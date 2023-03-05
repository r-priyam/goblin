import { envParseString } from '@skyra/env-utilities';
import { WebhookClient } from 'discord.js';

let webhookInstance: WebhookClient = null!;

export function useErrorLogsWebhook() {
	webhookInstance ??= new WebhookClient({
		url: envParseString('ERROR_LOGS_WEBHOOK')
	});
	return webhookInstance;
}
