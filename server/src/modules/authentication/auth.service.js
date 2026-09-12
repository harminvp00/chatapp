
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import {
  createAvatar,
  createUser,
  findByEmail,
  findByUsername,
} from "./auth.repo.js";
import "dotenv/config";
import { UserError } from "../../errors/auth.error.js";
import { registerEmail } from "../../config/nodemailer/auth.email.js";

// function to register the user in Postgres through prisma
export const registerUser = async (formdata, filedata) => {
  // destructure input data
  const { username, email, password } = formdata;
  let file_name, file_destination;
  if (filedata) {
    const { filename, destination } = filedata;
    file_name = filename
    file_destination = destination
  }
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

      // create a avatar
      let avatarId = null;
      if (filedata) {
        const avatar = await createAvatar(
          {
            file_name,
            file_destination,
          },
          tx,
        );
        avatarId = avatar.id;
      }

      // create user
      const _user = await createUser(
        {
          avatar_id: avatarId,
          username,
          email,
          password_hash: hashed_password,
        },
        tx,
      );

      return _user;
    });

    // check that is user created
    if (!user) {
      return {
        success: false,
        message: "User is not created",
        user: null,
      };
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
    );

    // send acknowledgement to user through email
    try {
      await registerEmail(
        user.username,
        user.email,
        "New sign-in to your QuickChat account",
      );
    } catch (error) {
      console.log("failed to send an email to user", error);
    }

    const { password_hash, ...safe_user } = user;

    return {
      success: true,
      message: "User is created successfully",
      token,
      user: {
        ...safe_user,
        id: safe_user.id.toString(),
        avatar_id: null,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.name + ": " + error.message,
      user: null,
    };
  }
};
