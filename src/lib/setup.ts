import '@sapphire/plugin-logger/register';
import 'reflect-metadata';

import { inspect } from 'node:util';

import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { container, Logger, Piece } from '@sapphire/framework';
import { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { Time } from '@sapphire/time-utilities';
import { envParseInteger, envParseString, setup } from '@skyra/env-utilities';
import { blueBright, createColors, cyan, greenBright, redBright, yellow } from 'colorette';
import postgres, { Sql as SQL } from 'postgres';
import { createClient as redisClient, RedisClientType } from 'redis';

import { Cache, GoblinClashClient } from '#lib/coc';
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

// @ts-expect-error Clear is missing from custom cache
container.coc = new GoblinClashClient({ restRequestTimeout: Time.Second * 30, cache: new Cache() });

const sqlHighlighter = new SqlHighlighter();

container.sql = postgres({
	debug(connection, query, parameters, types) {
		container.logger.debug(
			`${blueBright('Connections:')} ${yellow(connection)} » ${greenBright('Query:')} ${sqlHighlighter.highlight(query)} » ${redBright(
				'Params:'
			)} ${yellow(String(parameters || 'NULL'))} » ${cyan('Types:')} ${yellow(String(types || 'NULL'))}`
		);
	},
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
	tasks: { get: () => container.tasks }
});

declare module '@sapphire/pieces' {
	interface Container {
		coc: GoblinClashClient;
		sql: SQL<any>;
		redis: RedisClientType;
	}
	interface Piece {
		client: GoblinClient;
		logger: Logger;
		coc: GoblinClashClient;
		sql: SQL<any>;
		redis: RedisClientType;
		tasks: ScheduledTaskHandler;
	}
}
