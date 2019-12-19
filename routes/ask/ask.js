const express = require("express");
const router = express.Router();
const handle = require("../../middleware/handle");
const { validateAskSchema, Ask } = require("../../models/ask");
const { User } = require("../../models/user");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validatObjeectId = require("../../middleware/validateObjectId");
const _ = require("lodash");
router.get(
  "/:from/:to",
  handle(async (req, res) => {
    let from = parseInt(req.params.from);
    let to = parseInt(req.params.to);
    let asks = await Ask.find({
      admin_id: { $ne: null },
      answer: { $ne: null }
    })
      .skip(from)
      .limit(to);
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
    const user = await User.findById(req.body.user_id).select(
      "name profile_photo"
    );
    const ask = new Ask({
      question: req.body.question,
      user_id: req.body.user_id ? req.body.user_id : null,
      date: req.body.date ? req.body.date : Date.now(),
      admin_id: null,
      answer: null,
      username: req.body.user_id && user ? user.name : null,
      user_photo:
        req.body.user_id && user && user.profile_photo
          ? user.profile_photo
          : null,
      adminname: null
    });
    const { error } = validateAskSchema(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await ask.save();
    res.status(200).send(result);
  })
);
router.post(
  "/admin/answering/:id",
  validatObjeectId,
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
  validatObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const ask = await Ask.findByIdAndUpdate(
      req.params.id,
      {
        admin_id: null,
        answer: null,
        adminname: null
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
  validatObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const result = await Ask.findByIdAndRemove(req.params.id);
    if (!result)
      return res.status(400).send("the ask with the diven id was not found");
    res.status(200).send(result);
  })
);
module.exports = router;
