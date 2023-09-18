const promoModel = require("../Models/promo.model");

const getPromo = async (req, res) => {
  try {
    const { query } = req;
    const result = await promoModel.getPromo(query);

    if (result.rows.length === 0)
      return res.status(404).json({
        msg: "Promo Not Found",
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

const createPromo = async (req, res) => {
  try {
    const { body } = req;
    const result = await promoModel.postPromo(body);

    res.status(201).json({
      msg: "Successfully Create New Promo",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const updatePromo = async (req, res) => {
  try {
    const { params, body } = req;
    if (body.discount_type) {
      if (body.discount_type !== "flat" || body.discount_type !== "percent")
        return res.status(400).json({
          msg: "Discount Type Must Be flat or percent",
        });
    }

    const result = await promoModel.patchPromo(params, body);

    res.status(200).json({
      msg: "Successfully Change Promo",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const deletePromo = async (req, res) => {
  try {
    const { params } = req;
    const result = await promoModel.deletePromo(params);

    res.status(200).json({
      msg: "Successfuly Delete Promo",
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
  getPromo,
  createPromo,
  updatePromo,
  deletePromo,
};
