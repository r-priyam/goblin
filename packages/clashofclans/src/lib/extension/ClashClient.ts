import { type RedisClientType } from '@redis/client';
import { type ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { Client, OverrideOptions, RESTManager } from 'clashofclans.js';

import { LinkApi } from './LinkApi.js';

import { ClanHelper } from '../helpers/clan.js';
import { PlayerHelper } from '../helpers/player.js';
import { GoblinPlayer } from '../structure/Player.js';
import { GoblinClientOptions } from '../types/lib';
import { Cache } from '../util/cache.js';

export class GoblinClashClient extends Client {
	public linkApi: LinkApi;
	public clanHelper: ClanHelper;
	public playerHelper: PlayerHelper;

	private redisClient: RedisClientType;
	private taskClient: ScheduledTaskHandler;

	public constructor(options: GoblinClientOptions) {
		super(options);
		// @ts-expect-error Missing clear property from cache
		this.rest = new RESTManager({ ...options, cache: new Cache(options.redisClient), rejectIfNotValid: true });

		this.redisClient = options.redisClient;
		this.taskClient = options.taskClient;

		this.linkApi = new LinkApi(options.linkApiUserName, options.linkApiPassword, this.redisClient, this.taskClient);
		this.clanHelper = new ClanHelper(this);
		this.playerHelper = new PlayerHelper(this);
	}

	public override async getPlayer(playerTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getPlayer(playerTag, options);
		return new GoblinPlayer(this, data);
	}
}
