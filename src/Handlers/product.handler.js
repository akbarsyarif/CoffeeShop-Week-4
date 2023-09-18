const productModel = require("../Models/product.model");

const getProduct = async (req, res) => {
  try {
    const { query } = req;
    const result = await productModel.getProduct(query);
    // const sorting = ["asc", "desc"];

    // if (query.product_name || query.price || query.created_at) {
    //   if ((query.product_name !== sorting[0] && query.product_name !== sorting[1]) || (query.price !== sorting[0] && query.price !== sorting[1]) || (query.created_at !== sorting[0] && query.created_at !== sorting[1]))
    //     return res.status(400).json({
    //       msg: "Only Use asc and desc For Sorting",
    //       result: result.rows,
    //     });
    // }

    if (result.rows.length === 0)
      return res.status(404).json({
        msg: "Product Not Found",
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

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    const result = await productModel.postProduct(body);

    res.status(201).json({
      msg: "Sucessfully Create New Product",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await productModel.patchProduct(params, body);

    res.status(200).json({
      msg: "Successfully Update Product",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { params } = req;
    const result = await productModel.deleteProduct(params);

    res.status(200).json({
      msg: "Successfully Delete Product",
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
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
