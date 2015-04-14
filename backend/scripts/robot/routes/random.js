// IMPORTS =========================================================================================
let createParseParams = require("backend/common/middlewares/parse-params");
let createParseQuery = require("backend/common/middlewares/parse-query");
let createParseBody = require("backend/common/middlewares/parse-body");
let router = require("backend/robot/router");
let {generateRobot} = require("backend/robot/helpers");
let robots = require("backend/robot/db");

// ROUTES ==========================================================================================
router.get("/robots/random",
  createParseQuery({}),
  function handler(req, res, cb) {
    let robot = Map(generateRobot());
    let response = robot; // TODO data
    return res.status(200).send(response); // Status: ok
  }
);