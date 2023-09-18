const express = require("express");
const mainRouter = express.Router();

const userRouter = require("./user.router");
const productRouter = require("./product.router");
const promoRouter = require("./promo.router");
const orderRouter = require("./order.router");

mainRouter.use("/user", userRouter);
mainRouter.use("/product", productRouter);
mainRouter.use("/promo", promoRouter);
mainRouter.use("/order", orderRouter);

module.exports = mainRouter;
