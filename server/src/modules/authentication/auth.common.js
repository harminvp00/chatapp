import createRefreshToken from "../../utils/refresh_token.js";
import { createSession } from "./auth.repo.js";
/**
 * This function is used to create session, resue multiple time in multiple files
 */

export async function createUserSession(user_id, user_agent, ip_address, tx) {
  /**
   * Generates the refreshtoken and it hash using method createRefreshToken()
   */
  const { refreshToken, refresh_token_hash } = createRefreshToken();

  /**
   * All response provides uid that help to create session, and this code is reuse for all three response we are geting, no matter it is created first time, account is linked to Oauth or oauth account is login
   */
  const session = await createSession(
    {
      user_id,
      user_agent,
      ip_address,
      refresh_token_hash,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    tx,
  );

  return {
    session,
    refreshToken,
  };
}
