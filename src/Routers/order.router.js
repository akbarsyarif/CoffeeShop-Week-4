const express = require("express");

const orderHandler = require("../Handlers/order.handler");
const authMiddleware = require("../Middlewares/authorization");

const orderRouter = express.Router();

orderRouter.get("/", authMiddleware.isLogin, authMiddleware.isAdmin, orderHandler.getOrder);
orderRouter.get("/user/:user_id", authMiddleware.isLogin, authMiddleware.isUser, orderHandler.getOrderPeruser);
orderRouter.get("/:order_id", authMiddleware.isLogin, authMiddleware.isUser, orderHandler.getOrderDetail);
orderRouter.post("/:user_id", authMiddleware.isLogin, authMiddleware.isUser, orderHandler.createOrder);
orderRouter.patch("/:id", authMiddleware.isLogin, authMiddleware.isAdmin, orderHandler.updateOrder);
orderRouter.patch("/:order_id/:product_id", orderHandler.updateOrderDetail);
orderRouter.delete("/:order_id", authMiddleware.isLogin, authMiddleware.isAdmin, orderHandler.deleteOrder);

module.exports = orderRouter;
// ganti order_id
