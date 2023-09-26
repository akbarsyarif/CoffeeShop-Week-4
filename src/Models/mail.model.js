const db = require("../Configs/postgre");

const getEmail = (userId) => {
  let sql = "select full_name, email from users where id = $1";
  const values = [userId];

  return db.query(sql, values);
};

const postOtp = (otp, userId) => {
  let sql = "update users set otp = $1, updated_at = now() where id = $2";
  const values = [otp, userId];

  return db.query(sql, values);
};

const getOtp = (userId) => {
  let sql = "select otp from users where id = $1 and otp is not null";
  const values = [userId];

  return db.query(sql, values);
};

const deleteOtp = (userId) => {
  let sql = "update users  set isverified = $1, otp = null, updated_at = now() where id = $2";
  const values = [true, userId];

  return db.query(sql, values);
};

module.exports = {
  getEmail,
  postOtp,
  getOtp,
  deleteOtp,
};
