import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import {
	ButtonInteraction,
	GuildMember,
	MessageActionRow,
	Modal,
	ModalActionRowComponent,
	TextInputComponent
} from 'discord.js';
import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';
import { automationMemberCheck } from '#utils/functions/automationMemberCheck';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		automationMemberCheck(
			interaction.guildId!,
			interaction.member as GuildMember,
			interaction.guildId === envParseString('EYG_GUILD')
		);
		return interaction.showModal(result.modal);
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith(ButtonCustomIds.ClanEmbedRequirement)) return this.none();

		const clanTag = interaction.customId.split('-').pop()!;
		return this.some({ modal: this.requirementsModel(clanTag) });
	}

	private requirementsModel(clanTag: string) {
		return new Modal()
			.setTitle(`Edit Clan Requirements Form`)
			.setCustomId(`${ModalCustomIds.ClanEmbedRequirements}-${clanTag}`)
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
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					this.requirementsModelInput(10, ModalInputCustomIds.TenRequirements)
				)
			);
	}

	private requirementsModelInput(townHallLevel: number, customId: string) {
		return new TextInputComponent()
			.setCustomId(customId)
			.setLabel(`How many ${townHallLevel} you need?`)
			.setStyle('SHORT')
			.setMinLength(1)
			.setMaxLength(2)
			.setValue('0')
			.setRequired(true);
	}
}
