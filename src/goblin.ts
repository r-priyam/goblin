import '#lib/setup';
import { exit } from 'node:process';

import * as Sentry from '@sentry/node';

import { GoblinClient } from '#lib/extensions/GoblinClient';
import { logSuccess } from '#utils/functions/logging';

const client = new GoblinClient();

try {
	await client.login();
	client.logger.info(logSuccess('CORE', 'Logged In'));
} catch (error) {
	Sentry.captureException(error);
	client.logger.error(error);
	await client.destroy();
	exit(1);
}
