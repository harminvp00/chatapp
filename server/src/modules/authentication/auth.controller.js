import { registerUser, loginUser } from "./auth.service.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
import { UserError, UnauthorizedAccess } from "../../errors/auth.error.js";
import prisma from "../../config/prisma.js";
import { findByEmail } from "./auth.repo.js";
import { success } from "zod";

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

    const response = await registerUser(validation.data, req.file);

    if (!response.success) {
      return res.status(400).json(response);
    }

    const { token, ...rest } = response;
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(201).json(rest);
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
        success: true,
        message: validate.error.issues[0].message,
      });
      return;
    }

    const rawUA = req.get("User-Agent");
    console.log(rawUA);

    const response = await loginUser(validate.data, rawUA, req.ip);

    if (!response.success) {
      res.status(400).json({
        success: false,
        message: response.message,
      });
      return;
    }

    const { accessToken, refreshToken, ...rest } = response;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(rest);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.user;

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
      throw new Error("Invalid refresh token");
    }

    if (session.revoked_at) {
      throw new Error("session is revoked");
    }

    if (session.expires_at < new Date()) {
      throw new Error("session is expired");
    }

    const accessToken = jwt.sign(
      {
        uid: session.user_id,
        sid: session.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    tx.sessions.update({
      where: { id: session.id },
      data: { last_used: new Date() },
    });

    return accessToken;
  });

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
};

export const fetchUser = async (req, res) => {
  try {
    const { email } = req.user;

    const _user = await prisma.$transaction(async (tx) => {
      return await findByEmail(email, tx);
    });

    if (!_user) {
      throw new UserError("User is not exist!");
    }

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: _user,
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
      user: null,
    });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

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

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};
