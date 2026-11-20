import { _env } from "./config/env.js";

export default function startserver(server) {
  if (!server) {
    throw new Error("server is not connected");
  }

  const PORT = _env.port || 3000;

  server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
  });
}
