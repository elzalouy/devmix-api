const express = require("express");
const validatObjeectId = require("../../middleware/validateObjectId");
const mongoose = require("mongoose");
const Router = express.Router();
const {
  event,
  validateEvent,
  validateSessions
} = require("../../models/event");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const handle = require("../../middleware/handle");

//Get the events
Router.get(
  "/",
  handle(async (req, res) => {
    const events = await event.find().sort("date");
    if (!events)
      res.status(400).send("there are no events existed in the database.");
    res.send(events);
  })
);

//get an event with id
Router.get(
  "/:id",
  validatObjeectId,
  handle(async (req, res) => {
    const eventrow = await event.findById(req.params.id);
    if (!eventrow)
      return res.status(400).send("the event with the given id was not found");
    res.send(eventrow);
  })
);

//Get upcoming events
Router.get(
  "/all/upcoming",
  handle(async (req, res) => {
    const events = await event.find({ date: { $gte: Date.now() } });
    if (!events)
      return res.status(200).send("there is no upcoming events until now");
    res.send(events);
  })
);

//create a new event
Router.post(
  "/",
  [auth, admin],
  handle(async (req, res) => {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { error: sessionError } = validateSessions(req.body.sessions[0]);
    if (sessionError) return res.status(400).send(Serror.details[0].message);
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
      cover_photo: req.body.cover_photo,
      description: req.body.description,
      date: req.body.date,
      feedback: req.body.feedback,
      sessions: req.body.sessions
    });
    const result = await newEvent.save();
    res.send(result);
  })
);

//update an event
Router.put(
  "/:id",
  [auth, admin],
  validatObjeectId,
  handle(async (req, res, next) => {
    //validate
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const Event = await event.findById(req.params.id);
    if (!Event)
      return res.status(400).send("the event with the given id was not found");
    let Element;
    req.body.sessions.forEach(element => {
      const { error } = validateSessions(element);
      if (error) {
        Element = error;
      }
    });
    if (Element) return res.status(400).send(Element.message);
    const updateEvent = await event.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        cover_photo: req.body.cover_photo,
        description: req.body.description,
        date: req.body.date,
        feedback: req.body.feedback,
        sessions: req.body.sessions
      },
      {
        new: true
      }
    );
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
    if (!result)
      return res.status(400).send("the event with the given id was not found");
    res.send(result);
  })
);

module.exports = Router;
