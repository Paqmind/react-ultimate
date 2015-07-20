import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    //id: Joi.string().guid().required(),
    name: Joi.string().required(),
    citizenship: Joi.string().required(),
    // TODO improve
    //birthDate: Joi.date().format("YYYY-MM-DD").max("now").required(),
  },
};
