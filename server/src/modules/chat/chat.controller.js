import { create_conversation } from "./chat.service.js"


export const createConversation = async (req, res) => {
    try {
        const response = await create_conversation(req.body);
        if (!response.success) {
            return res.status(400).json({
                success: false,
                message: "response was not success"
            });
        }
        return res.status(200).json({
            success: true,
            message: "conversation is created."
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}