"use strict";

var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("home.html");
});

router.get("/designs", function(req, res) {
  res.render("designs/index.html");
});

router.get("/palettes", function(req, res) {
  res.render("palettes/index.html");
});

router.get("/charts", function(req, res) {
  res.render("charts/index.html");
});

module.exports = router;
