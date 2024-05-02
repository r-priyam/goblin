import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, roleMention, time, TimestampStyles } from 'discord.js';

import type { TextChannel } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	name: 'interviewWaitTimer',
	customJobOptions: {
		removeOnComplete: true
	}
})
export class BotScheduledTask extends ScheduledTask {
	public override async run({
		channelId,
		messageUrl,
		startedAt
	}: {
		channelId: string;
		messageUrl: string;
		startedAt: number;
	}) {
		const channel = (await this.client.channels.fetch(channelId)) as TextChannel;
		if (isNullish(channel)) {
			return;
		}

		return channel.send({
			content: `Hello ${roleMention(envParseString('EYG_RECRUITER_ROLE'))}, wait timer ended.\n${bold(
				'Started at:'
			)} ${time(new Date(startedAt), TimestampStyles.LongDateTime)}`,
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder() //
						.setLabel('Reference Message')
						.setURL(messageUrl)
						.setStyle(ButtonStyle.Link)
				)
			]
		});
	}
}
