import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "./auth.service.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { UserError, UnauthorizedAccess } from "../../errors/auth.error.js";
import prisma from "../../config/prisma.js";
import { findById, findAvatarById } from "./auth.repo.js";
import crypto from "node:crypto";
import { success } from "zod";

const cookies_options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

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

    const rawUA = req.get("User-Agent");
    const response = await registerUser(
      validation.data,
      req.file,
      rawUA,
      req.ip,
    );

    if (!response.success) {
      return res.status(400).json(response);
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
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const validate = loginValidation.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        success: false,
        message: validate.error.issues[0].message,
      });
      return;
    }

    console.log("validation is passed");

    const rawUA = req.get("User-Agent");

    const response = await loginUser(validate.data, rawUA, req.ip);

    console.log("response is received from the service layer");

    if (!response.success) {
      res.status(400).json({
        success: false,
        message: response.message,
      });
      return;
    }

    console.log(
      "after verify that the service task done with success, send the access and refresh token in cookie",
    );

    const { accessToken, refreshToken, ...rest } = response;

    return res
      .status(200)
      .cookie("access_token", accessToken, {
        ...cookies_options,
        maxAge: 1 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        ...cookies_options,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (err) {
    // if userError is occured
    if (err instanceof UserError) {
      res.status(400).json({
        success: true,
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

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.refreshToken;

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    console.log("refresh token created");

    const accessToken = await prisma.$transaction(async (tx) => {
      console.log("transaction begin");

      const session = await tx.sessions.findUnique({
        where: {
          refresh_token_hash: refreshTokenHash,
        },
      });

      if (!session) {
        throw new UnauthorizedAccess("Invalid refresh token");
      }
      console.log("session found");

      if (session.revoked_at) {
        throw new UnauthorizedAccess("session is revoked");
      }

      if (session.expires_at < new Date()) {
        throw new UnauthorizedAccess("session is expired");
      }
      console.log("session not revoked or expired");

      const newAccessToken = jwt.sign(
        {
          uid: session.user_id.toString(),
          sid: session.id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
        },
      );

      console.log("new jwt token is created.");

      await tx.sessions.update({
        where: { id: session.id },
        data: { last_used: new Date() },
      });

      console.log("token is updated.");

      return newAccessToken;
    });

    console.log("access token is retured using the cookie");

    return res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1 * 60 * 1000,
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
      console.log("UnauthorizedAccess error is thrown to client");
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
    const { uid } = req.user;

    const user = await prisma.$transaction(async (tx) => {
      const user_data = await findById(uid, tx);

      if (!user_data) {
        return null;
      }
      console.log("user founded from database");

      const avatar_data = user_data.avatar_id
        ? await findAvatarById(user_data.avatar_id, tx)
        : null;
      console.log("avatar_data is founded by user_id");

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
