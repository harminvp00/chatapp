import { TokenError } from "../errors/auth.error.js";
import { _env } from "./env.js";
import jwt from "jsonwebtoken";

/** This function is used to create JWT Token using user_id from users relation and session id from session relations, function is just pass the paremeter to the */
export const createToken = (uid, sid) => {
  // convert to the string if not already
  if (typeof uid === "bigint") uid = uid.toString();
  if (typeof sid === "bigint") sid = sid.toString();

  // this case is not possible but if this happen then it will be useful to debug quickly
  if (!(typeof uid === "string" && typeof sid === "string")) {
    throw new TokenError("Token payload must be string type");
  }

  // Creating token after type validation
  return jwt.sign({ uid, sid }, _env.jwt_secret, {
    expiresIn: "15m",
  });
};

/** This function is used to verify the JWT token */
export const verifyToken = (token) => {
  return jwt.verify(token, _env.jwt_secret);
};
