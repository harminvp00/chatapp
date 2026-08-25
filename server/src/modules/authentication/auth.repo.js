
import prisma from "../../config/prisma.js";

export const findByEmail = async (email, db = prisma) => {
  return db.users.findFirst({
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

export const createUser = async (payload, db = prisma) => {
  return db.users.create({
    data: {
        ...payload
    }
  })
};
