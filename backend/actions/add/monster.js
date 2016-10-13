let Tc = require("tcomb")
let Express = require("express")
let {merge} = require("common/helpers/common")
let {Monster} = require("common/types")
let {parseAs} = require("common/parsers")
let makeMonster = require("common/makers/monster")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/monster")

let router = Express.Router()

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Monster),
  function handler(req, res, cb) {
    let item = parseAs(Monster, merge(makeMonster(), req.body))
    db[item.id] = item
    let payload = {
      data: item,
    }
    return res.status(201).send(payload) // Status: created
  }
)

module.exports = router
