export class Config extends null {
	public static get isDevelopment() {
		return process.env.DEVELOPMENT === 'true';
	}

	public static get isDebug() {
		return process.env.DEBUG === 'true';
	}

	public static get bot() {
		return {
			token: process.env.BOT_TOKEN,
			owners: ['292332992251297794', '554882868091027456'],
			testingGuilds: process.env.BOT_TESTING_GUILDS?.split(',') ?? undefined
		};
	}
}
