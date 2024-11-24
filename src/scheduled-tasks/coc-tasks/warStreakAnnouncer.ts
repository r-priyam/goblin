import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Result } from '@sapphire/result';
import { RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { Status } from 'discord.js';

import { BlueNumberEmotes, TownHallEmotes } from '#lib/coc';
import { logInfo, logWarning } from '#utils/functions/logging';

import type { Clan, HTTPError as COCHttpError } from 'clashofclans.js';
import type { HTTPError } from 'discord.js';


@ApplyOptions<ScheduledTask.Options>({
	pattern: '00 */2 * * *',
	customJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	}
})
export class WarStreakAnnouncer extends ScheduledTask {
	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) {
			return;
		}

		const data = await this.sql<WarStreakAnnouncerData[]>`SELECT clan_tag,
																	 channel_id
																   FROM war_win_streak_announcement`;
		for (const x of data) {
			await this.announceWarStreak(x);
		}
	}

	private async announceWarStreak(data: WarStreakAnnouncerData) {
        // Handle
	}
}

type WarStreakAnnouncerData = {
	channelId: string;
	clanTag: string;
	currentWinStreak : number;
};
