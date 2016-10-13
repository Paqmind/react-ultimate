let Tc = require("tcomb")
let Express = require("express")
let {merge} = require("common/helpers/common")
let {Robot} = require("common/types")
let {parseAs} = require("common/parsers")
let makeRobot = require("common/makers/robot")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/robot")

let router = Express.Router()

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let item = parseAs(Robot, merge(makeRobot(), req.body))
    db[item.id] = item
    let payload = {
      data: item,
    }
    return res.status(201).send(payload) // Status: created
  }
)

module.exports = router
