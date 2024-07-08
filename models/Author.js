const mongoose = require("mongoose");
const joi = require("joi");
const AuthorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  { timestamps: true }
); // validate create
function validatecreatea(obj) {
  const schema = joi.object({
    firstname: joi.string().trim().min(3).max(200).required(),
    lastname: joi.string().trim().min(2).max(100).required(),
    image: joi.string(),
  });
  return schema.validate(obj);
}
// validate update
function validateupdatea(obj) {
  const schema = joi.object({
    firstname: joi.string().trim().min(3).max(200),
    lastname: joi.string().trim().min(2).max(100),
    image: joi.string(),
  });
  return schema.validate(obj);
}
const Author = mongoose.model("Author", AuthorSchema);
module.exports = { Author, validatecreatea, validateupdatea };
