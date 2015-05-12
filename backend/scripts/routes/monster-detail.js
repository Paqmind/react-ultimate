// IMPORTS =========================================================================================
import commonValidators from "shared/validators/common";
import middlewares from "backend/middlewares";
import monstersDB from "backend/dbs/monster";
import router from "backend/routers/monster";

// ROUTES ==========================================================================================
router.get("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = monstersDB[req.params.id];
    if (model) {
      let response = {
        data: model,
      };
      return res.status(200).send(response); // Status: ok
    } else {
      return cb();
    }
  }
);