const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

module.exports = async function verify(req, res, next) {
  const token = req.params.token;
  const decoded = jwt.verify(token, config.get("jwt_PK"));
  if (decoded) {
    const data = await User.findByIdAndUpdate(
      decoded._id,
      { confirmed: true },
      { new: true }
    ).select("name email confirmed isAdmin");
    if (!data) return res.status(400).send("Bad Request");
    req.user = decoded;
    next();
  } else {
    return res.status(400).send("Bad Request");
  }
};
