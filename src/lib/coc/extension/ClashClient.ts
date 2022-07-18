import { envParseString } from '@skyra/env-utilities';
import { Client } from 'clashofclans.js';

import { LinkApi } from '#lib/coc';

export class GoblinClashClient extends Client {
	public linkApi = new LinkApi(envParseString('CLASH_LINK_USER_NAME'), envParseString('CLASH_LINK_PASSWORD'));
}
