import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

class RedisUtil {
	public async set(key: string, value: string, ttl = 0) {
		let success = true;

		try {
			ttl === 0 ? await container.redis.set(key, value) : await container.redis.set(key, value, { EX: ttl });
		} catch {
			success = false;
		}

		return success;
	}

	public async get<k>(key: string): Promise<k | null> {
		const data = await container.redis.get(key);

		if (isNullish(data)) {
			return null;
		}

		return JSON.parse(data);
	}

	public async delete(key: string) {
		await container.redis.del(key);
	}

	public async handleClanOrPlayerCache(type: string, method: string, userId: string, tag: string, name?: string) {
		const initial = type === 'CLAN' ? 'c' : 'p';
		const cachedData = await this.get<ClanOrPlayer[]>(`${initial}-${userId}`);

		if (method === 'UPDATE') {
			if (isNullish(cachedData)) {
				return this.set(`${initial}-${userId}`, JSON.stringify([{ name: name!, tag }]));
			}

			cachedData.push({ name: name!, tag });
			return this.set(`${initial}-${userId}`, JSON.stringify(cachedData));
		}

		if (isNullish(cachedData)) return;

		const updated = cachedData.filter((data) => data.tag === tag);

		if (updated.length === 0) return this.delete(`${initial}-${userId}`);
		return this.set(`${initial}-${userId}`, JSON.stringify(updated));
	}

	public async handleAliasOperations(method: 'CREATE' | 'DELETE', tag: string, alias: string, name?: string) {
		const cachedAlias = await this.get<ClanAlias[]>('clan-aliases');

		if (method === 'CREATE') {
			if (isNullish(cachedAlias)) {
				return this.set(`clan-aliases`, JSON.stringify([{ name: name!, tag, alias }]));
			}

			cachedAlias.push({ name: name!, tag, alias });
			return this.set('clan-aliases', JSON.stringify(cachedAlias));
		}

		if (isNullish(cachedAlias)) return;

		const updated = cachedAlias.filter((data) => data.tag === tag);

		if (updated.length === 0) return this.delete('clan-aliases');
		return this.set('clan-aliases', JSON.stringify(updated));
	}
}

export const redis = new RedisUtil();

export type ClanOrPlayer = {
	name: string;
	tag: string;
}

export type ClanAlias = ClanOrPlayer & {
	alias: string;
}
