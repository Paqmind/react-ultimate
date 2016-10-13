let Tc = require("tcomb")
let Express = require("express")
let makeRobot = require("common/makers/robot")
let middlewares = require("backend/middlewares")

let router = Express.Router()

router.get("/random",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = makeRobot()
    let payload = {
      data: item,
    }
    return res.status(200).send(payload) // Status: ok
  }
)

module.exports = router
