const express = require("express");

const productHandler = require("../Handlers/product.handler");
const authMiddleware = require("../Middlewares/authorization");
const diskMiddleware = require("../Middlewares/diskUpload");

const productRouter = express.Router();

productRouter.get("/", productHandler.getProduct);
productRouter.post("/", authMiddleware.isLogin, diskMiddleware.singleUpload("product-image"), productHandler.createProduct);
productRouter.patch("/:id", authMiddleware.isLogin, diskMiddleware.singleUpload("product-image"), productHandler.updateProduct);
productRouter.delete("/:id", productHandler.deleteProduct);

module.exports = productRouter;
