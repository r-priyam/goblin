const config = {
	development: process.env.DEVELOPMENT === 'true',
	debug: process.env.DEBUG === 'true',
	bot: {
		token: process.env.BOT_TOKEN,
		owners: ['292332992251297794', '554882868091027456']
	}
};

export default config;
