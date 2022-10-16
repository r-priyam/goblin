import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import Fuse from 'fuse.js';

import type { ClanOrPlayer } from '#lib/redis-cache/RedisCacheClient';
import type { AutocompleteInteraction } from 'discord.js';

import { getFuzzyTagSuggestions, handleNoFuzzyMatch, handleNoValue } from '#lib/coc';

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
		const cachedData = await this.redis.fetch<{ name: string; tag: string }[]>(
			`${shortType}${interaction.user.id}`
		);
		const focused = interaction.options.getFocused(true);

		if (isNullishOrEmpty(focused.value)) {
			if (isNullishOrEmpty(cachedData)) {
				let data = null;

				if (shortType === 'p-') {
					data = await this.sql`SELECT player_name AS "name", player_tag AS "tag"
                                          FROM players
                                          WHERE user_id = ${interaction.user.id}`;
				} else {
					data = await this.sql`SELECT clan_name AS "name", clan_tag AS "tag"
                                          FROM clans
                                          WHERE user_id = ${interaction.user.id}`;
				}

				if (data) {
					await this.redis.insert(`${shortType}${interaction.user.id}`, data);
					return this.some(handleNoValue(data as unknown as ClanOrPlayer[]));
				}

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
