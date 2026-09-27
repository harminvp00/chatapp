/**
 * Prisma is ORM instance used to make operation on postgres database via ORM
 * ORM stand for the Object Relation Mapping
 */

import prisma from "../../config/prisma.js";
import createRefreshToken from "../../utils/refresh_token.js";

/** User relation operations */

// Retrival Operations

/** Find the user By it Email address  */
export const findByEmail = async (email, db = prisma) => {
  return await db.users.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      password_hash: true,
    },
  });
};

/** Find the user by its Username this is used to ensure that the username is same username will not store again,
 * into register controller and authenticate google user service  */
export const findByUsername = async (username, db = prisma) => {
  return await db.users.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
    },
  });
};

/** find the user by its ID */
export const findById = async (id, db = prisma) => {
  return await db.users.findUnique({
    where: {
      id,
    },
    select: {
      username: true,
      email: true,
      role: true,
      avatar_id: true,
    },
  });
};

// this is helpful repository method to identify that the user contain password or not, it state that user has a password account or Google/Github Oauth account
export async function checkPasswordExist(id, db = prisma) {
  const password = await db.users.findFirst({
    where: { id },
    select: { password_hash: true },
  });

  return password ? true : false;
}

// Create Operations
/** create user by email, username, password and the avatar_id */
export const createUser = async (payload, db = prisma) => {
  return await db.users.create({
    data: {
      ...payload,
    },
  });
};

// Avatar Relation Operation

// find Avatar By avatar_id
export const findAvatarById = async (id, db = prisma) => {
  return await db.avatars.findUnique({
    where: {
      id,
    },
    select: {
      image_path: true,
    },
  });
};

// create an avatar row for the password users, who store file path as localhost link
export const createAvatar = async (payload, db = prisma) => {
  return await db.avatars.create({
    data: {
      image_path: `http://localhost:3000/auth/avatar/${payload.file_name}`,
      file_name: payload.file_name,
    },
  });
};

/** Session relation operations */

// find the unqies session based on the refresh token hash
export const findSession = async (refresh_token_hash, db = prisma) => {
  return await db.sessions.findUnique({
    where: {
      refresh_token_hash,
    },
  });
};

// create session using the user id, user agent, ip address, refresh token hash etc
export const createSession = async (payload, db = prisma) => {
  const { refreshToken, refresh_token_hash } = createRefreshToken();

  const session = await db.sessions.create({
    data: {
      ...payload,
      refresh_token_hash,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { session, refreshToken };
};

// Update the session's last used field using the
export const updateSessionLastUsed = async (id, db = prisma) => {
  return await db.sessions.update({
    where: { id },
    data: { last_used: new Date() },
  });
};

export const updateSessionRevoked = async (refresh_token_hash, db = prisma) => {
  return await db.sessions.update({
    where: { refresh_token_hash },
    data: { revoked_at: new Date() },
  });
};

export async function createOAuthAccount(payload, db = prisma) {
  return await db.oauth_accounts.create({
    data: {
      ...payload,
    },
  });
}

// Create Google Avatar
export async function createGoogleAvatar(payload, db = prisma) {
  return await db.avatars.create({
    data: {
      ...payload,
    },
  });
}

// the find oauth user by user_id
export async function findOauthUserByUserID(user_id, db = prisma) {
  return await db.oauth_accounts.findFirst({
    where: {
      user_id,
    },
    select: { user_id: true, provider: true, provider_id: true },
  });
}

export async function findOauthUser(payload, db = prisma) {
  return await db.oauth_accounts.findUnique({
    where: {
      provider_provider_id: {
        ...payload,
      },
    },
    select: {
      user_id: true,
      provider: true,
      provider_id: true,
    },
  });
}
