import { WebhookClient } from 'discord.js';

import config from '#root/config';

let webhookInstance: WebhookClient = null!;

export function useGuildLogsWebhook() {
	webhookInstance ??= new WebhookClient({ url: config.webhooks.guildLogs });
	return webhookInstance;
}
