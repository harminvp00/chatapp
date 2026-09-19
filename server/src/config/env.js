import "dotenv/config";

export const _env = {
  // app configurations 
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  client_url: process.env.CLIENT_URL,

  // database urls 
  database_url: process.env.DATABASE_URL,

  // token secrets 
  jwt_secret: process.env.JWT_SECRET_KEY,

  // email credentials 
  smtp_host: process.env.SMTP_HOST,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,

  // github oauth credentials
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,

  // google oauth credentials
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  google_user: process.env.GOOGLE_USER,
};
