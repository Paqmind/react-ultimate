let Express = require("express");

let router = Express.Router();

router.get("*", function (req, res, cb) {
  if (req.path.startsWith("/static/")) {
    return cb();
  } else if (req.path.startsWith("/api/")) {
    return cb();
  } else {
    return res.render("app.html");
  }
});

export default router;

