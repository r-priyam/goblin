/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`
        ALTER TABLE ONLY public.clan_embeds
            ALTER COLUMN requirements SET DEFAULT
                '{"15": 0, "14": 0, "13": 0, "12": 0, "11": 0}'::JSONB;
    `);
}
