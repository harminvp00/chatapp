
import prisma from "../../config/prisma.js";

export const findByEmail = async (email, db = prisma) => {
  return await db.users.findFirst({
    where: {
      email,
    },
    select: {
      username: true,
      email: true,
      role: true,
    },
  });
};

export const findByUsername = async (username, db = prisma) => {
  return await db.users.findFirst({
    where: {
      username
    }, select: {
      username: true
    }
  })
}

export const createUser = async (payload, db = prisma) => {
  return await db.users.create({
    data: {
        ...payload
    }
  })
};
