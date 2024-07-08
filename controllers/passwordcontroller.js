const asynchandler = require("express-async-handler");
const { User, validatechangepass } = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
/** 
         *  @desc get forgot password view
         * @route /password/forgot-password
         * @method Get
         * @access public
         
        */
module.exports.forgotpass = asynchandler((req, res) => {
  res.render("forgor-password");
});
/** 
 *  @desc send forgot password link
 * @route /password/forgot-password
 * @method post
 * @access public
 
*/
module.exports.sendforgotpass = asynchandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user isnot found" });
  }
  const secret = process.env.JWT_SECRETEKEY + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: "10m",
  });
  const link = `http://localhost:8000/password/reset-password/${user._id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Passsword",
    html: `<div>
    <h4>click on the link below to reset your password </h4>
    </div>`,
  };
});

/** 
 *  @desc get reset password view
 * @route /password/reset-password/:userId/:token
 * @method Get
 * @access public
 
*/
module.exports.getresetpass = asynchandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "user isnot found" });
  }
  const secret = process.env.JWT_SECRETEKEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ messge: "Error!" });
  }
});

/** 
 *  @desc reset the password
 * @route /password/reset-password/:userId/:token
 * @method post
 * @access public
 
*/
module.exports.resetpass = asynchandler(async (req, res) => {
  const { error } = validatechangepass(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "user isnot found" });
  }
  const secret = process.env.JWT_SECRETEKEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({ messge: "Error!" });
  }
});
module.exports = {
  getresetpass,
  resetpass,
  sendforgotpass,
  forgotpass,
};
