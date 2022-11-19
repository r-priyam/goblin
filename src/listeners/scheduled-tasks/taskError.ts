import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Result } from '@sapphire/framework';
import { ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';
import Sentry from '@sentry/node';
import { DiscordAPIError, HTTPError, MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';
import { getCodeLine, getErrorLine, getPathLine } from '#utils/functions/errorHelper';
import { useErrorLogsWebhook } from '#utils/webhooks/errorLogs';

@ApplyOptions<Listener.Options>({
	name: 'ScheduledTaskError',
	event: ScheduledTaskEvents.ScheduledTaskError
})
export class BotListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskError> {
	public override async run(error: Error, task: string) {
		Sentry.captureException(error);
		this.logger.error(`[Scheduled-Task] Error occurred in task ${task}`, error);
		return this.errorToWebhook(error, task);
	}

	private async errorToWebhook(error: Error, task: string) {
		const lines = [`${bold('Task')}: ${task}`, getErrorLine(error)];

		if (error instanceof DiscordAPIError || error instanceof HTTPError) {
			lines.splice(2, 0, getPathLine(error), getCodeLine(error));
		}

		await Result.fromAsync(() =>
			useErrorLogsWebhook().send({
				embeds: [
					new MessageEmbed() //
						.setTitle('Scheduled-Task Error')
						.setDescription(lines.join('\n'))
						.setColor(Colors.Red)
				]
			})
		);
	}
}
