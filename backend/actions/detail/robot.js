// IMPORTS =========================================================================================
import commonValidators from "shared/validators/common";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";
import router from "backend/routers/robot";

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
