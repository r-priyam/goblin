CREATE EXTENSION pg_trgm;

SET TIME ZONE 'UTC';

CREATE TABLE public.clans
(
    id        SERIAL PRIMARY KEY,
    user_id   TEXT        NOT NULL,
    clan_name VARCHAR(20) NOT NULL,
    clan_tag  TEXT        NOT NULL,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_clans ON clans (user_id, clan_tag);

COMMENT ON COLUMN public.clans.id IS 'The unique identifier for the linked clan';
COMMENT ON COLUMN public.clans.user_id IS 'The user id of the user to whom clan is linked';
COMMENT ON COLUMN public.clans.clan_name IS 'The name of the clan';
COMMENT ON COLUMN public.clans.clan_tag IS 'The tag of the clan';
COMMENT ON COLUMN public.clans.linked_at IS 'The date and time when the clan was linked';

CREATE TABLE public.players
(
    id          SERIAL PRIMARY KEY,
    user_id     TEXT        NOT NULL,
    player_name VARCHAR(20) NOT NULL,
    player_tag  TEXT        NOT NULL,
    link_api    BOOLEAN                  DEFAULT FALSE,
    linked_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_players ON players (user_id, player_tag);

COMMENT ON COLUMN public.players.id IS 'The unique identifier for the linked player';
COMMENT ON COLUMN public.players.user_id IS 'The user id of the user to whom player is linked';
COMMENT ON COLUMN public.players.player_name IS 'The name of the player';
COMMENT ON COLUMN public.players.player_tag IS 'The tag of the player';
COMMENT ON COLUMN public.players.link_api IS 'Whether the tag is linked from link api database';
COMMENT ON COLUMN public.players.linked_at IS 'The date and time when the player was linked';

CREATE TABLE public.aliases
(
    alias     VARCHAR(5) PRIMARY KEY,
    clan_name VARCHAR(20) NOT NULL,
    clan_tag  TEXT        NOT NULL
);

CREATE UNIQUE INDEX idx_clan_aliases ON aliases (clan_tag, alias);

COMMENT ON COLUMN public.aliases.alias IS 'The alias of the clan';
COMMENT ON COLUMN public.aliases.clan_name IS 'The clan name of the clan for alias';
COMMENT ON COLUMN public.aliases.clan_tag IS 'The clan tag of the clan for alias';

