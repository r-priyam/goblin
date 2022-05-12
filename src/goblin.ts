import '#lib/setup';

import { green } from 'colorette';
import { GoblinClient } from '#lib/extensions/GoblinClient';

const client = new GoblinClient();

try {
	await client.login(process.env.BOT_TOKEN);
	client.logger.info(`${green('WS     ')} - Successfully logged in.`);
} catch (error) {
	client.logger.error(error);
	client.destroy();
	process.exit(1);
}
