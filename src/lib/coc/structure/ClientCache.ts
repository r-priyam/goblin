import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

export class ClientCache {
	public async set(key: string, value: string, ttl = 0) {
		return container.redis.set(key, JSON.stringify(value), 'PX', ttl);
	}

	public async get(key: string) {
		const data = await container.redis.get(key);
		return isNullish(data) ? null : JSON.parse(data);
	}

	public async delete(key: string) {
		await container.redis.del(key);
	}
}
