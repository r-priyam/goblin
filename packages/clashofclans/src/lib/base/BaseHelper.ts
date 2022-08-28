import { GoblinClashClient } from '../extension/ClashClient.js';

export abstract class BaseHelper {
	public readonly core: GoblinClashClient;

	public constructor(core: GoblinClashClient) {
		this.core = core;
	}

	protected get client() {
		return this.core.rest;
	}
}
