import { bold } from '@discordjs/builders';
import { container, Result, UserError } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { CommandInteraction } from 'discord.js';

import type { GoblinPlayer } from '#lib/coc';
import type { HTTPError } from 'clashofclans.js';

import { ErrorMessages } from '#lib/coc';
import { ValidateTag } from '#lib/decorators/ValidateTag';
import { ErrorIdentifiers } from '#utils/constants';

export class PlayerHelper {
	@ValidateTag({ prefix: 'player', isDynamic: true })
	public async info(_interaction: CommandInteraction<'cached'>, tag: string): Promise<GoblinPlayer> {
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

	public async verifyPlayer(interaction: CommandInteraction<'cached'>, tag: string, token: string) {
		const result = await Result.fromAsync<boolean, HTTPError>(async () =>
			container.coc.verifyPlayerToken(tag, token)
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			throw new UserError({
				identifier: ErrorIdentifiers.PlayerHelper,
				message: error.status === 404 ? 'No player found for the requested tag!' : ErrorMessages[error.status]
			});
		}

		if (!result.unwrap()) {
			throw new UserError({ identifier: ErrorIdentifiers.PlayerHelper, message: 'Invalid API token!' });
		}

		return this.info(interaction, tag);
	}

	public async dynamicTag(interaction: CommandInteraction<'cached'>) {
		const playerTag = interaction.options.getString('tag');

		if (playerTag) {
			return playerTag;
		} else {
			const [data] = await container.sql<[{ playerTag: string }]>`SELECT player_tag
                                                                        FROM players
                                                                        WHERE user_id = ${interaction.user.id} LIMIT 1`;
			if (isNullishOrEmpty(data)) {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: bold(
						"My poor eyes can't find any player linked to your account. Please link any or provide the tag while running the command!"
					)
				});
			}

			return data.playerTag;
		}
	}
}
