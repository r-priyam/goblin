import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import type { ModalSubmitInteraction } from 'discord.js';
import {
	Colors,
	ErrorIdentifiers,
	EventConfigDefaultValues,
	ModalCustomIds,
	ModalInputCustomIds
} from '#utils/constants';
import { checkUser, eventConfigMessage, extractConfigsFromValues } from '#utils/functions/eventHelpers';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public override async run(interaction: ModalSubmitInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: [result.embed] });
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith(ModalCustomIds.CWLEvent)) {
			return this.none();
		}

		await interaction.deferUpdate();
		checkUser(interaction.message!.interaction!.user.id, interaction.user.id);

		const rawConfigValues = interaction.message?.embeds[0].description?.split('\n').slice(1, 6);
		const parsedData = extractConfigsFromValues(rawConfigValues!);

		const eventName = this.getConfigValue(interaction.fields, ModalInputCustomIds.EventName);
		const registrationChannel = this.getConfigValue(
			interaction.fields,
			ModalInputCustomIds.EventRegistrationChannel
		);
		const startRolePing = this.getConfigValue(interaction.fields, ModalInputCustomIds.EventStartRolePing);
		const endRolePing = this.getConfigValue(interaction.fields, ModalInputCustomIds.EventEndRolePing);
		const registrationEndTime = this.getConfigValue(
			interaction.fields,
			ModalInputCustomIds.EventRegistrationEndTime
		);

		const valueToSend = {
			eventName: eventName ?? parsedData.eventName,
			registrationChannel: registrationChannel ?? parsedData.registrationChannel,
			startRolePing: startRolePing ?? parsedData.startRolePing,
			endRolePing: endRolePing ?? parsedData.endRolePing,
			registrationEndTime: registrationEndTime ?? parsedData.registrationEndTime
		};

		// verify that all the values are still valid snowflake
		this.verifyInput('Registration channel', valueToSend.registrationChannel);
		this.verifyInput('Start role ping', valueToSend.startRolePing);
		this.verifyInput('End role ping', valueToSend.endRolePing);

		let color;
		if (valueToSend.endRolePing) {
			color = Colors.Yellow;
		}

		if (valueToSend.startRolePing) {
			color = Colors.Orange;
		}

		if (valueToSend.registrationChannel) {
			color = Colors.LightGreen;
		}

		if (valueToSend.eventName) {
			color = Colors.Green;
		} else {
			color = Colors.Indigo;
		}

		return this.some({
			embed: new EmbedBuilder()
				.setTitle('New Event Configuration')
				.setDescription(eventConfigMessage({ ...valueToSend }))
				.setColor(color)
		});
	}

	private verifyInput(name: string, value: string) {
		if (
			([EventConfigDefaultValues.Required, EventConfigDefaultValues.NotRequired, null] as string[]).includes(
				value
			)
		) {
			return;
		}

		if (!SnowflakeRegex.test(value)) {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message: `It appears that the given ${name} id isn't a valid channel id. Please cross check`,
				context: { followUp: true }
			});
		}
	}

	private getConfigValue(fields: any, customId: string) {
		return fields.components[0].components[0].customId === customId
			? fields.components[0].components[0].value
			: null;
	}
}
