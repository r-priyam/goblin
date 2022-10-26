import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { MessageActionRow, Modal, TextInputComponent } from 'discord.js';

import type { ButtonInteraction, ModalActionRowComponent } from 'discord.js';

import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';
import { checkUser } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.showModal(result.model);
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!(
				[
					ButtonCustomIds.EventName,
					ButtonCustomIds.EventRegistrationChannel,
					ButtonCustomIds.EventStartRolePing,
					ButtonCustomIds.EventEndRolePing
				] as String[]
			).includes(interaction.customId)
		) {
			return this.none();
		}

		checkUser(interaction.message.interaction!.user.id, interaction.user.id);

		if (interaction.customId.startsWith(ButtonCustomIds.EventName)) {
			return this.some({ model: this.modalGenerator('Event Name', ModalInputCustomIds.EventName, true) });
		} else if (interaction.customId.startsWith(ButtonCustomIds.EventRegistrationChannel)) {
			return this.some({
				model: this.modalGenerator(
					'Event Registration Channel',
					ModalInputCustomIds.EventRegistrationChannel,
					true
				)
			});
		} else if (interaction.customId.startsWith(ButtonCustomIds.EventStartRolePing)) {
			return this.some({
				model: this.modalGenerator('Event Start Role', ModalInputCustomIds.EventStartRolePing)
			});
		} else {
			return this.some({ model: this.modalGenerator('Event End Role', ModalInputCustomIds.EventEndRolePing) });
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
