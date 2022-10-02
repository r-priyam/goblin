import { bold, inlineCode, userMention } from '@discordjs/builders';
import { UserError } from '@sapphire/framework';
import { envParseArray, envParseString } from '@skyra/env-utilities';
import { PermissionFlagsBits } from 'discord-api-types/v9';

import type { GuildMember } from 'discord.js';

import { ErrorIdentifiers } from '#utils/constants';

export function automationMemberCheck(guildId: string, member: GuildMember, checkManageMessage = false) {
	if (guildId === envParseString('EYG_GUILD') && !envParseArray('OWNERS').includes(member.id)) {
		throw new UserError({
			identifier: ErrorIdentifiers.MissingPermissions,
			message: `You are not authorized to run this command. Please contact ${userMention(
				'292332992251297794'
			)} to get anything done that you need`
		});
	}

	if (checkManageMessage) {
		const checkPermission = member.permissions.has(PermissionFlagsBits.ManageGuild);
		if (!checkPermission) {
			throw new UserError({
				identifier: ErrorIdentifiers.MissingPermissions,
				message: `You are missing ${inlineCode(bold('Manage Message'))} permission to run this command`
			});
		}
	}
}
