import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';
import { redis } from '#utils/redis';

@ApplyOptions<Subcommand.Options>({
	subcommands: [
		{
			name: 'clan',
			chatInputRun: 'clanLink'
		},
		{
			name: 'player',
			chatInputRun: 'playerLink'
		}
	],
	description: 'Commands related to user profile'
})
export class LinkCommand extends Subcommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false)
					.addSubcommand((command) =>
						command
							.setName('clan')
							.setDescription('Link a clan to your discord account')
							.addStringOption((option) => option.setName('tag').setDescription('Tag of the clan').setRequired(true))
					)
					.addSubcommand((command) =>
						command
							.setName('player')
							.setDescription('Link a player to your discord account')
							.addStringOption((option) => option.setName('tag').setDescription('Tag of the player').setRequired(true))
							.addStringOption((option) => option.setName('token').setDescription('API token of the player').setRequired(true))
					),
			{ idHints: ['975266632299606106', '980131947475009556'] }
		);
	}

	public async clanLink(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const clan = await this.coc.clanHelper.info(interaction.options.getString('tag', true));

		try {
			await this.sql`INSERT INTO clans (user_id, clan_name, clan_tag)
			               VALUES (${interaction.member.id}, ${clan.name}, ${clan.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: 'database-error',
					message: `**${clan.name} (${clan.tag})** is already linked to your account`
				});
			}
		}

		await redis.handleClanOrPlayerCache('CLAN', 'UPDATE', interaction.member.id, clan.tag, clan.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Linked **${clan.name} (${clan.tag})** to your discord account`)
					.setColor(Colors.Green)
			]
		});
	}

	public async playerLink(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const player = await this.coc.playerHelper.verifyPlayer(
			interaction.options.getString('tag', true),
			interaction.options.getString('token', true)
		);

		try {
			await this.sql`INSERT INTO players (user_id, player_name, player_tag)
                           VALUES (${interaction.member.id}, ${player.name}, ${player.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: 'database-error',
					message: `**${player.name} (${player.tag})** is already linked to your account`
				});
			}
		}

		await redis.handleClanOrPlayerCache('PLAYER', 'UPDATE', interaction.member.id, player.tag, player.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Linked **${player.name} (${player.tag})** to your discord account`)
					.setColor(Colors.Green)
			]
		});
	}
}