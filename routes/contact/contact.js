const express = require("express");
const Router = express.Router();
const handle = require("../../middleware/handle");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const {
  validateContactRequest,
  ContactRequest
} = require("../../models/contact");
const validatObjeectId = require("../../middleware/validateObjectId");

Router.get(
  "/all",
  [auth, admin],
  handle(async (req, res) => {
    const all = await ContactRequest.find();
    if (!all) res.status(400).send("count of contact requests is zero.");
    res.send(all);
  })
);
Router.delete(
  "/:id",
  validatObjeectId,
  [auth, admin],
  handle(async (req, res) => {
    const contact = await ContactRequest.findByIdAndDelete(req.params.id);
    if (!contact)
      return res
        .status(400)
        .send("the contact with the given id was not found");
    res.send(contact);
  })
);
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
