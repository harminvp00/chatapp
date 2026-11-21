
import { bigint } from "zod";
import prisma from "../../config/prisma.js";

/* 
    Chat Repository file abstract:
    1. Used Database relations into this files are Users, Conversations, Conversations_member, Messages
    2. Performed Operations: Create/Read/Update/Delete on All relations
    3. Filters: not implemented yet 
    4. Common Use Cases: List All Users, List User based on IDS or other filter
*/

// For create a new conversation 
export async function createConversation(db = prisma) {
    return await db.conversations.create({
        data: {},
        select: { id: true }
    })
}

// Get all conversation in a specific user is member and have access to it
export async function fetchConversations(user_id, db = prisma) {
    return await db.conversation_members.findMany({
        where: { user_id },
        select: { conversation_id: true }
    })
}

// For find existing conversation betweem two users
export async function findConversation(payload, db = prisma) {
    return await db.conversation_members.findMany({
        where: {
            user_id: { in: payload.IDs },
            conversation_id: { equals: payload.convId }
        },
        select: {
            conversation_id: true,
            user_id: true
        }
    });

}

// find many user record where the username is matched
export async function findByUsername(matchString, db = prisma) {
    return await db.profile.findMany({
        where: {
            username: {
                contains: matchString
            }
        },
        select: {
            username: true,
            users: {
                select: {
                    id: true,
                    avatars: { select: { image_path: true } }
                }
            },
        }
    })
}

// list all available user from the database
export async function listUsers(IDs, conversation_id, db = prisma) {
    return await db.conversation_members.findMany({
        where: {
            AND: [
                { user_id: { in: IDs } },
                { conversation_id }
            ]
        }, include: {
            users: {
                select: {
                    id: true,
                    email: true,
                    avatars: {
                        select: {
                            image_path: true
                        }
                    },
                    profile: {
                        select: {
                            username: true
                        }
                    }
                },
            }
        }
    })
}