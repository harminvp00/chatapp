/**
 * Prisma is ORM instance used to make operation on postgres database via ORM
 * ORM stand for the Object Relation Mapping
 */

import prisma from "../../config/prisma.js";

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
    },
  });
};

export const findByUsername = async (username, db = prisma) => {
  return await db.users.findFirst({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });
};

export const findAvatarByEmail = async (email, db = prisma) => {
  return await db.avatars.findFirst({
    where: {
      email,
    },
    select: {
      image_path: true,
    },
  });
};

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

export const createUser = async (payload, db = prisma) => {
  return await db.users.create({
    data: {
      ...payload,
    },
  });
};

export const createAvatar = async (payload, db = prisma) => {
  return await db.avatars.create({
    data: {
      image_path: `http://localhost:3000/auth/avatar/${payload.file_name}`,
      file_name: payload.file_name,
    },
  });
};

export const createSession = async (payload, db = prisma) => {
  return await db.sessions.create({
    data: {
      ...payload,
    },
  });
};

export async function checkPasswordExist(id, db = prisma) {
  const password = await db.users.findFirst({
    where: { id },
    select: { password_hash: true },
  });

  return password ? true : false;
}

/**
 *
 * @param payload contain database field such as user_id, provider_id, provider_name
 * @param db it is instance of prisma ORM to make operation database table like we doing operation on objects
 * @returns it is return object that contain oauth table row details which created by this operations
 */
export async function createOAuthAccount(payload, db = prisma) {
  return await db.oauth_accounts.create({
    data: {
      ...payload,
    },
  });
}

export async function createGoogleAvatar(payload, db = prisma) {
  return await db.avatars.create({
    data: {
      ...payload,
    },
  });
}

export async function findOauthUser(payload, db = prisma) {
  return await db.oauth_accounts.findFirst({
    where: {
      ...payload
    },
    select: {
      user_id: true,
      provider: true,
      provider_id: true,
    },
  });
}
