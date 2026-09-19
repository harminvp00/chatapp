import { _env } from "../../config/env.js";
import { TokenError, UserError } from "../../errors/auth.error.js";
import { api } from "../../config/axios.js";
import prisma from "../../config/prisma.js";
import {
  createAvatar,
  createUser,
  findByEmail,
  createSession,
} from "../../modules/authentication/auth.repo.js";
import { createRefreshToken } from "../../utils/refresh_token.js";

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

  //   {
  //   "id": "110190504010154674899",
  //   "email": "vekariyaharmin96@gmail.com",
  //   "verified_email": true,
  //   "name": "Harmin Vekariya",
  //   "given_name": "Harmin",
  //   "family_name": "Vekariya",
  //   "picture": "https://lh3.googleusercontent.com/a/ACg8ocJ64jqinoBpVso_1h-4TTP2t3thDfGVqlPTZuvulSQqz8HgoV6O=s96-c"
  // }

  try {
    const user = await prisma.$transaction(async (tx) => {
      /**
       * check user is exist or not
       */
      const userRow = await findByEmail(googleUser.email, tx);

      if (userRow) {
        throw new UserError();
      }

      let avatar_id = null;
      if (googleUser.picture) {
        const avatar = await createAvatar(
          {
            file_name: `${googleUser.picture}`.split("/")[4],
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

      const session = await createSession({
        user_id: newUser.id,
        user_agent,
        ip_address,
        refresh_token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    });

    return {
      userRow,
      session,
      refreshToken,
    };
  } catch (err) {
    return err;
  }

  return googleUser;
}
