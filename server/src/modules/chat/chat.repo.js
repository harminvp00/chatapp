
import { bigint } from "zod";
import prisma from "../../config/prisma.js";

/* 
    Chat Repository file abstract:
    1. Used Database relations into this files are Users, Conversations, Conversations_member, Messages
    2. Performed Operations: Create/Read/Update/Delete on All relations
    3. Filters: not implemented yet 
    4. Common Use Cases: List All Users, List User based on IDS or other filter
*/

// list all available user from the database
export async function listUsers(IDs, db = prisma) {
    return await db.users.findMany({
        where: {
            id: {
                in: IDs
            }
        },
        select: {
            id: true,
            profile: {
                select: {
                    username: true
                }
            }, avatars: {
                select: {
                    image_path: true
                }
            }
        }
    });
}