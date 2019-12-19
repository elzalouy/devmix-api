const event = require("../routes/event/event");
const user = require("../routes/user/user");
const auth = require("../routes/user/auth");
const Attendees = require("../routes/event/attendees");
const Sessions = require("../routes/event/sessions");
const JoinRequests = require("../routes/join/join");
const ContactRequest = require("../routes/contact/contact");
const Ask = require("../routes/ask/ask");
module.exports = function(app) {
  app.use("/api/event", event);
  app.use("/api/event/sessions", Sessions);
  app.use("/api/attendees", Attendees);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/api/join", JoinRequests);
  app.use("/api/contact", ContactRequest);
  app.use("/api/ask", Ask);
};
