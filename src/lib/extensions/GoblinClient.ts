import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord-api-types/v9';

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
}
