// IMPORTS =========================================================================================
let Joi = require("joi");

// RULES ===========================================================================================
export var model = {
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  assemblyDate: Joi.date().max("now").required(),
  manufacturer: Joi.string().required(),
};
