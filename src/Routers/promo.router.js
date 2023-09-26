const express = require("express");

const promoHandler = require("../Handlers/promo.handler");
const authMiddleware = require("../Middlewares/authorization");

const promoRouter = express.Router();

promoRouter.get("/", promoHandler.getPromo);
promoRouter.post("/", authMiddleware.isLogin, authMiddleware.isAdmin, promoHandler.createPromo);
promoRouter.patch("/:id", authMiddleware.isLogin, authMiddleware.isAdmin, promoHandler.updatePromo);
promoRouter.delete("/:id", authMiddleware.isLogin, authMiddleware.isAdmin, promoHandler.deletePromo);

module.exports = promoRouter;
