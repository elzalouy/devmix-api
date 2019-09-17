const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateObjectId = require("../../middleware/validateObjectId");
const { event } = require("../../models/event");
const { User } = require("../../models/user");
const { Attendees } = require("../../models/attendees");
const _ = require("lodash");

// get event attendees
router.get(
  "/event/:id",
  validateObjectId,
  handle(async (req, res) => {
    const attendees = await Attendees.find({ event: req.params.id });
    if (!attendees)
      return res.status(400).send("the event with the given id was not found");
    let users = { users: [] };
    for (i = 0; i < attendees.length; i++) {
      let user = await User.findById(attendees[i].user).select(
        "name , email , profile_photo"
      );
      users["users"].push(user);
    }
    res.send(users);
  })
);

// user events to attend
router.get(
  "/user/events",
  auth,
  handle(async (req, res) => {
    const attendees = await Attendees.find({
      user: req.user._id,
      confirm: false
    });
    let userEvents = { events: [] };
    for (i = 0; i < attendees.length; i++) {
      let Event = await event
        .findById(attendees[i].event)
        .select("name , cover_photo");
      userEvents["events"].push(Event);
    }
    res.send(userEvents);
  })
);

//promise to attent an event
router.get(
  "/:id",
  validateObjectId,
  auth,
  handle(async (req, res) => {
    let Event = await event.findById(req.params.id);
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
    let attendee = await Attendees.findOne({
      user: req.user._id,
      event: req.params.id
    });
    if (attendee) return res.status(200).send("the attendee aleardy existed");
    attendee = await Attendees.findOne({
      user_id: req.user._id,
      event_id: req.params.id
    });
    let newattendee = new Attendees({
      user: req.user._id,
      event: req.params.id,
      confirm: false
    });
    newattendee = await newattendee.save();
    Event = await event.findById(req.params.id).select("name");
    res.status(200).send(Event);
  })
);

//will not attend an event
router.get(
  "/not/:id",
  validateObjectId,
  auth,
  handle(async (req, res) => {
    const attendee = await Attendees.findOneAndRemove({
      user: req.user._id,
      event: req.params.id
    });
    res.status(200).send(attendee);
  })
);

// confirm user attending as an admin
router.post(
  "/confirm",
  auth,
  admin,
  handle(async (req, res) => {
    const attendee = await Attendees.findOne({
      user: req.body.user,
      event: req.body.event
    });
    if (!attendee)
      return res
        .status(400)
        .send("the attendee with the given info was not found");
    attendee.confirm = true;
    await attendee.save();
    return res.send(attendee);
  })
);

module.exports = router;
