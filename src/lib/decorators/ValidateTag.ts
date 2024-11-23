import { createFunctionPrecondition } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { bold } from 'discord.js';

import { ErrorIdentifiers } from '#utils/constants';

import type { ChatInputCommandInteraction } from 'discord.js';

function tagChecker(tag: string, prefix: string) {
	if (!Util.isValidTag(Util.formatTag(tag!))) {
		throw new UserError({
			identifier: ErrorIdentifiers.WrongTag,
			message: bold(`Uh-oh, I can't find any ${prefix} for the requested tag!`)
		});
	}

	return true;
}

export const ValidateTag = ({ prefix, isDynamic }: { isDynamic?: boolean; prefix: string }): MethodDecorator =>
	createFunctionPrecondition((interaction: ChatInputCommandInteraction<'cached'>) => {
		const tag = interaction.options?.getString('tag');

		if (isDynamic && !tag) {
			return true;
		}

		return tagChecker(tag!, prefix);
	});
