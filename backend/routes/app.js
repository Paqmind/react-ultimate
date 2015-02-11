var express = require("express");

var router = express.Router();

router.get("*", function(req, res, next) {
  if (req.path.startsWith("/static/")) {
    next();
  } else {
    res.render("app.html");
  }
});

module.exports = router;

