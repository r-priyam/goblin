import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { envParseInteger, envParseString } from '@skyra/env-utilities';
import Redis from 'ioredis';

import type { SelectMenuComponentOptionData } from 'discord.js';

import { RedisKeys } from '#utils/constants';

export enum RedisMethods {
	Delete = 'DELETE',
	Insert = 'INSERT',
	Update = 'UPDATE'
}

export class GoblinRedisClient extends Redis {
	public constructor() {
		super({
			host: envParseString('REDIS_HOST'),
			port: envParseInteger('REDIS_PORT')
		});
	}

	public async insert<K extends RedisKeys>(key: K, query: RedisKeyQuery<K>, data: RedisData<K>) {
		return this.set(query ? `${key}-${query}` : key, JSON.stringify(data));
	}

	public async insertWithExpiry<K extends RedisKeys>(
		key: K,
		query: RedisKeyQuery<K>,
		data: RedisData<K>,
		expiry: number
	) {
		return this.set(query ? `${key}-${query}` : key, JSON.stringify(data), 'EX', expiry);
	}

	public async fetch<K extends RedisKeys>(key: K, query: RedisKeyQuery<K>) {
		const result = await Result.fromAsync(async () => {
			const raw = await this.get(query ? `${key}-${query}` : key);

			if (isNullish(raw)) return raw;

			return JSON.parse(raw) as RedisData<K>;
		});

		return result.match({
			ok: (data) => data,
			err: () => null
		});
	}

	public async delete<K extends RedisKeys>(key: K, query: RedisKeyQuery<K>) {
		return this.del(query ? `${key}-${query}` : key);
	}

	public async handleClanOrPlayerCacheCache(type: string, method: string, userId: string, tag: string, name?: string) {
		const initial = type === 'CLAN' ? RedisKeys.Clan : RedisKeys.Player;
		const cachedData = await this.fetch(initial, userId);

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedData)) {
				const data = await container.sql<ClanOrPlayerCache[]>`SELECT player_name AS "name", player_tag AS "tag"
				                                  FROM players
										        WHERE user_id = ${userId}`;
				return this.insert(initial, userId, data);
			}

			cachedData.push({ name: name!, tag });
			return this.insert(initial, userId, cachedData);
		}

		if (isNullish(cachedData)) return;

		const updated = cachedData.filter((data) => data.tag !== tag);
		return updated.length === 0
			? this.delete(initial, userId)
			: this.set(`${initial}-${userId}`, JSON.stringify(updated));
	}

	public async handleAliasOperations(method: string, tag: string, alias: string, name?: string) {
		const cachedAlias = await this.fetch(RedisKeys.ClanAlias, undefined);

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedAlias)) return this.insert(RedisKeys.ClanAlias, undefined, [{ name: name!, tag, alias }]);

			cachedAlias.push({ name: name!, tag, alias });
			return this.insert(RedisKeys.ClanAlias, undefined, cachedAlias);
		}

		if (isNullish(cachedAlias)) return;

		const updated = cachedAlias.filter((data) => data.tag !== tag);
		return updated.length === 0
			? this.delete(RedisKeys.ClanAlias, undefined)
			: this.insert(RedisKeys.ClanAlias, undefined, updated);
	}
}

export interface ClanOrPlayerCache {
	name: string;
	tag: string;
}

interface ClanAliasCache extends ClanOrPlayerCache {
	alias: string;
}

type RedisKeyQuery<K extends RedisKeys> = K extends RedisKeys.Player
	? string
	: K extends RedisKeys.Clan
	? string
	: K extends RedisKeys.Links
	? string
	: K extends RedisKeys.ClanAlias
	? undefined
	: K extends RedisKeys.CWLEventRegistration
	? string
	: never;

type RedisData<K extends RedisKeys> = K extends RedisKeys.Player
	? ClanOrPlayerCache[]
	: K extends RedisKeys.Clan
	? ClanOrPlayerCache[]
	: K extends RedisKeys.Links
	? string[]
	: K extends RedisKeys.ClanAlias
	? ClanAliasCache[]
	: K extends RedisKeys.CWLEventRegistration
	? SelectMenuComponentOptionData[]
	: never;
