let Path = require("path")
let Nunjucks = require("nunjucks")
let constants = require("common/constants")

const TEMPLATE_DIR = Path.join(__dirname, "/templates")

module.exports = function (app) {
  app.set("views", TEMPLATE_DIR)
  app.set("view engine", "html")

  let env = Nunjucks.configure(TEMPLATE_DIR, {
    autoescape: true,
    express: app
  })

  env.addGlobal("String", String)
  env.addGlobal("Number", Number)
  env.addGlobal("Object", Object)
  env.addGlobal("Array", Array)
  env.addGlobal("RegExp", RegExp)
  env.addGlobal("Date", Date)

  env.addGlobal("JSON", JSON)
  env.addGlobal("Math", Math)

  env.addGlobal("constants", constants)

  return env
}
