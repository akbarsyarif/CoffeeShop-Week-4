const authModel = require("../Models/auth.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../Configs/postgre");
const { jwtSecret, jwtIssuer } = require("../Configs/environment");
const { consumers } = require("nodemailer/lib/xoauth2");

// 1. menerima body register dari client
// 2. hash password
// 3. memasukan data ke db
// 4. jika error, error handling
// 5. jika berhasil, kirim response berhasil
const register = async (req, res) => {
  const client = await db.connect();
  try {
    const { body } = req;

    if (body.password !== body.confirm_password)
      return res.status(400).json({
        msg: "Your Password Does Not Match",
      });

    const hashedPassword = await argon.hash(body.password);
    await client.query("BEGIN");
    const result = await authModel.postUser(client, body, hashedPassword);
    await authModel.postUserDetail(client, result.rows[0].id);

    await client.query("COMMIT");
    res.status(200).json({
      msg: "Your Account Successfully Created",
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      if (error.constraint.includes("email"))
        return res.status(400).json({
          msg: "email already used",
        });
    }

    res.status(500).json({
      msg: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};

/**
 * 1. Menerima body dari client
 * 2. Verifikasi password dengan DB
 * 3. Jika tidak cocok, maka response gagal
 * 4. Jika cocok, buat identitas akses (jwt)
 */
const login = async (req, res) => {
  try {
    const { body } = req;

    if (!body.email || !body.password)
      return res.status(400).json({
        msg: "email and password cannot empty",
      });

    const result = await authModel.getPassword(body);
    if (!result.rows.length)
      return res.status(404).json({
        msg: "Email is not registered",
      });
    // await get email jangan lupa error handling
    const { id, pwd, user_role_id } = result.rows[0];
    const isPasswordValid = await argon.verify(pwd, body.password);
    if (!isPasswordValid)
      return res.status(400).json({
        msg: "Wrong Email or Password",
      });

    const payload = {
      id,
      user_role_id,
    };
    const jwtOptions = {
      expiresIn: "1d",
      issuer: jwtIssuer,
    };

    const jwtToken = jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
      if (err) throw err;
      // console.log(payload.user_role_id);
      res.status(200).json({
        msg: "Log In Success",
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const bearerToken = req.header("Authorization");
    const token = bearerToken.split(" ")[1];

    await authModel.insertBlackToken(token);

    res.status(200).json({
      msg: "Logout Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
