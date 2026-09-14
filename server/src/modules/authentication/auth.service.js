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
import { PasswordError, UserError } from "../../errors/auth.error.js";
import {
  registerEmail,
  loginEmail,
} from "../../config/nodemailer/auth.email.js";

// function to register the user in Postgres through prisma
export const registerUser = async (formdata, filedata) => {
  // destructure input data
  const { username, email, password } = formdata;
  let file_name, file_destination;
  if (filedata) {
    const { filename, destination } = filedata;
    file_name = filename;
    file_destination = destination;
  }
  const hashed_password = await bcrypt.hash(password, 10);

  try {
    // database transsaction so on failure all operation will revert (rollback)
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

// Login User Service Start from Here
export const loginUser = async (credentials, user_agent, ip_addr) => {
  try {
    const { email, password } = credentials;

    const db_response = await prisma.$transaction(async (tx) => {
      const _user = await tx.users.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          password_hash: true,
        },
      });

      if (!_user) {
        throw new UserError("no user exists with this mail");
      }

      const matchPassword = await bcrypt.compare(password, _user.password_hash);

      if (!matchPassword) {
        throw new PasswordError();
      }

      const refreshToken = crypto.randomBytes(64).toString("hex");

      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const session = await tx.sessions.create({
        data: {
          user_id: _user.id,
          refresh_token_hash: refreshTokenHash,
          user_agent: user_agent,
          ip_address: ip_addr,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        _user,
        session,
        refreshToken,
      };
    });

    if (!db_response._user) {
      return {
        success: false,
        message: "Login Unsuccessful",
      };
    }

    const accessToken = jwt.sign(
      {
        uid: db_response._user.id,
        sid: db_response.session.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    // send acknowledgement to user through email
    try {
      await loginEmail(
        db_response._user.username,
        db_response._user.email,
        "New Login to your QuickChat account",
      );
    } catch (error) {
      console.log("failed to send an email to user", error);
    }

    return {
      success: true,
      message: "Login successfull",
      user: db_response._user,
      accessToken,
      refreshToken: db_response.refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `${error.name}: ${error.message}`,
    };
  }
};
