import { _env } from "./env.js";
import jwt from "jsonwebtoken";

export const createToken = (payload) => {
  return jwt.sign(payload, _env.jwt_secret, {
    expiresIn: "15m",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, _env.jwt_secret);
};
