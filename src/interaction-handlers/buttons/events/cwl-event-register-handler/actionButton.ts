import { bold } from '@discordjs/builders';
import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';

import type { APISelectMenuComponent } from 'discord-api-types/v9';
import type { ButtonInteraction, MessageButton } from 'discord.js';

import { ButtonCustomIds, Colors, ErrorIdentifiers, RedisKeys } from '#utils/constants';
import { seconds } from '#utils/functions/time';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: result.embeds, components: result.components });
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!interaction.customId.startsWith(ButtonCustomIds.CWLEventUserRegisterSubmit) &&
			!interaction.customId.startsWith(ButtonCustomIds.CWLEventUserRegisterCancel)
		) {
			return this.none();
		}

		if (!interaction.message.components) return this.none();
		await interaction.deferUpdate();

		if (interaction.customId === ButtonCustomIds.CWLEventUserRegisterCancel) {
			return this.some({ content: bold('Cancelling the process'), embeds: [], components: [] });
		}

		const daysValue = [];
		const playerName = interaction.message.embeds[0].title;
		const serious = (interaction.message.components[1].components[0] as MessageButton).style === 'SUCCESS';
		const [_, eventId, playerTag, thLevel, bkLevel, aqLevel, gwLevel, rcLevel] = interaction.customId.split('_');

		for (const component of interaction.message.components[2].components as MessageButton[]) {
			daysValue.push(component.style === 'SUCCESS');
		}

		for (const component of interaction.message.components[3].components as MessageButton[]) {
			daysValue.push(component.style === 'SUCCESS');
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

		const menu = new MessageSelectMenu(interaction.message.components[0].components[0] as APISelectMenuComponent);

		for (const option of menu.options) {
			if (option.value.includes(playerTag)) {
				option.label = `✅ ${option.label.slice(2)}`;
			}
		}

		await this.redis.insertWithExpiry(
			RedisKeys.CWLEventRegistration,
			interaction.user.id,
			menu.options.map((option) => ({
				label: option.label,
				value: option.value,
				emoji: `<${option.emoji?.name}:${option.emoji?.id}>`
			})),
			seconds.fromMilliseconds(Time.Minute * 30)
		);

		return this.some({
			embeds: [
				new MessageEmbed()
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
			components: [new MessageActionRow().addComponents(menu)]
		});
	}
}
