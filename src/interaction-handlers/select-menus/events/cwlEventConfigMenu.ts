import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { MessageActionRow, Modal, TextInputComponent } from 'discord.js';

import type { ModalActionRowComponent, SelectMenuInteraction } from 'discord.js';

import { ErrorIdentifiers, ModalCustomIds, ModalInputCustomIds, SelectMenuCustomIds, SelectMenuOptionsValue } from '#utils/constants';
import { checkUser } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.showModal(result.model);
	}

	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.CWLEventConfig)) return this.none();

		checkUser(interaction.message.interaction!.user.id, interaction.user.id);

		switch (interaction.values[0]) {
			case SelectMenuOptionsValue.EventName:
				return this.some({ model: this.modalGenerator('Event Name', ModalInputCustomIds.EventName, true) });
			case SelectMenuOptionsValue.EventRegistrationChannel:
				return this.some({
					model: this.modalGenerator(
						'Event Registration Channel',
						ModalInputCustomIds.EventRegistrationChannel,
						true
					)
				});
			case SelectMenuOptionsValue.EventStartRolePing:
				return this.some({
					model: this.modalGenerator('Event Start Role', ModalInputCustomIds.EventStartRolePing)
				});
			case SelectMenuOptionsValue.EventEndRolePing:
				return this.some({
					model: this.modalGenerator('Event End Role', ModalInputCustomIds.EventEndRolePing)
				});
			default:
				throw new UserError({
					identifier: ErrorIdentifiers.CWLEventProcess,
					message: "Boo, I don't know how you reached at this point, please report to my developer",
					context: { followUp: true }
				});
		}
	}

	private modalGenerator(fieldName: string, customId: string, required = false) {
		return new Modal()
			.setTitle(`${fieldName} Config Form`)
			.setCustomId(ModalCustomIds.CWLEvent)
			.addComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent()
						.setLabel(`Enter ${fieldName}`)
						.setCustomId(customId)
						.setStyle('SHORT')
						.setMinLength(5)
						.setMaxLength(22)
						.setRequired(required)
				)
			);
	}
}
