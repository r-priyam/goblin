import type { Piece } from '@sapphire/framework';
import { Command, none, UserError } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
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

		if (isNullish(cachedData)) {
			return none();
		}

		const fuse = new Fuse(cachedData, { includeScore: true, keys: ['name', 'tag'] });
		const focused = interaction.options.getFocused(true);

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
