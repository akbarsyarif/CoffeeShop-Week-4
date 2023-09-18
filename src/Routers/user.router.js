const express = require("express");

const userHandler = require("../Handlers/user.handler");

const userRouter = express.Router();

userRouter.get("/", userHandler.getUser);
userRouter.post("/", userHandler.createUser);
userRouter.patch("/:id", userHandler.updateUser);
userRouter.delete("/:id", userHandler.deleteUser);

module.exports = userRouter;
