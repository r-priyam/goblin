import { Duration, DurationFormatter } from '@sapphire/duration';
import { UserError } from '@sapphire/framework';
import type { ButtonStyle } from 'discord.js';
import { bold, channelMention, italic, roleMention, ButtonBuilder } from 'discord.js';
import { ErrorIdentifiers, EventConfigDefaultValues } from '#utils/constants';

export function eventConfigMessage({
	eventName,
	registrationChannel,
	startRolePing,
	endRolePing,
	registrationEndTime
}: {
	endRolePing?: string;
	eventName?: string;
	registrationChannel?: string;
	registrationEndTime?: string;
	startRolePing?: string;
}) {
	return `
${bold('Configuration')}
${bold('Name:')} ${eventName ?? italic('Not Configured (Required)')}
${bold('Registration Channel:')} ${
		registrationChannel ? channelMention(registrationChannel) : italic('Not Configured (Required)')
	}
${bold('Start Role Ping:')} ${startRolePing ? roleMention(startRolePing) : italic('Not Configured')}
${bold('End Role Ping:')} ${endRolePing ? roleMention(endRolePing) : italic('Not Configured')}
${bold('Registration End Time:')} ${registrationEndTime ? new DurationFormatter().format(new Duration(registrationEndTime).offset) : italic('Not Configured (Default: 7 days)')}

${bold('Configuration Fields Information')}
● Event Name - The name of the event
● Registration Channel - The channel where only bot will accept the applications
● Start Role Ping - The role to ping when the event will start
● End Role Ping - The role to ping when the event will end
● Registration End Time - The time when the registration will end, default is 7 days

${bold('FAQs')}
1. Please select the applicable option from the select menu to configure the config values.
2. You can select the option from select menu again if you want to change the set value.

${bold(italic('Once you are satisfied with the above displayed values then click on Submit to create the event'))}
`;
}

export function extractConfigsFromValues(values: string[], isSubmit = false) {
	const valuesToReturn: {
		endRolePing: string | null;
		eventName: string | null;
		registrationChannel: string | null;
		registrationEndTime: string | null;
		startRolePing: string | null;
	} = {
		eventName: null,
		registrationChannel: null,
		startRolePing: null,
		endRolePing: null,
		registrationEndTime: null
	};
	for (const [index, value] of values.entries()) {
		let val: string | null = value.split('**').pop()!.trim();

		if (val === EventConfigDefaultValues.Required && isSubmit) {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message:
					"You haven't configured one or more required field values, please configure them before submitting.",
				context: { followUp: true }
			});
		} else if (val === EventConfigDefaultValues.NotRequired && isSubmit) {
			switch (index) {
				case 3:
					valuesToReturn.startRolePing = null;
					break;
				case 4:
					valuesToReturn.endRolePing = null;
					break;
			}
		} else {
			if (([EventConfigDefaultValues.Required, EventConfigDefaultValues.NotRequired] as string[]).includes(val)) {
				val = null;
			}

			// Remove all the special characters to be easily parsed
			val = val?.replace(/[^\d A-Za-z]/g, '') ?? null;
			switch (index) {
				case 0:
					valuesToReturn.eventName = val;
					break;
				case 1:
					valuesToReturn.registrationChannel = val;
					break;
				case 2:
					valuesToReturn.startRolePing = val;
					break;
				case 3:
					valuesToReturn.endRolePing = val;
					break;
				case 4:
					valuesToReturn.registrationEndTime = val;
					break;
				default:
					throw new UserError({
						identifier: ErrorIdentifiers.CWLEventProcess,
						message: "Boo, I don't know how you reached at this point, please report to my developer",
						context: { followUp: true }
					});
			}
		}
	}

	return valuesToReturn;
}

export function checkUser(originalAuthorId: string, userId: string) {
	if (originalAuthorId !== userId) {
		throw new UserError({
			identifier: ErrorIdentifiers.CWLEventProcess,
			message: "These buttons can't be controlled by you!",
			context: { followUp: true }
		});
	}
}

export function makeButton(label: string, customId: string, style: ButtonStyle, enabled = true, emoji?: string) {
	const button = new ButtonBuilder().setLabel(label).setCustomId(customId).setStyle(style);
	if (!enabled) {
		button.setDisabled(true);
	}

	if (emoji) {
		button.setEmoji(emoji);
	}

	return button;
}
