import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, bold, ButtonStyle } from 'discord.js';
import type { StringSelectMenuInteraction, ButtonBuilder, StringSelectMenuComponentData } from 'discord.js';
import { ButtonCustomIds, Colors, SelectMenuCustomIds } from '#utils/constants';
import { makeButton } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuHandler extends InteractionHandler {
	public override async run(interaction: StringSelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({
			embeds: result.embeds,
			components: result.components
		});
	}

	public override async parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.CWLEventRegister)) {
			return this.none();
		}

		if (!interaction.message.components) {
			return this.none();
		}

		await interaction.deferUpdate();

		const menu = new StringSelectMenuBuilder(
			interaction.message.components[0].components[0].toJSON() as unknown as StringSelectMenuComponentData
		);
		const selected = menu.options.find((option) => option.data.value === interaction.values[0])!;

		if (selected.data.label?.startsWith('✅')) {
			return this.some({
				embeds: [
					new EmbedBuilder()
						.setTitle('Error')
						.setDescription(
							`It appears that player ${bold(
								selected.data?.label.slice(2)
							)} is already registered. Please select another player to register or cancel this if you don't have any else.`
						)
						.setColor(Colors.Red)
				],
				components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)]
			});
		}

		return this.some({
			embeds: [
				new EmbedBuilder()
					.setTitle(selected.data.label!.slice(2))
					.setDescription(
						`Selected ${bold(
							`${selected.data.label?.slice(2)} ${selected.data.value?.split('_')[0]}`
						)} to register.\n\nPlease select ${bold(
							'War Type and the days you will be available. By default you are available for all seven days.'
						)}`
					)
					.setColor(Colors.Indigo)
			],
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					makeButton('Serious', ButtonCustomIds.CWLWarSerious, ButtonStyle.Primary),
					makeButton('Casual', ButtonCustomIds.CWLWarCasual, ButtonStyle.Primary)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					makeButton('Day 1', ButtonCustomIds.CWLOptInDayOne, ButtonStyle.Success),
					makeButton('Day 2', ButtonCustomIds.CWLOptInDayTwo, ButtonStyle.Success),
					makeButton('Day 3', ButtonCustomIds.CWLOptInDayThree, ButtonStyle.Success),
					makeButton('Day 4', ButtonCustomIds.CWLOptInDayFour, ButtonStyle.Success),
					makeButton('Day 5', ButtonCustomIds.CWLOptInDayFive, ButtonStyle.Success)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					makeButton('Day 6', ButtonCustomIds.CWLOptInDaySix, ButtonStyle.Success),
					makeButton('Day 7', ButtonCustomIds.CWLOptInDaySeven, ButtonStyle.Success)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					makeButton(
						'Submit',
						`${ButtonCustomIds.CWLEventUserRegisterSubmit}_${menu.data.custom_id?.split('_').pop()}_${
							selected.data.value
						}`,
						ButtonStyle.Success,
						false
					),
					makeButton('Cancel', ButtonCustomIds.CWLEventUserRegisterCancel, ButtonStyle.Danger)
				)
			]
		});
	}
}
