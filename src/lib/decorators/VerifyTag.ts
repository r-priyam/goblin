import { bold } from '@discordjs/builders';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';

import type { CommandInteraction } from 'discord.js';

import { ErrorIdentifiers } from '#utils/constants';

export const VerifyTag = (prefix: string): MethodDecorator => {
	return createFunctionPrecondition((interaction: CommandInteraction<'cached'>) => {
		const tag = interaction.options.getString('tag', true);
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({
				identifier: ErrorIdentifiers.WrongTag,
				message: bold(`Uh-oh, I can't find any ${prefix} for the requested tag!`)
			});
		}

		return true;
	});
};
