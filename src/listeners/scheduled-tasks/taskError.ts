import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ScheduledTaskEvents, type ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import * as Sentry from '@sentry/node';
import { bold, DiscordAPIError, HTTPError, EmbedBuilder } from 'discord.js';
import { Colors } from '#utils/constants';
import { getCodeLine, getErrorLine, getPathLine } from '#utils/functions/errorHelper';
import { useErrorLogsWebhook } from '#utils/webhooks/errorLogs';

@ApplyOptions<Listener.Options>({
	name: 'ScheduledTaskError',
	event: ScheduledTaskEvents.ScheduledTaskError
})
export class BotListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskError> {
	public override async run(error: Error, task: ScheduledTask) {
		Sentry.captureException(error);
		this.logger.error(`[Scheduled-Task] Error occurred in task ${task.name}`, error);
		return this.errorToWebhook(error, task);
	}

	private async errorToWebhook(error: Error, task: ScheduledTask) {
		const lines = [`${bold('Task')}: ${task.name}`, getErrorLine(error)];

		if (error instanceof DiscordAPIError || error instanceof HTTPError) {
			lines.splice(2, 0, getPathLine(error), getCodeLine(error));
		}

		await useErrorLogsWebhook().send({
			embeds: [
				new EmbedBuilder() //
					.setTitle('Scheduled-Task Error')
					.setDescription(lines.join('\n'))
					.setColor(Colors.Red)
			]
		});
	}
}
