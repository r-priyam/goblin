import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Result } from '@sapphire/result';
import type { Clan, HTTPError as COCHttpError } from 'clashofclans.js';
import { RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { bold, EmbedBuilder, Status } from 'discord.js';
import type { HTTPError } from 'discord.js';
import { Colors } from '#root/lib/util/constants';
import { logInfo, logWarning } from '#utils/functions/logging';

@ApplyOptions<ScheduledTask.Options>({
	pattern: '*/30 * * * *',
	customJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	}
})
export class ClanLevelUpAnnouncer extends ScheduledTask {
	#clanLevelUpMessages = [
		'Level up alert! #NAME has reached level #LEVEL. The sky’s the limit for this mighty clan!',
		'Congratulations to #NAME for leveling up to #LEVEL! A new chapter of greatness begins!',
		'#NAME hits level #LEVEL! Strength, teamwork, and determination shine through. Keep climbing!',
		'Cheers to #NAME on reaching level #LEVEL! Here’s to more victories and glory ahead!',
		'What a journey! #NAME has powered up to level #LEVEL. The clan legacy grows stronger!'
	];

	#clanLevelUpColors = [Colors.Amber, Colors.Blue, Colors.Green, Colors.Orange, Colors.Purple];

	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) {
			return;
		}

		const data = await this.sql<ClanLevelUpAnnouncerData[]>`SELECT clan_tag,
																	   channel_id,
																	   current_level
																FROM clan_level_up_announcement
																WHERE enabled = true`;

		if (!data) {
			return;
		}

		for (const x of data) {
			await this.announceClanLevelUp(x);
		}
	}

	private async announceClanLevelUp(data: ClanLevelUpAnnouncerData) {
		const clan = await this.getClan(data.clanTag, data.channelId);
		if (!clan) {
			return;
		}

		if (clan.level === data.currentLevel) {
			return;
		}

		const levelUpMessage = this.#clanLevelUpMessages[Math.floor(Math.random() * this.#clanLevelUpMessages.length)]
			.replace('#NAME', bold(clan.name))
			.replace('#LEVEL', bold(clan.level.toString()));

		const levelUpEmebed = new EmbedBuilder()
			.setColor(this.#clanLevelUpColors[Math.floor(Math.random() * this.#clanLevelUpColors.length)])
			.setDescription(levelUpMessage);

		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			this.client.rest.post(Routes.channelMessages(data.channelId), {
				body: { embeds: [levelUpEmebed.toJSON()] }
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
				await this.stopClanLevelUpAnnouncer(data.clanTag, data.channelId);
				this.logger.info(
					logInfo(
						'Clan Level Annournce',
						`Stopping clan level up announcement for ${data.clanTag} with reason ${error.message}`
					)
				);
				return;
			}

			this.logger.warn(
				logWarning(
					'Clan Level Announcer',
					`Failed to announce clan level up announcement for ${data.clanTag} with reason ${error.message}`
				)
			);
		} else {
			await this.sql`UPDATE clan_level_up_announcement
							   SET current_level = ${clan.level}
						   WHERE clan_tag = ${data.clanTag} AND channel_id = ${data.channelId}`;
		}
	}

	private async getClan(clanTag: string, channelId: string) {
		const result = await Result.fromAsync<Clan, COCHttpError>(async () => this.coc.getClan(clanTag));

		if (result.isErr() && result.unwrapErr().status === 404) {
			await this.stopClanLevelUpAnnouncer(clanTag, channelId);
			this.logger.info(
				logInfo(
					'Clan Level Announcer',
					`Stopping clan level up announcement for ${clanTag} with reason Clan not found`
				)
			);
			return;
		}

		return result.unwrap();
	}

	private async stopClanLevelUpAnnouncer(clanTag: string, channelId: string) {
		await this.sql`UPDATE clan_level_up_announcement
					   SET enabled = false
					   WHERE clan_tag = ${clanTag} AND channel_id = ${channelId}`;
	}
}

type ClanLevelUpAnnouncerData = {
	channelId: string;
	clanTag: string;
	currentLevel: number;
};
