import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonStyle } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';
import { ButtonCustomIds } from '#utils/constants';
import { makeButton } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
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

		const tweak =
			optedIn === undefined || optedIn === 'true'
				? { style: ButtonStyle.Danger, customId: `${customId}_false` }
				: { style: ButtonStyle.Success, customId: `${customId}_true` };

		switch (customId) {
			case ButtonCustomIds.CWLOptInDayOne:
				// @ts-expect-error Dynamic
				interaction.message.components[2].components[0] = makeButton('Day 1', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayTwo:
				// @ts-expect-error Dynamic
				interaction.message.components[2].components[1] = makeButton('Day 2', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayThree:
				// @ts-expect-error Dynamic
				interaction.message.components[2].components[2] = makeButton('Day 3', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayFour:
				// @ts-expect-error Dynamic
				interaction.message.components[2].components[3] = makeButton('Day 4', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDayFive:
				// @ts-expect-error Dynamic
				interaction.message.components[2].components[4] = makeButton('Day 5', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDaySix:
				// @ts-expect-error Dynamic
				interaction.message.components[3].components[0] = makeButton('Day 6', tweak.customId, tweak.style);
				break;
			case ButtonCustomIds.CWLOptInDaySeven:
				// @ts-expect-error Dynamic
				interaction.message.components[3].components[1] = makeButton('Day 7', tweak.customId, tweak.style);
				break;
		}

		return this.some({ components: interaction.message.components });
	}
}
