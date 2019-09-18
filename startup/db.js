const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function(env) {
  //Mongo DB
  let con = "";
  if (env === "development") con = config.get("connectionString");
  if (env === "production") con = config.get("connectionString.production");
  mongoose
    .connect(con, { useNewUrlParser: true })
    .then(() => winston.info(`connected to db server ${con}`))
    .catch(ex => {
      winston.error(ex.message, ex);
    });
};
