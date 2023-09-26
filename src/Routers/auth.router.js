const authRouter = require("express").Router();

const authHandler = require("../Handlers/auth.handler");
const { isLogin } = require("../Middlewares/authorization");

authRouter.post("/", authHandler.register);
authRouter.post("/login", authHandler.login);
authRouter.post("/logout", isLogin, authHandler.logout);

module.exports = authRouter;
