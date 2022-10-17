import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { envParseInteger, envParseString } from '@skyra/env-utilities';
import Redis from 'ioredis';

import { CacheIdentifiers } from '#utils/constants';

export interface ClanOrPlayer {
	name: string;
	tag: string;
}

export interface ClanAlias extends ClanOrPlayer {
	alias: string;
}

export const enum RedisMethods {
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

	/**
	 *
	 * @param key - Key to set in the cache
	 * @param value - Value to set against the passed key
	 */
	public async insert(key: string, value: any) {
		return this.set(key, JSON.stringify(value));
	}

	/**
	 *
	 * @param key - Key to set in the cache
	 * @param value - Value to set against the passed key
	 * @param expiry - Number of seconds after which key should expire
	 */
	public async insertWithExpiry(key: string, value: any, expiry: number) {
		return this.set(key, JSON.stringify(value), 'EX', expiry);
	}

	/**
	 *
	 * @param key - Cache key to fetch data for
	 */
	public async fetch<k>(key: string): Promise<k | null> {
		const data = await this.get(key);
		return isNullish(data) ? null : JSON.parse(data);
	}

	/**
	 *
	 * @param key - Cache key to delete
	 */
	public async delete(key: string) {
		return this.del(key);
	}

	public async handleClanOrPlayerCache(type: string, method: string, userId: string, tag: string, name?: string) {
		const initial = type === 'CLAN' ? CacheIdentifiers.Clan : CacheIdentifiers.Player;
		const cachedData = await this.fetch<ClanOrPlayer[]>(`${initial}-${userId}`);

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedData)) {
				const data = await container.sql`SELECT player_name AS "name", player_tag AS "tag"
				                                  FROM players
										        WHERE user_id = ${userId}`;
				return this.insert(`${initial}-${userId}`, data);
			}

			cachedData.push({ name: name!, tag });
			return this.insert(`${initial}-${userId}`, cachedData);
		}

		if (isNullish(cachedData)) return;

		const updated = cachedData.filter((data) => data.tag !== tag);
		return updated.length === 0
			? this.delete(`${initial}-${userId}`)
			: this.set(`${initial}-${userId}`, JSON.stringify(updated));
	}

	public async handleAliasOperations(method: string, tag: string, alias: string, name?: string) {
		const cachedAlias = await this.fetch<ClanAlias[]>(CacheIdentifiers.ClanAliases);

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedAlias)) return this.insert(CacheIdentifiers.ClanAliases, [{ name: name!, tag, alias }]);

			cachedAlias.push({ name: name!, tag, alias });
			return this.insert(CacheIdentifiers.ClanAliases, cachedAlias);
		}

		if (isNullish(cachedAlias)) return;

		const updated = cachedAlias.filter((data) => data.tag === tag);
		return updated.length === 0
			? this.delete(CacheIdentifiers.ClanAliases)
			: this.insert(CacheIdentifiers.ClanAliases, updated);
	}
}
