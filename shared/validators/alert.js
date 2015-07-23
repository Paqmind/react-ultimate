import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    //id: Joi.string().guid().required(),
    message: Joi.string().required(),
    category: Joi.string().required(),
    // TODO improve
    //closable: true,
    //expire: data.category == "error" ? 0 : 5000,
  },
};
