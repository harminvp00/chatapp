import { _env } from "../../config/env.js";
import crypto from "node:crypto";
import prisma from "../../config/prisma.js";
import { findById, findAvatarById } from "./auth.repo.js";
import { registerUser, loginUser } from "./auth.password.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { handleGoogleAuth, authenticateGoogleUser } from "./google.oauth.js";
import {
  TokenError,
  UserError,
  UnauthorizedAccess,
  PasswordError,
} from "../../errors/auth.error.js";
import { OAuth2Client } from "google-auth-library";
import { success } from "zod";

const cookies_options = {
  httpOnly: true,
  secure: _env.node_env === "production",
  sameSite: _env.node_env === "production" ? "none" : "lax",
};

const googleClient = new OAuth2Client(
  _env.google_client_id,
  _env.google_client_secret,
  _env.google_callback_url,
);

export const register = async (req, res) => {
  try {
    const validation = registerValidation.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    // GET User Agent Details from the response
    const rawUA = req.get("User-Agent");

    // calling register user service and geting repsonse from it! it could an error or tokens if new user created successfully
    const response = await registerUser(
      validation.data,
      req.file,
      rawUA,
      req.ip,
    );


    if (!response?.success) {
      if (response?.code === "OAUTH_EXIST") {
        return res.status(400).json({
          success: false,
          code: response?.code,
        });
      }
    }
    const { accessToken, refreshToken, ...rest } = response;

    return res
      .status(201)
      .cookie("access_token", accessToken, {
        ...cookies_options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    if (error instanceof UnauthorizedAccess) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    return res.status(500).json({
      success: false,
      message: error.code,
    });
  }
};

/**
 *
 * @param {*} req contain username & password
 * @param {*} res can contain error response or can contain usual response such as tokens etc
 * @returns return status, message, tokens if success true, and set cookies if sucess true
 */

export const login = async (req, res) => {
  try {
    /**
     * Validation: IF the validation success false then controller diretly send 400 error
     */
    const validate = loginValidation.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        success: false,
        message: validate.error.issues[0].message,
      });
      return;
    }

    // User Agent info from response
    const rawUA = req.get("User-Agent");

    // Pass validate payload, User Agent and IP Address from the request coming to the service method loginUser()
    const response = await loginUser(validate.data, rawUA, req.ip);

    // if success false, that means service failed to login user or any service error is occurs
    if (!response.success) {
      res.status(400).json(response);
      return;
    }

    /**
     * if success !== false, then we are able to destructure the property from response
     * destructure access token and refresh token from the response and send them as cookie
     */
    const { accessToken, refreshToken, ...rest } = response;

    return res
      .status(200)
      .cookie("access_token", accessToken, {
        ...cookies_options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        ...cookies_options,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (err) {
    /**
     * Catch Bloack Handle all the error that can cause by the service
     */

    if (err instanceof UserError) {
      // if userError is occured
      res.status(400).json({
        success: false,
        message: err.message,
      });
      return;
    }

    if (err instanceof PasswordError) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.refreshToken;

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const accessToken = await prisma.$transaction(async (tx) => {
      const session = await tx.sessions.findUnique({
        where: {
          refresh_token_hash: refreshTokenHash,
        },
      });

      if (!session) {
        throw new UnauthorizedAccess("Invalid refresh token");
      }

      if (session.revoked_at) {
        throw new UnauthorizedAccess("session is revoked");
      }

      if (session.expires_at < new Date()) {
        throw new UnauthorizedAccess("session is expired");
      }

      const newAccessToken = createToken({
        uid: session.user_id.toString(),
        sid: session.id.toString(),
      });

      await tx.sessions.update({
        where: { id: session.id },
        data: { last_used: new Date() },
      });

      return newAccessToken;
    });

    return res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({
        success: true,
        message: "access token refreshed",
      });
  } catch (error) {
    if (error instanceof UnauthorizedAccess) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  try {
    // req.user comes from the decoded access token (AuthMiddleware), which
    // only carries { uid, sid } — not email — so look the user up by id.
    const { uid, sid } = req.user;

    const user = await prisma.$transaction(async (tx) => {
      const user_data = await findById(uid, tx);

      if (!user_data) {
        return null;
      }

      const avatar_data = user_data.avatar_id
        ? await findAvatarById(user_data.avatar_id, tx)
        : null;

      return {
        user_data,
        avatar_data,
      };
    });

    if (!user) {
      throw new UserError("User is not exist!");
    }

    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: {
        username: user.user_data.username,
        email: user.user_data.email,
        role: user.user_data.role,
        imagePath: user.avatar_data ? user.avatar_data.image_path : null,
      },
    });
  } catch (error) {
    if (error instanceof UserError) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    return res.status(500).json({
      success: false,
      message: "server decline the request",
    });
  }
};

export const getAvatar = async (req, res) => {
  const avatar_name = req.params.avatar_name;

  res.sendFile(
    `/home/harmin/Desktop/web3_projects/QuickChat/server/storage/avatar/${avatar_name}`,
  );
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(401).json({
        status: false,
        message: "Refresh token not found",
      });
      return;
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.sessions.update({
      where: {
        refresh_token_hash: refreshTokenHash,
      },
      data: {
        revoked_at: new Date(),
      },
    });

    res
      .clearCookie("access_token", {
        httpOnly: true,
        sameSite: "lax",
      })
      .clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "lax",
      })
      .status(200)
      .json({
        success: true,
        message: "logout successfully",
      });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  if (
    !_env.google_client_id ||
    !_env.google_client_secret ||
    !_env.google_callback_url
  ) {
    res.status(500).json({
      success: false,
      message: "Google login rejected due to server issue!",
    });
    return;
  }

  res.redirect(
    googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    }),
  );
};

export const googleCallback = async (req, res) => {
  try {
    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;

    if (!code) {
      res
        .status(404)
        .json({ success: false, message: "code is not received from google" });
      return;
    }

    const access_token = await handleGoogleAuth(code);

    const response = await authenticateGoogleUser(
      access_token,
       req.get("User-Agent"),
      req.ip,
    );


    console.log(response)

    if (!response.success) {
      if (response?.code) {
        return res
          .status(400)
          .redirect(
            `${_env.client_url}?code=${response?.code}&email=${response?.data?.email}&name=${response?.data?.name}&image=${response?.data?.image}`,
          );
      }
      return res
        .status(302)
        .redirect(`${_env.client_url}?message=${response.WhatsDone}`);
    }

    const { tokens } = response;

    res
      .cookie("access_token", tokens.accessToken, {
        ...cookies_options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .redirect(`${_env.client_url}`);
  } catch (err) {
    if (err instanceof UserError) {
      res
        .status(400)
        .redirect(`${_env.client_url}/login?message=${err.message}`);
      return;
    }
    if (err instanceof TokenError) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
