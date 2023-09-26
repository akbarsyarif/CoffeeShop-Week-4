const db = require("../Configs/postgre");

const getUser = () => {
  let sql = "select id, full_name, email from users order by id ASC";

  return db.query(sql);
};

const postUser = (client, body) => {
  let sql = "insert into users  (full_name, email, pwd) values ($1, $2, $3) returning id, full_name, email;";
  const values = [body.full_name, body.email, body.pwd];

  return client.query(sql, values);
};

const postUserDetail = (client, user_id) => {
  let sql = "insert into users_profile (users_id) values ($1)";
  const values = [user_id];

  return client.query(sql, values);
};

const patchUser = (body, user_id) => {
  let sql = "update users set pwd = $1, updated_at = now() where id = $2;";
  const values = [body.new_password, user_id];

  return db.query(sql, values);
};

const deleteUser = (params) => {
  let sql = "delete from users where id = $1 returning id, full_name";
  const values = [params.id];

  return db.query(sql, values);
};

module.exports = {
  getUser,
  postUser,
  postUserDetail,
  patchUser,
  deleteUser,
};
