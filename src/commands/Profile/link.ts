import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
import { GoblinSubCommand } from '#lib/extensions/GoblinSubCommand';
import { RedisMethods } from '#lib/redis-cache/RedisCacheClient';
import { Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { clanTagOption, playerTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinSubCommandOptions>({
	command: (builder) =>
		builder
			.setName('link')
			.setDescription('Command related to linking clan or player to user profile')
			.addSubcommand((command) =>
				command
					.setName('clan')
					.setDescription('Link a clan to your discord account')
					.addStringOption((option) => clanTagOption(option, { required: true }))
			)
			.addSubcommand((command) =>
				command
					.setName('player')
					.setDescription('Link a player to your discord account')
					.addStringOption((option) => playerTagOption(option, { required: true }))
					.addStringOption((option) =>
						option.setName('token').setDescription('API token of the player').setRequired(true)
					)
			),
	commandMetaOptions: { idHints: ['975266632299606106', '980131947475009556'] },
	subcommands: [
		{
			name: 'clan',
			chatInputRun: 'clanLink'
		},
		{
			name: 'player',
			chatInputRun: 'playerLink'
		}
	]
})
export class LinkCommand extends GoblinSubCommand {
	public async clanLink(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));

		try {
			await this.sql`INSERT INTO clans (user_id, clan_name, clan_tag)
			               VALUES (${interaction.member.id}, ${clan.name}, ${clan.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `**${clan.name} (${clan.tag})** is already linked to your account`
				});
			}
		}

		await this.redis.handleClanOrPlayerCacheCache(
			'CLAN',
			RedisMethods.Insert,
			interaction.member.id,
			clan.tag,
			clan.name
		);
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Linked **${clan.name} (${clan.tag})** to your discord account`)
					.setColor(Colors.Green)
			]
		});
	}

	public async playerLink(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const player = await this.coc.playerHelper.verifyPlayer(
			interaction,
			interaction.options.getString('tag', true),
			interaction.options.getString('token', true)
		);

		try {
			await this.sql`INSERT INTO players (user_id, player_name, player_tag)
                           VALUES (${interaction.member.id}, ${player.name}, ${player.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `**${player.name} (${player.tag})** is already linked to your account`
				});
			}
		}

		await this.redis.handleClanOrPlayerCacheCache(
			'PLAYER',
			RedisMethods.Insert,
			interaction.member.id,
			player.tag,
			player.name
		);
		await this.coc.linkApi.createLink(player.tag, interaction.member.id);
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Linked **${player.name} (${player.tag})** to your discord account`)
					.setColor(Colors.Green)
			]
		});
	}
}
