import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction, MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';

import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.showModal(result.modal);
	}

	public override parse(interaction: ButtonInteraction) {
		if (
			!interaction.customId.startsWith(ButtonCustomIds.AddClanRequirement) &&
			!interaction.customId.startsWith(ButtonCustomIds.UpdateClanRequirement)
		) {
			return this.none();
		}

		const clanTag = interaction.customId.split('-').pop()!;
		const updateRequirements = interaction.customId === ButtonCustomIds.UpdateClanRequirement;

		return this.some({ modal: this.requirementsModel(clanTag, updateRequirements) });
	}

	private requirementsModel(clanTag: string, updateRequirements: boolean) {
		return new Modal()
			.setTitle(`${updateRequirements ? 'Update' : 'Add'} Clan Requirements Form`)
			.setCustomId(`${updateRequirements ? ModalCustomIds.UpdateClanEmbedRequirements : ModalCustomIds.AddClanEmbedRequirements}-${clanTag}`)
			.addComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(14, ModalInputCustomIds.FourteenRequirements)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(13, ModalInputCustomIds.ThirteenRequirements)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(12, ModalInputCustomIds.TwelveRequirements)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(11, ModalInputCustomIds.ElevenRequirements)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(this.requirementsModelInput(10, ModalInputCustomIds.TenRequirements))
			);
	}

	private requirementsModelInput(townHallLevel: number, customId: string) {
		return new TextInputComponent()
			.setCustomId(customId)
			.setLabel(`How many ${townHallLevel} you need?`)
			.setStyle('SHORT')
			.setMinLength(1)
			.setMaxLength(2)
			.setRequired(true);
	}
}
