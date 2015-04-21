// IMPORTS =========================================================================================
let Joi = require("joi");

// RULES ===========================================================================================
export default {
  // ID
  id: {
    id: Joi.string().guid().required()
  },

  // PAGE
  page: {
    page: {
      offset: Joi.number(),
      limit: Joi.number()
    }
  },
};