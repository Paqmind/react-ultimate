// IMPORTS =========================================================================================
let CommonValidators = require("shared/common/validators");
let Middlewares = require("backend/common/middlewares");
let robotsDB = require("backend/robot/common/db");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.delete("/robots/:id",
  Middlewares.createParseParams(CommonValidators.id),
  Middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = robotsDB[req.params.id];
    if (model) {
      delete robotsDB[req.params.id];
      return res.status(204).send(); // Status: no-content
    } else {
      return cb();
    }
  }
);