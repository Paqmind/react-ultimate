var express = require("express");

var router = express.Router();

router.get("*", function(req, res, next) {
  // Dependency hack (app must be aware of "static" and "api") :(
  if (req.path.startsWith("/static/")) {
    return next();
  } else if (req.path.startsWith("/api/")) {
    return next();
  } else {
    return res.render("app.html");
  }
});

module.exports = router;

