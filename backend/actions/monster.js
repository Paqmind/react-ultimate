let indexRouter = require("./index/monster")
let addRouter = require("./add/monster")
let addOrEditRouter = require("./add-or-edit/monster")
let removeRouter = require("./remove/monster")
let randomRouter = require("./random/monster")
let detailRouter = require("./detail/monster")

module.exports = [
  indexRouter,
  addRouter,
  addOrEditRouter,
  removeRouter,
  randomRouter,
  detailRouter
]
