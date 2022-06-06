export async function up(sql) {
	await sql.unsafe(`CREATE TABLE public.aliases
                      (
                          alias     VARCHAR(5) PRIMARY KEY,
                          clan_name VARCHAR(20) NOT NULL,
                          clan_tag  TEXT        NOT NULL
                      );
    CREATE UNIQUE INDEX idx_clan_aliases ON aliases (clan_tag, alias);

    COMMENT ON COLUMN public.aliases.alias IS 'The alias of the clan';
    COMMENT ON COLUMN public.aliases.clan_name IS 'The clan name of the clan for alias';
    COMMENT ON COLUMN public.aliases.clan_tag IS 'The clan tag of the clan for alias';
    `);
}
