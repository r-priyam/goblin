import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

export class Cache {
	public async set(key: string, value: string, ttl = 0) {
		await container.redis.set(key, JSON.stringify(value), { PX: ttl });
		return true;
	}

	public async get(key: string) {
		const data = await container.redis.get(key);

		if (isNullish(data)) {
			return null;
		}

		return JSON.parse(data);
	}

	public async delete(key: string) {
		await container.redis.del(key);
	}
}
