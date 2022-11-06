import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';

import type { APISelectMenuComponent } from 'discord-api-types/v10';
import type { SelectMenuInteraction } from 'discord.js';

import { ButtonCustomIds, Colors, SelectMenuCustomIds } from '#utils/constants';
import { makeButton } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: result.embeds, components: result.components });
	}

	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.CWLEventRegister)) return this.none();

		if (!interaction.message.components) return this.none();
		await interaction.deferUpdate();

		const menu = new MessageSelectMenu(interaction.message.components[0].components[0] as APISelectMenuComponent);
		const selected = menu.options.find((option) => option.value === interaction.values[0])!;

		if (selected.label.startsWith('✅')) {
			return this.some({
				embeds: [
					new MessageEmbed()
						.setTitle('Error')
						.setDescription(
							`It appears that player ${bold(
								selected.label.slice(2)
							)} is already registered. Please select another player to register or cancel this if you don't have any else.`
						)
						.setColor(Colors.Red)
				],
				components: [new MessageActionRow().addComponents(menu)]
			});
		}

		return this.some({
			embeds: [
				new MessageEmbed()
					.setTitle(selected.label.slice(2))
					.setDescription(
						`Selected ${bold(
							`${selected.label.slice(2)} ${selected.value.split('_')[0]}`
						)} to register.\n\nPlease select ${bold(
							'War Type and the days you will be available. By default you are available for all seven days.'
						)}`
					)
					.setColor(Colors.Indigo)
			],
			components: [
				new MessageActionRow().addComponents(menu),
				new MessageActionRow().addComponents(
					makeButton('Serious', ButtonCustomIds.CWLWarSerious, 'PRIMARY'),
					makeButton('Casual', ButtonCustomIds.CWLWarCasual, 'PRIMARY')
				),
				new MessageActionRow().addComponents(
					makeButton('Day 1', ButtonCustomIds.CWLOptInDayOne, 'SUCCESS'),
					makeButton('Day 2', ButtonCustomIds.CWLOptInDayTwo, 'SUCCESS'),
					makeButton('Day 3', ButtonCustomIds.CWLOptInDayThree, 'SUCCESS'),
					makeButton('Day 4', ButtonCustomIds.CWLOptInDayFour, 'SUCCESS'),
					makeButton('Day 5', ButtonCustomIds.CWLOptInDayFive, 'SUCCESS')
				),
				new MessageActionRow().addComponents(
					makeButton('Day 6', ButtonCustomIds.CWLOptInDaySix, 'SUCCESS'),
					makeButton('Day 7', ButtonCustomIds.CWLOptInDaySeven, 'SUCCESS')
				),
				new MessageActionRow().addComponents(
					makeButton(
						'Submit',
						`${ButtonCustomIds.CWLEventUserRegisterSubmit}_${menu.customId?.split('_').pop()}_${
							selected.value
						}`,
						'SUCCESS',
						false
					),
					makeButton('Cancel', ButtonCustomIds.CWLEventUserRegisterCancel, 'DANGER')
				)
			]
		});
	}
}
