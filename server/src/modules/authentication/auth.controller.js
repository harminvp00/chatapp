import { registerUser } from "./auth.service.js";
import { registerValidation } from "./auth.validation.js";
import { UserError, UnauthorizedAccess } from "../../errors/auth.error.js";
import prisma from "../../config/prisma.js";
import { findByEmail } from "./auth.repo.js";
import { httpUrl } from "zod";

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

    let response;

    if (req.file) {
      const response_data = await registerUser(validation.data, req.file);
      response = response_data;
    } else {
      const response_data = await registerUser(validation.data);
      response = response_data;
    }

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
