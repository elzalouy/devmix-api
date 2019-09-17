const mongoose = require("mongoose");
const Joi = require("joi");

const attendeesSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  event: { type: mongoose.Types.ObjectId, required: true },
  confirm: { type: Boolean, required: true }
});

const Attendees = mongoose.model("attendees", attendeesSchema);

module.exports.Attendees = Attendees;
