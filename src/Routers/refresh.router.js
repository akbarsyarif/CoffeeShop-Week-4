const refreshRouter = require("express").Router();

const refreshHandler = require("../Handlers/refresh.handler");

refreshRouter.post("/", refreshHandler.refreshToken);

module.exports = refreshRouter;
