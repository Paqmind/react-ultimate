// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import modelValidators from "shared/validators/robot";
import makeModel from "shared/makers/robot";
import middlewares from "backend/scripts/middlewares";
import DB from "backend/scripts/dbs/robot";
import router from "backend/scripts/routers/robot";

// ROUTES ==========================================================================================
router.post("/",
  middlewares.createParseQuery({}),
  middlewares.createParseBody(modelValidators.model),
  function handler(req, res, cb) {
    let model = mergeDeep(makeModel(), req.body);
    DB[model.id] = model;
    let response = {
      data: model,
    };
    return res.status(201).send(response); // Status: created
  }
);
