const db = require("../Configs/postgre");

const getProduct = (query) => {
  let sql =
    'select p.id, p.product_image as "Product Image", p.product_name as "Product Name", p.description, p.rating, p.price, c.category_name as "Category", p.created_at as "Since" from products p join category c on category_id = c.id ';

  const limit = query.limit || 3;
  const page = query.page || 1;
  const offset = (page - 1) * limit;
  const values = [limit, offset];

  if (query.search) {
    values.push(`%${query.search}%`);
    sql += "where p.product_name ilike $3 ";
  }

  if (query.product_name || query.price || query.created_at) {
    sql += "order by ";
    let i = 1;
    for (const [key, value] of Object.entries(query)) {
      if (!query.search) {
        if (i >= 3) {
          sql += `p.${key} ${value}, `;
          // values.push(value);
        }
      } else if (i >= 4) {
        sql += `p.${key} ${value}, `;
        // values.push(value);
      }
      i++;
    }
    sql = sql.slice(0, -2);
  }

  sql += " limit $1 offset $2";
  // console.log(sql);
  // console.log(values);
  // console.log(values[3]);
  // console.log(typeof values[3]);
  return db.query(sql, values);
};

const postProduct = (body) => {
  let sql = "insert into products (product_name, description, rating, price, category_id, promo_id) values ($1, $2, $3, $4, $5, $6) returning *";
  const values = [body.product_name, body.description, body.rating, body.price, body.category_id, body.promo_id];

  return db.query(sql, values);
};

const patchProduct = (params, body) => {
  let sql = `update products set `;
  const values = [params.id];

  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    sql += `${key} = $${i + 1}, `;
    values.push(value);
    i++;
  }

  sql += `updated_at = now() where id = $1 returning *`;

  return db.query(sql, values);
};

const deleteProduct = (params) => {
  let sql = "update products set deleted_at = now() where id = $1 returning id, product_name";
  const values = [params.id];

  return db.query(sql, values);
};

module.exports = {
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
};
