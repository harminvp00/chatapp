
import { profileUpdateService } from "./profile.service.js"
export const profileUpdateController = async (req, res) => {

    try {
        // ===================================================
        // replace this condition with the zod condition soon
        // temporaray condition to make feature work without zod validation
        // ===================================================
        if (!(req.body.bio && req.body.birthday && req.body.gender && req.body.phone)) {
            return res.status(400).json({
                success: false,
                message: "invalid data received in contoller"
            })
        }

        // call service layer function 
        const results = await profileUpdateService(req.user.uid, req.body);

        if (!results.success) {
            return res.status(400).json(results);
        }

        return res.status(200).json(results);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.name
        })
    }
}