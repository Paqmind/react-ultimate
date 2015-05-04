// IMPORTS =========================================================================================
import commonValidators from "shared/validators/common";
import middlewares from "backend/middlewares";
import monstersDB from "backend/dbs/monster";
import router from "backend/routers/monster";

// ROUTES ==========================================================================================
router.delete("/:id",
  middlewares.createParseParams(commonValidators.id),
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = monstersDB[req.params.id];
    if (model) {
      delete monstersDB[req.params.id];
      return res.status(204).send(); // Status: no-content
    } else {
      return cb();
    }
  }
);