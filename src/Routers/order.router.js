const express = require("express");

const orderHandler = require("../Handlers/order.handler");

const orderRouter = express.Router();

orderRouter.get("/", orderHandler.getOrder);
orderRouter.get("/user/:user_id", orderHandler.getOrderPeruser);
orderRouter.get("/:order_id", orderHandler.getOrderDetail);
orderRouter.post("/:user_id", orderHandler.createOrder);
orderRouter.patch("/:id", orderHandler.updateOrder);
orderRouter.patch("/:order_id/:product_id", orderHandler.updateOrderDetail);
orderRouter.delete("/:order_id", orderHandler.deleteOrder);

module.exports = orderRouter;
// ganti order_id
