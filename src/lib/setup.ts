import 'reflect-metadata';
import '@sapphire/plugin-logger/register';

import { execSync } from 'node:child_process';
import process from 'node:process';
import { URL } from 'node:url';
import { inspect } from 'node:util';

import { container, Piece } from '@sapphire/framework';
import Sentry from '@sentry/node';
import { envParseString, setup } from '@skyra/env-utilities';
import { createColors } from 'colorette';

import { GoblinRedisClient } from '#lib/redis-cache/RedisCacheClient';
import { SrcDir } from '#utils/constants';
import { logSuccess, logWarning } from '#utils/functions/logging';

process.env.NODE_ENV ??= 'development';

setup(new URL('.env', SrcDir));
inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

container.redis = new GoblinRedisClient();
container.redis.on('ready', () => container.logger.info(logSuccess('REDIS', 'Connected')));
container.redis.on('error', (error) => container.logger.error(error));
container.redis.on('reconnecting', () => container.logger.warn(logWarning('REDIS', 'Reconnecting')));

if (envParseString('NODE_ENV') === 'production') {
	Sentry.init({
		dsn: envParseString('SENTRY'),
		serverName: 'goblin',
		environment: envParseString('NODE_ENV'),
		release: execSync('git rev-parse HEAD').toString().trim()
	});
}

// Make things easily accessible by this.<> instead of this.container.<>
Object.defineProperties(Piece.prototype, {
	client: { get: () => container.client },
	logger: { get: () => container.logger },
	sql: { get: () => container.sql },
	redis: { get: () => container.redis },
	coc: { get: () => container.coc },
	tasks: { get: () => container.tasks },
	discordRest: { get: () => container.discordRest }
});
