const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64
  },
  email: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 256,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean },
  short_desc: { type: String, minlength: 5, maxlength: 128 },
  long_desc: { type: String, minlength: 20, maxlength: 1028 },
  profile_photo: { type: String },
  linknedIn: { type: String },
  twitter: String,
  github: String,
  job: String
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin
    },
    config.get("jwt_PK"),
    {
      expiresIn: "48h"
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    gender: Joi.string().required(),
    short_desc: Joi.string()
      .min(5)
      .max(128),
    long_desc: Joi.string()
      .min(20)
      .max(1028),
    profile_photo: Joi.string(),
    linknedIn: Joi.string(),
    twitter: Joi.string(),
    github: Joi.string(),
    job: Joi.string()
  };
  return Joi.validate(user, schema);
}

function authUser(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required()
      .max(255),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.authUser = authUser;
