import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import process from 'node:process';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import { REST } from '@discordjs/rest';
import { container, Piece } from '@sapphire/framework';
import { envParseString, setup } from '@skyra/env-utilities';
import { createColors } from 'colorette';
import postgres from 'postgres';
import { GoblinClashClient } from '#lib/coc';
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

container.coc = new GoblinClashClient();
// TODO: remove in djs v14, it's exposed
container.discordRest = new REST({ version: '10' }).setToken(envParseString('DISCORD_TOKEN'));

container.sql = postgres({
	transform: {
		column: { to: postgres.fromCamel, from: postgres.toCamel }
	},
	types: {
		date: {
			to: 1184,
			from: [1082, 1083, 1114, 1184],
			serialize: (date: Date) => date.toISOString(),
			parse: (isoString) => isoString
		}
	}
});

Object.defineProperties(Piece.prototype, {
	client: { get: () => container.client },
	logger: { get: () => container.logger },
	sql: { get: () => container.sql },
	redis: { get: () => container.redis },
	coc: { get: () => container.coc },
	tasks: { get: () => container.tasks },
	discordRest: { get: () => container.discordRest }
});
