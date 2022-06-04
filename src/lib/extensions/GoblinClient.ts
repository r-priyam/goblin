import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { GatewayIntentBits } from 'discord-api-types/v9';
import { Options } from 'discord.js';

import config from '#root/config';

export class GoblinClient extends SapphireClient {
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions
			],
			logger: { level: config.debug ? LogLevel.Debug : LogLevel.Info },
			loadDefaultErrorListeners: config.debug,
			makeCache: Options.cacheWithLimits({
				MessageManager: {
					maxSize: 80
				},
				PresenceManager: 0,
				GuildMemberManager: {
					maxSize: 100,
					keepOverLimit: (user) => user.id === this.user!.id
				},
				UserManager: {
					maxSize: 100,
					keepOverLimit: (user) => user.id === this.user!.id
				}
			}),
			sweepers: {
				bans: {
					interval: 300,
					filter: () => null
				},
				emojis: {
					interval: 60,
					filter: () => null
				},
				invites: {
					interval: 120,
					filter: () => null
				},
				messages: {
					interval: 120,
					lifetime: 360
				},
				reactions: {
					interval: 5,
					filter: () => null
				},
				voiceStates: {
					interval: 60,
					filter: () => null
				},
				threads: {
					interval: 3600,
					lifetime: 14_400
				}
			},
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
