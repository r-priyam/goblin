import { bold, channelMention, italic, roleMention } from '@discordjs/builders';
import { UserError } from '@sapphire/framework';

import { ErrorIdentifiers, EventConfigDefaultValues } from '#utils/constants';

export function eventConfigMessage({
	eventName,
	registrationChannel,
	startRolePing,
	endRolePing
}: {
	endRolePing?: string;
	eventName?: string;
	registrationChannel?: string;
	startRolePing?: string;
}) {
	return `
Please click on the respective buttons to configure.

${bold('Configuration')}
${bold('Name:')} ${eventName ?? italic('Not Configured (Required)')}
${bold('Registration Channel:')} ${
		registrationChannel ? channelMention(registrationChannel) : italic('Not Configured (Required)')
	}
${bold('Start Role Ping:')} ${startRolePing ? roleMention(startRolePing) : italic('Not Configured')}
${bold('End Role Ping:')} ${endRolePing ? roleMention(endRolePing) : italic('Not Configured')}

${bold('Configuaration Fields Information')}
● Event Name - The name of the event
● Registration Channel - The channel where only bot will accept the applications
● Start Role Ping - The role to ping when the event will start
● End Role Ping - The role to ping when the event will end

${bold('FAQs')}
1. Red colour button means that it's not configured yet.
2. Green colour button means that the specific field is now set.
3. You can click on the buttons again to change the value if you want to.

${bold(italic('Once you are satisfied with the above displayed values then click on Submit to create the event'))}
`;
}

export function extractConfigsFromValues(values: string[], isSubmit = false) {
	const valuesToReturn: {
		endRolePing: string | null;
		eventName: string | null;
		registrationChannel: string | null;
		startRolePing: string | null;
	} = {
		eventName: null,
		registrationChannel: null,
		startRolePing: null,
		endRolePing: null
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
			if (([EventConfigDefaultValues.Required, EventConfigDefaultValues.NotRequired] as String[]).includes(val)) {
				val = null;
			}

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
