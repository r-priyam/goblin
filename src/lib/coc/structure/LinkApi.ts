import { Buffer } from 'node:buffer';
import { container } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { RequestOptions } from 'clashofclans.js';
import { redis } from '#utils/redis';

export class LinkApi {
	private readonly userName: string;

	private readonly password: string;

	private readonly url = 'https://cocdiscord.link';

	private apiKey: string | null = null;

	private expiry: number | null = null;

	public constructor(username: string, password: string) {
		this.userName = username;
		this.password = password;
	}

	public async getLinks(tagOrId: string) {
		const cachedData = await redis.get<string[]>(`links-${tagOrId}`);

		if (isNullish(cachedData)) {
			const data = await this.request<{ discordId: string; playerTag: string }[]>(`/links/${tagOrId}`, {
				method: 'GET'
			});
			if (isNullishOrEmpty(data)) return null;

			const tags = data.map((linkData) => linkData.playerTag);
			container.tasks.create('syncPlayerLinks', { userId: tagOrId, tags }, 60_000);
			await redis.set(`links-${tagOrId}`, JSON.stringify(tags), 10 * 60);
			return tags;
		}

		return cachedData;
	}

	private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
		if (this.expiry && this.expiry >= Date.now()) {
			await this.getKey();
		}

		const response = await fetch(`${this.url}${path}`, {
			method: options.method,
			body: options.body,
			headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' }
		}).catch(() => null);

		const data = await response?.json().catch(() => null);

		if (response?.status === 401) {
			await this.getKey();
			return this.request(path, options);
		}

		return data;
	}

	private async getKey() {
		const payload = await this.request<{ token: string }>('/login', {
			method: 'POST',
			body: JSON.stringify({ username: this.userName, password: this.password })
		});

		this.apiKey = payload.token;
		this.parseJwt();
	}

	private parseJwt() {
		this.expiry = JSON.parse(Buffer.from(this.apiKey!.split('.')[1], 'base64').toString()).exp;
	}
}
