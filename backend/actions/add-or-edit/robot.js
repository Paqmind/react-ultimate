let Tc = require("tcomb")
let Express = require("express")
let {Uid, Robot} = require("common/types")
let {parseAs} = require("common/parsers")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/robot")

let router = Express.Router()

router.put("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let oldItem = db[req.params.id]
    let newItem = parseAs(Robot, req.body)
    db[newItem.id] = newItem
    if (oldItem) {
      return res.status(204).send() // Status: no-content
    } else {
      let payload = {
        data: newItem,
      }
      return res.status(201).send(payload) // Status: created
    }
  }
)

module.exports = router
