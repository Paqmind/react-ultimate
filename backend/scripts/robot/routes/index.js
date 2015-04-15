// IMPORTS =========================================================================================
let Joi = require("joi");
let createParseParams = require("backend/common/middlewares/parse-params");
let createParseQuery = require("backend/common/middlewares/parse-query");
let createParseBody = require("backend/common/middlewares/parse-body");
let router = require("backend/robot/router");
let robots = require("backend/robot/db");

// ROUTES ==========================================================================================
router.get("/robots/",
  createParseQuery({}),
  function handler(req, res, cb) {
    let response = {
      data: robots.toList(),
      meta: {
        page: {
          //offset: 1,
          //limit: 10,
          total: robots.count(),
        }
      }
    };
    return res.status(200).send(response); // Status: ok
  }
);