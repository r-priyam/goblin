import type { ArrayString, BooleanString, IntegerString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		CLASH_EMAIL: string;
		CLASH_KEY_COUNT: IntegerString;
		CLASH_KEY_NAME: string;
		CLASH_LINK_PASSWORD: string;
		CLASH_LINK_USER_NAME: string;
		CLASH_PASSWORD: string;
		DEBUG: BooleanString;

		DEVELOPMENT_GUILD: string;

		DISCORD_TOKEN: string;

		ERROR_LOGS_WEBHOOK: string;

		EYG_ADMINISTRATOR_ROLE: string;
		EYG_CLAN_REP_ROLE: string;
		EYG_FRESH_SPAWN_ROLE: string;
		EYG_GATEWAY_CHANNEL: string;
		EYG_GUILD: string;
		EYG_INTERVIEW_CHANNEL_PARENT: string;
		EYG_INTERVIEW_REPORTING_CHANNEL: string;
		EYG_RECRUITER_ROLE: string;
		EYG_RECRUIT_ROLE: string;

		GITHUB_TOKEN: string;

		GUILD_LOGS_WEBHOOK: string;

		NODE_ENV: 'development' | 'production' | 'test';
		OWNERS: ArrayString;

		PGDATABASE: string;
		PGHOST: string;
		PGPASSWORD: string;
		PGPORT: IntegerString;
		PGUSER: string;

		REDIS_CACHE_DB: IntegerString;
		REDIS_HOST: string;
		REDIS_PORT: IntegerString;
		REDIS_TASK_DB: IntegerString;
	}
}
