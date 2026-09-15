
CREATE TYPE user_roles AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TYPE auth_providers AS ENUM (
    'EMAIL',
    'GOOGLE',
    'GITHUB'
);

CREATE TYPE message_types AS ENUM (
    'TEXT',
    'IMAGE',
    'VIDEO',
    'FILE'
);

CREATE TABLE avatars (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    image_path VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    avatar_id BIGINT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role user_roles NOT NULL DEFAULT 'USER',
    CONSTRAINT fk_users_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatars(id)
);

CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    last_used  TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT fk_user_session FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE oauth_accounts(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider auth_providers NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT fk_oauth_acc FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_oauth_provider UNIQUE(provider, provider_id)
);

CREATE TABLE user_keys(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    key_algorithm VARCHAR(100) NOT NULL,
    key_version INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT fk_user_keys FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE conversations(
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE conversation_members(
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_conversation_id FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_conversion_member FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_conversion_members UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages(
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    ciphertext TEXT NOT NULL,
    message_type message_types DEFAULT 'TEXT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT fk_message_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id),
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
);

CREATE INDEX idx_sessions_user_id
ON sessions(user_id);