import { Client } from 'clashofclans.js';

import { LinkApi } from '#lib/coc';
import config from '#root/config';

export class GoblinClashClient extends Client {
	public linkApi = new LinkApi(config.clash.linkUserName, config.clash.linkPassword);
}
