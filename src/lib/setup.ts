import 'reflect-metadata';
import '@sapphire/plugin-logger/register';

import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { ApplicationCommandRegistries, Logger, container, Piece, RegisterBehavior } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { Client } from 'clashofclans.js';
import { blueBright, createColors, cyan, greenBright, redBright, yellow } from 'colorette';
import dotenv from 'dotenv';
import postgres, { Sql } from 'postgres';
import type { GoblinClient } from './extensions/GoblinClient';
import { srcFolder } from '#utils/constants';

dotenv.config({ path: fileURLToPath(new URL('.env', srcFolder)) });

inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

container.coc = new Client({ restRequestTimeout: Time.Second * 30 });

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
	sql: { get: () => container.sql }
});

declare module '@sapphire/pieces' {
	interface Container {
		coc: Client;
		sql: Sql<any>;
	}
	interface Piece {
		client: GoblinClient;
		logger: Logger;
		coc: Client;
		sql: Sql<any>;
	}
}
