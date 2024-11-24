/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`
		CREATE TABLE .
		(
			id           SERIAL PRIMARY KEY,
			clan_tag	 TEXT NOT NULL,
			guild_id     TEXT NOT NULL,
			channel_id   TEXT NOT NULL,
			enabled      BOOLEAN                  DEFAULT TRUE,
			started_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);
	`);
}
