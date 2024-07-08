const express = require("express");

const router = express.Router();
const {
  User,
  validatereg,
  validatelog,
  validateup,
} = require("../models/User");
const bcrypt = require("bcryptjs");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
/** 
*  @desc register new user
* @route /api/auth/register
* @method post
* @access public

*/

router.post(
  "/register",
  asynchandler(async (req, res) => {
    const { error } = validatereg(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "this user is already registerd" });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      username: req.bode.username,
      password: req.body.password,
    });
    const result = await user.save();
    const token = user.generatetoken();

    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);
/** 
*  @desc login a user
* @route /api/auth/login
* @method post
* @access public

*/

router.post(
  "/login",
  asynchandler(async (req, res) => {
    const { error } = validatelog(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = user.generatetoken();
    const { password, ...other } = result._doc;
    res.status(20).json({ ...other, token });
  })
);
module.exports = router;
