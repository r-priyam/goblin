import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import Fuse from 'fuse.js';

import type { ClanOrPlayerCache } from '#lib/redis-cache/RedisCacheClient';
import type { AutocompleteInteraction } from 'discord.js';

import { RedisKeys } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		const identifier = interaction.commandName === 'player' ? RedisKeys.Player : RedisKeys.Clan;
		const cachedData = (await this.redis.fetch(identifier, interaction.user.id)) ?? [];

		const tag = interaction.options.getFocused(true).value.trim();

		if (isNullishOrEmpty(tag)) {
			// here just cross check when there's no redis cache, who knows
			if (isNullishOrEmpty(cachedData)) return this.handleNoRedisCache(interaction.user.id, identifier);
			return this.some(this.handleNoFocusedValue(cachedData));
		}

		const fuse = new Fuse(cachedData, {
			includeScore: true,
			keys: ['name', 'tag']
		});
		const matches = fuse.search(tag);

		// When the user don't have any account linked and the tag value is there
		// so show if it's a valid tag or not
		if (isNullishOrEmpty(cachedData) || isNullishOrEmpty(matches)) {
			return this.some(this.handleNoMatch(tag));
		}

		return this.some(this.getFuzzyMatches(tag, matches));
	}

	private async handleNoRedisCache(userId: string, identifier: RedisKeys.Clan | RedisKeys.Player) {
		const data = await (identifier === RedisKeys.Player
			? this.sql<ClanOrPlayerCache[]>`
                    SELECT player_name AS "name", player_tag AS "tag"
                    FROM players
                    WHERE user_id = ${userId}
            `
			: this.sql<ClanOrPlayerCache[]>`
                SELECT clan_name AS "name", clan_tag AS "tag"
                FROM clans
                WHERE user_id = ${userId}
            `);

		if (isNullishOrEmpty(data)) return this.none();

		await this.redis.insert(identifier, userId, data);
		return this.some(this.handleNoFocusedValue(data as unknown as ClanOrPlayerCache[]));
	}

	private handleNoFocusedValue(cachedData: ClanOrPlayerCache[]) {
		return cachedData
			.map((data) => ({
				name: `✅ ${data.name} (${data.tag})`,
				value: data.tag
			}))
			.slice(0, 14);
	}

	private handleNoMatch(tag: string) {
		const formattedTag = Util.formatTag(String(tag));
		const validateTag = Util.isValidTag(formattedTag);

		return validateTag
			? [{ name: `✅ ${formattedTag} is a valid tag`, value: formattedTag }]
			: [{ name: `❌ ${formattedTag || tag} isn't a valid tag ❌`, value: tag }];
	}

	private getFuzzyMatches(rawTag: string, matches: Fuse.FuseResult<ClanOrPlayerCache>[]) {
		const result = matches
			.map((fuzzy) => ({
				name: `✅ ${fuzzy.item.name} (${fuzzy.item.tag})`,
				value: fuzzy.item.tag
			}))
			.slice(0, 14);

		if (result[0].value.toLowerCase() === rawTag.toLowerCase()) return result;

		result.unshift(...this.handleNoMatch(rawTag));
		return result;
	}
}
