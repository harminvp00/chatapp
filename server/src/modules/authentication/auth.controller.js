import { registerUser } from "./auth.service.js";
import { registerValidation } from "./auth.validation.js";
import { UserError } from "../../errors/auth.error.js";
import prisma from "../../config/prisma.js";
import { findByEmail } from "./auth.repo.js";
import getClientDetails from "../../utils/ua.parser.js";

export const register = async (req, res) => {
  try {
     // validation using ZOD
    const validation = registerValidation.safeParse(req.body);

    // verify the validations
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    const userDetails = getClientDetails(req);

    // send paylaod to the service layer and geting ackowledgement as response
    const response = await registerUser(validation.data, userDetails);

    if (!response.success) {
      // send when user not created
      res.status(500).json(response);
    } else {
      // send the response to the client that the user is created
      res.status(201).json(response);
    }
  } catch (error) {
    // Error handler for "UserError"
    if (error instanceof UserError) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // function level Error handler
    res.status(400).json({
      success: false,
      message: "Internal Server Error:" + error.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  const { email } = req.user;

  const _user = await prisma.$transaction(async (tx) => {
    return await findByEmail(email);
  });

  if (!_user) {
    throw new UserError("User is not exist!");
  }
  return "";
};
