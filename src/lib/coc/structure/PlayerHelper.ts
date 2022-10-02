import { container, Result, UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';

import type { GoblinPlayer } from '#lib/coc';
import type { HTTPError } from 'clashofclans.js';

import { ErrorMessages } from '#lib/coc';
import { ErrorIdentifiers } from '#utils/constants';

export class PlayerHelper {
	public async info(tag: string): Promise<GoblinPlayer> {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({
				identifier: ErrorIdentifiers.WrongTag,
				message: 'No player found for the requested tag!'
			});
		}

		const result = await Result.fromAsync<GoblinPlayer, HTTPError>(() => container.coc.getPlayer(tag));

		if (result.isErr()) {
			const error = result.unwrapErr();
			throw new UserError({
				identifier: ErrorIdentifiers.PlayerHelper,
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
				identifier: ErrorIdentifiers.PlayerHelper,
				message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
			});
		}

		if (!result.unwrap())
			throw new UserError({ identifier: ErrorIdentifiers.PlayerHelper, message: 'Invalid API token!' });
		return this.info(tag);
	}
}
