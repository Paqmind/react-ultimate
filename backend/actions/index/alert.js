let {keys, values} = require("ramda")
let Tc = require("tcomb")
let Express = require("express")
let {filterByAll, sortByAll} = require("common/helpers/common")
let middlewares = require("backend/middlewares")
let {db} = require("backend/dbs/alert")

let router = Express.Router()

router.get("/",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let filters = req.query.filters
    let sorts = req.query.sorts
    let offset = req.query.offset || 0
    let limit = req.query.limit || 20

    let items = values(db)
    if (filters) {
      items = filterByAll(filters, items)
    }
    if (sorts) {
      items = sortByAll(sorts, items)
    }
    let total = items.length
    items = items.slice(offset, offset + limit)

    let payload = {
      data: items,
      meta: {
        page: {offset, limit, total}
      }
    }
    return res.status(200).send(payload) // Status: ok
  }
)

module.exports = router
