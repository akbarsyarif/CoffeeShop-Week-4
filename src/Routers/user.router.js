const express = require("express");

const userHandler = require("../Handlers/user.handler");
const authMiddleware = require("../Middlewares/authorization");

const userRouter = express.Router();

userRouter.get("/", authMiddleware.isLogin, authMiddleware.isAdmin, userHandler.getUser);
userRouter.post("/", userHandler.createUser);
userRouter.patch("/:id", authMiddleware.isLogin, userHandler.updateUser);
userRouter.delete("/:id", authMiddleware.isLogin, userHandler.deleteUser);

module.exports = userRouter;
