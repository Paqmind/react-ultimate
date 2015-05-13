// IMPORTS =========================================================================================
import Joi from "joi";

// RULES ===========================================================================================
export default {
  // ID
  id: {
    id: Joi.string().guid().required()
  },

  // URL QUERY
  urlQuery: {
    filters: Joi.object(),
    sorts: Joi.array(),
    page: {
      offset: Joi.number().min(0),
      limit: Joi.number().min(1),
    }
  },
};