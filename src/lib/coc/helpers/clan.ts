import { UserError, container } from '@sapphire/framework';
import { Clan, Util, HTTPError } from 'clashofclans.js';
import { ErrorMessages } from '../constants';

class ClanHelper extends null {
	private readonly coc = container.coc;
	private readonly identifier = 'clan-helper';

	public async info(tag: string) {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({ identifier: this.identifier, message: 'No clan found for the requested tag!' });
		}

		let clan: Clan;

		try {
			clan = await this.coc.getClan(tag);
		} catch (error) {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: this.identifier,
					message: error.status === 404 ? 'No clan found for the requested tag!' : ErrorMessages[error.status]
				});
			}
		}

		return clan!;
	}
}

export const clanHelper = new ClanHelper();
