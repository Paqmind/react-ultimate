// IMPORTS =========================================================================================
import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    name: Joi.string().required(),
    //birthDate: Joi.date().format("YYYY-MM-DD").max("now").required(),
    citizenship: Joi.string().required(),
  },
};
