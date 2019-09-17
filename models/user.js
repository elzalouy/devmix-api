const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  gender: { type: ["male" || "female"], required: true },
  isAdmin: { type: Boolean },
  short_desc: { type: String, required: true, minlength: 5, maxlength: 128 },
  long_desc: { type: String, required: true, minlength: 20, maxlength: 1028 },
  cover_photo: { type: String },
  profile_photo: { type: String }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin
    },
    config.get("jwt_PK")
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
    gender: "male" || "female",
    short_desc: Joi.string()
      .min(5)
      .max(128)
      .required(),
    long_desc: Joi.string()
      .min(20)
      .max(1028)
      .required(),
    cover_photo: Joi.string(),
    profile_photo: Joi.string()
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
