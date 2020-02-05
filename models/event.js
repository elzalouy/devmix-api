const Joi = require("joi");
const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  session_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 128,
    lowercase: true
  },
  session_number: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  content_desc: { type: String, required: true, min: 5, max: 1028 },
  content_link: String,
  instructor_id: { type: String, required: true }
});
const feedback = {
  user_id: { type: String },
  feedback: { type: String, required: true, minlength: 3, maxlength: 100 }
};
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
      type: Object
    },
    location: { type: String, min: 3, max: 128, required: true },
    date: {
      type: Date,
      required: true
    },
    feedbacks: { type: [feedback], minlength: 0, required: false },
    sessions: {
      type: [sessionSchema],
      required: true,
      minlength: 1,
      maxlength: 128
    },
    facebook_link: { type: String },
    twitter_link: { type: String },
    users: { type: Number }
  })
);

function validateEvent(event) {
  const eventJoiSchema = {
    _id: Joi.object(),
    name: Joi.string()
      .min(3)
      .max(128)
      .required(),
    cover_photo: Joi.object(),
    date: Joi.date().required(),
    feedbacks: Joi.array(),
    sessions: Joi.array()
      .required()
      .required()
      .min(1)
      .max(128),
    location: Joi.string()
      .min(3)
      .max(128)
      .required(),
    facebook_link: Joi.string(),
    twitter_link: Joi.string(),
    users: Joi.number()
  };
  return Joi.validate(event, eventJoiSchema);
}
function validateSessions(session) {
  const sessionJoiSchema = {
    _id: Joi.object(),
    session_name: Joi.string()
      .min(3)
      .max(128)
      .lowercase()
      .required(),
    instructor_id: Joi.string().required(),
    session_number: Joi.number().required(),
    date: Joi.string().required(),
    content_desc: Joi.string()
      .min(5)
      .max(2048)
      .required(),
    content_link: Joi.string(),
    date: Joi.string().required(),
    time: Joi.string().required()
  };
  return Joi.validate(session, sessionJoiSchema);
}
function validateFeedback(data) {
  const schema = {
    user_id: Joi.string().allow(null),
    feedback: Joi.string()
      .required()
      .min(3)
      .max(100)
  };
  return Joi.validate(data, schema);
}
module.exports.validateEvent = validateEvent;
module.exports.validateSessions = validateSessions;
module.exports.event = event;
module.exports.validateFeedback = validateFeedback;
