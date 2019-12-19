const { User, validateUser } = require("../../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const handle = require("../../middleware/handle");

router.post(
  "/",
  handle(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("this email already registered before.");
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    let name = req.body.name;
    name = name.toString().toLowerCase();
    user = new User({
      name: name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: false,
      gender: req.body.gender ? req.body.gender : null,
      profile_photo: "",
      short_desc: req.body.short_desc ? req.body.short_desc : null,
      long_desc: req.body.long_desc ? req.body.long_desc : null,
      linknedIn: req.body.linknedIn ? req.body.linknedIn : null,
      twitter: req.body.twitter ? req.body.twitter : null,
      job: req.body.job ? req.body.job : null
    });
    user = await user.save();
    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email", "gender"]));
  })
);
router.get(
  "/search/:name",
  handle(async (req, res) => {
    let users = await User.find({
      name: { $regex: req.params.name.toLowerCase() }
    }).select(
      "name email gender short_desc long_desc profile_photo.url linkedIn twitter job github"
    );
    if (!users) res.status(400).send("there are no users with this  name");
    res.status(200).send(users);
  })
);
router.get(
  "/byid/:id",
  handle(async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) res.status(400).send("user with the given id was not found");
    let response = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      short_desc: user.short_desc ? user.short_desc : "",
      long_desc: user.long_desc ? user.long_desc : "",
      profile_photo: user.profile_photo.url ? user.profile_photo : "",
      linknedIn: user.linknedIn ? user.linknedIn : "",
      twitter: user.twitter ? user.twitter : "",
      github: user.github ? user.github : "",
      job: user.job ? user.job : ""
    };
    res.status(200).send(response);
  })
);
module.exports = router;
