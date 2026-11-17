
-- enums 
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

-- to store avatars 
CREATE TABLE avatars (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    image_path VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- to store user informations 
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

-- to store the session 
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

-- to store oauth user informations 
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

-- to store user public/private keys 
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

-- to store the conversation between the two users 
CREATE TABLE conversations(
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);

-- to store the included member into conversation either one, two or more 
CREATE TABLE conversation_members(
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_conversation_id FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_conversion_member FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_conversion_members UNIQUE(conversation_id, user_id)
);

-- this releation store actual message content and releted informations
CREATE TABLE messages(
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    ciphertext BYTEA NOT NULL,
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

CREATE INDEX idx_message_conversation_id 
ON message(conversation_id);

CREATE INDEX idx_message_sender_id 
ON message(sender_id);

CREATE INDEX idx_sessions_user_id
ON sessions(user_id);


-- in second change 
ALTER TABLE users DROP username;
ALTER TABLE users ADD email_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Add new enum for new relation users_otp
CREATE TYPE otp_purpose_enum AS ENUM (
    'EMAIL_VERIFY',
    'FORGET_PASSWORD',
    'LOGIN_ACCOUNT'
);

-- Add new enum for new relation profile
CREATE TYPE gender_enum AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);

-- to store user otp for email vefication, login, and forget password
CREATE TABLE users_otp (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    otp_encrypted VARCHAR(255),
    otp_purpose otp_purpose_enum DEFAULT(NULL),
    otp_expiry TIMESTAMPTZ DEFAULT NULL,
    CONSTRAINT fk_users_otp FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- to store info of the user as profile, (kind of personal details)
CREATE TABLE profile (
    bio TEXT,
    birthday TIMESTAMPTZ DEFAULT NULL, 
    id BIGSERIAL PRIMARY KEY,
    home_address VARCHAR(255),
    gender gender_enum,
    phone VARCHAR(50) UNIQUE,  
    prefer_language VARCHAR(100),
    user_id BIGINT UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT fk_unique_profile FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);