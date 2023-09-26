require("dotenv").config();
require("eslint");

const express = require("express");

const app = express();

app.use(express.static("./"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8000, () => {
  console.log("Server is Running at Port 8000");
});

const mainRouter = require("./src/Routers/main.router");
app.use(mainRouter);
