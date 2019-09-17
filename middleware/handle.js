const error = require("./error");
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
