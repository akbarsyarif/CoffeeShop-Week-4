const orderModel = require("../Models/order.model");
const db = require("../Configs/postgre");

const getOrder = async (req, res) => {
  try {
    const result = await orderModel.getOrder();

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

const getOrderPeruser = async (req, res) => {
  try {
    const { params, query } = req;
    const result = await orderModel.getOrderPeruser(params, query);

    if (result.rows.length === 0)
      return res.status(404).json({
        msg: "Order Not Found",
        result: result.rows,
      });

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

const getOrderDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await orderModel.getOrderDetail(params);

    if (result.rows.length === 0)
      return res.status(404).json({
        msg: "Order Not Found",
        result: result.rows,
      });

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

const createOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const { params, body } = req;

    await client.query("BEGIN");
    const data = await orderModel.postOrder(client, params, body);
    const result = await orderModel.postOrderProduct(client, data.rows[0].id, body);
    await client.query("COMMIT");

    res.status(201).json({
      msg: "Successfully Create New Order",
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

const updateOrder = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await orderModel.patchOrder(params, body);

    res.status(200).json({
      msg: "Successfully Update Order",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updateOrderDetail = async (req, res) => {
  const client = await db.connect();
  try {
    const { params, body } = req;

    await client.query("BEGIN");
    const result = await orderModel.patchOrderDetail(client, params, body);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        msg: "No Rows Affected, Please Check Your Order ID or Product ID",
        result: result.rows,
      });
    }

    if (body.products_id || body.quantity || body.sizes_id || body.sub_total) {
      await orderModel.patchTotalOnly(client, params, body);
    }
    await client.query("COMMIT");

    res.status(200).json({
      msg: "Successfully Update Order Detail",
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

const deleteOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const { params } = req;

    await client.query("BEGIN");
    const result = await orderModel.deleteOrder(client, params);
    await orderModel.deleteOrderDetail(client, params);
    await client.query("COMMIT");

    res.status(200).json({
      msg: "Successfully Delete Order",
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

module.exports = {
  getOrder,
  getOrderPeruser,
  getOrderDetail,
  createOrder,
  updateOrder,
  updateOrderDetail,
  deleteOrder,
};
