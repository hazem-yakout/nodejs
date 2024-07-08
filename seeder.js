const { Book } = require("./models/Book");
const { books } = require("./data");
const connectToDB = require("./config/db");
connectToDB();
// insert books
const importbooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("books imported !");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// remove books
const removebooks = async () => {
  try {
    await Book.deleteMany();
    console.log("books removed !");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
