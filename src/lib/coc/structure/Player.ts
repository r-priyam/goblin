import { Player } from 'clashofclans.js';

import type { GoblinClashClient } from '#lib/coc';
import type { APIPlayer } from 'clashofclans.js';

import { UnitsHelper } from '#lib/coc/structure/UnitsHelper';

export class GoblinPlayer extends Player {
	/**
	 * Helper class to return player units in category and in beautiful discord formatting
	 */
	public units: UnitsHelper;

	public constructor(
		public override client: GoblinClashClient,
		body: APIPlayer
	) {
		super(client, body);

		this.units = new UnitsHelper(this);
	}

	/**
	 * Returns the Player TownHall image
	 */
	public get townHallImage() {
		return `https://clash-assets.vercel.app/townhalls/${
			this.townHallWeaponLevel ? `${this.townHallLevel}.${this.townHallWeaponLevel}` : `${this.townHallLevel}`
		}.png`;
	}
}
