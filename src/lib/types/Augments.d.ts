/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { REST } from '@discordjs/rest';
import type { Logger } from '@sapphire/framework';
import type { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import type { Sql } from 'postgres';
import type { RedisClientType } from 'redis';
import type { GoblinClashClient } from '#lib/coc';
import type { GoblinClient } from '#lib/extensions/GoblinClient';

declare module '@sapphire/pieces' {
	interface Container {
		coc: GoblinClashClient;
		discordRest: REST;
		redis: RedisClientType;
		sql: Sql<any>;
	}

	interface Piece {
		client: GoblinClient;
		coc: GoblinClashClient;
		discordRest: REST;
		logger: Logger;
		redis: RedisClientType;
		sql: Sql<any>;
		tasks: ScheduledTaskHandler;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
		StartRequiredPermissions: never;
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		interviewWaitTimer: never;
		syncPlayerLinks: never;
	}
}
