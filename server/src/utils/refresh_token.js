import crypto from "node:crypto";
import { TokenError } from "../errors/auth.error.js";
import { createToken } from "../config/jwt.js";

const createRefreshToken = () => {
  try {
    const random = crypto.randomBytes(64);
    const refreshToken = random.toString("hex");
    const refresh_token_hash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    if (!refreshToken || !refresh_token_hash) {
      throw new TokenError();
    }

    return { refreshToken, refresh_token_hash };
  } catch (error) {
    return error;
  }
};

export default createRefreshToken;
