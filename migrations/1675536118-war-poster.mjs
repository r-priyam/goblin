/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`
        CREATE TABLE war_image_poster
        (
            id           SERIAL PRIMARY KEY,
            clan_tag     TEXT NOT NULL,
            guild_id     TEXT NOT NULL,
            channel_id   TEXT NOT NULL,
            win_enabled  BOOLEAN                  DEFAULT TRUE,
            lose_enabled BOOLEAN                  DEFAULT TRUE,
            draw_enabled BOOLEAN                  DEFAULT TRUE,
            started_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        COMMENT ON COLUMN war_image_poster.id IS 'The image poster unique id';
        COMMENT ON COLUMN war_image_poster.clan_tag IS 'The clan tag for which image should be posted';
        COMMENT ON COLUMN war_image_poster.guild_id IS 'The guild id where the image poster is running';
        COMMENT ON COLUMN war_image_poster.channel_id IS 'The channel id where the image t';
        COMMENT ON COLUMN war_image_poster.win_enabled IS 'Boolean value to indicate if image to be posted for win war';
        COMMENT ON COLUMN war_image_poster.lose_enabled IS 'Boolean value to indicate if image to be posted for lose war';
        COMMENT ON COLUMN war_image_poster.draw_enabled IS 'Boolean value to indicate if image to be posted for draw war';
        COMMENT ON COLUMN war_image_poster.started_at IS 'The time when image posting record was created';

        CREATE UNIQUE INDEX idx_war_image_poster ON public.war_image_poster (clan_tag, guild_id);
    `);

	await sql.unsafe(`
        CREATE TABLE war_poster_records
        (
            id           SERIAL PRIMARY KEY,
            clan_tag     TEXT NOT NULL,
            opponent_tag TEXT NOT NULL,
            war_end_time TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
        );

        COMMENT ON COLUMN war_poster_records.id IS 'The war poster record unique id';
        COMMENT ON COLUMN war_poster_records.clan_tag IS 'The war record clan tag';
        COMMENT ON COLUMN war_poster_records.opponent_tag IS 'The war opponent clan tag';
        COMMENT ON COLUMN war_poster_records.war_end_time IS 'The time when war ended';
    `);
}
