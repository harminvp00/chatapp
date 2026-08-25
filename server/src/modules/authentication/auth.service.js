import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { createUser, findByEmail } from "./auth.repo.js";
import { UserNotFound } from "../../errors/auth.error.js";
import { registerEmail } from "../../config/nodemailer/auth.email.js";

// function to register the user in MONGO Database
export const registerUser = async (payload) => {
  const { username, email, password } = payload;

  const user = await prisma.$transaction(async (tx) => {
    const userExist = await findByEmail(email, tx);

    if (userExist) {
      throw new UserNotFound();
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
    "New Acount is created on <b>InstantChat</b> using this email",
  );

  const { password_hash, ...safe_user } = user;
  return {
    success: true,
    message: "User is created successfully",
    user: {
      ...safe_user,
      id: safe_user.id.toString()
    },
  };
};
