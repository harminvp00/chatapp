import { _env } from "../../config/env.js";
import { createToken } from "../../config/jwt.js";
import prisma from "../../config/prisma.js";
import { api } from "../../config/axios.js";
import {
  createGoogleAvatar,
  createOAuthAccount,
  createSession,
  createUser,
  findByEmail,
  findOauthUserByUserID,
  findByUsername,
  checkPasswordExist,
} from "./auth.repo.js";
import { TokenError, UserError } from "../../errors/auth.error.js";

export async function handleGoogleAuth(code) {
  try {
    const tokenResponse = await api.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: _env.google_client_id,
        client_secret: _env.google_client_secret,
        redirect_uri: _env.google_callback_url,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!tokenResponse) {
      throw new TokenError();
    }

    return tokenResponse?.data?.access_token;
  } catch (error) {
    return {
      success: false,
      message: `${error.name}: ${error.message}`,
    };
  }
}

/**
 * This function is used to take google user from the google server by exchange to code we received via google client request
 */
export async function getGoogleUser(access_token) {
  const userResponseFromGoogle = await api.get(_env.google_user, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const googleUser = userResponseFromGoogle.data;

  if (!googleUser) {
    throw new UserError("Unable to get user info from GOOGLE");
  }

  return googleUser;
}

export async function authenticateGoogleUser(
  access_token,
  user_agent,
  ip_address,
) {
  try {
    /** fetch the google user from google server by providing the access code */
    const googleUser = await getGoogleUser(access_token);

    // THe Transaction is Begin from here
    const transaction = await prisma.$transaction(async (tx) => {
      /**
       * check user is exist or not
       */
      const userRow = await findByEmail(googleUser.email, tx);

      let response = null,
        avatar_id = null;

      /**
       * Case 1: User Exist when:
       * we will check that user has password or not, and based on that we redirect user to link or login!
       */
      if (userRow) {
        const PasswordExit = await checkPasswordExist(userRow.id, tx);

        /**
         * If password user is exist then we can link the password based account to the oauth acccount, and the user will able to login with one more ways, the google oauth will add.
         */
        if (PasswordExit) {
          console.log(1);
          response = await linkOauthGoogle(userRow.id, googleUser.id, tx);
        } else {
          console.log(2);
          /**
           * if the user dont have password and user exist that means the oauth account is created using this mail only, acccount is not password based, so we can directly give login to oauth account after verify the provider id and provider name, Note: user able to add password from profile after login
           */
          response = await loginGoogleOauthUser(userRow.id, googleUser.id, tx);
        }
      } else {
        console.log(3);
        /**
         * Case 2: User not exist when:
         * Now we confirm that this user is not exist in our system ever so we can simply follow below instruction to create this user in our system
         */
        const userNameExists = await findByUsername(googleUser.name, tx);

        // verify that the username is unique for our systems.
        if (userNameExists) {
          throw new UserError("Username is already exists");
        }

        /**
         * if picture is exist into the recived gogole user object that it will used as the avatar for our user
         */
        if (googleUser.picture) {
          const avatar = await createGoogleAvatar(
            {
              file_name: `google-${googleUser.id}`,
              image_path: `${googleUser.picture}`,
            },
            tx,
          );
          avatar_id = avatar.id;
        }

        /**
         * Create a new User
         */
        const newUser = await createUser(
          {
            avatar_id: avatar_id,
            email: googleUser.email,
            username: googleUser.name,
            password_hash: null,
            role: "USER",
          },
          tx,
        );

        // useful field id, email, name, picture
        const oauthUser = await createOAuthAccount(
          {
            user_id: newUser.id,
            provider_id: googleUser.id,
            provider: "GOOGLE",
          },
          tx,
        );

        /**
         * Store the newUser into the user variable,
         * All function used user variable to store thier return user
         * */
        response = { uid: newUser.id, WhatsDone: "Google is linked" };
      }

      if (response?.success) {
        return { ...response };
      }

      if (!response?.uid) {
        throw new UserError("User ID missing!");
      }

      const { session, refreshToken } = await createSession(
        {
          user_id: response.uid,
          user_agent,
          ip_address,
        },
        tx,
      );

      return (response = {
        uid: response.uid,
        sid: session.id,
        refreshToken,
        WhatsDone: response.WhatsDone,
      });
    });

    if (!transaction) {
      throw new Error("Server issue, Please try out later");
    }

    // End of the transactions
    const { uid, sid, refreshToken, WhatsDone } = transaction;

    // Creating JWT token for verifications
    const accessToken = createToken(uid, sid);

    return {
      success: true,
      message: WhatsDone,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function linkOauthGoogle(user_id, provider_id, tx) {
  try {
    /** finding the oauth user first to know that it already not exist because in that case we can do directly login */
    const oauthuser = await findOauthUserByUserID(
      {
        user_id: user_id,
        provider: "GOOGLE",
        provider_id,
      },
      tx,
    );

    if (oauthuser) {
      /**
       * In the case where a user have two login methods already, for example user already able to login with the PASSWORD + GOOGLE OAUTH, then in this case here Oauth account will exist already, so we can redirect the code towards the loginGoogleOauthUser, and send it response direct!
       */
      return await loginGoogleOauthUser(user_id, provider_id, tx);
    }

    const linked_oauth = await createOAuthAccount(
      {
        user_id,
        provider: "GOOGLE",
        provider_id,
      },
      tx,
    );

    return {
      uid: linked_oauth.user_id,
      WhatsDone: "PASSWORD_LINKED_GOOGLE_OAUTH",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function loginGoogleOauthUser(user_id, provider_id, tx) {
  try {
    const oauthuser = await findOauthUserByUserID(
      {
        user_id: user_id,
        provider: "GOOGLE",
        provider_id,
      },
      tx,
    );

    if (!oauthuser) {
      throw new UserError("Google Oauth account is NOT Linked");
    }
    if (oauthuser.provider !== "GOOGLE") {
      throw new UserError(
        "the user is not belong to Google Oauth, Try other account or login methods",
      );
    }

    /**
     * THIS UPDATE IS NOT DONE YET
     * PASSWORD verification method will be introduce soon, User will not able to link the account directly after that */

    return {
      uid: oauthuser.user_id,
      WhatsDone: "GOOGLE_OAUTH_LOGIN_DIRECTLY",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
