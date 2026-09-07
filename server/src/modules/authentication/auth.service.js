import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { createUser, findByEmail, findByUsername } from "./auth.repo.js";
import { UserError } from "../../errors/auth.error.js";
import { registerEmail } from "../../config/nodemailer/auth.email.js";

// function to register the user in Postgres through prisma
export const registerUser = async (payload) => {
  const { username, email, password } = payload;
  const hashed_password = await bcrypt.hash(password, 10);

  try {
    // database transsaction so on failure all operation will revert
    const user = await prisma.$transaction(async (tx) => {
      const userExist = await findByEmail(email, tx);

      if (userExist) {
        throw new UserError("user is already exist");
      }

      const uniqueUsername = await findByUsername(username, tx);

      if (uniqueUsername) {
        throw new UserError(`The username ${username} is not available`);
      }

      const _user = await createUser(
        { username, email, password_hash: hashed_password },
        tx,
      );

      return _user;
    });

    if (!user) {
      return {
        success: false,
        message: "User is not created successfully",
        user: null,
      };
    }

    try {
      await registerEmail(
        user.username,
        user.email,
        "New sign-in to your QuickChat account"
      );
    } catch (error) {
      console.log("failed to send an email to user", error);
    }

    const { password_hash, ...safe_user } = user;
    return {
      success: true,
      message: "User is created successfully",
      user: {
        ...safe_user,
        id: safe_user.id.toString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      user: null,
    };
  }
};
