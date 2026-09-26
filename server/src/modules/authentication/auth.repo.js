/**
 * Prisma is ORM instance used to make operation on postgres database via ORM
 * ORM stand for the Object Relation Mapping
 */

import prisma from "../../config/prisma.js";
import createRefreshToken from "../../utils/refresh_token.js";
// import {
//   MissingField,
//   OperationNotFound,
// } from "../../errors/database.error.js";

// export const findInUser = async (
//   whereField,
//   selectField,
//   db = prisma,
//   retrival_type = "findFirst",
// ) => {
//   if (!whereField)
//     throw new MissingField(
//       "you need to specify the 'where' argument, to search the records",
//     );
//   if (!selectField)
//     throw new MissingField(
//       "you need to specify the 'select' argument, to search the records",
//     );

//   switch (retrival_type) {
//     case "findFirst": {
//       return await db.users.findFirst({
//         where: whereField,
//         select: selectField,
//       });
//     }

//     case "findMany": {
//       return await db.users.findMany({
//         where: whereField,
//         select: selectField,
//       });
//     }

//     case "findUnique": {
//       return await db.users.findUnique({
//         where: whereField,
//         select: selectField,
//       });
//     }

//     default: {
//       throw new OperationNotFound(
//         `There no operation available into the 'findInUser()' method like ${retrival_type}`,
//       );
//     }
//   }
// };

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

/** Find the user by its Username< this is used to ensure that the username is same username will not store again,
 * into register controller and authenticate google user service  */
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

/** Find User By the it id, */
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

// this is just for password verifications
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
        ...payload
      },
    },
    select: {
      user_id: true,
      provider: true,
      provider_id: true,
    },
  });
}
