import { APIPlayer, Player } from 'clashofclans.js';

import { GoblinClashClient } from '#lib/coc';
import { UnitsHelper } from '#lib/coc/structure/UnitsHelper';

export class GoblinPlayer extends Player {
	/** Helper class to return player units in category and in beautiful discord formatting */
	public units: UnitsHelper;

	public constructor(public override client: GoblinClashClient, data: APIPlayer) {
		super(client, data);

		this.units = new UnitsHelper(this);
	}
}
