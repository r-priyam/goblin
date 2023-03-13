import type { GoblinClashClient } from '#lib/coc';
import type { GoblinClient } from '#lib/extensions/GoblinClient';
import type { GoblinRedisClient } from '#lib/redis-cache/RedisCacheClient';
import type { Logger } from '@sapphire/framework';
import type { ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import type { Sql } from 'postgres';

declare module '@sapphire/pieces' {
	interface Container {
		coc: GoblinClashClient;
		redis: GoblinRedisClient;
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		sql: Sql<any>;
	}

	interface Piece {
		client: GoblinClient;
		coc: GoblinClashClient;
		discordRest: REST;
		logger: Logger;
		redis: GoblinRedisClient;
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
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
		cwlEventEnd: never;
		interviewWaitTimer: never;
		syncPlayerLinks: never;
	}
}
