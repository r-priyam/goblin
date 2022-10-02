import { isNullish } from '@sapphire/utilities';
import { envParseInteger, envParseString } from '@skyra/env-utilities';
import Redis from 'ioredis';

export type ClanOrPlayer = {
	name: string;
	tag: string;
};

export type ClanAlias = ClanOrPlayer & {
	alias: string;
};

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
		const initial = type === 'CLAN' ? 'c' : 'p';
		const cachedData = await this.fetch<ClanOrPlayer[]>(`${initial}-${userId}`);

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedData)) return this.insert(`${initial}-${userId}`, [{ name: name!, tag }]);

			cachedData.push({ name: name!, tag });
			return this.insert(`${initial}-${userId}`, cachedData);
		}

		if (isNullish(cachedData)) return;

		const updated = cachedData.filter((data) => data.tag === tag);
		return updated.length === 0
			? this.delete(`${initial}-${userId}`)
			: this.set(`${initial}-${userId}`, JSON.stringify(updated));
	}

	public async handleAliasOperations(method: string, tag: string, alias: string, name?: string) {
		const cachedAlias = await this.fetch<ClanAlias[]>('clan-aliases');

		if (method === RedisMethods.Insert) {
			if (isNullish(cachedAlias)) return this.insert(`clan-aliases`, [{ name: name!, tag, alias }]);

			cachedAlias.push({ name: name!, tag, alias });
			return this.insert('clan-aliases', cachedAlias);
		}

		if (isNullish(cachedAlias)) return;

		const updated = cachedAlias.filter((data) => data.tag === tag);
		return updated.length === 0 ? this.delete('clan-aliases') : this.insert('clan-aliases', updated);
	}
}