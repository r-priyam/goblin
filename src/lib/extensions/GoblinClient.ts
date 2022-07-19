import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { envParseBoolean, envParseInteger, envParseString } from '@skyra/env-utilities';
import { GatewayIntentBits } from 'discord.js';

export class GoblinClient extends SapphireClient {
	public constructor() {
		super({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
			logger: { level: envParseBoolean('DEBUG') ? LogLevel.Debug : LogLevel.Info },
			loadDefaultErrorListeners: envParseBoolean('DEBUG'),
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
							host: envParseString('REDIS_HOST'),
							port: envParseInteger('REDIS_PORT'),
							db: envParseInteger('REDIS_TASK_DB')
						}
					}
				})
			}
		});
	}

	public override async login() {
		await container.redis.connect();

		await container.coc.login({
			email: envParseString('CLASH_EMAIL'),
			password: envParseString('CLASH_PASSWORD'),
			keyCount: envParseInteger('CLASH_KEY_COUNT'),
			keyName: envParseString('CLASH_KEY_NAME')
		});
		this.logger.info('Successfully logged into clash api.');

		return super.login();
	}

	public override async destroy() {
		await container.redis.quit();
	}
}
