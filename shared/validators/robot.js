import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    //id: Joi.string().guid().required(),
    name: Joi.string().required(),
    manufacturer: Joi.string().required(),
    // TODO improve
    //assemblyDate: Joi.date().format("YYYY-MM-DD").max("now").required(),
  },
};
