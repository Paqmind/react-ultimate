// IMPORTS =========================================================================================
import {filter, keys, values} from "ramda";
import {sortByAll} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import middlewares from "backend/middlewares";
import monstersDB from "backend/dbs/monster";
import router from "backend/routers/monster";

// ROUTES ==========================================================================================
router.get("/",
  middlewares.createParseQuery(commonValidators.page),
  function handler(req, res, cb) {
    let filters = req.query.filter || {};
    let sorts = (req.query.sort || "").split(",");
    let {offset=0, limit=20} = req.query.page || {};

    let models = values(monstersDB);
    if (keys(filters).length) {
      models = filter(filters, models);
    }
    if (sorts.length) {
      models = sortByAll(sorts, models);
    }
    let total = models.length;
    models = models.slice(offset, offset + limit);

    let response = {
      data: models,
      meta: {
        page: {offset, limit, total}
      }
    };
    return res.status(200).send(response); // Status: ok
  }
);

router.get("/total",
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let filters = req.query.filter || {};

    let models = values(monstersDB);
    if (keys(filters).length) {
      models = filter(filters, models);
    }
    let total = models.length;

    let response = {
      data: total,
    };
    return res.status(200).send(response); // Status: ok
  }
);