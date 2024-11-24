import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Result } from '@sapphire/result';
import type { Clan, HTTPError as COCHttpError } from 'clashofclans.js';
import { RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { EmbedBuilder, Status } from 'discord.js';
import type { HTTPError } from 'discord.js';
import { BlueNumberEmotes } from '#lib/coc';
import { logInfo, logWarning } from '#utils/functions/logging';

@ApplyOptions<ScheduledTask.Options>({
	pattern: '00 */2 * * *',
	customJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	}
})
export class WarStreakAnnouncer extends ScheduledTask {
	#winStreakMessages = [
		'What a powerhouse! #NAME is on fire with a #STREAK win streak. Keep the wins rolling in!',
		'Incredible teamwork pays off! #NAME is celebrating a #STREAK war win streak. GG!',
		'Talk about domination! #NAME secures a #STREAK win streak. Next stop: greatness!',
		"Victory dance time! #NAME just locked in a #STREAK streak. Let's go!"
	];

	#winStreakColors = [0xff4500, 0x32cd32, 0x1e90ff, 0xffd700];

	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) {
			return;
		}

		const data = await this.sql<WarStreakAnnouncerData[]>`SELECT clan_tag,
																	 channel_id,
																	 current_win_streak
																   FROM war_win_streak_announcement
																   WHERE enabled = true`;
		for (const x of data) {
			await this.announceWarStreak(x);
		}
	}

	private async announceWarStreak(data: WarStreakAnnouncerData) {
		const clan = await this.getClan(data.clanTag, data.channelId);
		if (!clan) {
			return;
		}

		// Don't want to send the message if the streak is 0 or the same as the last streak
		// Streak is incremental, can never be the same value again without going down first
		if (clan.warWinStreak === 0 || clan.warWinStreak === data.currentWinStreak) {
			return;
		}

		const streakMessage = this.#winStreakMessages[Math.floor(Math.random() * this.#winStreakMessages.length)]
			.replace('#NAME', clan.name)
			.replace('#STREAK', BlueNumberEmotes[clan.warWinStreak]);

		const streakEmabed = new EmbedBuilder()
			.setDescription(streakMessage)
			.setColor(this.#winStreakColors[Math.floor(Math.random() * this.#winStreakColors.length)]);

		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			this.client.rest.post(Routes.channelMessages(data.channelId), {
				body: { embeds: [streakEmabed.toJSON()] }
			})
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			if (
				[
					RESTJSONErrorCodes.MissingAccess,
					RESTJSONErrorCodes.MissingPermissions,
					RESTJSONErrorCodes.UnknownMessage
				].includes(error.status)
			) {
				await this.stopWarStreakAnnouncer(data.clanTag, data.channelId);
				this.logger.info(
					logInfo(
						'War Streak Announcer',
						`Stopping war streak announcement for ${data.clanTag} with reason ${error.message}`
					)
				);
				return;
			}

			this.logger.warn(
				logWarning(
					'War Streak Announcer',
					`Failed to announce war streak for ${data.clanTag} with reason ${error.message}`
				)
			);
		} else {
			await this.sql`UPDATE war_win_streak_announcement
						   SET current_win_streak = ${clan.warWinStreak}
						   WHERE clan_tag = ${data.clanTag} AND channel_id = ${data.channelId}`;
		}
	}

	/**
	 * Get clan information from the clan tag.
	 * Stops the clan embed if clan not found and logs it
	 *
	 * @param clanTag - Clan Tag to get information for
	 * @param channelId - Channel ID where the clan board is running
	 */
	private async getClan(clanTag: string, channelId: string) {
		const result = await Result.fromAsync<Clan, COCHttpError>(async () => this.coc.getClan(clanTag));

		if (result.isErr() && result.unwrapErr().status === 404) {
			await this.stopWarStreakAnnouncer(clanTag, channelId);
			this.logger.info(
				logInfo('ClanEmbed Syncer', `Stopping clan embed for ${clanTag} with reason Clan not found`)
			);
			return;
		}

		return result.unwrap();
	}

	private async stopWarStreakAnnouncer(clanTag: string, channelId: string) {
		await this.sql`UPDATE war_win_streak_announcement
					   SET enabled = false
					   WHERE clan_tag = ${clanTag} AND channel_id = ${channelId}`;
	}
}

type WarStreakAnnouncerData = {
	channelId: string;
	clanTag: string;
	currentWinStreak: number;
};
