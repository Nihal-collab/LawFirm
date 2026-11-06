const https = require('https');
const http = require('http');

/**
 * Periodically pings the server's public health endpoint to prevent
 * free hosting tiers (such as Render) from entering sleep mode due to inactivity.
 */
function startKeepAlive() {
  const targetUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    'https://lawfirm-5e2a.onrender.com';

  if (!targetUrl || process.env.NODE_ENV !== 'production') {
    return;
  }

  const normalized = targetUrl.endsWith('/') ? targetUrl.slice(0, -1) : targetUrl;
  const pingUrl = `${normalized}/api/health`;
  const intervalMinutes = 13; // Render sleeps after 15 minutes of inactivity

  console.log(`⏱️ Keep-alive active: pinging ${pingUrl} every ${intervalMinutes} minutes`);

  setInterval(() => {
    try {
      const client = pingUrl.startsWith('https') ? https : http;
      client
        .get(pingUrl, (res) => {
          if (res.statusCode === 200) {
            console.log(`💓 [Keep-Alive] Ping OK (${res.statusCode}) at ${new Date().toISOString()}`);
          } else {
            console.log(`⚠️ [Keep-Alive] Ping returned status ${res.statusCode}`);
          }
        })
        .on('error', (err) => {
          console.warn(`⚠️ [Keep-Alive] Ping request error: ${err.message}`);
        });
    } catch (err) {
      console.warn(`⚠️ [Keep-Alive] Execution error: ${err.message}`);
    }
  }, intervalMinutes * 60 * 1000);
}

module.exports = { startKeepAlive };
