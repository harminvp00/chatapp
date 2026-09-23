import crypto from "node:crypto";
import { TokenError } from "../errors/auth.error.js";

const createRefreshToken = () => {
  try {
    const random = crypto.randomBytes(64);
    const refreshToken = random.toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    if (!refreshToken || !refreshTokenHash) {
      throw new TokenError();
    }

    return { refreshToken, refreshTokenHash };
  } catch (error) {
    return error;
  }
};

export default createRefreshToken;
