import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    name: Joi.string().required(),
    //assemblyDate: Joi.date().format("YYYY-MM-DD").max("now").required(),
    manufacturer: Joi.string().required(),
    // TODO improve
    //id: UUID.v4(),
  },
};
