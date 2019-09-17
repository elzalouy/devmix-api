const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const config = require("config");
const app = express();
const passport = require("passport");
require("./startup/prod")(app);

app.use(passport.initialize());
app.use(morgan("tiny"));
app.use(express.urlencoded());
app.use(express.json());
require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  try {
    console.log(`listening to port ${port}....`);
  } catch (ex) {
    console.log(ex.message);
    winston.error(ex.message, ex);
  }
});
module.exports = server;
