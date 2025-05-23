import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { envParseBoolean, envParseInteger, envParseString } from '@skyra/env-utilities';
import { GatewayIntentBits } from 'discord-api-types/v10';
import { ActivityType } from 'discord.js';
import postgres from 'postgres';
import { GoblinClashClient } from '#lib/coc';
import { GoblinRedisClient } from '#lib/redis-cache/RedisCacheClient';
import { loadFAQs } from '#utils/faq';
import { logSuccess } from '#utils/functions/logging';

export class GoblinClient extends SapphireClient {
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			logger: {
				level: envParseBoolean('DEBUG') ? LogLevel.Debug : LogLevel.Info
			},
			loadDefaultErrorListeners: envParseBoolean('DEBUG'),
			presence: {
				activities: [
					{
						name: 'Goblin stealing resources!',
						type: ActivityType.Playing
					}
				]
			},
			tasks: {
				bull: {
					connection: {
						host: envParseString('REDIS_HOST'),
						port: envParseInteger('REDIS_PORT'),
						db: envParseInteger('REDIS_TASK_DB')
					}
				}
			}
		});

		// Inject things in container
		container.coc = new GoblinClashClient();
		container.redis = new GoblinRedisClient();
		container.sql = postgres({
			transform: {
				column: { to: postgres.fromCamel, from: postgres.toCamel }
			},
			types: {
				date: {
					to: 1_184,
					from: [1_082, 1_083, 1_114, 1_184],
					serialize: (date: Date) => date.toISOString(),
					parse: (isoString: string) => isoString
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
		this.logger.info(logSuccess('COC', 'Logged In'));

		await loadFAQs();
		this.logger.info(logSuccess('FAQs', 'Loaded FAQs Cache'));

		return super.login();
	}

	public override async destroy() {
		await container.redis.quit();
	}
}
