let indexRouter = require("./index/robot")
let addRouter = require("./add/robot")
let addOrEditRouter = require("./add-or-edit/robot")
let removeRouter = require("./remove/robot")
let randomRouter = require("./random/robot")
let detailRouter = require("./detail/robot")

module.exports = [
  indexRouter,
  addRouter,
  addOrEditRouter,
  removeRouter,
  randomRouter,
  detailRouter
]
