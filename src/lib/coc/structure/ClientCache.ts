import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';

export class ClientCache {
	public async set(key: string, value: string, ttl = 0) {
		return container.redis.set(key, JSON.stringify(value), 'PX', ttl);
	}

	public async get(key: string) {
		const result: any = await Result.fromAsync(async () => {
			const raw = await this.get(key);

			if (isNullish(raw)) return raw;

			return JSON.parse(raw);
		});

		return result.match({
			ok: (data: any) => data,
			err: () => null
		});
	}

	public async delete(key: string) {
		await container.redis.del(key);
	}
}
