import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';
import { redis } from '#utils/redis';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Unlink a clan or a player from your discord account'
})
export class SlashCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option
							.setName('choice')
							.setDescription('Select what you want to unlink')
							.setRequired(true)
							.addChoices({ name: 'Clan', value: 'clan' }, { name: 'Player', value: 'player' })
					)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('The tag to unlink')
							.setRequired(true)
					)
					.setDMPermission(false),
			{ idHints: ['975442552134197248', '980131949911883847'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const type = interaction.options.getString('choice', true);
		return type === 'clan' ? this.removeClan(interaction) : this.removePlayer(interaction);
	}

	private async removeClan(interaction: ChatInputCommand.Interaction<'cached'>) {
		const tag = Util.formatTag(interaction.options.getString('tag', true));

		if (!Util.isValidTag(tag)) {
			return interaction.editReply({ content: 'No clan found for the provided tag!' });
		}

		const [result] = await this.sql<[{ clanName?: string }]>`DELETE
                                                                 FROM clans
                                                                 WHERE user_id = ${interaction.member.id}
                                                                   AND clan_tag = ${tag}
                                                                 RETURNING clan_name`;

		if (!result) {
			return interaction.editReply({ content: `**${tag}** isn't linked to your profile` });
		}

		await redis.handleClanOrPlayerCache('CLAN', 'REMOVE', interaction.member.id, tag);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Removed **${result.clanName} (${tag})** from your discord account`)
					.setColor(Colors.Green)
			]
		});
	}

	private async removePlayer(interaction: ChatInputCommand.Interaction<'cached'>) {
		const tag = Util.formatTag(interaction.options.getString('tag', true));

		if (!Util.isValidTag(tag)) {
			return interaction.editReply({ content: 'No player found for the provided tag!' });
		}

		const [result] = await this.sql<[{ playerName?: string }]>`DELETE
                                                                   FROM players
                                                                   WHERE user_id = ${interaction.member.id}
                                                                     AND player_tag = ${tag}
                                                                   RETURNING player_name`;

		if (!result) {
			return interaction.editReply({ content: `**${tag}** isn't linked to your profile` });
		}

		await redis.handleClanOrPlayerCache('PLAYER', 'REMOVE', interaction.member.id, tag);
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Removed **${result.playerName} (${tag})** from your discord account`)
					.setColor(Colors.Green)
			]
		});
	}
}
