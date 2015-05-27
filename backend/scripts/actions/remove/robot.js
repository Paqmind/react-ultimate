// IMPORTS =========================================================================================
import commonValidators from "shared/validators/common";
import middlewares from "backend/scripts/middlewares";
import DB from "backend/scripts/dbs/robot";
import router from "backend/scripts/routers/robot";

// ROUTES ==========================================================================================
router.delete("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = DB[req.params.id];
    if (model) {
      delete DB[req.params.id];
      return res.status(204).send(); // Status: no-content
    } else {
      return cb();
    }
  }
);
