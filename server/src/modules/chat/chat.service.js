
import prisma from "../../config/prisma.js";
import { createNewConversation,  addConversationMember } from "./chat.repo.js";


export const create_conversation = async (payload) => {
    const { sender_id } = payload;


    const transaction = await prisma.$transaction(async (trsnx) => {
        const conversation = await createNewConversation(trsnx);

        const members = await addConversationMember({ conversation_id: conversation.id, user_id: sender_id }, trsnx);

        return members;
    });

    console.log("Done")

    if (transaction) {
        return {
            success: true,
            message: 'successfully created a conversation',
            data: transaction
        }
    }

    return {
        success: false,
        message: "failed to create a conversation",
        data: null
    }
}