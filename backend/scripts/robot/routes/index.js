// IMPORTS =========================================================================================
import {filter, sortByOrder} from "lodash";
import {lodashifySorts} from "shared/common/helpers";
let CommonValidators = require("shared/common/validators");
let Middlewares = require("backend/common/middlewares");
let robotsDB = require("backend/robot/common/db");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.get("/robots/",
  Middlewares.createParseQuery(CommonValidators.page),
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

router.get("/robots/total",
  Middlewares.createParseQuery({}),
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