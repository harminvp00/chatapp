
import { registerUser } from "./auth.service.js";
import { registerValidation } from "./auth.validation.js";
import { UserNotFound } from "../../errors/auth.error.js";

export const register = async (req, res) => {
  try {

    // validation using ZOD
    const validation = registerValidation.safeParse(req.body);

    // verify the validations 
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message
      });
      return;
    }

    // send paylaod to the service layer and geting ackowledgement as response
    const response = await registerUser(validation.data);

    if(!response.success){
      // send when user not created
      res.status(500).json(response);
    }else{
      // send the response to the client that the user is created
      res.status(201).json(response);
    }


  } catch (error) {

    // Error handler for "UserNotFound"
    if (error instanceof UserNotFound) {
      res.status(400).json({
        success: false,
        messahe: error.message,
      });
      return;
    }

    // function level Error handler
    res.status(400).json({
        success: false,
        message: "Internal Server Error:" + error.message
    })
  }
};
