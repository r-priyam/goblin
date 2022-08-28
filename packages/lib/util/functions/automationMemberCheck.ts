import { inlineCode, userMention } from '@discordjs/builders';
import { UserError } from '@sapphire/framework';
import { envParseArray, envParseString } from '@skyra/env-utilities';
import { bold } from 'colorette';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { GuildMember } from 'discord.js';

export function automationMemberCheck(guildId: string, member: GuildMember, checkManageGuild = false) {
	if (guildId === envParseString('EYG_GUILD_ID') && !envParseArray('OWNERS').includes(member.id)) {
		throw new UserError({
			identifier: 'user-not-allowed',
			message: `You are not authorized to run this command. Please contact ${userMention(
				'292332992251297794'
			)} to get anything done that you need`
		});
	}

	if (checkManageGuild) {
		const checkPermission = member.permissions.has(PermissionFlagsBits.ManageGuild);
		if (!checkPermission) {
			throw new UserError({
				identifier: 'user-not-allowed',
				message: `You are not missing ${bold(inlineCode('Manage Server'))} permission to perform this action`
			});
		}
	}
}
