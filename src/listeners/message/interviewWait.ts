import { bold, roleMention, time, TimestampStyles } from '@discordjs/builders';
import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { ChannelType } from 'discord.js';

import type { Message } from 'discord.js';

import { seconds } from '#utils/functions/time';

@ApplyOptions<Listener.Options>({
	name: 'InterviewWaitMessageCreate',
	event: Events.MessageCreate
})
export class BotListener extends Listener<typeof Events.MessageCreate> {
	#waitMessage = `We appreciate your interest in our family. We have multiple clan reps from all over the world.
Some are sleeping, some are at work, and some are just busy. Our process could take up to 8 hours to find a clan that matches your needs and a clan you can help.
During this time some reps may ask you extra interview questions to help narrow down your new home.
We thank you for your patience and can't wait to welcome you in!`.replaceAll('\n', ' ');

	public async run(message: Message) {
		if (
			message.author.bot ||
			message.channel.type !== ChannelType.GuildText ||
			!message.channel.parent ||
			message.channel.parentId !== envParseString('EYG_INTERVIEW_CHANNEL_PARENT') ||
			message.content !== '-wait'
		)
			return;

		if (!message.member?.roles.cache.has(envParseString('EYG_RECRUITER_ROLE'))) return;

		const timerMessage = await message.channel.send({
			content: `Hello ${roleMention(envParseString('EYG_RECRUIT_ROLE'))}! ${this.#waitMessage}\n\n${bold(
				'Ends at:'
			)} ${time(seconds.fromMilliseconds(Date.now() + Time.Hour * 8), TimestampStyles.RelativeTime)}`
		});

		return this.tasks.create(
			'interviewWaitTimer',
			{
				channelId: message.channelId,
				messageUrl: timerMessage.url,
				startedAt: Date.now()
			},
			Time.Hour * 8
		);
	}
}
