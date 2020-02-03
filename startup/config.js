const config = require("config");
const winston = require("winston");
module.exports = function() {
  //Configuration
  if (
    !config.has("jwt_PK") ||
    !config.has("connectionString") ||
    !config.has("name") ||
    !config.has("CLOUDINARY_URL") ||
    !config.has("Mail_UserName") ||
    !config.has("Mail_Password") ||
    !config.has("FrontEndUrl")
  ) {
    console.log(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
    winston.error(
      "FATAL ERROR: you must set the environment variables that are related to the configuration file."
    );
  }
};
