const notfound = (req, res, next) => {
  const error = new Error(`not found -${req.originalUrl}`);
  req.status(404);
  next(error);
};
const errorhandler = (err, req, res, next) => {
  const statuscode = res.statuscode === 200 ? 500 : res.statuscode;
  res.status(statuscode).json({ message: err.message });
};
module.exports = {
  notfound,
  errorhandler,
};
