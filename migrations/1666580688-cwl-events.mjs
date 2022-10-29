/**
 * @param {import('postgres').Sql} sql
 */
export async function up(sql) {
	await sql.unsafe(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

	// Function to generate unique ID's
	await sql.unsafe(`
    CREATE OR REPLACE FUNCTION unique_short_id()
    RETURNS TRIGGER AS
$$
DECLARE
    key   TEXT;
    qry   TEXT;
    found TEXT;
BEGIN
    qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';
    LOOP
        key := encode(gen_random_bytes(10), 'base64');
        key := replace(key, '/', '_');
        key := replace(key, '+', '-');
        EXECUTE qry || quote_literal(key) INTO found;
        IF found IS NULL THEN
            EXIT;
        END IF;
    END LOOP;
    NEW.id = key;
    RETURN NEW;
END;
$$ language 'plpgsql';
`);

	// Event types enum
	await sql.unsafe(`
        CREATE TYPE event_types
        AS ENUM ('custom', 'cwl');
    `);

	// Events table
	await sql.unsafe(`
        CREATE TABLE events
        (
            id                 TEXT PRIMARY KEY,
            name               TEXT        NOT NULL,
            type               event_types NOT NULL,
            guild_id           TEXT        NOT NULL,
            channel_id         TEXT        NOT NULL,
            message_id         TEXT        NOT NULL,
            start_role_ping_id TEXT,
            end_role_ping_id   TEXT,
            author_id          TEXT        NOT NULL,
            is_active          BOOLEAN                  DEFAULT TRUE,
            started_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ends_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW() + '7 DAYS':: INTERVAL
        );

        CREATE TRIGGER set_events_id
            BEFORE INSERT
            ON events
            FOR EACH ROW
        EXECUTE PROCEDURE unique_short_id();

        COMMENT ON TRIGGER set_events_id ON events IS 'Sets the id field for each event';
        COMMENT ON COLUMN events.id IS 'The event unique id';
        COMMENT ON COLUMN events.name IS 'The event name';
        COMMENT ON COLUMN events.type IS 'The type of event';
        COMMENT ON COLUMN events.guild_id IS 'The id of guild to which this event belongs to';
        COMMENT ON COLUMN events.channel_id IS 'The channel id where users can apply for event';
        COMMENT ON COLUMN events.message_id IS 'The message id that contains the registration board';
        COMMENT ON COLUMN events.start_role_ping_id IS 'The role id to ping when the event starts';
        COMMENT ON COLUMN events.end_role_ping_id IS 'The role id to ping when the event ends';
        COMMENT ON COLUMN events.author_id IS 'The id of the author that created this event';
        COMMENT ON COLUMN events.is_active IS 'The boolean value to indicate whether this event is active or not';
        COMMENT ON COLUMN events.started_at IS 'The time the event was created at';
        COMMENT ON COLUMN events.ends_at IS 'The time when the event will end';
    `);

	// Event whitelist
	await sql.unsafe(`
        CREATE TABLE events_whitelist
        (
            id      TEXT,
            user_id TEXT PRIMARY KEY
        );

        CREATE TRIGGER set_events_whitelist_id
            BEFORE INSERT
            ON events_whitelist
            FOR EACH ROW
        EXECUTE PROCEDURE unique_short_id();

        COMMENT ON TRIGGER set_events_whitelist_id ON events IS 'Sets the id field for each whitelisted user';
        COMMENT ON COLUMN events_whitelist.id IS 'The user unique whitelist id';
        COMMENT ON COLUMN events_whitelist.user_id IS 'The whitelisted user id';
    `);

	// CWL applications table
	await sql.unsafe(`
        CREATE TABLE cwl_applications
        (
            id               SERIAL PRIMARY KEY,
            event_id         TEXT NOT NULL
                CONSTRAINT cwl_applications_events_id_fk
                    REFERENCES events (id)
                    ON DELETE CASCADE,
            discord_id       TEXT NOT NULL,
            discord_name     TEXT NOT NULL,
            player_name      TEXT NOT NULL,
            player_tag       TEXT NOT NULL,
            town_hall        INTEGER                  DEFAULT 0,
            barbarian_king   INTEGER                  DEFAULT 0,
            archer_queen     INTEGER                  DEFAULT 0,
            grand_warden     INTEGER                  DEFAULT 0,
            royal_champion   INTEGER                  DEFAULT 0,
            serious          BOOLEAN                  DEFAULT FALSE,
            casual           BOOLEAN                  DEFAULT FALSE,
            opt_in_day_one   BOOLEAN                  DEFAULT TRUE,
            opt_in_day_two   BOOLEAN                  DEFAULT TRUE,
            opt_in_day_three BOOLEAN                  DEFAULT TRUE,
            opt_in_day_four  BOOLEAN                  DEFAULT TRUE,
            opt_in_day_five  BOOLEAN                  DEFAULT TRUE,
            opt_in_day_six   BOOLEAN                  DEFAULT TRUE,
            opt_in_day_seven BOOLEAN                  DEFAULT TRUE,
            registered_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE UNIQUE INDEX idx_user_applications ON cwl_applications (event_id, player_tag);

        COMMENT ON COLUMN cwl_applications.id IS 'The application unique id';
        COMMENT ON COLUMN cwl_applications.event_id IS 'The event id to which this application belongs to';
        COMMENT ON COLUMN cwl_applications.discord_id IS 'The applicant discord id';
        COMMENT ON COLUMN cwl_applications.discord_name IS 'The applicant discord user name';
        COMMENT ON COLUMN cwl_applications.player_name IS 'The applicant player name';
        COMMENT ON COLUMN cwl_applications.player_tag IS 'The applicant player tag';
        COMMENT ON COLUMN cwl_applications.town_hall IS 'The applicant player town hall level';
        COMMENT ON COLUMN cwl_applications.barbarian_king IS 'The applicant barbarian king level';
        COMMENT ON COLUMN cwl_applications.archer_queen IS 'The applicant archer queen level';
        COMMENT ON COLUMN cwl_applications.grand_warden IS 'The applicant grand warden level';
        COMMENT ON COLUMN cwl_applications.royal_champion IS 'The applicant royal champion level';
        COMMENT ON COLUMN cwl_applications.serious IS 'Whether user want to play serious cwl or not';
        COMMENT ON COLUMN cwl_applications.casual IS 'Whether user wants to play casual cwl or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_one IS 'Whether user is opted in day one or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_two IS 'Whether user is opted in day two or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_three IS 'Whether user is opted in day three or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_four IS 'Whether user is opted in day four or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_five IS 'Whether user is opted in day five or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_six IS 'Whether user is opted in day six or not';
        COMMENT ON COLUMN cwl_applications.opt_in_day_seven IS 'Whether user is opted in day seven or not';
        COMMENT ON COLUMN cwl_applications.registered_at IS 'The time when applicant registered for a player';
    `);

	// Helper function to get database export for a cwl event
	await sql.unsafe(`
    CREATE FUNCTION get_cwl_applications(BIGINT)
    RETURNS TABLE
            (
                "registrationId" INTEGER,
                "discordName"    TEXT,
                "discordId"      TEXT,
                "playerName"     TEXT,
                "playerTag"      TEXT,
                "townHall"       INTEGER,
                "barbarianKing"  INTEGER,
                "archerQueen"    INTEGER,
                "grandWarden"    INTEGER,
                "royalChampion"  INTEGER,
                "isSerious"      BOOLEAN,
                "isCasual"       BOOLEAN,
                "dayOne"         BOOLEAN,
                "dayTwo"         BOOLEAN,
                "dayThree"       BOOLEAN,
                "dayFour"        BOOLEAN,
                "dayFive"        BOOLEAN,
                "daySix"         BOOLEAN,
                "daySeven"       BOOLEAN,
                "registeredAt"   TIMESTAMP WITH TIME ZONE
            )
    LANGUAGE plpgsql
    STABLE
AS
$$
BEGIN
    RETURN QUERY
        SELECT id,
               discord_name,
               discord_id,
               player_name,
               player_tag,
               town_hall,
               barbarian_king,
               archer_queen,
               grand_warden,
               royal_champion,
               serious,
               casual,
               opt_in_day_one,
               opt_in_day_two,
               opt_in_day_three,
               opt_in_day_four,
               opt_in_day_five,
               opt_in_day_six,
               opt_in_day_seven,
               registered_at
        FROM cwl_applications
        WHERE event_id = $1
        ORDER BY town_hall DESC,
                 barbarian_king DESC,
                 archer_queen DESC,
                 grand_warden DESC,
                 royal_champion DESC,
                 serious DESC;
END;
$$;
    `);
}
