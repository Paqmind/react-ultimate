// IMPORTS =========================================================================================
let Joi = require("joi");

let createParseParams = require("backend/common/middlewares/parse-params");
let createParseQuery = require("backend/common/middlewares/parse-query");
let createParseBody = require("backend/common/middlewares/parse-body");

let router = require("backend/robot/common/router");
let robots = require("backend/robot/common/db");

// ROUTES ==========================================================================================
router.get("/robots/",
  createParseQuery({page: {offset: Joi.number(), limit: Joi.number()}}),
  function handler(req, res, cb) {
    let page = req.query.page || {};
    let offset = page.offset || 0;
    let limit = page.limit || 20;
    let response = {
      data: robots.toList().slice(offset, offset + limit),
      meta: {
        page: {
          offset: offset,
          limit: limit,
          total: robots.count(),
        }
      }
    };
    return res.status(200).send(response); // Status: ok
  }
);