import { envParseString } from '@skyra/env-utilities';
import { WebhookClient } from 'discord.js';

let webhookInstance: WebhookClient = null!;

export function useGuildLogsWebhook() {
	webhookInstance ??= new WebhookClient({ url: envParseString('GUILD_LOGS_WEBHOOK') });
	return webhookInstance;
}
