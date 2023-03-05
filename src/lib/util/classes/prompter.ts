import { Time } from '@sapphire/cron';
import {
	bold,
	time,
	TimestampStyles,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder
} from 'discord.js';

import type { CommandInteraction, ButtonInteraction } from 'discord.js';

import { Colors, Emotes } from '#utils/constants';
import { seconds } from '#utils/functions/time';

export class Prompter {
	private readonly interaction: ButtonInteraction | CommandInteraction;

	private readonly message: string;

	private readonly timeout: number;

	public constructor(interaction: ButtonInteraction | CommandInteraction, message: string, timeout?: number) {
		this.interaction = interaction;
		this.message = message;
		this.timeout = timeout ?? Time.Minute * 2;
	}

	public async prompt() {
		if (this.interaction.replied || this.interaction.deferred) {
			await this.interaction.editReply({
				embeds: [this.prompterEmbed],
				components: [this.prompterComponent]
			});
		} else {
			await this.interaction.reply({
				embeds: [this.prompterEmbed],
				components: [this.prompterComponent]
			});
		}

		try {
			const response = await this.interaction.channel?.awaitMessageComponent({
				componentType: ComponentType.Button,
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
				await this.interaction.editReply({
					content: 'Aborting the process!',
					embeds: [],
					components: []
				});
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
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder().setLabel('Yes').setEmoji(Emotes.Success).setStyle(ButtonStyle.Success).setCustomId('yes'),
			new ButtonBuilder() //
				.setLabel('No')
				.setEmoji(Emotes.Error)
				.setStyle(ButtonStyle.Danger)
				.setCustomId('no')
		);
	}

	private get prompterEmbed() {
		return new EmbedBuilder()
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
