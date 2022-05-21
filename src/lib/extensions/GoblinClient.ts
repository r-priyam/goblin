import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord-api-types/v9';
import config from '#root/config';

export class GoblinClient extends SapphireClient {
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions
			],
			logger: { level: config.debug ? LogLevel.Debug : LogLevel.Info },
			loadDefaultErrorListeners: config.debug,
			presence: {
				activities: [
					{
						name: 'Goblin stealing resources!',
						type: 'PLAYING'
					}
				]
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
