import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import process from 'node:process';
import { URL } from 'node:url';
import { inspect } from 'node:util';
import { REST } from '@discordjs/rest';
import { container, Logger, Piece } from '@sapphire/framework';
import { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { createColors } from 'colorette';
import postgres, { Sql as SQL } from 'postgres';
import { createClient as redisClient, RedisClientType } from 'redis';
import { GoblinClashClient } from '#lib/coc';
import { GoblinClient } from '#lib/extensions/GoblinClient';
import { SrcDir } from '#utils/constants';
import { logSuccess, logWarning } from '#utils/functions/logging';

process.env.NODE_ENV ??= 'development';

setup(new URL('.env', SrcDir));
inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

container.redis = redisClient({ url: `redis://:@${envParseString('REDIS_HOST')}:${envParseInteger('REDIS_PORT')}` });
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

declare module '@sapphire/pieces' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Container {
		coc: GoblinClashClient;
		discordRest: REST;
		redis: RedisClientType;
		sql: SQL<any>;
	}
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Piece {
		client: GoblinClient;
		coc: GoblinClashClient;
		discordRest: REST;
		logger: Logger;
		redis: RedisClientType;
		sql: SQL<any>;
		tasks: ScheduledTaskHandler;
	}
}
