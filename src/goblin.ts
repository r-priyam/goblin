import '#lib/setup';

import { green } from 'colorette';
import { GoblinClient } from '#lib/extensions/GoblinClient';
import config from '#root/config';

const client = new GoblinClient();

try {
	await client.login(config.bot.token);
	client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
	client.logger.error(error);
	client.destroy();
	process.exit(1);
}
