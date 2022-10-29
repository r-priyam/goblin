import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
import type { CommandInteraction } from 'discord.js';

import { GoblinSubCommand } from '#lib/extensions/GoblinSubCommand';
import { Prompter } from '#utils/classes/prompter';
import { ButtonCustomIds, Colors, ErrorIdentifiers } from '#utils/constants';

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

	public async deleteEvent(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();

		const eventId = interaction.options.getString('id', true).trim();

		const [{ exists }] = await this.sql<[{ exists: boolean }]>`SELECT EXISTS
                                                                            (SELECT *
                                                                             FROM events
                                                                             WHERE id = ${eventId}
                                                                               AND guild_id = ${interaction.guildId})`;

		if (!exists) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `No event exist with the ${bold(`ID: ${eventId}`)} in this server, please cross check the id`
			});
		}

		const prompter = new Prompter(
			interaction,
			`Are you sure that you want to delete the event? ${bold(
				'Be aware that, it will delete all data related to event.'
			)}`
		);
		const response = await prompter.prompt();

		if (!response) return;

		await this.sql`DELETE
                       FROM events
                       WHERE id = ${eventId}`;

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription('Event and all releated data deleted successfully! Hoping to serve you again soon.')
					.setColor(Colors.Green)
			]
		});
	}
}
