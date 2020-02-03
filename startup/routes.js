const event = require("../routes/event/event");
const user = require("../routes/user/user");
const auth = require("../routes/user/auth");
const Attendees = require("../routes/event/attendees");
const Sessions = require("../routes/event/sessions");
const JoinRequests = require("../routes/join/join");
const ContactRequest = require("../routes/contact/contact");
const Ask = require("../routes/ask/ask");
const Mail = require("../routes/mail/mail");
const config = require("config");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.get("FrontEndUrl"));
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/api/mail", Mail);
  app.use("/api/event", event);
  app.use("/api/event/sessions", Sessions);
  app.use("/api/attendees", Attendees);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/api/join", JoinRequests);
  app.use("/api/contact", ContactRequest);
  app.use("/api/ask", Ask);
};
