import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, bold, ButtonStyle } from 'discord.js';

import type { ButtonInteraction, ButtonComponent, StringSelectMenuComponentData } from 'discord.js';

import { ButtonCustomIds, Colors, ErrorIdentifiers, RedisKeys } from '#utils/constants';
import { seconds } from '#utils/functions/time';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({
			embeds: result.embeds,
			components: result.components
		});
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!(
				interaction.customId.startsWith(ButtonCustomIds.CWLEventUserRegisterSubmit) ||
				interaction.customId.startsWith(ButtonCustomIds.CWLEventUserRegisterCancel)
			)
		) {
			return this.none();
		}

		if (!interaction.message.components) return this.none();
		await interaction.deferUpdate();

		if (interaction.customId === ButtonCustomIds.CWLEventUserRegisterCancel) {
			return this.some({
				embeds: [new EmbedBuilder().setDescription(bold('Cancelling the process')).setColor(Colors.DeepOrange)],
				components: []
			});
		}

		const daysValue = [];
		const playerName = interaction.message.embeds[0].title;
		const serious = (interaction.message.components[1].components[0] as ButtonComponent).style === ButtonStyle.Success;
		const [_, eventId, playerTag, thLevel, bkLevel, aqLevel, gwLevel, rcLevel] = interaction.customId.split('_');

		for (const component of interaction.message.components[2].components as ButtonComponent[]) {
			daysValue.push(component.style === ButtonStyle.Success);
		}

		for (const component of interaction.message.components[3].components as ButtonComponent[]) {
			daysValue.push(component.style === ButtonStyle.Success);
		}

		try {
			await this.sql`
            INSERT INTO cwl_applications (event_id,
                                          discord_id,
                                          discord_name,
                                          player_name,
                                          player_tag,
                                          town_hall,
                                          barbarian_king,
                                          archer_queen,
                                          grand_warden,
                                          royal_champion,
                                          serious,
                                          casual,
                                          opt_in_day_one,
                                          opt_in_day_two,
                                          opt_in_day_three,
                                          opt_in_day_four,
                                          opt_in_day_five,
                                          opt_in_day_six,
                                          opt_in_day_seven)
            VALUES
            ${this.sql([
							eventId,
							interaction.user.id,
							interaction.user.username,
							playerName,
							playerTag,
							thLevel,
							bkLevel ?? 0,
							aqLevel ?? 0,
							gwLevel ?? 0,
							rcLevel ?? 0,
							serious,
							!serious,
							...daysValue
						])}`;
		} catch {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message: 'It appears that the selected user is already registered.'
			});
		}

		const menu = new StringSelectMenuBuilder(
			interaction.message.components[0].components[0].toJSON() as unknown as StringSelectMenuComponentData
		);

		for (const option of menu.options) {
			if (option.data.value?.includes(playerTag)) {
				option.data.label = `✅ ${option.data.label!.slice(2)}`;
			}
		}

		await this.redis.insertWithExpiry(
			RedisKeys.CWLEventRegistration,
			interaction.user.id,
			menu.options.map((option) => ({
				label: option.data.label!,
				value: option.data.value!,
				emoji: `<${option.data.emoji?.name}:${option.data.emoji?.id}>`
			})),
			seconds.fromMilliseconds(Time.Minute * 30)
		);

		return this.some({
			embeds: [
				new EmbedBuilder()
					.setTitle('Success')
					.setDescription(
						`Successfully registered ${bold(
							`${playerName} (${playerTag})`
						)} for the event.\n\nIf you don't have any more player to register then you can click on ${bold(
							'Cancel'
						)} button to end the process. You can always click back on ${bold(
							'Register'
						)} button on the registration message to register any new player if you may have.`
					)
					.setColor(Colors.Green)
			],
			components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)]
		});
	}
}
