/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`
		CREATE TABLE clan_level_up_announcement
		(
			id            SERIAL PRIMARY KEY,
			clan_tag      TEXT    NOT NULL,
			guild_id      TEXT    NOT NULL,
			channel_id    TEXT    NOT NULL,
			current_level INTEGER NOT NULL         DEFAULT 0,
			enabled       BOOLEAN                  DEFAULT TRUE,
			started_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);

		CREATE UNIQUE INDEX idx_clan_level_up_announcement ON public.clan_level_up_announcement (clan_tag, guild_id);
	`);

	// Add missed index from the previous migration
	await sql.unsafe(`
		CREATE UNIQUE INDEX idx_war_win_streak_announcement ON public.war_win_streak_announcement (clan_tag, guild_id);
	`);
}
