import { ApplyOptions } from '@sapphire/decorators';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
import type { CommandInteraction } from 'discord.js';

import { GoblinSubCommand } from '#lib/extensions/GoblinSubCommand';
import { ButtonCustomIds, Colors } from '#utils/constants';

@ApplyOptions<GoblinSubCommandOptions>({
	command: (builder) =>
		builder
			.setName('events')
			.setDescription('Commands related to events')
			.addSubcommand((command) => command.setName('create').setDescription('Creates an event'))
			.addSubcommand((command) =>
				command
					.setName('delete')
					.setDescription('Deletes an event')
					.addStringOption((option) =>
						option //
							.setName('id')
							.setDescription('Event id to delete')
							.setRequired(true)
					)
			),
	commandMetaOptions: { idHints: ['1034307161024647198'] },
	subcommands: [
		{
			name: 'create',
			chatInputRun: 'createEvent'
		},
		{
			name: 'delete',
			chatInputRun: 'deleteEvent'
		}
	]
})
export class EventCommands extends GoblinSubCommand {
	public async createEvent(interaction: CommandInteraction<'cached'>) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Create Event')
					.setDescription(
						'Woohoo a new event 🥳, but more work for me 🥺. Anyway, my commander asked me to follow your orders so 😒, please select the type of event'
					)
					.setColor(Colors.Indigo)
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton().setCustomId(ButtonCustomIds.CWLEventCreate).setLabel('CWL').setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId(ButtonCustomIds.CustomEventCreate)
						.setLabel('Custom')
						.setStyle('PRIMARY')
				)
			]
		});
	}

	public async deleteEvent(interaction: CommandInteraction<'cached'>) {}
}
