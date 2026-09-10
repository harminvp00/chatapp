import { registerUser } from "./auth.service.js";
import { registerValidation } from "./auth.validation.js";
import { UserError } from "../../errors/auth.error.js";
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

    
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    
    if (error instanceof UnauthorizedAccess) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  const { email } = req.user;

  const _user = await prisma.$transaction(async (tx) => {
    return await findByEmail(email, tx);
  });

  if (!_user) {
    throw new UserError("User is not exist!");
  }
  return "";
};
