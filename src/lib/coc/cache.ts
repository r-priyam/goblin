import { container } from '@sapphire/framework';

export class Cache {
	private readonly redis = container.redis;

	public async set(key: string, value: string, ttl = 0) {
		await this.redis.set(key, JSON.stringify(value), { PX: ttl });
		return true;
	}

	public async get(key: string) {
		const data = await this.redis.get(key);
		if (data === null) {
			return null;
		}

		return JSON.parse(data);
	}

	public async delete(key: string) {
		await this.redis.del(key);
	}
}
