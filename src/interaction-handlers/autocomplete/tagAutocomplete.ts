import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { AutocompleteInteraction } from 'discord.js';
import Fuse from 'fuse.js';

import { getFuzzyTagSuggestions, handleNoFuzzyMatch, handleNoValue } from '#lib/coc';
import { redis } from '#utils/redis';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		// use array when there are more player specific commands
		const shortType = interaction.commandName === 'player' ? 'p-' : 'c-';
		const cachedData = await redis.get<{ name: string; tag: string }[]>(`${shortType}${interaction.user.id}`);
		const focused = interaction.options.getFocused(true);

		if (isNullishOrEmpty(focused.value)) {
			if (isNullishOrEmpty(cachedData)) {
				return this.none();
			}

			return this.some(handleNoValue(cachedData));
		}

		const tag = String(focused.value);
		if (isNullishOrEmpty(cachedData)) {
			return this.some(handleNoFuzzyMatch(tag));
		}

		const fuse = new Fuse(cachedData, { includeScore: true, keys: ['name', 'tag'] });
		const matches = fuse.search(tag);

		if (isNullishOrEmpty(matches)) {
			return this.some(handleNoFuzzyMatch(tag));
		}

		return this.some(getFuzzyTagSuggestions(tag, matches));
	}
}
