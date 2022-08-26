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

	public override async parse(interaction: ButtonInteraction) {
		if (
			!interaction.customId.startsWith(ButtonCustomIds.AddClanRequirement) &&
			!interaction.customId.startsWith(ButtonCustomIds.UpdateClanRequirement)
		) {
			return this.none();
		}

		const clanTag = interaction.customId.split('-').pop()!;
		const updateRequirements = interaction.customId.startsWith(ButtonCustomIds.UpdateClanRequirement);
		const [currentRequirements] = await this.sql<[{ requirements: Record<string, number> }]>`SELECT requirements
                                                                                                 FROM clan_embeds`;

		return this.some({ modal: this.requirementsModel(clanTag, updateRequirements, currentRequirements.requirements) });
	}

	private requirementsModel(clanTag: string, updateRequirements: boolean, requirements: Record<string, number>) {
		return new Modal()
			.setTitle(`${updateRequirements ? 'Update' : 'Add'} Clan Requirements Form`)
			.setCustomId(`${updateRequirements ? ModalCustomIds.UpdateClanEmbedRequirements : ModalCustomIds.AddClanEmbedRequirements}-${clanTag}`)
			.addComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(14, ModalInputCustomIds.FourteenRequirements, String(requirements['14']))
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(13, ModalInputCustomIds.ThirteenRequirements, String(requirements['13']))
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(12, ModalInputCustomIds.TwelveRequirements, String(requirements['12']))
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(11, ModalInputCustomIds.ElevenRequirements, String(requirements['11']))
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(10, ModalInputCustomIds.TenRequirements, String(requirements['10']))
				)
			);
	}

	private requirementsModelInput(townHallLevel: number, customId: string, value: string) {
		return new TextInputComponent()
			.setCustomId(customId)
			.setLabel(`How many ${townHallLevel} you need?`)
			.setStyle('SHORT')
			.setMinLength(1)
			.setMaxLength(2)
			.setValue(value)
			.setRequired(true);
	}
}
