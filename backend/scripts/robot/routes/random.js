// IMPORTS =========================================================================================
let Middlewares = require("backend/common/middlewares");
let {generateRobot} = require("backend/robot/common/helpers");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.get("/robots/random",
  Middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let robot = Map(generateRobot());
    let response = {
      data: robot,
    }
    return res.status(200).send(response); // Status: ok
  }
);