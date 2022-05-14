import { SapphireClient, container } from '@sapphire/framework';
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
			logger: {},
			loadDefaultErrorListeners: false,
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
		await container.coc.login({
			email: config.clash.email,
			password: config.clash.password,
			keyCount: 5,
			keyName: config.clash.keyName
		});
		this.logger.info('Successfully logged into clash api.');

		return super.login(token);
	}
}
