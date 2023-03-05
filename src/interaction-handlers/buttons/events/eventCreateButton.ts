import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

import type { ButtonInteraction } from 'discord.js';

import { ButtonCustomIds, Colors, Emotes, SelectMenuCustomIds, SelectMenuOptionsValue } from '#utils/constants';
import { checkUser, eventConfigMessage } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({
			embeds: result.embeds,
			components: result.components
		});
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!([ButtonCustomIds.CWLEventCreate, ButtonCustomIds.CustomEventCreate] as string[]).includes(
				interaction.customId
			)
		) {
			return this.none();
		}

		await interaction.deferUpdate();
		checkUser(interaction.message.interaction!.user.id, interaction.user.id);

		if (interaction.customId.startsWith(ButtonCustomIds.CustomEventCreate)) {
			return this.some({ ...this.handleCustomEvent() });
		}

		return this.some({ ...this.handleCWLEvent() });
	}

	private handleCustomEvent() {
		return {
			embeds: [
				new EmbedBuilder()
					.setTitle('Warning')
					.setDescription("Creating custom event isn't supported at the moment, soon™️!")
					.setColor(Colors.Orange)
			],
			components: []
		};
	}

	private handleCWLEvent() {
		const embeds = [
			new EmbedBuilder()
				.setTitle('New Event Configuration')
				.setDescription(eventConfigMessage({}))
				.setColor(Colors.Indigo)
		];

		const components = [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(SelectMenuCustomIds.CWLEventConfig)
					.setPlaceholder('Select a config to set')
					.addOptions([
						{
							label: '✍🏻 Event Name',
							value: SelectMenuOptionsValue.EventName
						},
						{
							label: '#️⃣ Registration Channel',
							value: SelectMenuOptionsValue.EventRegistrationChannel
						},
						{
							label: '＠ Event Start Role Ping',
							value: SelectMenuOptionsValue.EventStartRolePing
						},
						{
							label: '＠ Event End Role Ping',
							value: SelectMenuOptionsValue.EventEndRolePing
						}
					])
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setLabel('Submit')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(Emotes.Success)
					.setCustomId(ButtonCustomIds.EventSubmit),
				new ButtonBuilder()
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(Emotes.Error)
					.setCustomId(ButtonCustomIds.EventCancel)
			)
		];

		return { embeds, components };
	}
}
