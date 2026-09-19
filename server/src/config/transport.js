
import { _env } from "./env.js";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: _env.smtp_host,
  auth: {
    user: _env.smtp_user,
    pass: _env.smtp_pass,
  },
});

export default transport;
