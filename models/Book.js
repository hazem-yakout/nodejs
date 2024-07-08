const mongoose = require("mongoose");
const joi = require("joi");
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
  },
  { timestamps: true }
);
// validate create
function validatecreate(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200).required(),
    author: joi.string().trim().min(2).max(100).required(),
  });
  return schema.validate(obj);
}
// validate update
function validateupdate(obj) {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200),
    author: joi.string().trim().min(2).max(100),
  });
  return schema.validate(obj);
}
const Book = mongoose.model("Book", BookSchema);
module.exports = { Book, validatecreate, validateupdate };
