const db = require("../Configs/postgre");

const postUser = (client, body, hashedPassword) => {
  let sql = "insert into users  (full_name, email, pwd) values ($1, $2, $3) returning id, full_name, email;";
  const values = [body.full_name, body.email, hashedPassword];

  return client.query(sql, values);
};

const postUserDetail = (client, user_id) => {
  let sql = "insert into users_profile (users_id) values ($1)";
  const values = [user_id];

  return client.query(sql, values);
};

const getPassword = (body) => {
  const sql = "select id, email, pwd, user_role_id from users where email like $1";
  const values = [body.email];

  return db.query(sql, values);
};

module.exports = {
  postUser,
  postUserDetail,
  getPassword,
};
