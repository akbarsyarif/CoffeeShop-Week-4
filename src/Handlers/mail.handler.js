const mailModel = require("../Models/mail.model");
const send = require("../Helpers/sendMail");

const sendMail = async (req, res) => {
  try {
    // const { id } = req.userInfo;
    const userId = req.userInfo.id;
    const result = await mailModel.getEmail(userId);

    const info = await send.sendMail({
      to: result.rows[0].email,
      subject: "Activation Link",
      data: {
        fullName: result.rows[0].full_name,
        activationLink: "https://www.fazztrack.com/",
      },
    });

    res.status(200).json({
      msg: "Activation Link Has Been Send To Your Registered Email",
      info,
    });
  } catch (error) {
    // console.log(req.userInfo);
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMail,
};
