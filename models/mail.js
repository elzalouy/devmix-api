const Joi = require("joi");

function ValiadateMail(request) {
  const mailSchema = {
    email: Joi.string()
      .email()
      .required(),
    mail: Joi.string().required()
  };
  return Joi.validate(request, mailSchema);
}

function ValiadateMailList(request) {
  const mailSchema = {
    emails: Joi.array(),
    html: Joi.string().required()
  };
  return Joi.validate(request, mailSchema);
}

module.exports.ValiadateMail = ValiadateMail;
module.exports.ValiadateMailList = ValiadateMailList;
