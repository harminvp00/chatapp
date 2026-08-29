import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { createUser, findByEmail, findByUsername } from "./auth.repo.js";
import { UserError } from "../../errors/auth.error.js";
import { registerEmail } from "../../config/nodemailer/auth.email.js";

// function to register the user in MONGO Database
export const registerUser = async (payload, clinetDetails) => {
  try {
    const { username, email, password } = payload;
    const { browser, os, device, network } = clinetDetails;

    console.log(browser, os, device, network);
    const user = await prisma.$transaction(async (tx) => {
      const userExist = await findByEmail(email, tx);

      if (userExist) {
        throw new UserError();
      }

      const uniqueUsername = await findByUsername(username, tx);

      if (uniqueUsername) {
        throw new UserError("Username is already taken");
      }

      const password_hash = await bcrypt.hash(password, 10);
      const user = await createUser({ username, email, password_hash }, tx);

      return user;
    });

    if (!user) {
      return {
        success: false,
        message: "User is not created successfully",
        user: null,
      };
    }

    await registerEmail(
      user.username,
      user.email,
      "New sign-in to your QuickChat account",
      {
       browser: browser.name,
       os: os.name,
       deviceVendor: device.vendor,
       deviceModel: device.model,
       network: network.ip
      }
    );

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
