import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

import type { APIButtonComponent } from 'discord-api-types/v9';
import type { ButtonInteraction } from 'discord.js';

import { ButtonCustomIds } from '#utils/constants';
import { makeButton } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		// @ts-expect-error Data is correct, I am not caring if TS is happy or not
		return interaction.editReply({ components: result.components });
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!([ButtonCustomIds.CWLWarSerious, ButtonCustomIds.CWLWarCasual] as string[]).includes(interaction.customId)
		) {
			return this.none();
		}

		if (!interaction.message.components) {
			return this.none();
		}

		await interaction.deferUpdate();
		const isSerious = interaction.customId === ButtonCustomIds.CWLWarSerious;
		const typeActionRow = new ActionRowBuilder<ButtonBuilder>();

		if (isSerious) {
			typeActionRow.addComponents(
				makeButton('Serious', ButtonCustomIds.CWLWarSerious, 'SUCCESS', false),
				makeButton('Casual', ButtonCustomIds.CWLWarCasual, 'SECONDARY')
			);
		} else {
			typeActionRow.addComponents(
				makeButton('Serious', ButtonCustomIds.CWLWarSerious, 'SECONDARY'),
				makeButton('Casual', ButtonCustomIds.CWLWarCasual, 'SUCCESS', false)
			);
		}

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			// inherit from interaction button only as it contains all the data in custom id
			new ButtonBuilder(interaction.message.components[4].components[0] as APIButtonComponent).setDisabled(false),
			makeButton('Cancel', ButtonCustomIds.CWLEventUserRegisterCancel, 'DANGER')
		);

		interaction.message.components?.splice(1, 1, typeActionRow);
		interaction.message.components?.splice(4, 1, actionRow);
		return this.some({ components: interaction.message.components });
	}
}
