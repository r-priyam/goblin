import { Time } from '@sapphire/cron';
import { envParseString } from '@skyra/env-utilities';
import { Client, RESTManager } from 'clashofclans.js';

import type { OverrideOptions } from 'clashofclans.js';

import { ClanHelper } from '#lib/coc/structure/ClanHelper';
import { ClientCache } from '#lib/coc/structure/ClientCache';
import { LinkApi } from '#lib/coc/structure/LinkApi';
import { GoblinPlayer } from '#lib/coc/structure/Player';
import { PlayerHelper } from '#lib/coc/structure/PlayerHelper';

export class GoblinClashClient extends Client {
	public clanHelper: ClanHelper;

	public playerHelper: PlayerHelper;

	public linkApi: LinkApi;

	public constructor() {
		super({ restRequestTimeout: Time.Second * 30 });

		this.clanHelper = new ClanHelper();
		this.playerHelper = new PlayerHelper();
		this.linkApi = new LinkApi(envParseString('CLASH_LINK_USER_NAME'), envParseString('CLASH_LINK_PASSWORD'));
		// @ts-expect-error clear property missing in cache
		this.rest = new RESTManager({ cache: new ClientCache(), rejectIfNotValid: true });
	}

	public override async getPlayer(playerTag: string, options?: OverrideOptions) {
		const { data } = await this.rest.getPlayer(playerTag, options);
		return new GoblinPlayer(this, data);
	}
}
