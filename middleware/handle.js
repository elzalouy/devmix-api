const error = require("./error");
const winston = require("winston");
module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      winston.error(err.message, err);
      res.status(500).send(err.message);
    }
  };
};
