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

    let otp = Math.floor(Math.random() * 10000 + 1);
    if (otp < 1000) {
      otp += 999;
    }
    await mailModel.postOtp(otp, userId);

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

const verifyOtp = async (req, res) => {
  try {
    const { body, userInfo } = req;
    const userId = userInfo.id;
    const result = await mailModel.getOtp(userId);
    // console.log(result.rows.otp);

    if (!result.rows.length)
      return res.status(404).json({
        msg: "Data Not Found",
      });
    if (result.rows[0].otp !== parseInt(body.Your_OTP))
      return res.status(400).json({
        // result: result.rows[0].otp,
        msg: "Your OTP Is Wrong",
      });

    await mailModel.deleteOtp(userId);
    res.status(200).json({
      msg: "Your Email Succesfully Activated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  sendMail,
  verifyOtp,
};
