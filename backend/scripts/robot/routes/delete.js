// IMPORTS =========================================================================================
let CommonValidators = require("shared/common/validators");
let RobotValidators = require("shared/robot/validators");

let createParseParams = require("backend/common/middlewares/parse-params");
let createParseQuery = require("backend/common/middlewares/parse-query");
let createParseBody = require("backend/common/middlewares/parse-body");

let router = require("backend/robot/common/router");
let robots = require("backend/robot/common/db");

// ROUTES ==========================================================================================
router.delete("/robots/:id",
  createParseParams(CommonValidators.id),
  createParseQuery({}),
  function handler(req, res, cb) {
    let robot = robots.get(req.params.id);
    if (robot) {
      robots = robots.delete(req.params.id);
      return res.status(204).send(); // Status: no-content
    } else {
      return cb();
    }
  }
);