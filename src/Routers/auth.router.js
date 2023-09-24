const authRouter = require("express").Router();

const authHandler = require("../Handlers/auth.handler");

authRouter.post("/", authHandler.register);
authRouter.post("/login", authHandler.login);

module.exports = authRouter;
