const mongoose = require("mongoose");
const Joi = require("joi");

const AskSchema = mongoose.model(
  "Ask",
  new mongoose.Schema({
    question: { type: String, required: true, maxlength: 2000, minlength: 1 },
    answer: { type: String },
    date: { type: Date },
    user_id: { type: mongoose.Types.ObjectId },
    admin_id: { type: mongoose.Types.ObjectId },
    username: { type: String },
    adminname: { type: String },
    user_photo: { type: Object }
  })
);

function validateAskSchema(ask) {
  const Schema = {
    question: Joi.string()
      .max(2000)
      .min(1)
      .required(),
    answer: Joi.string()
      .min(1)
      .allow(null),
    date: Joi.date(),
    user_id: Joi.string().allow(null),
    admin_id: Joi.string().allow(null)
  };
  return Joi.validate(ask, Schema);
}
module.exports = {
  Ask: AskSchema,
  validateAskSchema: validateAskSchema
};
