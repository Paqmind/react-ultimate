let Tc = require("tcomb")
let Express = require("express")
let makeMonster = require("common/makers/monster")
let middlewares = require("backend/middlewares")

let router = Express.Router()

router.get("/random",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = makeMonster()
    let payload = {
      data: item,
    }
    return res.status(200).send(payload) // Status: ok
  }
)

module.exports = router
