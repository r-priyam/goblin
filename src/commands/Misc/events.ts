import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, bold } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
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
	commandMetaOptions: { idHints: ['1034307161024647198', '1043558434194341969'] },
	subcommands: [
		{
			name: 'create',
			chatInputRun: 'createEvent'
		},
		{
			name: 'delete',
			chatInputRun: 'deleteEvent'
		}
	],
	preconditions: ['OwnerOnly']
})
export class EventCommands extends GoblinSubCommand {
	public async createEvent(interaction: ChatInputCommandInteraction<'cached'>) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Create Event')
					.setDescription(
						'Woohoo a new event 🥳, but more work for me 🥺. Anyway, my commander asked me to follow your orders so 😒, please select the type of event'
					)
					.setColor(Colors.Indigo)
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId(ButtonCustomIds.CWLEventCreate)
						.setLabel('CWL')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId(ButtonCustomIds.CustomEventCreate)
						.setLabel('Custom')
						.setStyle(ButtonStyle.Primary)
				)
			]
		});
	}

	public async deleteEvent(interaction: ChatInputCommandInteraction<'cached'>) {
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

		if (!response) {
			return;
		}

		await this.sql`DELETE
                       FROM events
                       WHERE id = ${eventId}`;

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Success')
					.setDescription('Event and all related data deleted successfully! Hoping to serve you again soon.')
					.setColor(Colors.Green)
			]
		});
	}
}
