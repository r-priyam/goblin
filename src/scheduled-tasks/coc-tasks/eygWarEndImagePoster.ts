import { fileURLToPath, URL } from 'node:url';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import type { Image, SKRSContext2D } from '@napi-rs/canvas';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Result } from '@sapphire/result';
import type { ClanWar, WarClan, HTTPError as COCHttpError } from 'clashofclans.js';
import { Routes, RESTJSONErrorCodes } from 'discord-api-types/v10';
import { Status } from 'discord.js';
import type { HTTPError } from 'discord.js';
import { fetch } from 'undici';
import { MetaDir } from '#utils/constants';
import { logInfo, logWarning } from '#utils/functions/logging';

@ApplyOptions<ScheduledTask.Options>({
	pattern: '*/2 * * * *',
	customJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	}
})
export class EYGWarEndImagePoster extends ScheduledTask {
	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) {
			return;
		}

		const data = await this.sql<WarImagePosterData[]>`
            SELECT DISTINCT ON (wip.clan_tag, wip.guild_id) wip.clan_tag,
                                                            wip.channel_id,
                                                            wip.win_enabled,
                                                            wip.lose_enabled,
                                                            wip.draw_enabled,
                                                            wpr.opponent_tag,
                                                            wpr.war_end_time
            FROM war_image_poster wip
                     LEFT JOIN war_poster_records wpr
                               ON wip.clan_tag = wpr.clan_tag
            ORDER BY wip.clan_tag, wip.guild_id, wpr.war_end_time DESC
        `;

		for (const value of data) {
			await this.postWarImage(value);
		}
	}

	public override onLoad() {
		GlobalFonts.registerFromPath(fileURLToPath(new URL('fonts/SuperCell.tff', MetaDir)), 'SuperCell');
	}

	private async postWarImage(data: WarImagePosterData) {
		const war = await this.getClanWar(data.clanTag, data.channelId);
		if (!war || war.state !== 'warEnded') {
			return;
		}

		if (war.status === 'win' && !data.winEnabled) {
			return;
		}

		if (war.status === 'lose' && !data.loseEnabled) {
			return;
		}

		if (war.status === 'tie' && !data.drawEnabled) {
			return;
		}

		if (
			data.opponentTag === war.opponent.tag &&
			data.warEndTime &&
			new Date(data.warEndTime).getTime() === war.endTime.getTime()
		) {
			// We have the same war here
			return;
		}

		let clanColor = '';
		let opponentColor = '';

		switch (war.status) {
			case 'lose':
				clanColor = '#e74c3c';
				opponentColor = '#2ecc71';
				break;
			case 'pending':
				clanColor = '#F4D03F';
				opponentColor = '#F4D03F';
				break;
			case 'tie':
				clanColor = '#E67E22 ';
				opponentColor = '#E67E22 ';
				break;
			case 'win':
				clanColor = '#2ecc71';
				opponentColor = '#e74c3c';
				break;
		}

		const image = await this.generateWarImage(war, clanColor, opponentColor);
		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			this.client.rest.post(Routes.channelMessages(data.channelId), {
				files: [{ data: image, name: `${war.clan.name}-result.png` }]
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
				await this.stopWarImage(data.clanTag, data.channelId);
				this.logger.info(
					logInfo('WarImagePoster', `Stopping war image for ${data.clanTag} with reason ${error.message}`)
				);
				return;
			}

			this.logger.warn(
				logWarning(
					'WarImagePoster',
					`Failed to send war end image for ${data.clanTag} with reason ${error.message}`
				)
			);
		} else {
			await this.sql`
                INSERT INTO war_poster_records (clan_tag, opponent_tag, war_end_time)
                VALUES (${war.clan.tag}, ${war.opponent.tag}, ${war.endTime})
            `;
		}
	}

	private async getClanWar(clanTag: string, channelId: string) {
		const result = await Result.fromAsync<ClanWar, COCHttpError>(async () => this.coc.getClanWar(clanTag));

		if (result.isErr() && [403, 404].includes(result.unwrapErr().status)) {
			await this.stopWarImage(clanTag, channelId);
			this.logger.info(
				logInfo('WarImagePoster', `Stopping for ${clanTag} with reason Clan not found or War log is Private`)
			);
			return;
		}

		return result.unwrap();
	}

	private async stopWarImage(clanTag: string, channelId: string) {
		await this.sql`
            DELETE
            FROM war_image_poster
            WHERE clan_tag = ${clanTag}
              AND channel_id = ${channelId}
        `;
	}

	private async generateWarImage(war: ClanWar, clanColor: string, opponentColor: string) {
		const canvas = createCanvas(2_496, 1_404);
		const context = canvas.getContext('2d');
		const background = await loadImage(new URL('images/WarResultBackground.jpg', MetaDir));

		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		await this.drawStar(context, war);
		await this.drawClanBadge(context, war.clan.badge.url, war.opponent.badge.url);
		this.drawText(context, war.clan, war.opponent, clanColor, opponentColor);

		return canvas.encode('png');
	}

	private async drawStar(context: SKRSContext2D, war: ClanWar) {
		// Left star is for the clan, right star is for the opponent
		let leftStar: Image;
		let rightStar: Image;

		switch (war.status) {
			case 'lose':
				leftStar = await loadImage(new URL('images/RedStar.png', MetaDir));
				rightStar = await loadImage(new URL('images/GreenStar.png', MetaDir));
				break;
			case 'win':
				leftStar = await loadImage(new URL('images/GreenStar.png', MetaDir));
				rightStar = await loadImage(new URL('images/RedStar.png', MetaDir));
				break;
			case 'tie':
			case 'pending':
				leftStar = await loadImage(new URL('images/Star.png', MetaDir));
				rightStar = await loadImage(new URL('images/Star.png', MetaDir));
				break;
		}

		context.drawImage(leftStar, 850, 750, 200, 200);
		context.drawImage(rightStar, 1_450, 750, 200, 200);
	}

	private async drawClanBadge(context: SKRSContext2D, clanBadgeUrl: string, opponentBadgeUrl: string) {
		const clanBadge = await (await fetch(clanBadgeUrl)).arrayBuffer();
		const opponentBadge = await (await fetch(opponentBadgeUrl)).arrayBuffer();

		context.drawImage(await loadImage(clanBadge), 100, 450, 400, 400);
		context.drawImage(await loadImage(opponentBadge), 1_990, 450, 400, 400);
	}

	private drawText(
		context: SKRSContext2D,
		clan: WarClan,
		opponentClan: WarClan,
		clanColor: string,
		opponentColor: string
	) {
		context.font = '100px SuperCell';
		context.fillStyle = '#E5E8E8 ';

		context.fillText(clan.stars.toString(), 600, 900);
		context.fillText(opponentClan.stars.toString(), 1_700, 900);

		context.font = '55px SuperCell';

		context.fillStyle = clanColor;
		context.fillText(clan.name, 600, 600);

		context.fillStyle = opponentColor;
		context.fillText(opponentClan.name, 1_450, 600);

		context.font = '40px SuperCell';

		context.fillStyle = clanColor;
		context.fillText(`Attacks - ${clan.attackCount}`, 500, 1_050);
		context.fillText(`Percentage - ${clan.destruction}%`, 500, 1_100);

		context.fillStyle = opponentColor;
		context.fillText(`Attacks - ${opponentClan.attackCount}`, 1_600, 1_050);
		context.fillText(`Percentage - ${opponentClan.destruction}`, 1_600, 1_100);
	}
}

type WarImagePosterData = {
	channelId: string;
	clanTag: string;
	drawEnabled: boolean;
	loseEnabled: boolean;
	opponentTag?: string;
	warEndTime?: string;
	winEnabled: boolean;
};
