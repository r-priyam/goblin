import { Buffer } from 'node:buffer';

import { Time } from '@sapphire/cron';
import { container } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import { fetch } from 'undici';

import type { ClanOrPlayer } from '#lib/redis-cache/RedisCacheClient';
import type { RequestOptions } from 'clashofclans.js';

import { seconds } from '#utils/functions/time';

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
		const cachedData = await container.redis.fetch<string[]>(`links-${tagOrId}`);

		if (isNullish(cachedData)) {
			const data = await this.request<{ discordId: string; playerTag: string }[]>(`/links/${tagOrId}`, {
				method: 'GET'
			});
			if (isNullishOrEmpty(data)) return null;

			const linkApiTags = data.map((linkData) => linkData.playerTag);
			const cachedTags = ((await container.redis.fetch<ClanOrPlayer[]>(`p-${tagOrId}}`)) ?? []).map(
				(data) => data?.tag
			);

			const tagsToFetch = [...linkApiTags, ...cachedTags];
			const playersData = await Util.allSettled(tagsToFetch.map((tag) => container.coc.getPlayer(tag)));

			const sqlData = playersData.map((player) => ({
				user_id: tagOrId,
				player_name: player.name,
				player_tag: player.tag,
				link_api: true
			}));

			await container.sql`INSERT INTO players (user_id, player_name, player_tag, link_api)
                           SELECT user_id, player_name, player_tag, link_api
                           FROM JSONB_TO_RECORDSET(${sqlData}::jsonb) c(user_id TEXT, player_name TEXT, player_tag TEXT, link_api BOOLEAN)
                           ON CONFLICT DO NOTHING`;

			await container.redis.insert(
				`p-${tagOrId}`,
				playersData.map((player) => ({ name: player.name, tag: player.tag }))
			);

			await container.redis.insertWithExpiry(
				`links-${tagOrId}`,
				tagsToFetch,
				seconds.fromMilliseconds(Time.Minute * 5)
			);
			return playersData;
		}

		return Util.allSettled(cachedData.map((tag) => container.coc.getPlayer(tag)));
	}

	public async createLink(playerTag: string, discordId: string) {
		return this.request('/links', { method: 'POST', body: JSON.stringify({ playerTag, discordId }) });
	}

	public async deleteLink(tag: string) {
		return this.request(`/links/${tag}`, { method: 'DELETE' });
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

		return data as T;
	}

	private async getKey() {
		const payload = await this.request<{ token: string }>('/login', {
			method: 'POST',
			body: JSON.stringify({ username: this.userName, password: this.password })
		});

		this.apiKey = payload.token;
		this.expiry = JSON.parse(Buffer.from(this.apiKey!.split('.')[1], 'base64').toString()).exp;
	}
}
