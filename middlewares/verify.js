const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}
// veify (token) and authorization the user for update
function verifyTokenauth() {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isadmin) {
      next();
    } else {
      return res.status(403).json({ message: "you arenot allowed " });
    }
  });
}
// verify token and admin
function verifyTokenadmin(req, res, next) {
  verifyt(req, res, () => {
    if (req.user.isadmin) {
      next();
    } else {
      return res.status(403).json({ message: "you arenot allowed " });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenauth,
  verifyTokenadmin,
};
