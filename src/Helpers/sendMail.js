const { createTransport } = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const path = require("path");

const oauthCLient = require("../Configs/oauth");
const { mService, authType, mUser, gClientId, gClientSecret, refreshToken } = require("../Configs/environment");

const sendMail = ({ to, subject, data }) => {
  const accessToken = oauthCLient.getAccessToken;
  const transporter = createTransport({
    service: mService,
    auth: {
      type: authType,
      user: mUser,
      clientId: gClientId,
      clientSecret: gClientSecret,
      refreshToken,
      accessToken,
    },
  });
  const template = fs.readFileSync(path.join(__dirname, "../Templates/HTML/test-mail.html"), "utf8");
  const mailOptions = {
    from: '"Coffee Shop App" <coffeeshop@gmail.com>',
    to,
    subject,
    html: mustache.render(template, { ...data }),
  };
  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
