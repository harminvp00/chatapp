
import { registerUser } from "./auth.service.js";
import { registerValidation } from "./auth.validation.js";
import { UserError, UnauthorizedAccess } from "../../errors/auth.error.js";
import prisma from "../../config/prisma.js";
import { findByEmail } from "./auth.repo.js";

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

export const fetchUser = async (req, res) => {
  try {
    console.log(1010);
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
    res.status(500).json({
      success: false,
      message: "server decline the request",
      user: null,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", null);
  return res.status(200).json({
    success: true,
    message: "user logout successfully",
  });
};
