/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { bold, roleMention, time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { MessageActionRow, MessageButton, TextChannel } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	name: 'interviewWaitTimer',
	bullJobsOptions: {
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
		if (isNullish(channel)) return;

		return channel.send({
			content: `Hello ${roleMention(envParseString('EYG_RECRUITER_ROLE'))}, wait timer ended.\n${bold(
				'Started at:'
			)} ${time(new Date(startedAt), TimestampStyles.LongDateTime)}`,
			components: [
				new MessageActionRow().addComponents(
					new MessageButton() //
						.setLabel('Reference Message')
						.setURL(messageUrl)
						.setStyle('LINK')
				)
			]
		});
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		interviewWaitTimer: never;
	}
}
