// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import {makeRobot} from "shared/makers/robot";
import commonValidators from "shared/validators/common";
import robotValidators from "shared/validators/robot";
import middlewares from "backend/middlewares";
import robotsDB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.put("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  middlewares.createParseBody(robotValidators.model),
  function handler(req, res, cb) {
    let oldModel = robotsDB[req.params.id];
    if (oldModel) {
      let newModel = mergeDeep(oldModel, req.body);
      robotsDB[newModel.id] = newModel;
      return res.status(204).send(); // Status: no-content
    } else {
      let newModel = mergeDeep(makeRobot(), req.body);
      robotsDB[newModel.id] = newModel;
      let response = {
        data: newModel,
      }
      return res.status(201).send(response); // Status: created
    }
  }
);