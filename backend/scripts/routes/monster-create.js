// IMPORTS =========================================================================================
import {merge} from "ramda";
import commonValidators from "shared/validators/common";
import monsterValidators from "shared/validators/monster";
import makeMonster from "shared/makers/monster";
import middlewares from "backend/middlewares";
import monstersDB from "backend/dbs/monster";
import router from "backend/routers/monster";

// ROUTES ==========================================================================================
router.post("/",
  middlewares.createParseQuery({}),
  middlewares.createParseBody(monsterValidators.model),
  function handler(req, res, cb) {
    let model = merge(makeMonster(), req.body);
    monstersDB[model.id] = model;
    let response = {
      data: model,
    };
    return res.status(201).send(response); // Status: created
  }
);