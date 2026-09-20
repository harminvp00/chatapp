import { OAuth2Client } from "google-auth-library";
import { _env } from "../../config/env.js";
import { TokenError, UserError } from "../../errors/auth.error.js";
import { handleGoogleAuth, registerGoogleUser } from "./oauth.service.js";

const googleClient = new OAuth2Client(
  _env.google_client_id,
  _env.google_client_secret,
  _env.google_callback_url,
);

const cookies_options = {
  httpOnly: true,
  secure: _env.node_env === "production",
  sameSite: _env.node_env === "production" ? "none" : "lax",
};

export const googleLogin = async (req, res) => {
  if (
    !_env.google_client_id ||
    !_env.google_client_secret ||
    !_env.google_callback_url
  ) {
    res.status(500).json({
      success: false,
      message: "Google login rejected due to server issue!",
    });
    return;
  }

  res.redirect(
    googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    }),
  );
};

export const googleCallback = async (req, res) => {
  try {
    const code =
      typeof req.query.code === "string" ? req.query.code : undefined;

    if (!code) {
      res
        .status(404)
        .json({ success: false, message: "code is not received from google" });
      return;
    }

    const access_token = await handleGoogleAuth(code);

    const user_agent = req.get("User-Agent");
    const response = await registerGoogleUser(access_token, user_agent, req.ip);

    if (!response.success) {
      console.log(response)
      return res.redirect(`${_env.client_url}?message=${response.message}`);
    }

    const { success, message, user, tokens } = response;

    res
      .cookie("access_token", tokens.accessToken, {
        ...cookies_options,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .redirect(`${_env.client_url}`);
  } catch (err) {
    if (err instanceof UserError) {
      res
        .status(400)
        .redirect(`${_env.client_url}/login?message=${err.message}`);
      return;
    }
    if (err instanceof TokenError) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
      return;
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
