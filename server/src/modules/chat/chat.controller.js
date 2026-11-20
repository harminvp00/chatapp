import { list_users } from "./chat.service.js"


// for list the user in database 
export const listUserController = async (req, res) => {
    try {  
        const users = await list_users(req.user.uid);
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
