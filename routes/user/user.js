const { User, validateUser } = require("../../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const validateObjectId = require("../../middleware/validateObjectId");
const router = express.Router();
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");

router.post(
  "/",
  handle(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already existed");
    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: false,
      gender: req.body.gender,
      short_desc: req.body.short_desc,
      long_desc: req.body.long_desc
    });
    user = await user.save();
    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email", "gender"]));
  })
);

module.exports = router;
