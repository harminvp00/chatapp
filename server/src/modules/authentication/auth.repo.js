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
