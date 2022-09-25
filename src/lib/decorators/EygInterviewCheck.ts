import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { ErrorIdentifiers } from '#utils/constants';

export const EygInterviewCheck = (): MethodDecorator => {
	return createFunctionPrecondition((interaction: CommandInteraction<'cached'>) => {
		const roleCheck = (interaction.member as GuildMember).roles.cache.hasAny(
			envParseString('EYG_RECRUIT_ROLE_ID'),
			envParseString('EYG_ADMINISTRATOR_ROLE')
		);

		if (!roleCheck) {
			throw new UserError({
				identifier: ErrorIdentifiers.MissingPermissions,
				message: "You aren't allowed to run interview command"
			});
		}

		return true;
	});
};
