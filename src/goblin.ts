import '#lib/setup';

import { GoblinClient } from '#lib/extensions/GoblinClient';
import { logSuccess } from '#utils/functions/logging';

const client = new GoblinClient();

try {
	await client.login();
	client.logger.info(logSuccess('CORE', 'Logged In'));
} catch (error) {
	client.logger.error(error);
	void client.destroy();
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
}
