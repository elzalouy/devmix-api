const config = require("config");
const winston = require("winston");
module.exports = function() {
  //Configuration
  if (
    !config.has("jwt_PK") ||
    !config.has("connectionString") ||
    !config.has("name")
  ) {
    console.log(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
    winston.error(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
  }
};
