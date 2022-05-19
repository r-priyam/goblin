import '#lib/setup';

import { GoblinClient } from '#lib/extensions/GoblinClient';
import config from '#root/config';

const client = new GoblinClient();

try {
	await client.login(config.bot.token);
	client.logger.info('Successfully logged in.');
} catch (error) {
	client.logger.error(error);
	void client.destroy();
	process.exit(1);
}
