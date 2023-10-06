const jwt = require("jsonwebtoken");

const { jwtSecret, refreshSecret, jwtIssuer } = require("../Configs/environment");

const refreshToken = async (req, res) => {
  try {
    const { cookies } = req;
    // console.log(cookies.jwt);
    const reToken = cookies.jwt;

    jwt.verify(reToken, refreshSecret, { issuer: jwtIssuer }, (err, decoded) => {
      if (err)
        return res.status(401).json({
          msg: "Please Login Again",
        });
      //   console.log(decoded);
      const payload = {
        id: decoded.id,
        user_role_id: decoded.user_role_id,
      };
      const jwtOptions = {
        expiresIn: "15m",
        issuer: jwtIssuer,
      };

      jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
        if (err) throw err;
        res.status(200).json({
          msg: "Login Success",
          token,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  refreshToken,
};
