
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