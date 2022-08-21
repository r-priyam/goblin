import { container, Result, UserError } from '@sapphire/framework';
import { HTTPError, Util } from 'clashofclans.js';

import { ErrorMessages } from '#lib/coc';

class CocClanHelper {
	public async info(tag: string) {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({
				identifier: 'clan-wrong-tag',
				message: 'No clan found for the requested tag!'
			});
		}

		const clan = await Result.fromAsync(() => container.coc.getClan(tag));
		return clan.unwrapOrElse((error) => {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: 'clan-info-request',
					message: error.status === 404 ? 'No clan found for the requested tag!' : ErrorMessages[error.status]
				});
			}

			throw error;
		});
	}
}

export const ClanHelper = new CocClanHelper();
