let Tc = require("tcomb")
let Express = require("express")
let {Uid} = require("common/types")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/monster")

let router = Express.Router()

router.delete("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = db[req.params.id]
    if (item) {
      delete db[req.params.id]
      return res.status(204).send() // Status: no-content
    } else {
      return cb()
    }
  }
)

module.exports = router
