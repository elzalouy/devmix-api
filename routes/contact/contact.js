const express = require("express");
const Router = express.Router();
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const {
  validateContactRequest,
  ContactRequest
} = require("../../models/contact");

Router.post(
  "/request",
  handle(async (req, res) => {
    const { error } = validateContactRequest(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const contact = new ContactRequest({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      message: req.body.message
    });
    const result = await contact.save();
    res.send(result);
  })
);
module.exports = Router;
