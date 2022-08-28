import { APIPlayer, Player } from 'clashofclans.js';

import { GoblinClashClient } from '../extension/ClashClient.js';
import { PlayerUnits } from '../helpers/units.js';

export class GoblinPlayer extends Player {
	/** Helper class to return player units in category and in beautiful discord formatting */
	public units: PlayerUnits;

	public constructor(public override client: GoblinClashClient, data: APIPlayer) {
		super(client, data);

		this.units = new PlayerUnits(this);
	}
}
