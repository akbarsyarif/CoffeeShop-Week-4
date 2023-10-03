const express = require("express");

const productHandler = require("../Handlers/product.handler");
const authMiddleware = require("../Middlewares/authorization");
const diskMiddleware = require("../Middlewares/diskUpload");

const productRouter = express.Router();

productRouter.get("/", productHandler.getProduct);

// productRouter.post(
//   "/",
//   authMiddleware.isLogin,
//   authMiddleware.isRole(2),
//   (req, res, next) =>
//     diskMiddleware.singleUpload("product-image")(req, res, (err) => {
//       diskMiddleware.checkError(err, res, next);
//     }),
//   productHandler.createProduct
// );
productRouter.post("/", authMiddleware.isLogin, authMiddleware.isRole(2), diskMiddleware.singleUpload("product-image"), productHandler.createProduct);

productRouter.patch("/:id", authMiddleware.isLogin, authMiddleware.isRole(2), diskMiddleware.singleUpload("product-image"), productHandler.updateProduct);

productRouter.delete("/:id", authMiddleware.isLogin, authMiddleware.isAdmin, productHandler.deleteProduct);

module.exports = productRouter;
