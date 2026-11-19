-- Up Migration
CREATE TABLE users (
    id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    google_sub  text UNIQUE,

    email     text,
    name      text,
    is_guest    boolean NOT NULL DEFAULT false,


    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,


    CONSTRAINT users_guest_consistency CHECK(
        (is_guest AND google_sub IS NULL AND expires_at IS NOT NULL)
        OR
        (NOT is_guest AND google_sub IS NOT NULL AND email IS NOT NULL AND expires_at IS NULL)
    )
);
-- Down Migration
DROP TABLE users;