const event = require("../routes/event/event");
const user = require("../routes/user/user");
const auth = require("../routes/user/auth");
const Attendees = require("../routes/event/attendees");
const Sessions = require("../routes/event/sessions");
const error = require("../middleware/error");
module.exports = function(app) {
  app.use("/api/events", event);
  app.use("/api/events/sessions", Sessions);
  app.use("/api/attend/", Attendees);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
};
