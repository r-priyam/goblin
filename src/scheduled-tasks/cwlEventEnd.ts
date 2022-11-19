import { bold, roleMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Result } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { Routes } from 'discord-api-types/v9';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import type { HTTPError } from 'discord.js';

import { ButtonCustomIds, Colors } from '#utils/constants';
import { useErrorLogsWebhook } from '#utils/webhooks/errorLogs';

@ApplyOptions<ScheduledTask.Options>({
	name: 'cwlEventEnd',
	bullJobsOptions: {
		removeOnComplete: true
	}
})
export class BotScheduledTask extends ScheduledTask {
	public override async run({
		channelId,
		messageId,
		eventName,
		eventId,
		endRolePing
	}: {
		channelId: string;
		endRolePing: string;
		eventId: string;
		eventName: string;
		messageId: string;
	}) {
		const embed = new MessageEmbed()
			.setTitle('Event Ended')
			.setDescription(
				`Registration ended for Event ${bold(
					`${eventName} (${eventId})`
				)}. To export the registration information please click on the ${bold(
					'Export'
				)} button in this message.`
			)
			.setColor(Colors.Indigo);
		const exportButton = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel('Export')
				.setStyle('SUCCESS')
				.setCustomId(`${ButtonCustomIds.CWLEventEndExport}_${eventId}`)
		);

		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			this.discordRest.patch(Routes.channelMessage(channelId, messageId), {
				body: {
					content: endRolePing ? roleMention(endRolePing) : null,
					embeds: [embed.toJSON()],
					components: [exportButton.toJSON()]
				}
			})
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			await useErrorLogsWebhook().send({
				embeds: [
					new MessageEmbed()
						.setTitle('Error')
						.setDescription(
							`Failed to update the Event End Message.\n${bold(
								`Event ID: ${eventId}\nError Code: ${error.code}`
							)}\nError Message: ${error.message}`
						)
						.setColor(Colors.Red)
				]
			});
		}

		await this.sql`UPDATE events
                       SET is_active = false
                       WHERE id = ${eventId}`;
	}
}
