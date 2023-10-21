import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Result } from '@sapphire/result';
import { RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { Status } from 'discord.js';

import type { Clan, HTTPError as COCHttpError } from 'clashofclans.js';
import type { HTTPError } from 'discord.js';

import { BlueNumberEmotes, TownHallEmotes } from '#lib/coc';
import { logInfo, logWarning } from '#utils/functions/logging';

@ApplyOptions<ScheduledTask.Options>({
	pattern: '00 */2 * * *',
	bullJobsOptions: {
		removeOnComplete: true
	}
})
export class SyncClanEmbedTask extends ScheduledTask {
	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) {
			return;
		}

		const data = await this.sql<ClanEmbedSyncData[]>`SELECT clan_tag,
                                                                leader_discord_id,
                                                                requirements,
                                                                color,
                                                                message_id,
                                                                channel_id
                                                         FROM clan_embeds`;

		for (const value of data) {
			await this.updateEmbed(value);
		}
	}

	private async updateEmbed(data: ClanEmbedSyncData) {
		const clan = await this.getClan(data.clanTag, data.channelId);
		if (!clan) {
			return;
		}

		const embed = await this.coc.clanHelper.generateAutomationClanEmbed(clan, {
			leaderId: data.leaderDiscordId,
			requirements: this.parseRequirements(data.requirements),
			color: data.color
		});

		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			this.client.rest.patch(Routes.channelMessage(data.channelId, data.messageId), {
				body: { embeds: [embed.toJSON()] }
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
				await this.stopClanEmbed(data.clanTag, data.channelId);
				this.logger.info(
					logInfo('ClanEmbed Syncer', `Stopping clan embed for ${data.clanTag} with reason ${error.message}`)
				);
				return;
			}

			this.logger.warn(
				logWarning(
					'ClanEmbed Syncer',
					`Failed to update the clan embed board for ${data.clanTag} with reason ${error.message}`
				)
			);
		}
	}

	private parseRequirements(requirements: Record<string, number>) {
		let result = '';
		for (const [key, value] of Object.entries(requirements)) {
			if (value === 0) {
				continue;
			}

			result += `${TownHallEmotes[key]}: ${BlueNumberEmotes[value]} `;
		}

		return result.length > 0 ? result.trimEnd() : 'Please click on the button in this message to set requirements';
	}

	/**
	 * Get clan information from the clan tag.
	 * Stops the clan embed if clan not found and logs it
	 * @param clanTag - Clan Tag to get information for
	 * @param channelId - Channel ID where the clan board is running
	 */
	private async getClan(clanTag: string, channelId: string) {
		const result = await Result.fromAsync<Clan, COCHttpError>(() => this.coc.getClan(clanTag));

		if (result.isErr() && result.unwrapErr().status === 404) {
			await this.stopClanEmbed(clanTag, channelId);
			this.logger.info(
				logInfo('ClanEmbed Syncer', `Stopping clan embed for ${clanTag} with reason Clan not found`)
			);
			return;
		}

		return result.unwrap();
	}

	private async stopClanEmbed(clanTag: string, channelId: string) {
		await this.sql`DELETE
                       FROM clan_embeds
                       WHERE clan_tag = ${clanTag}
                         AND channel_id = ${channelId}`;
	}
}

interface ClanEmbedSyncData {
	channelId: string;
	clanTag: string;
	color: string;
	leaderDiscordId: string;
	messageId: string;
	requirements: Record<string, number>;
}
