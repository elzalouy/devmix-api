const { User, authUser } = require("../../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const handle = require("../../middleware/handle");
const router = express.Router();
const passport = require("passport");
const config = require("config");
router.post(
  "/",
  handle(async (req, res) => {
    const { error } = authUser(req.body);
    if (error) res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (validPassword === false)
      res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    user = _.pick(user, ["name", "email", "_id"]);
    res
      .status(200)
      .header("x-auth-token", token)
      .send(user);
  })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    redirect: config.get("callbackURL")
  })
);
router.get(
  "/google/reirect",
  passport.authenticate("google", { redirect: config.get("callbackURL") }),
  function onAuthenticate(req, res) {
    var profile = req.user.profile;
    res.send({
      username: profile.name,
      email: profile.email,
      gender: profile.gender
    });
  }
);
module.exports = router;
