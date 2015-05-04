// IMPORTS =========================================================================================
import {filter, sortByOrder} from "lodash";
import {lodashifySorts} from "shared/helpers/common";
import commonValidators from "shared/validators/common";
import middlewares from "backend/middlewares";
import robotsDB from "backend/dbs/robot";
import router from "backend/routers/robot";

// ROUTES ==========================================================================================
router.get("/",
  middlewares.createParseQuery(commonValidators.page),
  function handler(req, res, cb) {
    let filters = req.query.filter || {};
    let sorts = (req.query.sort || "").split(",");
    let {offset=0, limit=20} = req.query.page || {};

    let models = Object.values(robotsDB);
    if (Object.keys(filters).length) {
      models = filter(models, filters);
    }
    if (sorts.length) {
      models = sortByOrder(models, ...lodashifySorts(sorts));
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

    let models = Object.values(robotsDB);
    if (Object.keys(filters).length) {
      models = filter(models, filters);
    }
    let total = models.length;

    let response = {
      data: total,
    };
    return res.status(200).send(response); // Status: ok
  }
);