let Express = require("express")

let router = Express.Router()

router.get("*", function (req, res, cb) {
  if (req.path.startsWith("/public/")) {
    return cb()
  } else if (req.path.startsWith("/api/")) {
    return cb()
  } else {
    if (process.env.NODE_ENV == "development") {
      return res.render("app-dev.html")
    } else {
      let assets = require("public/assets.json")
      return res.render("app-prod.html", {hashes: {
        bundleJs: assets.bundle[0].split("?")[1],
        vendorsJs: assets.vendors.split("?")[1],
        bundleCss: assets.bundle[1].split("?")[1],
      }})
    }
  }
})

module.exports = router
