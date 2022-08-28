import { RedisClientType } from '@redis/client';
import { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { RequestOptions } from 'clashofclans.js';

import { GoblinRedisUtility } from '../util/redisUtility.js';

export class LinkApi {
	private username: string;
	private password: string;
	private baseUrl = 'https://cocdiscord.link';
	private apiKey: string | null = null;
	private apiKeyExpiry: number | null = null;
	private redis: GoblinRedisUtility;
	private tasks: ScheduledTaskHandler;

	public constructor(username: string, password: string, redis: RedisClientType, tasks: ScheduledTaskHandler) {
		this.username = username;
		this.password = password;
		this.redis = new GoblinRedisUtility(redis);
		this.tasks = tasks;
	}

	public async getLinks(tagOrId: string) {
		const cachedData = await this.redis.get<string[]>(`links-${tagOrId}`);

		if (isNullish(cachedData)) {
			const data = await this.request<{ playerTag: string; discordId: string }[]>(`/links/${tagOrId}`, { method: 'GET' });
			if (isNullishOrEmpty(data)) return null;

			const tags = data.map((d) => d.playerTag);
			// @ts-expect-error needs typing for task name
			this.tasks.create('syncPlayerLinks', { userId: tagOrId, tags }, 60_000);
			await this.redis.set(`links-${tagOrId}`, JSON.stringify(tags), 10 * 60);
			return tags;
		}

		return cachedData;
	}

	private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
		if (this.apiKeyExpiry && !(this.apiKeyExpiry < Date.now())) {
			await this.getKey();
		}

		const response = await fetch(`${this.baseUrl}${path}`, {
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
			body: JSON.stringify({ username: this.username, password: this.password })
		});

		this.apiKey = payload.token;
		this.parseJwt();
	}

	private parseJwt() {
		this.apiKeyExpiry = JSON.parse(Buffer.from(this.apiKey!.split('.')[1], 'base64').toString()).exp;
	}
}
