import { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		NODE_ENV: 'test' | 'development' | 'production';
		DEBUG: BooleanString;

		OWNERS: ArrayString;

		DISCORD_TOKEN: string;
		GITHUB_TOKEN: string;

		ERROR_LOGS_WEBHOOK: string;
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

		EYG_GUILD: string;
		EYG_FRESH_SPAWN_ROLE: string;
		EYG_GATEWAY_CHANNEL: string;
		EYG_INTERVIEW_CHANNEL_PARENT: string;
		EYG_RECRUIT_ROLE_ID: string;
		EYG_RECRUITER_ROLE: string;
		EYG_ADMINISTRATOR_ROLE: string;
		EYG_REPORTING_CHANNEL: string;
	}
}
