const http = require("http");
const https = require("https");

/**
 * Keep-Alive Cron Job
 * Runs every 10 minutes to prevent deployed server (Render, Koyeb, Glitch, etc.) from sleeping/idling.
 */
function initKeepAliveCron(serverPort = 3000) {
  const TEN_MINUTES_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

  const pingServer = () => {
    // Determine target URL from environment variables or fallback to local URL
    const targetUrl =
      process.env.APP_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      process.env.SERVER_URL ||
      process.env.URL ||
      "https://tripora-lemon.vercel.app";

    const pingEndpoint = `${targetUrl.replace(/\/$/, "")}/ping`;
    const protocol = pingEndpoint.startsWith("https") ? https : http;

    console.log(`[Cron Job] ⏰ [${new Date().toLocaleString()}] Sending 10-min keep-alive ping to: ${pingEndpoint}`);

    protocol
      .get(pingEndpoint, (res) => {
        console.log(`[Cron Job] ✅ Server keep-alive response status: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error(`[Cron Job] ⚠️ Keep-alive ping warning: ${err.message}`);
      });
  };

  // Run initial ping after 1 minute of startup
  setTimeout(pingServer, 60 * 1000);

  // Schedule ping every 10 minutes
  const intervalId = setInterval(pingServer, TEN_MINUTES_MS);
  
  console.log("🚀 [Cron Job Service] Keep-Alive Cron Job initialized! Server will stay active with 10-minute pings.");
  return intervalId;
}

module.exports = initKeepAliveCron;
