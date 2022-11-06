import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';

import type { ButtonInteraction, MessageButtonStyleResolvable } from 'discord.js';

import { ButtonCustomIds } from '#utils/constants';
import { makeButton } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		// @ts-expect-error Data is always what's needed, TS goes brr
		return interaction.editReply({ components: result.components });
	}

	public override async parse(interaction: ButtonInteraction) {
		const [customId, optedIn] = interaction.customId.split('_');
		if (
			!(
				[
					ButtonCustomIds.CWLOptInDayOne,
					ButtonCustomIds.CWLOptInDayTwo,
					ButtonCustomIds.CWLOptInDayThree,
					ButtonCustomIds.CWLOptInDayFour,
					ButtonCustomIds.CWLOptInDayFive,
					ButtonCustomIds.CWLOptInDaySix,
					ButtonCustomIds.CWLOptInDaySeven
				] as string[]
			).includes(customId)
		) {
			return this.none();
		}

		await interaction.deferUpdate();
		if (!interaction.message.components) {
			return this.none();
		}

		let tweak;
		if (optedIn === undefined || optedIn === 'true') {
			tweak = { style: 'DANGER' as MessageButtonStyleResolvable, customId: `${customId}_false` };
		} else {
			tweak = { style: 'SUCCESS' as MessageButtonStyleResolvable, customId: `${customId}_true` };
		}

		switch (customId) {
			case ButtonCustomIds.CWLOptInDayOne:
				interaction.message.components[2].components[0] = makeButton('Day 1', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayTwo:
				interaction.message.components[2].components[1] = makeButton('Day 2', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayThree:
				interaction.message.components[2].components[2] = makeButton('Day 3', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayFour:
				interaction.message.components[2].components[3] = makeButton('Day 4', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayFive:
				interaction.message.components[2].components[4] = makeButton('Day 5', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDaySix:
				interaction.message.components[3].components[0] = makeButton('Day 6', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDaySeven:
				interaction.message.components[3].components[1] = makeButton('Day 7', tweak.customId, tweak.style);
				break;
		}

		return this.some({ components: interaction.message.components });
	}
}
