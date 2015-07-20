import {merge} from "shared/helpers/common";
import Model from "shared/models/robot";
import makeModel from "shared/makers/robot";
import commonValidators from "shared/validators/common";
import modelValidators from "shared/validators/robot";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.patch("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  middlewares.createParseBody(modelValidators.model),
  function handler(req, res, cb) {
    let oldModel = DB[req.params.id];
    let newModel = Model(req.body);
    if (oldModel) {
      DB[newModel.id] = merge(newModel, oldModel);
      return res.status(204).send(); // Status: no-content
    } else {
      DB[newModel.id] = newModel;
      let payload = {
        data: newModel,
      };
      return res.status(201).send(payload); // Status: created
    }
  }
);
