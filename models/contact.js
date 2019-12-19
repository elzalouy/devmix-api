const Joi = require("joi");
const mongoose = require("mongoose");

const ContactRequest = mongoose.model(
  "contactrequest",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 2,
      max: 128
    },
    phone: {
      type: String,
      required: true,
      min: 6,
      max: 22
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      min: 3,
      max: 1024
    }
  })
);
function validateContactRequest(request) {
  const Schema = {
    name: Joi.string()
      .required()
      .min(2)
      .max(64),
    phone: Joi.string()
      .required()
      .min(6)
      .max(22),
    email: Joi.string()
      .required()
      .email(),
    message: Joi.string()
      .required()
      .min(3)
      .max(1024)
  };
  return Joi.validate(request, Schema);
}

module.exports.validateContactRequest = validateContactRequest;
module.exports.ContactRequest = ContactRequest;
