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
import { CreateOAuthAccount, createGoogleAvatar } from "./oauth.repo.js";
import createRefreshToken from "../../utils/refresh_token.js";

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
  const UserResponse = await api.get(_env.google_user, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const googleUser = await UserResponse.data;
  if (!googleUser) {
    throw new UserError("unable to find the google user account");
  }
b
  try {
    const user = await prisma.$transaction(async (tx) => {
      /**
       * check user is exist or not
       */
      const userRow = await findByEmail(googleUser.email, tx);

      if (userRow) {
        throw new UserError("User is already exists");
      }

      console.log(1);

      const userNameExists = await findByUsername(googleUser.name, tx);

      if (userNameExists) {
        throw new UserError("Username is already exists");
      }
      console.log(2);

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
        console.log(3);
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

      console.log(4);

      const { refreshToken, refreshTokenHash } = createRefreshToken();

      console.log(refreshToken, refreshTokenHash);

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

      console.log(5);

      //   {
      //   "id": "110190504010154674899",
      //   "email": "vekariyaharmin96@gmail.com",
      //   "verified_email": true,
      //   "name": "Harmin Vekariya",
      //   "given_name": "Harmin",
      //   "family_name": "Vekariya",
      //   "picture": "https://lh3.googleusercontent.com/a/ACg8ocJ64jqinoBpVso_1h-4TTP2t3thDfGVqlPTZuvulSQqz8HgoV6O=s96-c"
      // }

      const oauthUser = await CreateOAuthAccount(
        {
          user_id: newUser.id,
          provider_id: googleUser.id,
          provider: "GOOGLE",
        },
        tx,
      );

      console.log(6);

      return {
        newUser,
        session,
        refreshToken,
        imagePath: googleUser.picture,
      };
    });

    console.log(7);

    if (!user) {
      throw new UserError("error during saving user");
    }

    console.log(8);

    const { newUser, session, refreshToken, imagePath } = user;

    const accessToken = createToken({
      uid: `${newUser.id}`,
      sid: `${session.id}`,
    });

    console.log(9);

    return {
      success: true,
      message: "Google User is created...",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        imagePath,
        refreshToken,
        accessToken,
      },
    };
  } catch (err) {
    return err;
  }
}
