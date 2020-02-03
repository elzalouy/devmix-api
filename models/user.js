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
  confirmed: {
    type: Boolean,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  oldPassword: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  adminAt: { type: Date },
  short_desc: { type: String, minlength: 5, maxlength: 128 },
  long_desc: { type: String, minlength: 20, maxlength: 1028 },
  profile_photo: { type: Object },
  linknedIn: { type: String },
  phone: { type: String, max: 24 },
  address: { type: String, max: 1028 },
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
      expiresIn: "24h"
    }
  );
  return token;
};
userSchema.methods.ConfirmChangingPassword = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      action: "passwordAttack"
    },
    config.get("jwt_PK"),
    { expiresIn: "24h" }
  );
  return token;
};
userSchema.methods.ResetPasswordToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, action: "reset" },
    config.get("jwt_PK"),
    { expiresIn: "24h" }
  );
  return token;
};
const User = mongoose.model("user", userSchema);

function verifyToken(token) {
  return jwt.verify(token, config.get("jwt_PK"));
}
function validateUpdate(user) {
  const schema = {
    short_desc: Joi.string()
      .min(5)
      .max(128)
      .allow(null),
    long_desc: Joi.string()
      .min(20)
      .max(1028)
      .allow(null),
    profile_photo: Joi.object().allow(null),
    linknedIn: Joi.string().allow(null, ""),
    address: Joi.string()
      .max(1028)
      .allow(null, ""),
    twitter: Joi.string().allow(null, ""),
    github: Joi.string().allow(null, ""),
    phone: Joi.string()
      .max(24)
      .allow(null, ""),
    job: Joi.string().allow(null, "")
  };
  return Joi.validate(user, schema);
}

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
    confirmed: Joi.boolean().required(),
    oldPassword: Joi.string()
      .min(5)
      .max(255),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    gender: Joi.string().required(),
    short_desc: Joi.string()
      .min(5)
      .max(128)
      .allow(null, ""),
    long_desc: Joi.string()
      .min(20)
      .max(1028)
      .allow(null, ""),
    profile_photo: Joi.object().allow(null, ""),
    linknedIn: Joi.string().allow(null, ""),
    address: Joi.string()
      .max(1028)
      .allow(null, ""),
    twitter: Joi.string().allow(null, ""),
    github: Joi.string().allow(null, ""),
    phone: Joi.string()
      .max(24)
      .allow(null, ""),
    job: Joi.string().allow(null, ""),
    isAdmin: Joi.boolean().required(),
    adminAt: Joi.date().allow(null, "")
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

function validateChangePassword(data) {
  const schema = {
    oldPassword: Joi.string()
      .min(6)
      .max(1024)
      .required(),
    newPassword: Joi.string()
      .min(6)
      .max(1024)
      .required()
  };
  return Joi.validate(data, schema);
}

function validateForgotPassword(data) {
  const schema = {
    newPassword: Joi.string()
      .min(6)
      .max(1024)
      .required(),
    token: Joi.string().required()
  };
  return Joi.validate(data, schema);
}

module.exports = {
  User,
  validateUser,
  authUser,
  validateUpdate,
  validateChangePassword,
  validateForgotPassword,
  verifyToken
};
