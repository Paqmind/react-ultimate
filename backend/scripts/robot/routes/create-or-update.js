// IMPORTS =========================================================================================
import mergeDeep from "shared/common/helpers";
let CommonValidators = require("shared/common/validators");
let RobotValidators = require("shared/robot/validators");
let Middlewares = require("backend/common/middlewares");
let {generateRobot} = require("backend/robot/common/helpers");
let robotsDB = require("backend/robot/common/db");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.put("/robots/:id",
  Middlewares.createParseParams(CommonValidators.id),
  Middlewares.createParseQuery({}),
  Middlewares.createParseBody(RobotValidators.model),
  function handler(req, res, cb) {
    let oldModel = robotsDB[req.params.id];
    if (oldModel) {
      let newModel = mergeDeep(oldModel, req.body);
      robotsDB[newModel.id] = newModel;
      return res.status(204).send(); // Status: no-content
    } else {
      let newModel = mergeDeep(generateRobot(), req.body);
      robotsDB[newModel.id] = newModel;
      let response = {
        data: newModel,
      }
      return res.status(201).send(response); // Status: created
    }
  }
);