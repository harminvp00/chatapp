/**
 * Prisma is ORM instance used to make operation on postgres database via ORM
 * ORM stand for the Object Relation Mapping
 */
import prisma from "../../config/prisma.js";

/**
 *
 * @param payload contain database field such as user_id, provider_id, provider_name
 * @param db it is instance of prisma ORM to make operation database table like we doing operation on objects
 * @returns it is return object that contain oauth table row details which created by this operations
 */
export async function CreateOAuthAccount(payload, db = prisma) {
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
