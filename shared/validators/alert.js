// IMPORTS =========================================================================================
import Joi from "joi";

// RULES ===========================================================================================
export default {
  model: {
    message: Joi.string().required(),
    category: Joi.string().required(),
    // TODO improve
    //id: UUID.v4(),
    //closable: true,
    //expire: data.category == "error" ? 0 : 5000,
    //createdDate: data.createdDate ? data.createdDate : new Date()
  },
};
