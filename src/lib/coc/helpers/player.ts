import { container, UserError } from '@sapphire/framework';
import { HTTPError, Player, Util } from 'clashofclans.js';

import { ErrorMessages } from '#lib/coc';

class PlayerHelper {
	private readonly identifier = 'player-helper';

	public async info(tag: string) {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({ identifier: this.identifier, message: 'No player found for the requested tag!' });
		}

		let player: Player;

		try {
			player = await container.coc.getPlayer(tag);
		} catch (error) {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: this.identifier,
					message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
				});
			}
		}

		return player!;
	}

	public async verifyPlayer(tag: string, token: string) {
		let status = false;

		try {
			status = await container.coc.verifyPlayerToken(tag, token);
		} catch (error) {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: this.identifier,
					message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
				});
			}
		}

		if (!status) {
			throw new UserError({ identifier: this.identifier, message: 'Invalid API token!' });
		}

		return this.info(tag);
	}
}

export const playerHelper = new PlayerHelper();
