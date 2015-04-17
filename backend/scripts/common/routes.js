// IMPORTS =========================================================================================
let router = require("backend/common/router");

// ROUTES ==========================================================================================
router.get("*", function (req, res, cb) {
  if (req.path.startsWith("/public/")) {
    return cb();
  } else if (req.path.startsWith("/api/")) {
    return cb();
  } else {
    return res.render("app.html");
  }
});
