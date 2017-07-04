/**
 * Note: imports are statically hoisted at compile time
 * and splitted on sections only to improve readability
 * in this complex file.
 */
let {forEach} = require("ramda")
let Fs = require("fs")
let Path = require("path")
let Express = require("express")
let {MESSAGES_DIR} = require("common/constants")
require("common/shims")

function readMessages(path) {
  if (!Fs.existsSync(path) || !Fs.statSync(path).isFile()) {
    console.warn("Unable to find message file: `" + path + "`")
    return null
  }
  return JSON.parse(Fs.readFileSync(path))
}

// APP =============================================================================================
let {PUBLIC_DIR} = require("common/constants")

let app = Express()

app.set("etag", Boolean(process.env.HTTP_USE_ETAG))

// LOGGER ==========================================================================================
let logger = require("backend/logger")

// TEMPLATES =======================================================================================
let templater = require("backend/templater")
templater(app)

// MIDDLEWARES =====================================================================================
let Compression = require("compression")
let Morgan = require("morgan")
let CookieParser = require("cookie-parser")
let BodyParser = require("body-parser")

app.use(Compression())
app.use(CookieParser())
app.use(BodyParser.json())                        // parse application/json
app.use(BodyParser.urlencoded({extended: false})) // parse application/x-www-form-urlencoded

if (process.env.NODE_ENV != "testing") {
  app.use(Morgan("dev", {
    skip: function (req, res) {
      return req.originalUrl.includes("/public")
    }
  }))
}

let appRouter = require("backend/pages/app")
let alertRouters = require("backend/actions/alert")
let robotRouters = require("backend/actions/robot")
let monsterRouters = require("backend/actions/monster")

let publicRouter = Express.static("public", {etag: false})

app.use("/", appRouter)
app.use("/public", publicRouter)
forEach(router => app.use("/api/alerts/", router), alertRouters)
forEach(router => app.use("/api/robots/", router), robotRouters)
forEach(router => app.use("/api/monsters/", router), monsterRouters)

app.use((req, res, cb) => {
  res.status(404).sendFile(Path.join(PUBLIC_DIR, "errors/404.html"))
})

app.use((err, req, res, cb) => {
  logger.error(err.stack)
  res.status(err.status || 500).sendFile(Path.join(PUBLIC_DIR, "errors/500.html"))
})

module.exports = app
