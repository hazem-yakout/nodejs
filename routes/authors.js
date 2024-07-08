const express = require("express");

const router = express.Router();

const {
  Author,
  validatecreatea,
  validateupdatea,
} = require("../models/Author");
const asynchandler = require("express-async-handler");
const authors = [
  {
    id: 1,
    firstname: "hazem",
    lastname: "yakout",
    image: "default-image.png",
  },
];
/** 
 *  @desc get all authors
 * @route /api/authors
 * @method Get
 * @access public
 
*/

router.get(
  "/",
  asynchandler(async (req, res) => {
    const authorsPerPage = 2;
    const { pageNumber } = req.query;
    const authorlist = await Author.find()
      .skip((pageNumber - 1) * authorsPerPage)
      .limit(authorsPerPage)
      .sort({ firstname: -1 })
      .select("firstname lastname -_id");

    res.status(200).json(authorlist);
  })
);
/** 
*  @desc get author by id
* @route /api/authors/:id
* @method Get
* @access public

*/
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
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
  const { error } = validatecreatea(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // console.log(req.body);

  try {
    const author = new Author({
      firstname: req.body.firstname,
      lastname: req.bode.lastname,
      image: req.body.image,
    });
    const result = await author.save();
    res.status(201).json(result); // 201=> creatd succefully
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/** 
*  @desc update an author
* @route /api/authors/:id
* @method put
* @access public

*/
router.put("/:id", async (req, res) => {
  try {
    const { error } = validateupdatea(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.bode.lastname,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/** 
*  @desc delete an author
* @route /api/books/:id
* @method delete
* @access public

*/
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author has been deleted" });
    } else {
      res.status(404).json({ message: "author not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
