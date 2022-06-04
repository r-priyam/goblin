import 'reflect-metadata';
import '@sapphire/plugin-logger/register';

import { inspect } from 'node:util';

import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { ApplicationCommandRegistries, container, Logger, Piece, RegisterBehavior } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { Client } from 'clashofclans.js';
import { blueBright, createColors, cyan, greenBright, redBright, yellow } from 'colorette';
import postgres, { Sql } from 'postgres';
import { createClient as redisClient, RedisClientType } from 'redis';

import type { GoblinClient } from './extensions/GoblinClient';

import { Cache } from '#lib/coc';
import config from '#root/config';

inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

container.redis = redisClient({ url: `redis://:@${config.redis.host}:${config.redis.port}` });
container.redis.on('ready', () => container.logger.info(`${cyan('[REDIS]')} Successfully connected`));
container.redis.on('error', (error) => container.logger.error(error));
container.redis.on('reconnecting', () => container.logger.warn(`${yellow('[REDIS]')} Attempting reconnect`));

// @ts-expect-error Clear is missing from custom cache
container.coc = new Client({ restRequestTimeout: Time.Second * 30, cache: new Cache() });

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
	coc: { get: () => container.coc }
});

declare module '@sapphire/pieces' {
	interface Container {
		coc: Client;
		sql: Sql<any>;
		redis: RedisClientType;
	}
	interface Piece {
		client: GoblinClient;
		logger: Logger;
		coc: Client;
		sql: Sql<any>;
		redis: RedisClientType;
	}
}
