const express = require("express");

const promoHandler = require("../Handlers/promo.handler");

const promoRouter = express.Router();

promoRouter.get("/", promoHandler.getPromo);
promoRouter.post("/", promoHandler.createPromo);
promoRouter.patch("/:id", promoHandler.updatePromo);
promoRouter.delete("/:id", promoHandler.deletePromo);

module.exports = promoRouter;
