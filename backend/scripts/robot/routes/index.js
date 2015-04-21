// IMPORTS =========================================================================================
let CommonValidators = require("shared/common/validators");
let Middlewares = require("backend/common/middlewares");
let robotsDB = require("backend/robot/common/db");
let router = require("backend/robot/common/router");

// ROUTES ==========================================================================================
router.get("/robots/",
  Middlewares.createParseQuery(CommonValidators.page),
  function handler(req, res, cb) {
    let page = req.query.page || {};
    let offset = page.offset || 0;
    let limit = page.limit || 20;
    let robots = robotsDB.toList().slice(offset, offset + limit);
    let total = robotsDB.count();
    let response = {
      data: robots,
      meta: {
        page: {offset, limit, total}
      }
    };
    return res.status(200).send(response); // Status: ok
  }
);