const express = require("express");

const productHandler = require("../Handlers/product.handler");

const productRouter = express.Router();

productRouter.get("/", productHandler.getProduct);
productRouter.post("/", productHandler.createProduct);
productRouter.patch("/:id", productHandler.updateProduct);
productRouter.delete("/:id", productHandler.deleteProduct);

module.exports = productRouter;
