const express = require("express");
const {
  forgotpass,
  sendforgotpass,
  getresetpass,
  resetpass,
} = require("../controllers/passwordcontroller");
const router = express.Router();
// /password/forgot-password
router.route("/forgot-password").get(forgotpass).post(sendforgotpass);
// /password/reset-password/:userId:token

router.route("/reset-password/:userId:token").get(getresetpass).post(resetpass);
module.exports = router;
