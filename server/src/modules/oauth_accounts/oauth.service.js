import { _env } from "../../config/env.js";
import { TokenError, UserError, UserSession } from "../../errors/auth.error.js";
import { api } from "../../config/axios.js";
import prisma from "../../config/prisma.js";
import { createToken } from "../../config/jwt.js";
import {
  createUser,
  findByEmail,
  createSession,
  findByUsername,
} from "../../modules/authentication/auth.repo.js";
import {
  CreateOAuthAccount,
  createGoogleAvatar,
  findOauthUser,
} from "./oauth.repo.js";
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

export async function registerGoogleUser(access_token, user_agent, ip_address) {
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

      if (userRow) {
        const response = await loginExistingOauthUser(
          userRow.id,
          user_agent,
          ip_address,
        );
        return {
          ...response,
        };
      }

      const userNameExists = await findByUsername(googleUser.name, tx);

      if (userNameExists) {
        throw new UserError("Username is already exists");
      }

      let avatar_id = null;
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
      const oauthUser = await CreateOAuthAccount(
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
        imagePath: googleUser.picture,
      };
    });

    if (!user) {
      throw new UserError("error during saving user");
    }

    if (user?.logged) {
      const { success, message, tokens } = user;
      return {
        success,
        message,
        tokens,
      };
    }

    const { newUser, session, refreshToken, imagePath } = user;

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

export async function loginExistingOauthUser(userId, user_agent, ip_address) {
  try {
    const userdata = await prisma.$transaction(async (tx) => {
      const oauthuser = await findOauthUser(userId, tx);

      const { refreshToken, refreshTokenHash } = createRefreshToken();

      const session = await createSession(
        {
          user_id: oauthuser.user_id,
          user_agent,
          ip_address,
          refresh_token_hash: refreshTokenHash,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        tx,
      );

      return {
        oauthuser,
        refreshToken,
        session,
      };
    });

    if (!userdata) {
      throw new UserError("User is not exist or created");
    }

    if (userdata.oauthuser.provider !== "GOOGLE") {
      throw new UserError(
        "the user is not belong to Google Oauth, Try other accounts or methods",
      );
    }

    const accessToken = createToken({
      uid: `${userdata.oauthuser.user_id}`,
      sid: `${userdata.session.id}`,
    });

    return {
      success: true,
      message: "User is logged successfully",
      tokens: {
        accessToken,
        refreshToken: userdata.refreshToken,
      },
      logged: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
