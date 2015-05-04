// IMPORTS =========================================================================================
import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    name: Joi.string().required(),
    birthDate: Joi.date().max("now").required(),
    citizenship: Joi.string().required(),
  },
};
