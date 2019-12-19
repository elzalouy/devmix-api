const Joi = require("joi");
const mongoose = require("mongoose");

const JoinReuest = mongoose.model(
  "joinRequest",
  new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      min: 2,
      max: 64
    },
    email: {
      type: String,
      required: true,
      unique: false
    },
    school: {
      type: String,
      required: true,
      min: 2,
      max: 1028
    },
    experience: {
      type: String,
      required: true,
      min: 2,
      max: 1028
    },
    career: {
      type: String,
      min: 3,
      max: 64
    },
    fields: {
      type: String,
      min: 3,
      max: 1028
    },
    languages: {
      type: String,
      min: 3,
      max: 1028
    },
    linkedin: {
      type: String,
      min: 3,
      max: 1028
    },
    freelanceSite: {
      type: String,
      min: 3,
      max: 1028
    },
    OrganizationField: {
      type: String,
      min: 1,
      max: 2024
    },
    fieldExperience: {
      type: String,
      min: 1,
      max: 2048
    },
    date: {
      type: String
    }
  })
);

function validateJoinRequet(request) {
  const JoinRequestJoiSchema = {
    _id: Joi.string(),
    fullName: Joi.string()
      .required()
      .min(2)
      .max(64),
    email: Joi.string()
      .email()
      .required(),
    school: Joi.string()
      .required()
      .min(2)
      .max(1028),
    experience: Joi.string()
      .required()
      .min(2)
      .max(1028),
    career: Joi.string()
      .min(3)
      .max(1028),
    fields: Joi.string()
      .min(3)
      .max(1028),
    languages: Joi.string()
      .min(3)
      .max(1028),
    linkedin: Joi.string()
      .min(3)
      .max(1028),
    freelanceSite: Joi.string()
      .min(3)
      .max(1028),
    OrganizationField: Joi.string(),
    fieldExperience: Joi.string()
      .min(3)
      .max(2048),
    date: Joi.string()
  };
  return Joi.validate(request, JoinRequestJoiSchema);
}

module.exports.validateJoinRequet = validateJoinRequet;
module.exports.JoinReuest = JoinReuest;
