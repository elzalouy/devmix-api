const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) res.status(401).send("Access denied, No token provided");
    const decoded = jwt.verify(token, config.get("jwt_PK"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
