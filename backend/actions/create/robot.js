import {merge} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import modelValidators from "shared/validators/robot";
import makeModel from "shared/makers/robot";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.post("/",
  middlewares.createParseQuery({}),
  middlewares.createParseBody(modelValidators.model),
  function handler(req, res, cb) {
    let model = merge(req.body, makeModel());
    DB[model.id] = model;
    let response = {
      data: model,
    };
    return res.status(201).send(response); // Status: created
  }
);
