import prisma from "../../config/prisma.js";
import {
  createAvatar,
  createUser,
  createSession,
  findByEmail,
  findByUsername,
  findOauthUserByUserID,
  checkPasswordExist,
} from "./auth.repo.js";
import { registerEmail, loginEmail } from "../../utils/emails/auth.email.js";
import { comparePassword, hashPassword } from "../../config/bcrypt.js";
import { createToken } from "../../config/jwt.js";
import { UserError, PasswordError } from "../../errors/auth.error.js";
import { loginGoogleOauthUser } from "./google.oauth.js";

/**
 * @param formdata contain information like username, email & passoword
 * @param filedata it is profile picture and exists if user uploaded his profile while fill create user form
 * @param user_agent meta data about user browser and os
 * @param ip_addr ip address of the user from he sending request, device address
 * @returns send tokens if user register successfully or else send the error
 */
export const registerUser = async (
  formdata,
  filedata,
  user_agent,
  ip_address,
) => {
  try {
    // destructure input data
    const { username, email, password } = formdata;

    // Create temparary variable to store file name and location later, if filedata exists
    let file_name = null,
      file_destination = null,
      user = null;

    // if file data exist store it details to the temparary variables file_name and file_destination
    if (filedata) {
      const { filename, destination } = filedata;
      file_name = filename;
      file_destination = destination;
    }

    // create hash password and keep it seperate from the database transaction
    const password_hash = await hashPassword(password);

    // database transsaction so on failure all operation will revert (rollback)
    const transaction = await prisma.$transaction(async (tx) => {
      const userExist = await findByEmail(email, tx);

      if (userExist) {
        const oauthUser = await findOauthUserByUserID(userExist.id, tx);

        if (oauthUser) {
          // if provider is GOOGLE
          if (oauthUser.provider === "GOOGLE") {
            return {
              success: false,
              code: "GOOGLE_OAUTH_EXIST",
              provider: oauthUser.provider,
              message: "This email is already linked with the Google account",
            };
          }

          // if provider is GITHUB
          if (oauthUser.provider === "GITHUB") {
            return {
              success: false,
              code: "GITHUB_OAUTH_EXIST",
              provider: oauthUser.provider,
              message: "This email is already linked with the Github account",
            };
          }
        }

        const passwordUser = await checkPasswordExist(userExist.id, tx);
        if (passwordUser) {
          throw new UserError("User is already Exists");
        }
      }

      const uniqueUsername = await findByUsername(username, tx);

      if (uniqueUsername) {
        throw new UserError(`The username ${username} is not available`);
      }

      // create a avatar
      let avatar_id = null;
      if (filedata) {
        const avatar = await createAvatar(
          {
            file_name,
            file_destination,
          },
          tx,
        );
        avatar_id = avatar.id;
      }

      // create new user into the database
      const newUser = await createUser(
        {
          avatar_id,
          username,
          email,
          password_hash,
        },
        tx,
      );

      user = newUser;

      /**
       * Create a session using user details and refresh token
       */
      const { session, refreshToken } = await createSession(
        {
          user_id: newUser.id,
          user_agent,
          ip_address,
        },
        tx,
      );

      return {
        uid: newUser.id,
        sid: session.id,
        refreshToken,
      };
    });

    if (transaction?.code) {
      return { ...transaction };
    }
    // check that is user exists, impossible case still here to prevent rare errror
    if (!transaction?.uid) {
      return {
        success: false,
        message: "User is not created",
        user: null,
      };
    }

    // JWT generation
    const accessToken = createToken(transaction.uid, transaction.sid);

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

    return {
      success: true,
      message: "User is created successfully",
      accessToken,
      refreshToken: transaction.refreshToken,
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
 * @param credentials contains email & password
 * @param user_agent browser and os information of the user
 * @param ip_addr ip address of the user
 * @returns tokens or errors to the controller
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
        const oauth = await findOauthUserByUserID(_user.id, tx);

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

      /**  Create a session using user details and refresh token
       */
      const { session, refreshToken } = await createSession(
        {
          user_id: _user.id,
          user_agent,
          ip_address,
        },
        tx,
      );

      /**
       * store _user detail into the userData variable,
       * later it used to send detail in email in this service
       */
      userData = _user;

      // prepare response and send forward
      return (response = {
        uid: _user.id,
        sid: session.id,
        WhatsDone: "PASSWORD_USER_LOGIN",
        refreshToken,
      });
    });

    // check for uid that tell us either user exists or not
    if (!transaction.uid) {
      throw new UserError("User is not defined");
    }

    // create an access token using user id and session id
    const accessToken = createToken(transaction.uid, transaction.sid);

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
