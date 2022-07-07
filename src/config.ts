import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

import { srcFolder } from '#utils/constants';

dotenv.config({ path: fileURLToPath(new URL('.env', srcFolder)) });

const config = {
	development: process.env.DEVELOPMENT === 'true',
	debug: process.env.DEBUG === 'true',
	bot: {
		token: process.env.BOT_TOKEN,
		owners: ['292332992251297794', '554882868091027456']
	},
	webhooks: {
		guildLogs: process.env.GUILD_LOGS_WEBHOOKS!
	},
	github: process.env.GITHUB_TOKEN,
	clash: {
		email: process.env.CLASH_EMAIL!,
		password: process.env.CLASH_PASSWORD!,
		keyName: process.env.CLASH_KEY_NAME!,
		linkUserName: process.env.CLASH_LINK_USER_NAME!,
		linkPassword: process.env.CLASH_LINK_PASSWORD!
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
		cacheDb: Number(process.env.REDIS_CACHE_DB),
		taskDb: Number(process.env.REDIS_TASK_DB)
	}
};

export default config;
