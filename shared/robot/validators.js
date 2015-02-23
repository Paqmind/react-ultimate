// IMPORTS =========================================================================================
let Joi = require("joi");

// RULES ===========================================================================================
export var model = {
  name: Joi.string().required(),
  assemblyDate: Joi.date().max("now").required(),
  manufacturer: Joi.string().required(),
};
