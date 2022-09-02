/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Util } from 'clashofclans.js';

export class SyncPlayerLinkTask extends ScheduledTask {
	public async run({ userId, tags }: { tags: string[], userId: string; }) {
		const players = await Util.allSettled(tags.map((tag) => this.coc.getPlayer(tag))).then((data) => {
			const insertData = [];
			for (const player of data) {
				insertData.push({ user_id: userId, player_name: player.name, player_tag: player.tag, link_api: true });
			}

			return insertData;
		});

		try {
			// TODO: Do some magic to sync with redis cache too
			await this.sql`INSERT INTO players (user_id, player_name, player_tag, link_api)
                           SELECT user_id, player_name, player_tag, link_api
                           FROM JSONB_TO_RECORDSET(${players}::jsonb) c(user_id TEXT, player_name TEXT, player_tag TEXT, link_api BOOLEAN)
                           ON CONFLICT DO NOTHING`;
		} catch (error) {
			this.logger.error(error);
		}
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		syncPlayerLinks: never;
	}
}
