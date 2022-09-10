import { userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { Result, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Colors } from '#utils/constants';
import { redis } from '#utils/redis';

@ApplyOptions<Subcommand.Options>({
	subcommands: [
		{
			name: 'clan',
			chatInputRun: 'forceLinkClan'
		},
		{
			name: 'player',
			chatInputRun: 'forceLinkPlayer'
		}
	],
	description: 'Commands related to linking clan or player to an user forcefully'
})
export class ForceLinkCommand extends Subcommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false)
					.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
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
							.addStringOption((option) =>
								option //
									.setName('tag')
									.setDescription('Tag of the clan')
									.setRequired(true)
							)
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
							.addStringOption((option) =>
								option //
									.setName('tag')
									.setDescription('Tag of the player')
									.setRequired(true)
							)
					),
			{ idHints: ['1017973522171187250', '1017984888575631381'] }
		);
	}

	public async forceLinkClan(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();

		const clan = await this.coc.clanHelper.info(interaction.options.getString('tag', true));
		const user = interaction.options.getUser('user', true);

		const result = await Result.fromAsync(
			async () => this.sql`INSERT INTO clans (user_id, clan_name, clan_tag)
                                 VALUES (${user.id}, ${clan.name}, ${clan.tag})`
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: 'database-error',
					message: `**${clan.name} (${clan.tag})** is already linked to ${userMention(
						user.id
					)} discord account`
				});
			}
		}

		await redis.handleClanOrPlayerCache('CLAN', 'UPDATE', interaction.member.id, clan.tag, clan.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(
						`Forcibly linked **${clan.name} (${clan.tag})** to ${userMention(user.id)} discord account`
					)
					.setColor(Colors.DeepOrange)
			]
		});
	}

	public async forceLinkPlayer(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();

		const player = await this.coc.playerHelper.info(interaction.options.getString('tag', true));
		const user = interaction.options.getUser('user', true);

		const check = await Result.fromAsync(
			async () => this.sql`SELECT
								 FROM players
								 WHERE player_tag = ${player.tag}
								   AND user_id = ${user.id}`
		);

		if (!isNullishOrEmpty(check.unwrap())) {
			throw new UserError({
				identifier: 'database-error',
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
					identifier: 'database-error',
					message: `**${player.name} (${
						player.tag
					})** is already linked to an user. If you think this was a mistake then please contact ${userMention(
						'292332992251297794'
					)}`
				});
			}
		}

		await redis.handleClanOrPlayerCache('PLAYER', 'UPDATE', interaction.member.id, player.tag, player.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Forcibly linked **${player.name} (${player.tag})** to ${user.id} discord account`)
					.setColor(Colors.DeepOrange)
			]
		});
	}
}
