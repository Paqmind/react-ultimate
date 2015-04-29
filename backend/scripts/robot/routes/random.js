// IMPORTS =========================================================================================
let Middlewares = require("backend/common/middlewares");
let {generateRobot} = require("backend/robot/common/helpers");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.get("/robots/random",
  Middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = generateRobot();
    let response = {
      data: model,
    }
    return res.status(200).send(response); // Status: ok
  }
);