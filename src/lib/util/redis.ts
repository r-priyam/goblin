import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

interface ClanOrPlayer {
	name: string;
	tag: string;
}

class RedisUtil {
	private readonly redis = container.redis;

	public async set(key: string, value: string, ttl = 0) {
		let success = true;

		try {
			ttl === 0 ? await this.redis.set(key, value) : await this.redis.set(key, value, { EX: ttl });
		} catch {
			success = false;
		}

		return success;
	}

	public async get(key: string) {
		const data = await this.redis.get(key);

		if (isNullish(data)) {
			return null;
		}

		return JSON.parse(data);
	}

	public async delete(key: string) {
		await this.redis.del(key);
	}

	public async handleClanOrPlayerCache(type: string, method: string, userId: string, tag: string, name?: string) {
		const initial = type === 'CLAN' ? 'c' : 'p';
		const cachedData: ClanOrPlayer[] = await this.get(`${initial}-${userId}`);

		if (method === 'UPDATE') {
			if (isNullish(cachedData)) {
				return this.set(`${initial}-${userId}`, JSON.stringify({ name: name!, tag }));
			}

			cachedData.push({ name: name!, tag });
			return this.set(`${initial}-${userId}`, JSON.stringify(cachedData));
		}

		if (isNullish(cachedData)) {
			return;
		}

		const updated = cachedData.filter((data) => data.tag === tag);
		return this.set(`${initial}-${userId}`, JSON.stringify(updated));
	}
}

export const redis = new RedisUtil();
