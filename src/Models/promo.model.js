const db = require("../Configs/postgre");

const getPromo = (query) => {
  let sql = "select * from promo p order by id asc";

  const limit = query.limit || 3;
  const page = query.page || 1;
  const offset = (page - 1) * limit;
  const values = [limit, offset];

  sql += " limit $1 offset $2";

  return db.query(sql, values);
};

const postPromo = (body) => {
  let sql = "insert into promo (promo_name, description, discount_type, flat_amount, percent_amount) values ($1, $2, $3, $4, $5) returning *";
  const values = [body.promo_name, body.description, body.discount_type, body.flat_amount, body.percent_amount];

  return db.query(sql, values);
};

const patchPromo = (params, body) => {
  let sql = `update promo set `;
  const values = [params.id];

  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    sql += `${key} = $${i + 1}, `;
    values.push(value);
    i++;
  }

  sql += ` updated_at = now() where id = $1 returning *`;

  return db.query(sql, values);
};

const deletePromo = (params) => {
  let sql = "delete from promo where id = $1 returning id, promo_name, description";
  const values = [params.id];

  return db.query(sql, values);
};

module.exports = {
  getPromo,
  postPromo,
  patchPromo,
  deletePromo,
};
