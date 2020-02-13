const express = require("express");
const validatObjeectId = require("../../middleware/validateObjectId");
const Router = express.Router();
const {
  event,
  validateEvent,
  validateSessions,
  validateFeedback
} = require("../../models/event");
const { verifyToken } = require("../../models/user");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const handle = require("../../middleware/handle");
const { Attendees } = require("../../models/attendees");
const upload = require("../../services/uploading")();
const _ = require("lodash");
const {
  uploadImage,
  deleteImage,
  deletePublic
} = require("../../services/cloudinary");

//Get the events
Router.get(
  "/",
  handle(async (req, res) => {
    let events = await event.find().sort("date");
    if (!events)
      res.status(400).send("there are no events existed in the database.");
    res.send(events);
  })
);

//get an event with id
Router.get(
  "/get/:id",
  validatObjeectId,
  handle(async (req, res) => {
    const eventrow = await event.findById(req.params.id);
    if (!eventrow)
      return res.status(400).send("the event with the given id was not found");
    const Event = _.pick(eventrow, [
      "name cover_photo.url location date feedbacks sessions facebook_link twitter_link users"
    ]);
    res.send(eventrow);
  })
);

//create a new event
Router.post(
  "/",
  [auth, admin],
  handle(async (req, res) => {
    const obj = await event.findOne({ name: req.body.name });
    if (obj)
      return res
        .status(400)
        .send(
          "There are an event with the same name. Please choose another name..."
        );
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { error: sessionError } = validateSessions(req.body.sessions[0]);
    if (sessionError)
      return res.status(400).send(sessionError.details[0].message);
    let Element;
    req.body.sessions.forEach(element => {
      const { error } = validateSessions(element);
      if (error) {
        Element = error;
      }
    });
    if (Element) return res.status(400).send(Element.message);
    const newEvent = new event({
      name: req.body.name,
      date: req.body.date,
      feedbacks: req.body.feedbacks,
      sessions: req.body.sessions,
      cover_photo: req.body.cover_photo,
      location: req.body.location,
      twitter_link: req.body.twitter_link,
      facebook_link: req.body.facebook_link,
      users: 0
    });
    const result = await newEvent.save();
    res.status(200).send(result._id);
  })
);

Router.post(
  "/image",
  [auth, admin],
  upload.single("cover_photo"),
  handle(async (req, res) => {
    const id = req.body.id;
    const Event = await event.findById(id);
    if (Event && Event.cover_photo) deleteImage(Event.cover_photo.public_id);
    if (!Event)
      return res.status(400).send("there are error while saving the event...");
    const path = req.file.path;
    const result = await uploadImage(path);
    if (result) {
      Event.cover_photo = result;
      await Event.save();
    }
    deletePublic();
    res.status(200).send("done");
  })
);

//update an event
Router.put(
  "/update/:id",
  [auth, admin],
  validatObjeectId,
  handle(async (req, res, next) => {
    const sessions = _.map(req.body.sessions, element => {
      return _.omit(element, "_id");
    });
    const data = {
      name: req.body.name,
      date: req.body.date,
      sessions: sessions,
      location: req.body.location,
      twitter_link: req.body.twitter_link,
      facebook_link: req.body.facebook_link
    };
    const { error } = validateEvent(data);
    if (error) return res.status(400).send(error.details[0].message);
    const Event = await event.findById(req.params.id);
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
    let Element;
    data.sessions.forEach(element => {
      const { error } = validateSessions(element);
      if (error) {
        Element = error;
      }
    });
    if (Element) return res.status(400).send(Element.message);
    const updateEvent = await event.findByIdAndUpdate(req.params.id, data, {
      new: true
    });
    if (!updateEvent)
      return res.status(400).send("the event with the given id was not found");
    res.send(updateEvent);
  })
);

//delete event
Router.delete(
  "/:id",
  [auth, admin],
  validatObjeectId,
  handle(async (req, res, next) => {
    const result = await event.findByIdAndRemove(req.params.id);
    if (!result.errors) deleteImage(result.cover_photo.public_id);
    await Attendees.remove({ event: req.params.id });
    if (!result)
      return res.status(400).send("the event with the given id was not found");
    res.send(result);
  })
);
Router.post(
  "/feedback",
  handle(async (req, res) => {
    let decoded = null;
    if (req.header("x-auth-token"))
      decoded = verifyToken(req.header("x-auth-token"));
    const feedback = {
      user_id: decoded ? decoded._id : null,
      feedback: req.body.feedback
    };
    let { error } = validateFeedback(feedback);
    if (error) return res.status(400).send(error.details[0].message);
    const id = req.body.event;
    let Event = await event.findByIdAndUpdate(
      id,
      {
        $push: { feedbacks: feedback }
      },
      { new: true }
    );
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
    res.status(200).send(Event.feedbacks);
  })
);

Router.delete(
  "/feedback/:event/:id",
  [auth, admin],
  handle(async (req, res) => {
    let id = req.params.event;
    let feedback = req.params.id;
    let Event = await event.findByIdAndUpdate(
      id,
      {
        $pull: { feedbacks: { _id: feedback } }
      },
      { new: true }
    );
    await Event.save();
    if (!Event)
      return res.status(400).send("The event with the given id was not found");
    res.status(200).send(Event);
  })
);
module.exports = Router;
