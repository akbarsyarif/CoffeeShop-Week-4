const db = require("../Configs/postgre");
// const { param } = require("../Routers/promo.router");

const getOrder = () => {
  let sql =
    'select o.id, u.full_name as "Full Name", sh."name" as "Shipping", s."name" as "Status", total from "order" o join users u on o.users_id  = u.id join status s on o.status_id = s.id join shipping sh on o.shipping_id = sh.id  order by id asc';

  return db.query(sql);
};

const getOrderPeruser = (params, query) => {
  let sql =
    'select o.id, u.full_name as "Full Name", sh."name" as "Shipping", s."name" as "Status", total from "order" o join users u on o.users_id  = u.id join status s on o.status_id = s.id join shipping sh on o.shipping_id = sh.id where o.users_id = $3';

  const limit = query.limit || 3;
  const page = query.page || 1;
  const offset = (page - 1) * limit;
  const values = [limit, offset, params.user_id];

  sql += " limit $1 offset $2";

  return db.query(sql, values);
};

const getOrderDetail = (params) => {
  let sql =
    'select p.product_image, p.product_name as "Product Name", o.id as "Order No.", u.full_name as "Full Name", o.created_at  as "Date", op.quantity as "Quantity", s."size" as "Size", op.ice as "With Ice?", sh."name" as "Shipping", st."name" as "Status", op.sub_total as "Sub Total" from order_products op join "order" o  on op.order_id  = o.id join products p on op.products_id = p.id join users u on o.users_id = u.id join sizes s on op.sizes_id = s.id join shipping sh on o.shipping_id = sh.id join status st on o.status_id = st.id where o.id = $1';
  const values = [params.order_id];

  return db.query(sql, values);
};

const postOrder = (client, params, body) => {
  let sql = 'insert into "order" (users_id, status_id, total, shipping_id) values ($1, $2, $3, $4) returning id';
  const values = [params.user_id, body.status_id, body.total, body.shipping_id];

  return client.query(sql, values);
};

const postOrderProduct = (client, orderId, body) => {
  let sql = "insert into order_products (order_id, products_id, quantity, sizes_id, ice, sub_total) values ";
  const values = [orderId];
  const bodyValue = Object.values(body);

  let k = 2;
  for (let i = 3; i < bodyValue.length; i++) {
    for (let j = 0; j < bodyValue[i].length; j++) {
      if (j === 0) {
        sql += `($1, $${k}, `;
      }
      if (j > 0 && j < bodyValue[i].length - 1) {
        sql += `$${k}, `;
      }
      if (j === bodyValue[i].length - 1) {
        sql += `$${k}), `;
      }
      values.push(bodyValue[i][j]);
      k++;
    }
  }
  sql = sql.slice(0, -2);

  sql += ` returning order_id, sub_total`;

  return client.query(sql, values);
};
// const postOrderProduct = (client, orderId, body) => {
//   let sql = "insert into order_products (order_id, products_id, quantity, sizes_id, ice, sub_total) values ($1, $2, $3, $4, $5, $6), ";
//   const values = [orderId, body.products_id, body.quantity, body.sizes_id, body.ice, body.sub_total];
//   // 5
//   if (Object.keys(body).length > 8) {
//     let i = 0;
//     for (const [key, value] of Object.entries(body)) {
//       if (i >= 8) {
//         if (i % 5 === 3) {
//           sql += `($1, $${i - 1}, `;
//         } else if (i % 5 === 4 || i % 5 === 0 || i % 5 === 1) {
//           sql += `$${i - 1}, `;
//         } else if (i % 5 === 2) {
//           sql += `$${i - 1}), `;
//         }
//         values.push(value);
//       }
//       i++;
//     }
//   }
//   sql = sql.slice(0, -2);

//   sql += ` returning order_id, sub_total`;
//   console.log(sql);
//   console.log(Object.entries(body));
//   console.log(Object.keys(body).length);
//   console.log(values);

//   return client.query(sql, values);
// };

const patchOrder = (params, body) => {
  let sql = 'update "order"  set ';
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

const patchOrderDetail = (client, params, body) => {
  let sql = `update order_products set `;
  const values = [params.order_id, params.product_id];

  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    if (body.total) {
      if (i < Object.entries(body).length) {
        sql += `${key} = $${i + 2}, `;
        values.push(value);
        i++;
      }
    }
    sql += `${key} = $${i + 2}, `;
    values.push(value);
    i++;
  }

  sql += `updated_at = now() where order_id = $1 and products_id = $2 returning *`;
  // console.log(values);
  // console.log(sql);

  return client.query(sql, values);
};

const patchTotalOnly = (client, params, body) => {
  let sql = `update "order" set total = $2, updated_at = now() where id = $1`;
  const values = [params.order_id, body.total];

  return client.query(sql, values);
};

const deleteOrder = (client, params) => {
  let sql = 'update "order" set deleted_at = now() where id = $1 returning *';
  const values = [params.order_id];

  return client.query(sql, values);
};

const deleteOrderDetail = (client, params) => {
  let sql = "update order_products set deleted_at = now() where order_id = $1";
  const values = [params.order_id];

  return client.query(sql, values);
};

module.exports = {
  getOrder,
  getOrderPeruser,
  getOrderDetail,
  postOrder,
  postOrderProduct,
  patchOrder,
  patchOrderDetail,
  patchTotalOnly,
  deleteOrder,
  deleteOrderDetail,
};
