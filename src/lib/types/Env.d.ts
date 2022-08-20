import { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		NODE_ENV: 'test' | 'development' | 'production';
		DEBUG: BooleanString;

		OWNERS: ArrayString;

		DISCORD_TOKEN: string;
		GITHUB_TOKEN: string;

		GUILD_LOGS_WEBHOOK: string;

		CLASH_EMAIL: string;
		CLASH_PASSWORD: string;
		CLASH_KEY_COUNT: IntegerString;
		CLASH_KEY_NAME: string;
		CLASH_LINK_USER_NAME: string;
		CLASH_LINK_PASSWORD: string;

		PGHOST: string;
		PGPORT: IntegerString;
		PGDATABASE: string;
		PGUSER: string;
		PGPASSWORD: string;

		REDIS_HOST: string;
		REDIS_PORT: IntegerString;
		REDIS_CACHE_DB: IntegerString;
		REDIS_TASK_DB: IntegerString;
	}
}
