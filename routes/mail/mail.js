const express = require("express");
const Router = express.Router();
const { transporter } = require("../../services/mail");
const config = require("config");
const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");
const handle = require("../../middleware/handle");
const { User } = require("../../models/user");
const { ValiadateMail, ValiadateMailList } = require("../../models/mail");

Router.post(
  "/",
  [auth, admin],
  handle(async (req, res) => {
    const { error } = ValiadateMail(req.body.mail);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: req.body.mail.email,
      subject: "Devmix Support",
      html: req.body.mail.mail
    });
    res.send("done");
  })
);

Router.post(
  "/list",
  [auth, admin],
  handle(async (req, res) => {
    const { ids, html } = req.body.mail;
    let emails = [];
    for (let i = 0; i < ids.length; i++) {
      let user = await User.findById(ids[i]).select("email");
      emails.push(user.email);
    }
    let mail = { emails: emails, html: req.body.mail.html };
    const { error } = ValiadateMailList(mail);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await transporter.sendMail({
      from: config.get("Mail_UserName"),
      to: mail.emails,
      subject: "Devmix Support",
      html: html
    });
    res.send("done");
  })
);

module.exports = Router;
