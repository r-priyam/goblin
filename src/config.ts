const config = {
	development: process.env.DEVELOPMENT === 'true',
	debug: process.env.DEBUG === 'true',
	bot: {
		token: process.env.BOT_TOKEN,
		owners: ['292332992251297794', '554882868091027456']
	},
	github: process.env.GITHUB_TOKEN,
	clash: {
		email: process.env.CLASH_EMAIL!,
		password: process.env.CLASH_PASSWORD!,
		keyName: process.env.CLASH_KEY_NAME!
	}
};

export default config;
