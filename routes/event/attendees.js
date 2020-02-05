const express = require("express");
const router = express.Router();
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const validateObjectId = require("../../middleware/validateObjectId");
const { event } = require("../../models/event");
const { User } = require("../../models/user");
const { Attendees } = require("../../models/attendees");
const _ = require("lodash");

//get all event attendees
router.get(
  "/AttendeesList",
  [auth, admin],
  handle(async (req, res) => {
    let attendees = await Attendees.find();
    if (!attendees)
      return res.status(400).send("there are no attendees not confirmed");
    res.status(200).send(attendees);
  })
);

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
        "name , profile_photo, email"
      );
      users["users"].push(user);
    }
    res.send(users);
  })
);

// get user attendee
router.get(
  "/getUserAttendee/:event_id/:user_id",
  validateObjectId,
  handle(async (req, res) => {
    const attendee = await Attendees.findOne({
      event: req.params.event_id,
      user: req.params.user_id
    });
    res.status(200).send(attendee);
  })
);

// user's events to attend
router.get(
  "/getUserAttendees/:user_id",
  validateObjectId,
  handle(async (req, res) => {
    attendees = await Attendees.find({
      user: req.params.user_id,
      confirm: true
    });
    let userEvents = { events: [] };
    for (i = 0; i < attendees.length; i++) {
      let Event = await event
        .findById(attendees[i].event)
        .select("name , cover_photo , date , location");
      Event = Event.set({ confirmed: attendees[i].confirmed });
      userEvents["events"].push(Event);
    }
    res.send(userEvents);
  })
);

//promise to attend an event
router.get(
  "/attendEvent/:id",
  validateObjectId,
  auth,
  handle(async (req, res) => {
    let attendee = await Attendees.findOne({
      user: req.user._id,
      event: req.params.id
    });
    if (attendee) return res.status(200).send("the attendee aleardy existed");
    let Event = await event.findById(req.params.id);
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
    let count = Event.users;
    Event = await event.findByIdAndUpdate(
      req.params.id,
      { users: count + 1 },
      { new: true }
    );
    let user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("unauthorized user");
    let newattendee = new Attendees({
      user: req.user._id,
      username: user.name,
      event: req.params.id,
      name: Event.name,
      profile_photo: user.profile_photo,
      confirm: false
    });
    newattendee = await newattendee.save();
    res.status(200).send(newattendee);
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
    let count = await Attendees.find({ event: req.params.id }).count();
    let Event = await event.findByIdAndUpdate(req.params.id, { users: count });
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
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

router.post(
  "/delete",
  [auth, admin],
  handle(async (req, res) => {
    let ids = req.body.ids;
    for (let i = 0; i < ids.length; i++) {
      let result = await Attendees.findByIdAndDelete(ids[i]);
      if (!result) return res.status(400).send("not found");
    }
    res.send("done");
  })
);
//get confirmed attendees
module.exports = router;
