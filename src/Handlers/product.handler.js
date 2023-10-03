const multer = require("multer");
const productModel = require("../Models/product.model");

const getProduct = async (req, res) => {
  try {
    const { query } = req;
    const sorting = ["asc", "desc"];

    if (query.min_price >= query.max_price) {
      return res.status(400).json({
        msg: "Min Price Must Be Higher Than Max Price",
      });
    }
    if (query.product_name || query.price || query.created_at) {
      if (query.product_name !== sorting[0] && query.product_name !== sorting[1] && query.price !== sorting[0] && query.price !== sorting[1] && query.created_at !== sorting[0] && query.created_at !== sorting[1])
        return res.status(400).json({
          msg: "Only Use asc and desc For Sorting",
        });
    }

    const result = await productModel.getProduct(query);
    if (result.rows.length === 0)
      return res.status(404).json({
        msg: "Product Not Found",
        result: result.rows,
      });

    const metaResult = await productModel.getMetaProduct(query);
    const totalData = parseInt(metaResult.rows[0].total_data);
    const totalPage = Math.ceil(totalData / parseInt(query.limit));
    const isLastPage = parseInt(query.page) >= totalPage;
    const nextPage = parseInt(query.page) + 1;
    const prevPage = parseInt(query.page) - 1;
    const meta = {
      page: parseInt(query.page),
      totalPage,
      totalData,
      next: isLastPage ? null : `http://localhost:8000${req.originalUrl.slice(0, -1) + nextPage}`,
      prev: parseInt(query.page) === 1 ? null : `http://localhost:8000${req.originalUrl.slice(0, -1) + prevPage}`,
    };

    res.status(200).json({
      msg: "Success",
      result: result.rows,
      meta,
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

    if (!req.file)
      return res.status(400).json({
        msg: "You Must Insert Product Image",
      });

    const fileLink = `/public/images/${req.file.filename}`;

    const result = await productModel.postProduct(body, fileLink);

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
    let fileLink = ``;
    if (req.file) {
      fileLink += `/public/images/${req.file.filename}`;
    }

    const result = await productModel.patchProduct(params, body, fileLink);

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
