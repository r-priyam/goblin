import { bold, time, TimestampStyles } from '@discordjs/builders';
import { Time } from '@sapphire/cron';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import type { CommandInteraction } from 'discord.js';

import { Colors, Emotes } from '#utils/constants';
import { seconds } from '#utils/functions/time';

export class Prompter {
	private readonly interaction: CommandInteraction;

	private readonly message: string;

	private readonly timeout: number;

	public constructor(interaction: CommandInteraction, message: string, timeout?: number) {
		this.interaction = interaction;
		this.message = message;
		this.timeout = timeout ?? Time.Minute * 2;
	}

	public async prompt() {
		if (this.interaction.replied) {
			await this.interaction.editReply({ embeds: [this.prompterEmbed], components: [this.prompterComponent] });
		} else {
			await this.interaction.reply({ embeds: [this.prompterEmbed], components: [this.prompterComponent] });
		}

		try {
			const response = await this.interaction.channel?.awaitMessageComponent({
				componentType: 'BUTTON',
				time: this.timeout,
				filter: async (interaction) => {
					await interaction.deferUpdate();
					if (interaction.user.id !== this.interaction.user.id) {
						await interaction.followUp({
							content: "These buttons can't be controlled by you, sorry!",
							ephemeral: true
						});
						return false;
					}

					return interaction.customId === 'yes' || interaction.customId === 'no';
				}
			});

			if (response?.customId === 'yes') {
				return true;
			} else {
				await this.interaction.editReply({ content: 'Aborting the process!', embeds: [], components: [] });
				return false;
			}
		} catch {
			await this.interaction.editReply({
				content: 'You took too log to reply, aborting!',
				embeds: [],
				components: []
			});
			return false;
		}
	}

	private get prompterComponent() {
		return new MessageActionRow().addComponents(
			new MessageButton().setLabel('Yes').setEmoji(Emotes.Success).setStyle('SUCCESS').setCustomId('yes'),
			new MessageButton().setLabel('No').setEmoji(Emotes.Error).setStyle('DANGER').setCustomId('no')
		);
	}

	private get prompterEmbed() {
		return new MessageEmbed()
			.setTitle('Confirmation Prompt')
			.setDescription(
				`${this.message}\n\n${bold(
					`This prompt will expire ${time(
						seconds.fromMilliseconds(Date.now() + this.timeout),
						TimestampStyles.RelativeTime
					)}`
				)}`
			)
			.setColor(Colors.Orange);
	}
}
