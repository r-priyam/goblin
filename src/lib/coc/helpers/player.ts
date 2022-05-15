import { container, UserError } from '@sapphire/framework';
import { HTTPError, Player, Util } from 'clashofclans.js';
import { ErrorMessages } from '../constants';

class PlayerHelper extends null {
	private readonly coc = container.coc;
	private readonly identifier = 'player-helper';

	public async info(tag: string) {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({ identifier: this.identifier, message: 'No player found for the requested tag!' });
		}

		let player: Player;

		try {
			player = await this.coc.getPlayer(tag);
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
}

export const playerHelper = new PlayerHelper();
