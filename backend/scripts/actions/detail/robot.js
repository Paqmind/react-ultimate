// IMPORTS =========================================================================================
import commonValidators from "shared/validators/common";
import middlewares from "backend/scripts/middlewares";
import DB from "backend/scripts/dbs/robot";
import router from "backend/scripts/routers/robot";

// ROUTES ==========================================================================================
router.get("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = DB[req.params.id];
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
