-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name)
VALUES
    ('USER'),
    ('ADMIN');

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

                       username VARCHAR(100) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       display_name VARCHAR(100),

                       role_id BIGINT NOT NULL,

                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       enabled BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE users
    ADD CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
            REFERENCES roles(id);

CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

                                user_id UUID NOT NULL,
                                token VARCHAR(512) NOT NULL UNIQUE,

                                expires_at TIMESTAMPTZ NOT NULL,

                                revoked BOOLEAN NOT NULL DEFAULT FALSE,

                                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_refresh_tokens_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE
);