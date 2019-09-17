const Joi = require("joi");
const mongoose = require("mongoose");
const debug = require("debug")("app:startup");
const sessionSchema = mongoose.Schema({
  session_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 128,
    lowercase: true
  },
  session_number: { type: Number, required: true },
  content_desc: { type: String, required: true, minlength: 5, maxlength: 2048 },
  content_link: String,
  instructor_id: Number
});

const event = mongoose.model(
  "event",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 128,
      lowercase: true,
      unique: true
    },
    cover_photo: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 2048
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2048
    },
    date: {
      type: Date,
      required: true
    },
    feedback: {
      type: Array,
      required: false
    },
    sessions: {
      type: [sessionSchema],
      required: true,
      minlength: 1,
      maxlength: 128
    }
  })
);

function validateEvent(event) {
  const eventJoiSchema = {
    name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    cover_photo: Joi.string()
      .min(5)
      .max(2048)
      .required(),
    description: Joi.string()
      .required()
      .min(10)
      .max(2048),
    date: Joi.date().required(),
    feedback: Joi.array(),
    sessions: Joi.array()
      .required()
      .required()
      .min(1)
      .max(128)
  };
  return Joi.validate(event, eventJoiSchema);
}

function validateSessions(session) {
  const sessionJoiSchema = {
    session_name: Joi.string()
      .min(3)
      .max(128)
      .lowercase()
      .required(),
    instructor_id: Joi.number(),
    session_number: Joi.number().required(),
    content_desc: Joi.string()
      .min(5)
      .max(2048)
      .required(),
    content_link: Joi.string()
  };
  return Joi.validate(session, sessionJoiSchema);
}

module.exports.validateEvent = validateEvent;
module.exports.validateSessions = validateSessions;
module.exports.event = event;
