import { _env } from "./config/env.js";

export default function startApp(app) {
  if (!app) {
    throw new Error("App is not connected");
  }

  const PORT = _env.port || 3000;

  app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  });
}
