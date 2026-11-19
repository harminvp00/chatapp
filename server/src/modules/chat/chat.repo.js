
import prisma from "../../config/prisma.js";

// repositories function for chat and conversation schema part 

// function to create a new conversation
export async function createNewConversation(db = prisma) {
    return await db.conversations.create({
        data: {}
    })
}

// function to add a conversation members
export async function addConversationMember(payload, db = prisma) {
    return await db.conversation_members.create({
        data: payload
    })
}

// list all available user from the database
export async function listUsers(id, db = prisma) {
    return await db.users.findMany({
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