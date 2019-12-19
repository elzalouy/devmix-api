const express = require("express");
const Router = express.Router();
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const { JoinReuest, validateJoinRequet } = require("../../models/joinRequests");
Router.get(
  "/list",
  [auth, admin],
  handle(async (req, res) => {
    const Requests = await JoinReuest.find().sort("date");
    if (!Requests) res.status(400).send("there are no Requests yet");
    res.send(Requests);
  })
);
Router.post(
  "/request",
  handle(async (req, res) => {
    const { error } = validateJoinRequet(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const Request = new JoinReuest({
      fullName: req.body.fullName,
      email: req.body.email,
      school: req.body.school,
      experience: req.body.experience,
      career: req.body.career,
      fields: req.body.fields,
      languages: req.body.languages,
      linkedin: req.body.linkedin,
      freelanceSite: req.body.freelanceSite,
      OrganizationField: req.body.OrganizationField,
      fieldExperience: req.body.fieldExperience,
      date: new Date()
    });
    const result = await Request.save();
    res.status(200).send(result);
  })
);

Router.delete(
  "/delete",
  [auth, admin],
  handle(async (req, res) => {
    req.body.ids.forEach(async element => {
      const result = await JoinReuest.findByIdAndRemove(element);
      if (!result)
        res.status(400).send("the event with the given id was not found");
    });
    res.status(200).send("done");
  })
);

module.exports = Router;
