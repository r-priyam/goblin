/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`
		CREATE TABLE war_win_streak_announcement
		(
			id             SERIAL PRIMARY KEY,
			clan_tag       TEXT    NOT NULL,
			current_win_streak INTEGER NOT NULL         DEFAULT 0,
			guild_id       TEXT    NOT NULL,
			channel_id     TEXT    NOT NULL,
			enabled        BOOLEAN                  DEFAULT TRUE,
			started_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);
	`);
}
