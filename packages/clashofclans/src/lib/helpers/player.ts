import { container, Result, UserError } from '@sapphire/framework';
import { HTTPError, Player, Util } from 'clashofclans.js';

import { BaseHelper } from '../base/BaseHelper';
import { ErrorMessages } from '../constant/constants';

class PlayerHelper extends BaseHelper {
	private readonly identifier = 'player-helper';

	public async info(tag: string): Promise<Player> {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({ identifier: this.identifier, message: 'No player found for the requested tag!' });
		}

		const player = await Result.fromAsync(() => this.client.getPlayer(tag));
		return player.unwrapOrElse((error) => {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: this.identifier,
					message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
				});
			}

			throw error;
		});
	}

	public async verifyPlayer(tag: string, token: string) {
		const status = await Result.fromAsync(() => container.coc.verifyPlayerToken(tag, token));
		status.unwrapOrElse((error) => {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: this.identifier,
					message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
				});
			}

			throw error;
		});

		if (!status.isOk()) throw new UserError({ identifier: this.identifier, message: 'Invalid API token!' });
		return this.info(tag);
	}
}
