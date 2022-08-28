import '@sapphire/plugin-logger/register';
import 'reflect-metadata';

import { inspect } from 'node:util';

import { REST } from '@discordjs/rest';
import { container, Logger, Piece } from '@sapphire/framework';
import { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { createColors, cyan, yellow } from 'colorette';
import postgres, { Sql as SQL } from 'postgres';
import { createClient as redisClient, RedisClientType } from 'redis';

import { GoblinClashClient } from '#lib/coc';
import { GoblinClient } from '#lib/extensions/GoblinClient';
import { SrcDir } from '#utils/constants';

process.env.NODE_ENV ??= 'development';

setup(new URL('.env', SrcDir));
inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

container.redis = redisClient({ url: `redis://:@${envParseString('REDIS_HOST')}:${envParseInteger('REDIS_PORT')}` });
container.redis.on('ready', () => container.logger.info(`${cyan('[REDIS]')} Successfully connected`));
container.redis.on('error', (error) => container.logger.error(error));
container.redis.on('reconnecting', () => container.logger.warn(`${yellow('[REDIS]')} Attempting reconnect`));

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
	interface Container {
		coc: GoblinClashClient;
		sql: SQL<any>;
		redis: RedisClientType;
		discordRest: REST;
	}
	interface Piece {
		client: GoblinClient;
		logger: Logger;
		coc: GoblinClashClient;
		sql: SQL<any>;
		redis: RedisClientType;
		tasks: ScheduledTaskHandler;
		discordRest: REST;
	}
}
