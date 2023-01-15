import { ApplyOptions } from '@sapphire/decorators';
import { Result, UserError } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, userMention } from 'discord.js';

import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
import type { ChatInputCommandInteraction } from 'discord.js';

import { GoblinSubCommand } from '#lib/extensions/GoblinSubCommand';
import { RedisMethods } from '#lib/redis-cache/RedisCacheClient';
import { Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { clanTagOption, playerTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinSubCommandOptions>({
	command: (builder) =>
		builder
			.setName('forcelink')
			.setDescription('Commands related to linking clan or player to an user forcefully')
			.addSubcommand((command) =>
				command
					.setName('clan')
					.setDescription('Link clan to an user forcibly')
					.addUserOption((option) =>
						option //
							.setName('user')
							.setDescription('User to link clan to')
							.setRequired(true)
					)
					.addStringOption((option) => clanTagOption(option, { required: true }))
			)
			.addSubcommand((command) =>
				command
					.setName('player')
					.setDescription('Link player to an user forcibly')
					.addUserOption((option) =>
						option //
							.setName('user')
							.setDescription('User to link player to')
							.setRequired(true)
					)
					.addStringOption((option) => playerTagOption(option, { required: true }))
			),
	commandMetaOptions: { idHints: ['1017973522171187250', '1017984888575631381'] },
	requiredMemberPermissions: PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
	subcommands: [
		{
			name: 'clan',
			chatInputRun: 'forceLinkClan'
		},
		{
			name: 'player',
			chatInputRun: 'forceLinkPlayer'
		}
	]
})
export class ForceLinkCommand extends GoblinSubCommand {
	public async forceLinkClan(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));
		const user = interaction.options.getUser('user', true);

		const result = await Result.fromAsync(
			async () => this.sql`INSERT INTO clans (user_id, clan_name, clan_tag)
                                 VALUES (${user.id}, ${clan.name}, ${clan.tag})`
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `**${clan.name} (${clan.tag})** is already linked to ${userMention(
						user.id
					)} discord account`
				});
			}
		}

		await this.redis.handleClanOrPlayerCacheCache('CLAN', RedisMethods.Insert, user.id, clan.tag, clan.name);
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(
						`Forcibly linked **${clan.name} (${clan.tag})** to ${userMention(user.id)} discord account`
					)
					.setColor(Colors.DeepOrange)
			]
		});
	}

	public async forceLinkPlayer(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const player = await this.coc.playerHelper.info(interaction, interaction.options.getString('tag', true));
		const user = interaction.options.getUser('user', true);

		const check = await Result.fromAsync(
			async () => this.sql`SELECT
								 FROM players
								 WHERE player_tag = ${player.tag}
								   AND user_id = ${user.id}`
		);

		if (!isNullishOrEmpty(check.unwrap())) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `**${player.name} (${player.tag})** is already linked ${userMention(user.id)} account`
			});
		}

		const result = await Result.fromAsync(
			async () => this.sql`INSERT INTO players (user_id, player_name, player_tag)
                                 VALUES (${user.id}, ${player.name}, ${player.tag})`
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `**${player.name} (${
						player.tag
					})** is already linked to an user. If you think this was a mistake then please contact ${userMention(
						'292332992251297794'
					)}`
				});
			}
		}

		await this.redis.handleClanOrPlayerCacheCache('PLAYER', RedisMethods.Insert, user.id, player.tag, player.name);
		await this.coc.linkApi.createLink(player.tag, user.id);
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Forcibly linked **${player.name} (${player.tag})** to ${user.id} discord account`)
					.setColor(Colors.DeepOrange)
			]
		});
	}
}
