import process from 'node:process';
import { URL } from 'node:url';

import { isNullishOrEmpty } from '@sapphire/utilities';
import { setup } from '@skyra/env-utilities';
import { greenBright, yellowBright } from 'colorette';
import ley from 'ley';

setup(new URL('../src/.env', import.meta.url));

process.env.PGHOST = 'localhost';

const result = await ley.up({ dir: 'migrations', driver: 'postgres' });

if (isNullishOrEmpty(result)) {
	process.stdout.write(yellowBright('No migrations to run'));
} else {
	process.stdout.write(greenBright(`Successfully ran migration for ${result}`));
}
