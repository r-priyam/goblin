import { ClientOptions } from 'clashofclans.js';

export interface GoblinClientOptions extends ClientOptions {
	linkApiUserName: string;
	linkApiPassword: string;
	redisClient: string;
	postgresClient: string;
}
