let Tc = require("tcomb")
let Express = require("express")
let {Uid} = require("common/types")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/monster")

let router = Express.Router()

router.get("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = db[req.params.id]
    if (item) {
      let payload = {
        data: item,
      }
      return res.status(200).send(payload) // Status: ok
    } else {
      return cb()
    }
  }
)

module.exports = router
