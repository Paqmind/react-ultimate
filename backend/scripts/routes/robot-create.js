// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import robotValidators from "shared/validators/robot";
import makeRobot from "shared/makers/robot";
import middlewares from "backend/middlewares";
import robotsDB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.post("/",
  middlewares.createParseQuery({}),
  middlewares.createParseBody(robotValidators.model),
  function handler(req, res, cb) {
    let model = mergeDeep(makeRobot(), req.body);
    robotsDB[model.id] = model;
    let response = {
      data: model,
    }
    return res.status(201).send(response); // Status: created
  }
);