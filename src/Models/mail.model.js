const db = require("../Configs/postgre");

const getEmail = (userId) => {
  let sql = "select full_name, email from users where id = $1";
  const values = [userId];

  return db.query(sql, values);
};

module.exports = {
  getEmail,
};
