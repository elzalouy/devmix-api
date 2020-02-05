const express = require("express");
const router = express.Router();
const handle = require("../../middleware/handle");
const { validateAskSchema, Ask } = require("../../models/ask");
const { User } = require("../../models/user");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateObjeectId = require("../../middleware/validateObjectId");
const _ = require("lodash");

router.get(
  "/UserAsks/:id",
  handle(async (req, res) => {
    const user = req.params.id;
    const asks = await Ask.find({
      admin_id: { $ne: null },
      answer: { $ne: null },
      user_id: user
    });
    if (!asks)
      return res.status(400).send("the user didn't ask us about anything.");
    res.status(200).send(asks);
  })
);

router.get(
  "/",
  handle(async (req, res) => {
    let asks = await Ask.find({
      admin_id: { $ne: null },
      answer: { $ne: null }
    });
    asks = _.orderBy(asks, ["date"], ["desc"]);
    res.status(200).send(asks);
  })
);

router.get(
  "/notAnswered",
  [auth, admin],
  handle(async (req, res) => {
    const asks = await Ask.find({ admin_id: null, answer: null });
    if (!asks) return res.status(400).send("there no asks not answered");
    res.status(200).send(asks);
  })
);

router.get(
  "/count",
  handle(async (req, res) => {
    const knownCount = await Ask.find({
      user_id: { $ne: null },
      answer: { $ne: null }
    }).count();
    const unknownCount = await Ask.find({
      user_id: null,
      answer: { $ne: null }
    }).count();
    res.send({ unknownCount: unknownCount, knownCount: knownCount });
  })
);

router.post(
  "/",
  handle(async (req, res) => {
    console.log(req.body);
    let user = null;
    if (req.body.user_id) user = await User.findById(req.body.user_id);
    const ask = new Ask({
      question: req.body.question,
      user_id: req.body.user_id ? req.body.user_id : null,
      date: Date.now(),
      admin_id: null,
      answer: null,
      username: user ? user.name : null,
      user_photo: user ? user.profile_photo : null
    });
    const { error } = validateAskSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await ask.save();
    console.log(result);
    res.status(200).send(result);
  })
);

router.post(
  "/admin/answering/:id",
  validateObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const admin = await User.findById(req.user._id).select("name");
    const ask = await Ask.findOneAndUpdate(
      { _id: req.params.id, answer: null, admin_id: null },
      {
        admin_id: req.user._id,
        answer: req.body.answer,
        adminname: admin.name,
        date: Date.now()
      },
      { new: true }
    );
    if (!ask)
      return res.status(400).send("the ask with the given id was not found");
    res.send(ask);
  })
);

router.get(
  "/admin/deleteAnswer/:id",
  validateObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const ask = await Ask.findByIdAndUpdate(
      req.params.id,
      {
        admin_id: null,
        answer: null
      },
      { new: true }
    );
    if (!ask)
      return res.status(400).send("the ask with the given id was not found");
    res.send(ask);
  })
);

router.delete(
  "/admin/deleteQuestion/:id",
  validateObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const result = await Ask.findByIdAndRemove(req.params.id);
    if (!result)
      return res.status(400).send("the ask with the given id was not found");
    res.status(200).send(result);
  })
);

router.delete(
  "/user/deleteQuestion/:id",
  validateObjeectId,
  [auth],
  handle(async (req, res) => {
    const result = await Ask.findOneAndRemove({
      _id: req.params.id,
      user_id: req.user._id
    });
    if (!result)
      res.status(400).send("the ask with the given id was not found");
    res.status(200).send(result);
  })
);

module.exports = router;
