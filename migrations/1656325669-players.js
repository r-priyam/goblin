export async function up(sql) {
    await sql.unsafe(`ALTER TABLE public.players
        ADD COLUMN link_api BOOLEAN DEFAULT FALSE;

    COMMENT ON COLUMN public.players.link_api IS 'Whether the tag is linked from link api database';
    `);
}
