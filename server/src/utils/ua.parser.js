import { UAParser } from "ua-parser-js";

export default function getClientDetails(req) {
  const parser = new UAParser(req.get("User-Agent"));
  const result = parser.getResult();

  return {
    browser: {
      name: result.browser.name || "Unknown",
      version: result.browser.version || "Unknown",
    },

    os: {
      name: result.os.name || "Unknown",
      version: result.os.version || "Unknown",
    },

    device: {
      type: result.device.type || "desktop",
      vendor: result.device.vendor || null,
      model: result.device.model || null,
    },

    network: {
      ip: req.ip || null,
    },

    client: {
      language: req.get("Accept-Language")?.split(",")[0] || null,
      referer: req.get("Referer") || null,
      origin: req.get("Origin") || null,
    },

    request: {
      method: req.method,
      path: req.originalUrl,
    },

    timestamp: new Date(),
  };
}
