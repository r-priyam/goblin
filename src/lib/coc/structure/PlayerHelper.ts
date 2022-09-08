import { container, Result, UserError } from '@sapphire/framework';
import { HTTPError, Util } from 'clashofclans.js';
import { ErrorMessages, GoblinPlayer } from '#lib/coc';

export class PlayerHelper {
	private readonly identifier = 'player-helper';

	public async info(tag: string): Promise<GoblinPlayer> {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({ identifier: this.identifier, message: 'No player found for the requested tag!' });
		}

		const result = await Result.fromAsync<GoblinPlayer, HTTPError>(() => container.coc.getPlayer(tag));

		if (result.isErr()) {
			const error = result.unwrapErr();
			throw new UserError({
				identifier: this.identifier,
				message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
			});
		}

		return result.unwrap();
	}

	public async verifyPlayer(tag: string, token: string) {
		const result = await Result.fromAsync<boolean, HTTPError>(() => container.coc.verifyPlayerToken(tag, token));

		if (result.isErr()) {
			const error = result.unwrapErr();
			throw new UserError({
				identifier: this.identifier,
				message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
			});
		}

		if (!result.unwrap()) throw new UserError({ identifier: this.identifier, message: 'Invalid API token!' });
		return this.info(tag);
	}
}
