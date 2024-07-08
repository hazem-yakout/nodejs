const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// generate token
UserSchema.methods.generatetoken = function () {
  return jwt.sign(
    { id: this_id, isadmin: this.username },
    process.env.JWT_SECRETEKEY
  );
};

const User = mongoose.model("User", UserSchema); // validate register
function validatereg(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    username: joi.string().trim().min(2).max(200).required(),
    password: joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
} // validate login
function validatelog(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required(),

    password: joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
} // update a user
function validateup(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).email(),
    username: joi.string().trim().min(2).max(200),
    password: joi.string().trim().min(6),
  });
  return schema.validate(obj);
}
// validate change password
function validatechangepass(obj) {
  const schema = joi.object({
    password: joi.string().trim().min(6),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validatelog,
  validatereg,
  validateup,
  validatechangepass,
};
