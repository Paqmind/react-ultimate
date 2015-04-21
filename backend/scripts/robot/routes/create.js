// IMPORTS =========================================================================================
let {Map} = require("immutable");

let CommonValidators = require("shared/common/validators");
let RobotValidators = require("shared/robot/validators");
let Middlewares = require("backend/common/middlewares");
let {generateRobot} = require("backend/robot/common/helpers");
let robotsDB = require("backend/robot/common/db");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.post("/robots/",
  Middlewares.createParseQuery({}),
  Middlewares.createParseBody(RobotValidators.model),
  function handler(req, res, cb) {
    let robot = Map(generateRobot());
    robot = robot.mergeDeep(req.body);
    robotsDB.set(robot.get("id"), robot);
    let response = {
      data: robot,
    }
    return res.status(201).send(response); // Status: created
  }
);