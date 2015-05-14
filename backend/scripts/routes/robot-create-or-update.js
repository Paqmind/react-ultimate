// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import * as makeModel from "shared/makers/robot";
import commonValidators from "shared/validators/common";
import * as modelValidators from "shared/validators/robot";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.put("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  middlewares.createParseBody(modelValidators.model),
  function handler(req, res, cb) {
    let oldModel = DB[req.params.id];
    if (oldModel) {
      let newModel = mergeDeep(oldModel, req.body);
      DB[newModel.id] = newModel;
      return res.status(204).send(); // Status: no-content
    } else {
      let newModel = mergeDeep(makeModel(), req.body);
      DB[newModel.id] = newModel;
      let response = {
        data: newModel,
      };
      return res.status(201).send(response); // Status: created
    }
  }
);