const express = require("express");

const router = express.Router();
const { Book, validatecreate, validateupdate } = require("../models/Book");
const joi = require("joi");
const asynchandler = require("express-async-handler");
const books = [
  {
    id: 1,
    title: "haz",
    author: "hazem",
  },
];
/** 
 *  @desc get all books
 * @route /api/books
 * @method Get
 * @access public
 
*/

router.get(
  "/",
  asynchandler(async (req, res) => {
    const { minprice, maxprice } = req.query;
    const books = await Book.find({
      price: { $gte: minprice, $lte: maxprice },
    }).populate("author", ["_id", "firstname", "lastname"]);
    res.status(200).json(books);
  })
);
/** 
/** 
*  @desc get author by id
* @route /api/authors/:id
* @method Get
* @access public

*/
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "author not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/** 
*  @desc create new author
* @route /api/authors
* @method post
* @access public

*/
router.post("/", async (req, res) => {
  const { error } = validatecreate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // console.log(req.body);

  try {
    const book = new Book({
      firstname: req.body.firstname,
      lastname: req.bode.lastname,
      image: req.body.image,
    });
    const result = await book.save();
    res.status(201).json(result); // 201=> creatd succefully
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/** 
*  @desc update a book
* @route /api/authors/:id
* @method put
* @access public

*/
router.put("/:id", async (req, res) => {
  try {
    const { error } = validateupdate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
        },
      },
      { new: true }
    );
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/** 
*  @desc delete a book
* @route /api/books/:id
* @method delete
* @access public

*/
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "book has been deleted" });
    } else {
      res.status(404).json({ message: "book not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
