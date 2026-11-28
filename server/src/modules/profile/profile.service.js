

import prisma from '../../config/prisma.js';

export async function profileUpdateService(user_id, payload) {

    const updateData = await prisma.profile.update({
        where: {
            user_id
        }, data: {
            bio: payload.bio,
            birthday: payload.birthday,
            gender: payload.gender,
            phone: payload.phone
        }
    })

    if (!updateData) {
        return {
            success: false,
            message: "update operation failed"
        }
    }

    return {
        success: true,
        message: "update operation successfully done"
    }
}