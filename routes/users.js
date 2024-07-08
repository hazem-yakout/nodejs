const express = require("express");

const router = express.Router();
const { User, validateup } = require("../models/User");
const bcrypt = require("bcryptjs");
const asynchandler = require("express-async-handler");
const {
  verifyTokenadmin,
  verifyTokenauth,
  verifyToken,
} = require("../middlewares/verify");
/** 
*  @desc update a user
* @route /api/usersl:id
* @method put
* @access private

*/
router.put(
  "/:id",
  verifyTokenauth,
  asynchandler(async (req, res) => {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "you arenot allowed " });
    }
    const { error } = validateup(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateduser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updateduser);
  })
);
/** 
 *  @desc get all users
 * @route /api/users
 * @method Get
 * @access private (only admin)
 
*/

router.get(
  "/",
  verifyTokenadmin,
  asynchandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  })
);
/** 
 *  @desc delete 
 * @route /api/users/:id
 * @method delete
 * @access private (only admin and user himself)
 
*/

router.delete(
  "/:id",
  verifyTokenauth,
  asynchandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "user has been deleted succefully" });
    } else {
      res.status(404).json({ message: "user isnot found" });
    }
  })
);
/** 
 *  @desc get user by id
 * @route /api/users/:id
 * @method Get
 * @access private (only admin and user himself)
 
*/

router.get(
  "/:id",
  verifyTokenauth,
  asynchandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user isnot found" });
    }
  })
);
module.exports = router;
