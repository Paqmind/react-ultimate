// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import Model from "shared/models/monster";
import makeModel from "shared/makers/monster";
import commonValidators from "shared/validators/common";
import modelValidators from "shared/validators/monster";
import middlewares from "backend/scripts/middlewares";
import DB from "backend/scripts/dbs/monster";
import router from "backend/scripts/routers/monster";

// ROUTES ==========================================================================================
router.patch("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  middlewares.createParseBody(modelValidators.model),
  function handler(req, res, cb) {
    let oldModel = DB[req.params.id];
    let newModel = Model(req.body);
    if (oldModel) {
      DB[newModel.id] = mergeDeep(oldModel, newModel);
      return res.status(204).send(); // Status: no-content
    } else {
      DB[newModel.id] = newModel;
      let response = {
        data: newModel,
      };
      return res.status(201).send(response); // Status: created
    }
  }
);
