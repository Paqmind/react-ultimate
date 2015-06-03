// IMPORTS =========================================================================================
import {mergeDeep} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import modelValidators from "shared/validators/monster";
import makeModel from "shared/makers/monster";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";
import router from "backend/routers/monster";

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
