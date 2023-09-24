const jwt = require("jsonwebtoken");

const { jwtSecret, jwtIssuer, adminKey } = require("../Configs/environment");

/**
 * 1. mengecek header authorization
 * 2. ambil token
 * 3. jika tidak ditemukan, maka belum login dan kirim response suruh login
 * 4. jika ditemukan, maka verifikasi token
 * 5. jika tidak valid, maka suruh login ulang
 * 6. jika valid, maka lanjut ke middleware berikut nya
 */
const isLogin = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return res.status(401).json({
      msg: "You Need To Login First",
    });
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, jwtSecret, { issuer: jwtIssuer }, (err, data) => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return res.status(401).json({
            msg: "Please Login Again",
          });
        case "JsonWebTokenError":
          return res.status(401).json({
            msg: "Please Login Again",
          });
        default:
          return res.status(500).json({
            msg: "Internal Server Error",
          });
      }
    }
    req.userInfo = data;
    next();
  });
};

const isRole = (req, res, next) => {
  const { user_role_id } = req.userInfo;
  if (user_role_id !== parseInt(adminKey))
    return res.status(404).json({
      msg: "Data Not Found",
    });
  next();
};

module.exports = {
  isLogin,
  isRole,
};
