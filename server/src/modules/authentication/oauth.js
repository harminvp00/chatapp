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
  findOauthUser,
  findByUsername,
  checkPasswordExist,
} from "./auth.repo.js";
import { TokenError, UserError } from "../../errors/auth.error.js";
import createRefreshToken from "../../utils/refresh_token.js";
import { success } from "zod";

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

export async function authenticateGoogleUser(
  access_token,
  user_agent,
  ip_address,
) {
  try {
    const UserResponse = await api.get(_env.google_user, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const googleUser = await UserResponse.data;
    if (!googleUser) {
      throw new UserError("unable to find the google user account");
    }

    const user = await prisma.$transaction(async (tx) => {
      /**
       * check user is exist or not
       */
      const userRow = await findByEmail(googleUser.email, tx);

      let response = null;
      let avatar_id = null;

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
          response = await linkOauthGoogle(userRow, googleUser, tx);
        } else {
          /**
           * if the user dont have password and user exist that means the oauth account is created using this mail only, acccount is not password based, so we can directly give login to oauth account after verify the provider id and provider name, Note: user able to add password from profile after login
           */
          response = await loginOauthUser(userRow, googleUser, tx);
        }
      } else {
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
      }

      const { refreshToken, refreshTokenHash } = createRefreshToken();

      const session = await createSession(
        {
          user_id: newUser.id,
          user_agent,
          ip_address,
          refresh_token_hash: refreshTokenHash,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

      return {
        newUser,
        session,
        refreshToken,
      };
    });

    if (!user) {
      throw new UserError("error during saving user");
    }

   

    const { newUser, session, refreshToken } = user;

    const accessToken = createToken({
      uid: `${newUser.id}`,
      sid: `${session.id}`,
    });

    return {
      success: true,
      message: "user is created",
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (err) {
    if (err instanceof UserError) {
      return {
        success: false,
        message: "User is already exists",
      };
    }
    return {
      success: false,
      message: err.message,
    };
  }
}

export async function loginOauthUser(user, googleUser, tx) {
  try {
    const oauthuser = await findOauthUser(
      {
        user_id: user.id,
        provider: "GOOGLE",
        provider_id: googleUser.provider_id,
      },
      tx,
    );

    if (oauthuser.provider !== "GOOGLE") {
      throw new UserError(
        "the user is not belong to Google Oauth, Try other account or login methods",
      );
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function linkOauthGoogle(user, googleUser, metaUser, tx) {
  try {
    /** finding the oauth user first to know that it already not exist because in that case we can do directly login */
    const oauthuser = await findOauthUser(
      { user_id: user.id, provider: "GOOGLE", provider_id },
      tx,
    );

    if (oauthuser) {
      throw new UserError("Oauth user is exists");
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
