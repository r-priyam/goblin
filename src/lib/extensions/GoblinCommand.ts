import type { Piece } from '@sapphire/framework';
import { Command, UserError } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import Fuse from 'fuse.js';
import { getFuzzyTagSuggestions, handleNoFuzzyMatch, handleNoValue } from '#lib/coc';
import { redis } from '#utils/redis';

export abstract class GoblinCommand extends Command {
	public constructor(context: Piece.Context, options: any) {
		super(context, { ...options });
	}

	protected userError({ identifier, message, embedMessage }: { identifier?: string; message?: string; embedMessage?: boolean }): never {
		throw new UserError({ identifier: identifier ?? 'user-error', message, context: { embedMessage } });
	}

	protected async handleClanOrPlayerTagAutoComplete(interaction: Command.AutocompleteInteraction, type: 'PLAYER' | 'CLAN') {
		const shortType = type === 'CLAN' ? 'c-' : 'p-';
		const cachedData: { name: string; tag: string }[] = await redis.get(`${shortType}${interaction.user.id}`);
		const focused = interaction.options.getFocused(true);

		if (!isNullishOrEmpty(focused.value)) {
			return interaction.respond(handleNoFuzzyMatch(String(focused.value)));
		}

		const fuse = new Fuse(cachedData, { includeScore: true, keys: ['name', 'tag'] });

		if (isNullishOrEmpty(focused.value)) {
			return interaction.respond(handleNoValue(cachedData));
		}

		const matches = fuse.search(String(focused.value));

		if (isNullishOrEmpty(matches)) {
			handleNoFuzzyMatch(String(focused.value));
		}

		return interaction.respond(getFuzzyTagSuggestions(String(focused.value), matches));
	}
}
