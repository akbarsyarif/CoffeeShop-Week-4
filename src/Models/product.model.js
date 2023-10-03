const { query } = require("express");
const db = require("../Configs/postgre");

const getProduct = (query) => {
  let sql =
    'select p.id, p.product_image as "Product Image", p.product_name as "Product Name", p.description, p.rating, p.price, c.category_name as "Category", p.created_at as "Since" from products p join category c on category_id = c.id ';

  const limit = parseInt(query.limit) || 3;
  const page = parseInt(query.page) || 1;
  const offset = (page - 1) * limit;
  const values = [limit, offset];
  let j = 1;

  if (query.search || query.category || query.min_price || query.max_price) {
    sql += "where ";
    let i = 3;
    for (const [key, value] of Object.entries(query)) {
      if (key === "search") {
        sql += `p.product_name ilike $${i} and `;
        values.push(`%${value}%`);
      }
      if (key === "category") {
        sql += `c.category_name like $${i} and `;
        values.push(value);
      }
      if (key === "min_price") {
        sql += `p.price >= $${i} and `;
        values.push(value);
      }
      if (key === "max_price") {
        sql += `p.price <= $${i} and `;
        values.push(value);
      }
      i++;
      j++;
    }
    sql = sql.slice(0, -4);
  }

  if (query.product_name || query.price || query.created_at) {
    sql += "order by ";
    let i = 1;
    for (const [key, value] of Object.entries(query)) {
      if (key === "product_name" || key === "price" || key === "created_at") {
        sql += `p.${key} ${value}, `;
      }
      i++;
      j++;
    }
    sql = sql.slice(0, -2);
  }

  sql += ` limit $1 offset $2`;
  console.log(sql);
  console.log(values);
  console.log(Object.entries(query));
  // console.log(values[3]);
  // console.log(typeof values[3]);
  return db.query(sql, values);
};

const getMetaProduct = (query) => {
  let sql = `select count(*) as total_data from products p join category c on category_id = c.id `;
  const values = [];

  if (query.search || query.category || query.min_price || query.max_price) {
    sql += "where ";
    let i = 1;
    for (const [key, value] of Object.entries(query)) {
      if (key === "search") {
        sql += `p.product_name ilike $${i} and `;
        values.push(`%${value}%`);
      }
      if (key === "category") {
        sql += `c.category_name like $${i} and `;
        values.push(value);
      }
      if (key === "min_price") {
        sql += `p.price >= $${i} and `;
        values.push(value);
      }
      if (key === "max_price") {
        sql += `p.price <= $${i} and `;
        values.push(value);
      }
      i++;
    }
    sql = sql.slice(0, -4);
  }

  return db.query(sql, values);
};

const postProduct = (body, fileLink) => {
  let sql = "insert into products (product_image, product_name, description, price, category_id, promo_id) values ($1, $2, $3, $4, $5, $6) returning *";
  const values = [fileLink, body.product_name, body.description, body.price, body.category_id, body.promo_id];

  console.log(values);
  return db.query(sql, values);
};

const patchProduct = (params, body, fileLink) => {
  let sql = `update products set `;
  const values = [params.id];

  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    sql += `${key} = $${i + 1}, `;
    values.push(value);
    i++;
  }

  if (fileLink) {
    values.push(fileLink);
    sql += `product_image = $${i + 1}, `;
  }

  sql += `updated_at = now() where id = $1`;

  return db.query(sql, values);
};

const deleteProduct = (params) => {
  let sql = "update products set deleted_at = now() where id = $1 returning id, product_name";
  const values = [params.id];

  return db.query(sql, values);
};

module.exports = {
  getProduct,
  getMetaProduct,
  postProduct,
  patchProduct,
  deleteProduct,
};

// if (query.product_name || query.price || query.created_at) {
//   sql += "order by ";
//   let i = 1;
//   for (const [key, value] of Object.entries(query)) {
//     if (!query.search) {
//       if (i >= 3) {
//         sql += `p.${key} ${value}, `;
//         // values.push(value);
//       }
//     } else if (i >= 4) {
//       sql += `p.${key} ${value}, `;
//       // values.push(value);
//     }
//     i++;
//   }
//   sql = sql.slice(0, -2);
// }

// if (!query.search) {
//   values.push(query.category);
//   sql += "where c.category_name like $3";
// }

// if (query.search) {
//   values.push(`%${query.search}%`);
//   sql += "where p.product_name ilike $3 ";
// }
