"use strict";

var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("home.html");
});

router.get("/palette", function(req, res) {
  res.render("palette/index.html");
});

router.get("/chartlib", function(req, res) {
  res.render("chartlib/index.html");
});

module.exports = router;
