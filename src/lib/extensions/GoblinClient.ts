import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { GatewayIntentBits } from 'discord-api-types/v10';

import config from '#root/config';

export class GoblinClient extends SapphireClient {
	public constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
			logger: { level: config.debug ? LogLevel.Debug : LogLevel.Info },
			loadDefaultErrorListeners: config.debug,
			presence: {
				activities: [
					{
						name: 'Goblin stealing resources!',
						type: 'PLAYING'
					}
				]
			},
			tasks: {
				strategy: new ScheduledTaskRedisStrategy({
					bull: {
						redis: {
							host: config.redis.host,
							port: config.redis.port,
							db: config.redis.taskDb
						}
					}
				})
			}
		});
	}

	public override async login(token?: string) {
		await container.redis.connect();

		await container.coc.login({
			email: config.clash.email,
			password: config.clash.password,
			keyCount: 5,
			keyName: config.clash.keyName
		});
		this.logger.info('Successfully logged into clash api.');

		return super.login(token);
	}

	public override async destroy() {
		await container.redis.quit();
	}
}
