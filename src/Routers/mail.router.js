const express = require("express");

const mailHandler = require("../Handlers/mail.handler");
const authMiddleware = require("../Middlewares/authorization");

const mailRouter = express.Router();

mailRouter.get("/", authMiddleware.isLogin, mailHandler.sendMail);
mailRouter.delete("/", authMiddleware.isLogin, mailHandler.verifyOtp); // ganti route ke get

module.exports = mailRouter;
