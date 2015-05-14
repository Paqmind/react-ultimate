// IMPORTS =========================================================================================
import router from "backend/routers/common";

// ROUTES ==========================================================================================
router.get("*", function (req, res, cb) {
  if (req.path.startsWith("/public/")) {
    return cb();
  } else if (req.path.startsWith("/api/")) {
    return cb();
  } else {
    if (process.env.NODE_ENV == "development") {
      return res.render("app-dev.html");
    } else {
      return res.render("app-prod.html");
    }
  }
});