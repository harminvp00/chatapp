
/*
 * Migration 1
*/

-- Change existing schema
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

-- new relation : to store user otp for email vefication, login, and forget password
CREATE TABLE users_otp (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    otp_encrypted VARCHAR(255),
    otp_purpose otp_purpose_enum DEFAULT(NULL),
    otp_expiry TIMESTAMPTZ DEFAULT NULL,

    CONSTRAINT fk_users_otp FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- new relation : to store info of the user as profile, (kind of personal details)
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

    -- constraints
    CONSTRAINT fk_unique_profile FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

