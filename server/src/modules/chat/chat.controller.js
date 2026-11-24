
import { success } from "zod";
import { createConversation, getFriends, searchForUsername } from "./chat.service.js"


// for list the user in database 
export const getFriendsController = async (req, res) => {
    try {
        const users = await getFriends(req.user.uid);
        if (!users) {
            throw new Error("Unable to list the users from database.")
        }
        return res.status(200).json({
            success: true,
            message: "user are listed successfully",
            users: JSON.parse(users)
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}


// to search user based on username from the database
export const searchUsersController = async (req, res) => {
    try { 

        const response = await searchForUsername(req.params.username);
        if (!response.success) {
            return res.status(400).json({
                success: false,
                message: "Issue came from service function."
            })
        }

        if (!response?.results) {
            return res.status(400).json({
                success: false,
                message: "user list is not available"
            })
        }


        return res.status(200).json(response);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
     }
}


export const createConversationController = async (req, res) => {
    
    try {
        if (!req.body.member1 || !req.body.member2) {
            return res.status(404).json({
                success: false,
                message: "One of the two field is missing, [senderID, receiverID]"
            })
        }

        const response = await createConversation(req.body);

        if (!response.success) {
            return res.status(400).json(response);
        }   

        return res.status(201).json(response);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}