import { type ScheduledTaskHandler } from '@sapphire/plugin-scheduled-tasks';
import { type ClientOptions } from 'clashofclans.js';
import { type RedisClientType } from 'redis';

export interface GoblinClientOptions extends ClientOptions {
	linkApiUserName: string;
	linkApiPassword: string;
	redisClient: RedisClientType<any>;
	taskClient: ScheduledTaskHandler;
}
