const { google } = require("googleapis");

const { gClientId, gClientSecret, refreshToken } = require("./environment");

const client = new google.auth.OAuth2(gClientId, gClientSecret);
client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = client;
