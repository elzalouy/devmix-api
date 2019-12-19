const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");
module.exports = async function auth(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied, No token provided");
    const decoded = jwt.verify(token, config.get("jwt_PK"));
    const data = await User.findById(decoded._id);
    if (!data) return res.status(401).send("Unauthorized Request");
    req.user = data;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
