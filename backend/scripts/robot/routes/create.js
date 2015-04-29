// IMPORTS =========================================================================================
import mergeDeep from "shared/common/helpers";
import CommonValidators from "shared/common/validators";
import RobotValidators from "shared/robot/validators";
import Middlewares from "backend/common/middlewares";
import {generateRobot} from "backend/robot/common/helpers";
import robotsDB from "backend/robot/common/db";
import router from "backend/robot/common/router";

// ROUTES ==========================================================================================
router.post("/robots/",
  Middlewares.createParseQuery({}),
  Middlewares.createParseBody(RobotValidators.model),
  function handler(req, res, cb) {
    let model = mergeDeep(generateRobot(), req.body);
    robotsDB[model.id] = model;
    let response = {
      data: model,
    }
    return res.status(201).send(response); // Status: created
  }
);