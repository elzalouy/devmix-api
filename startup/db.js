const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
module.exports = function() {
  //Mongo DB
  const con = config.get("connectionString");
  mongoose
    .connect(con, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => winston.info(`connected to db server ${con}`))
    .catch(ex => {
      winston.error(ex.message, ex);
    });
};
