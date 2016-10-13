let Tc = require("tcomb")
let Express = require("express")
let {merge} = require("common/helpers/common")
let {Uid, Robot} = require("common/types")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/robot")

let router = Express.Router()

router.patch("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let oldItem = db[req.params.id]
    let newItem = req.body
    if (oldItem) {
      db[newItem.id] = merge(oldItem, newItem)
      return res.status(204).send() // Status: no-content
    } else {
      db[newItem.id] = newItem
      let payload = {
        data: newItem,
      }
      return res.status(201).send(payload) // Status: created
    }
  }
)

module.exports = router
