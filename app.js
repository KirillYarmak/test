const { google } = require("googleapis");
const express = require("express");
const path = require("path");
const fs = require("fs");

const keyfile = path.join(__dirname, "creds/leadgen_client_secret.json");
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// console.log(__dirname, __filename);
console.log("Keys", keys);

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.installed.client_id,
  keys.installed.client_secret,
  keys.installed.redirect_uris[0]
);

// Generate the url that will be used for authorization
this.authorizeUrl = client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

// Open an http server to accept the oauth callback. In this
// simple example, the only request to our webserver is to
// /oauth2callback?code=<code>
const app = express();
app.get("/oauth2callback", (req, res) => {
  const code = req.query.code;
  client.getToken(code, (err, tokens) => {
    if (err) {
      console.error("Error getting oAuth tokens:");
      throw err;
    }
    client.credentials = tokens;
    res.send("Authentication successful! Please return to the console.");
    server.close();
    listMajors(client);
  });
});
const server = app.listen(3000, () => {
  // open the browser to the authorize url to start the workflow
  opn(this.authorizeUrl, { wait: false });
});
