import { REST } from '@discordjs/rest';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { envParseBoolean, envParseInteger, envParseString } from '@skyra/env-utilities';
import { GatewayIntentBits } from 'discord-api-types/v10';
import postgres from 'postgres';

import { GoblinClashClient } from '#lib/coc';
import { GoblinRedisClient } from '#lib/redis-cache/RedisCacheClient';
import { logSuccess } from '#utils/functions/logging';

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
						connection: {
							host: envParseString('REDIS_HOST'),
							port: envParseInteger('REDIS_PORT'),
							db: envParseInteger('REDIS_TASK_DB')
						}
					}
				})
			}
		});

		// Inject things in container
		container.coc = new GoblinClashClient();
		container.discordRest = new REST({ version: '10' }).setToken(envParseString('DISCORD_TOKEN'));
		container.redis = new GoblinRedisClient();
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
	}

	public override async login() {
		await container.coc.login({
			email: envParseString('CLASH_EMAIL'),
			password: envParseString('CLASH_PASSWORD'),
			keyCount: envParseInteger('CLASH_KEY_COUNT'),
			keyName: envParseString('CLASH_KEY_NAME')
		});
		this.logger.info(logSuccess('COC', 'Logged In!'));

		return super.login();
	}

	public override async destroy() {
		await container.redis.quit();
	}
}
