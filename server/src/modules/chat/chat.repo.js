
import prisma from "../../config/prisma.js";

/* 
    chat.repo.js file's abstract (details):
    1. Used Database relations into this files are Users, Conversations, Conversations_member, Messages
    2. Performed Operations: Create/Read/Update/Delete on All relations
    3. Filters: not implemented yet 
    4. Common Use Cases: List All Users, List User based on IDS or other filter

    Note: repository function are start with _, and service function start without _, this is for making similarity within repository methods and service method relation
*/

// For create a new conversation 
export async function _createConversation(db = prisma) {
    return await db.conversations.create({
        data: {},
        select: { id: true }
    })
}

export async function addMemberToConversation(payload, db = prisma) {
    return await db.conversation_members.createMany({
        data: [
            { user_id: payload.member1, conversation_id: payload.conv_id },
            { user_id: payload.member2, conversation_id: payload.conv_id },
        ]
    });
}

// Get all conversation in a specific user is member and have access to it
export async function fetchConversations(user_id, db = prisma) {
    return await db.conversation_members.findMany({
        where: { user_id },
        select: { conversation_id: true }
    })
}

export async function fetchUserWithConversation(user_id, conversation_ids = [], db = prisma) {

    return await db.conversation_members.findMany({
        where: {
            user_id: {
                not: user_id,
            },
            conversation_id: {
                in: conversation_ids
            }
        },
        select: {
            user_id: true
        }
    })
}

// Get All Friend from the database
export async function fetchFriends(user_id, conversation_ids = [], db = prisma) {
    return await db.conversation_members.findMany({
        where: {
            user_id: {
                not: user_id,
            },
            conversation_id: {
                in: conversation_ids
            }
        }, select: {
            users: {
                select: {
                    id: true,
                    avatars: { select: { image_path: true } },
                    profile: { select: { username: true } },
                }
            }
        }
    })
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
