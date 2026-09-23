import prisma from "../../config/prisma.js";
import {
  createAvatar,
  createSession,
  createUser,
  findByEmail,
  findByUsername,
  findOauthUser,
} from "./auth.repo.js";
import { registerEmail, loginEmail } from "../../utils/emails/auth.email.js";
import { comparePassword, hashPassword } from "../../config/bcrypt.js";
import { createToken } from "../../config/jwt.js";
import createRefreshToken from "../../utils/refresh_token.js";
import { UserError, PasswordError } from "../../errors/auth.error.js";
import { loginGoogleOauthUser } from "./oauth.js";
import { createUserSession } from "./auth.common.js";

// function to register the user in Postgres through prisma
export const registerUser = async (formdata, filedata, user_agent, ip_addr) => {
  // destructure input data
  const { username, email, password } = formdata;
  let file_name, file_destination;
  if (filedata) {
    const { filename, destination } = filedata;
    file_name = filename;
    file_destination = destination;
  }
  const hashed_password = await hashPassword(password);

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
      const user_data = await createUser(
        {
          avatar_id: avatarId,
          username,
          email,
          password_hash: hashed_password,
        },
        tx,
      );

      const { refreshToken, refreshTokenHash } = createRefreshToken();

      const session = await tx.sessions.create({
        data: {
          user_id: user_data.id,
          refresh_token_hash: refreshTokenHash,
          user_agent: user_agent,
          ip_address: ip_addr,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user_data,
        session,
        refreshToken,
      };
    });

    // check that is user created
    if (!user.user_data) {
      return {
        success: false,
        message: "User is not created",
        user: null,
      };
    }

    const accessToken = createToken({
      uid: user.user_data.id.toString(),
      sid: user.session.id.toString(),
    });

    // send acknowledgement to user through email
    try {
      await registerEmail(
        user.user_data.username,
        user.user_data.email,
        "New sign-in to your QuickChat account",
      );
    } catch (error) {
      console.log("failed to send an email to user", error);
    }

    const { id, avatar_id, password_hash, ...safe_user } = user.user_data;

    return {
      success: true,
      message: "User is created successfully",
      accessToken,
      refreshToken: user.refreshToken,
      user: {
        ...safe_user,
        avatar_id: avatar_id ? avatar_id.toString() : null,
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

/**
 * This loginUser service is used to make the user login into the website
 * @param {*} credentials contains email & password
 * @param {*} user_agent browser and os information of the user
 * @param {*} ip_addr ip address of the user
 * @returns returns tokens or errors to the controller
 */
export const loginUser = async (credentials, user_agent, ip_address) => {
  try {
    // destructuring the data from credentials such as email and passoword
    const { email, password } = credentials;

    /**
     * Database transaction will be start from here, it is task like
     * find user based on email
     * throw error if user not exists
     * verify password is matched or not
     * generate refreshtoken and its hash to create sessions
     * create access token outside the transactions
     * return the data to the controller for send back the response
     */
    let userData = null;
    const transaction = await prisma.$transaction(async (tx) => {
      // get a user where email match
      const _user = await findByEmail(email, tx);

      // throw error if the user not found
      if (!_user) {
        throw new UserError("no user exists with this mail");
      }

      let response = null;

      // throw error if the password is null,
      if (!_user.password_hash) {
        const oauth = await findOauthUser({ user_id: _user.id }, tx);

        if (oauth) {
          response = await loginGoogleOauthUser(
            _user.id,
            oauth.provider_id,
            tx,
          );
        }
      } else {
        // camapare founded user password and received password from the user
        const matchPassword = await comparePassword(
          password,
          _user.password_hash,
        );

        //  if password is incorrect throw PasswordError
        if (!matchPassword) {
          throw new PasswordError("Wrong Credentials");
        }

        // return useful information such as user, session and refresh token
        response = {
          uid: _user.id,
          WhatsDone: "PASSWORD_USER_IS_LOGIN",
        };
      }

      userData = _user;
      const { session, refreshToken } = await createUserSession(
        _user.id,
        user_agent,
        ip_address,
        tx,
      );

      return (response = {
        uid: _user.id,
        sid: session.id,
        WhatsDone: "PASSWORD_USER_LOGIN",
        refreshToken,
      });
    });

    if (!transaction.uid) {
      throw new UserError("User is not defined");
    }

    // create an access token using user id and session id
    const accessToken = createToken({
      uid: transaction.uid.toString(),
      sid: transaction.sid.toString(),
    });

    // send email to the user for login
    try {
      await loginEmail(
        userData.username,
        userData.email,
        "New Login to your QuickChat account",
      );
    } catch (error) {
      console.log("failed to send an email to user", error);
    }

    //

    return {
      success: true,
      message: "Login successfull",
      accessToken,
      refreshToken: transaction.refreshToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `${error.name}: ${error.message}`,
    };
  }
};
