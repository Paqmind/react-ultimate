let {range, reduce} = require("ramda")
let makeRobot = require("common/makers/robot")

// FAKE Db =========================================================================================
function makeDb() {
  return reduce(db => {
    let item = makeRobot()
    db[item.id] = item
    return db
  }, {}, range(0, 50))
}

exports.makeDb = makeDb
exports.db = makeDb()
