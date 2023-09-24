const express = require("express");
const mainRouter = express.Router();

const userRouter = require("./user.router");
const productRouter = require("./product.router");
const promoRouter = require("./promo.router");
const orderRouter = require("./order.router");
const authRouter = require("./auth.router");
const { sendMail } = require("../Helpers/sendMail");

mainRouter.use("/user", userRouter);
mainRouter.use("/product", productRouter);
mainRouter.use("/promo", promoRouter);
mainRouter.use("/order", orderRouter);
mainRouter.use("/auth", authRouter);

mainRouter.get("/mail", async (req, res) => {
  try {
    const info = await sendMail({
      to: "ledixom343@armablog.com",
      subject: "Email Activation",
      data: {
        username: "fazztrack",
        activationLink: "https://www.fazztrack.com/",
      },
    });
    res.status(200).json({
      msg: "Success",
      response: info.response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = mainRouter;
