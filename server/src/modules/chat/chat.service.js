
import prisma from "../../config/prisma.js";
import {
    _createConversation,
    fetchConversations,
    findConversation,
    findByUsername,
    fetchFriends,
} from "./chat.repo.js";


/**
 * find if the conversation already exists
 * if the conversation does not exist between users, then create new one
 * update clients
 */
export const createConversation = async (paylaod) => {
    // find for existing conversations
    const conversations = await findConversation();

    if (conversations) {
        // use this existing conversation
    }
    else[
        // create a new conversation here
    ]
} 

export const getFriends = async (uid) => {

    const transaction = await prisma.$transaction(async (tx)=>{
        const conversation = await fetchConversations(uid, tx)
        const conversation_ids = conversation.map(ele => { return ele.conversation_id });
        const friends = await fetchFriends(uid, conversation_ids, tx);
        return friends;
    });

    return JSON.stringify(transaction, (_, v) => typeof v === 'bigint' ? v.toString() : v);
}


export const searchForUsername = async (username) => {
    
    const results = await prisma.$transaction(async (tx) => {
        const usersList = await findByUsername(username, tx);
        return JSON.stringify(usersList, (_, val)=> typeof val === 'bigint' ? val.toString() : val);
    })

    if (!results) {
        return {
            success: false,
            message: "Trouble in fecthing user from the db."
        }
    }

    return {
        success: true,
        message: "fetched users successfully",
        results: JSON.parse(results)
    }

}