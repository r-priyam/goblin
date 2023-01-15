import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import Sentry from '@sentry/node';
import { blue, blueBright, red, yellow } from 'colorette';
import { DiscordAPIError, HTTPError } from 'discord.js';

@ApplyOptions<Listener.Options>({
	name: 'ClientError',
	event: Events.Error
})
export class BotListener extends Listener<typeof Events.Error> {
	public override run(error: Error) {
		Sentry.captureException(error);
		if (error instanceof DiscordAPIError) {
			this.logger.warn(this.errorSummary(error, 'API ERROR'));
			this.logger.fatal(error.stack);
		} else if (error instanceof HTTPError) {
			this.logger.warn(this.errorSummary(error, 'HTTP ERROR'));
			this.logger.fatal(error.stack);
		} else {
			this.logger.error(error);
		}
	}

	private errorSummary(error: DiscordAPIError | HTTPError, prefix: string) {
		return `${red(`[${prefix}]`)} ${yellow(`[CODE: ${error.status}]`)} ${blueBright(error.message)}\n\t\t\t\t${blue(
			`[PATH: ${error.method} ${error.url}]`
		)}`;
	}
}
