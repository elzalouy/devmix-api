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
  "/getEventAttendees/:id",
  validateObjectId,
  handle(async (req, res) => {
    const Event = await event.findById(req.params.id);
    if (!Event)
      return res.status(400).send("the event with the given id was found");
    const attendees = await Attendees.find({ event: req.params.id });
    if (attendees.length === 0)
      return res.status(200).send("there are no attendees until now");
    Event.users = attendees.length;
    await Event.save();
    let users = { users: [] };
    for (i = 0; i < attendees.length; i++) {
      let user = await User.findById(attendees[i].user).select(
        "name , profile_photo, short_desc"
      );
      users["users"].push(user);
    }
    res.send(users);
  })
);

router.get(
  "/getUserAttendee/:event_id",
  validateObjectId,
  auth,
  handle(async (req, res) => {
    const attendee = await Attendees.findOne({
      event: req.params.event_id,
      user: req.user._id
    });
    res.status(200).send(attendee);
  })
);
// user's events to attend
router.get(
  "/getUserAttendees",
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
  "/attendEvent/:id",
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
    let newattendee = new Attendees({
      user: req.user._id,
      event: req.params.id,
      confirm: false
    });
    newattendee = await newattendee.save();
    Event = _.pick(Event, ["name", "cover_photo"]);
    res.status(200).send(Event);
  })
);

//will not attend an event
router.get(
  "/notAttend/:id",
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
//get confirmed attendees
module.exports = router;
