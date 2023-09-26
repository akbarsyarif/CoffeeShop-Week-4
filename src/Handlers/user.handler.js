const userModel = require("../Models/user.model");
const db = require("../Configs/postgre");
// const check = require("../Helpers/checkRole");

const getUser = async (req, res) => {
  try {
    const result = await userModel.getUser();
    res.status(200).json({
      msg: "Success",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const client = await db.connect();
    const { body } = req;

    await client.query("BEGIN");
    const result = await userModel.postUser(client, body);
    await userModel.postUserDetail(client, result.rows[0].id);
    await client.query("COMMIT");

    res.status(201).json({
      msg: "Successfully created a new user",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    res.status(500).json({
      msg: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};

const updateUser = async (req, res) => {
  try {
    const { body, userInfo } = req;
    const result = await userModel.patchUser(body, userInfo.id);

    res.status(200).json({
      msg: "Succesfully changed Password",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { params } = req;
    const result = await userModel.deleteUser(params);

    res.status(200).json({
      msg: "User Successfully Deleted",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
