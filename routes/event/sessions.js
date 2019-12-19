const express = require("express");
const validatObjeectId = require("../../middleware/validateObjectId");
const Router = express.Router();
const {
  event,
  validateEvent,
  validateSessions
} = require("../../models/event");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const handle = require("../../middleware/handle");
const _ = require("lodash");
//get an event sessions by id
Router.get(
  "/:id",
  validatObjeectId,
  handle(async (req, res) => {
    const getevent = await event.findById(req.params.id);
    if (!getevent)
      return res.status(400).send("the event with the given id was not found");
    res.send(getevent.sessions);
  })
);

//add an event session by id
Router.post(
  "/:id",
  [auth, admin],
  validatObjeectId,
  handle(async (req, res, next) => {
    const { error } = validateSessions(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const evnt = await event.findById(req.params.id);
    if (!evnt)
      return res.status(400).send("the event with the given id was not found");
    const number = evnt.sessions.push(req.body);
    const result = await evnt.save();
    if (!result) return res.status(400).send("error while saving the document");
    res.send({ "sessions number": number, result: result });
  })
);
Router.delete(
  "/:id/:session_id",
  [auth, admin],
  validatObjeectId,
  handle(async (req, res) => {
    console.log(req.params.session_id);
    const Event = await event.findById(req.params.id);
    let sessions = _.filter(
      Event.sessions,
      s => s.id !== req.params.session_id
    );
    Event.sessions = sessions;
    await Event.save();
    res.send("the session deleted successfuly.");
  })
);

module.exports = Router;
