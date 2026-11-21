
import { success } from "zod";
import prisma from "../../config/prisma.js";
import {
    createConversation,
    fetchConversations,
    findConversation,
    findByUsername,
    listUsers,
} from "./chat.repo.js";


export const list_users = async (uid) => {

    const u_list = await prisma.$transaction(async (tx) => {
        return await listUsers([], tx);
    });

    return JSON.stringify(u_list, (_, v) => typeof v === 'bigint' ? v.toString() : v);
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