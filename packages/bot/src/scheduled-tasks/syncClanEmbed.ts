import { BlueNumberEmotes, HTTPError as COCHttpError, TownHallEmotes } from '@goblin/clashofclans';
import { ApplyOptions } from '@sapphire/decorators';
import { Result } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { Constants, HTTPError } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	cron: '0 */2 * * *'
})
export class SyncClanEmbedTask extends ScheduledTask {
	public override async run() {
		if (this.container.client.ws.status !== Constants.Status.READY) return;

		const data = await this.sql<ClanEmbedSyncData[]>`SELECT clan_tag,
                                                                leader_discord_id,
                                                                requirements,
                                                                color,
                                                                message_id,
                                                                channel_id
                                                         FROM clan_embeds`;

		for (const value of data) await this.updateEmbed(value);
	}

	private async updateEmbed(data: ClanEmbedSyncData) {
		const clan = await this.getClan(data.clanTag, data.channelId);
		if (!clan) return;

		const embed = await this.coc.clanHelper.generateAutomationClanEmbed(clan, {
			leaderId: data.leaderDiscordId,
			requirements: this.parseRequirements(data.requirements),
			color: data.color
		});

		const result = await Result.fromAsync(async () =>
			this.discordRest.patch(Routes.channelMessage(data.channelId, data.messageId), {
				body: { embeds: [embed.toJSON()] }
			})
		);

		result.unwrapOrElse(async (e) => {
			const error = e as HTTPError;
			if ([RESTJSONErrorCodes.MissingAccess, RESTJSONErrorCodes.MissingPermissions, RESTJSONErrorCodes.UnknownMessage].includes(error.code)) {
				await this.stopClanEmbed(data.clanTag, data.channelId);
				this.logger.info(`Stopping clan embed for ${data.clanTag} with reason ${error.message}`);
				return;
			}

			this.logger.warn(`Failed to update the clan embed board for ${data.clanTag} with reason ${error.message}`);
		});
	}

	private parseRequirements(requirements: Record<string, number>) {
		let result = '';
		for (const [key, value] of Object.entries(requirements)) {
			if (value === 0) continue;
			// TODO: change with other color number emote
			result += `${TownHallEmotes[key]}: ${BlueNumberEmotes[value]} `;
		}

		return result.length > 0 ? result.trimEnd() : 'Please click on the button in this message to set requirements';
	}

	private async getClan(clanTag: string, channelId: string) {
		const clan = await Result.fromAsync(() => this.coc.getClan(clanTag));
		return clan.unwrapOrElse((e) => {
			if ((e as COCHttpError).status === 404) return this.stopClanEmbed(clanTag, channelId);
			return null;
		});
	}

	private async stopClanEmbed(clanTag: string, channelId: string) {
		await this.sql`DELETE
                       FROM clan_embeds
                       WHERE clan_tag = ${clanTag}
                         AND channel_id = ${channelId}`;
	}
}

interface ClanEmbedSyncData {
	clanTag: string;
	leaderDiscordId: string;
	requirements: Record<string, number>;
	color: string;
	messageId: string;
	channelId: string;
}
