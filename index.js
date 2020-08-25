const express = require("express");
const cors = require("cors");
const winston = require("winston");
const morgan = require("morgan");
const config = require("config");
const passport = require("passport");
const app = express();
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
require("./startup/config")();
require("./startup/logging")();
require("./startup/prod")(app);
require("./startup/db")();
require("./startup/routes")(app);
const FrontApp = config.get("FrontEndUrl");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  try {
    console.log(config.get("name"));
    console.log(`listenin to port ${port}`);
  } catch (ex) {
    console.log(ex.message);
    winston.error(ex.message, ex);
  }
});
module.exports = server;
