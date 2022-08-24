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

CREATE UNIQUE INDEX idx_user_clans ON public.clans (user_id, clan_tag);

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

CREATE UNIQUE INDEX idx_user_players ON public.players (user_id, player_tag);

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

CREATE UNIQUE INDEX idx_clan_aliases ON public.aliases (clan_tag, alias);

COMMENT ON COLUMN public.aliases.alias IS 'The alias of the clan';
COMMENT ON COLUMN public.aliases.clan_name IS 'The clan name of the clan for alias';
COMMENT ON COLUMN public.aliases.clan_tag IS 'The clan tag of the clan for alias';

CREATE TABLE public.clan_embeds
(
    id                SERIAL PRIMARY KEY,
    clan_name         VARCHAR(20) NOT NULL,
    clan_tag          TEXT        NOT NULL,
    leader_discord_id TEXT        NOT NULL,
    requirements      TEXT        NOT NULL,
    color             VARCHAR(10) NOT NULL,
    message_id        TEXT        NOT NULL,
	guild_id          TEXT        NOT NULL,
    channel_id        TEXT        NOT NULL,
    started_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_clan_embed ON public.clan_embeds (guild_id, clan_tag);

COMMENT ON COLUMN public.clan_embeds.id IS 'The unique identifier for each clan embed';
COMMENT ON COLUMN public.clan_embeds.clan_name IS 'The clan name of the clan for embed';
COMMENT ON COLUMN public.clan_embeds.clan_tag IS 'The clan tag of the clan for the embed';
COMMENT ON COLUMN public.clan_embeds.leader_discord_id IS 'The leader discord id to whom the clan belongs to';
COMMENT ON COLUMN public.clan_embeds.requirements IS 'The clan requirements';
COMMENT ON COLUMN public.clan_embeds.color IS 'The embed custom color';
COMMENT ON COLUMN public.clan_embeds.message_id IS 'The embed message id to update';
COMMENT ON COLUMN public.clan_embeds.guild_id IS 'The guild id in which the embed is running';
COMMENT ON COLUMN public.clan_embeds.channel_id IS 'The channel id in which the embed is running';
COMMENT ON COLUMN public.clan_embeds.started_at IS 'Timestamp when the embed was started at';
