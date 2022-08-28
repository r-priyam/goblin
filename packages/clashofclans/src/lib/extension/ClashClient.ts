import { Client } from 'clashofclans.js';

import { LinkApi } from './LinkApi';

import { ClanHelper } from '../helpers/clan';
import { GoblinClientOptions } from '../types/lib';

export class GoblinClashClient extends Client {
	public linkApi: LinkApi;
	public clanHelper: ClanHelper;

	private redisClient: string;
	private postgresClient: string;

	public constructor(options: GoblinClientOptions) {
		super(options);

		this.redisClient = options.redisClient;
		this.postgresClient = options.postgresClient;

		this.linkApi = new LinkApi(options.linkApiUserName, options.linkApiPassword);
		this.clanHelper = new ClanHelper(this);
	}
}
