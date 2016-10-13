let {range, reduce} = require("ramda")
let makeMonster = require("common/makers/monster")

// FAKE Db =========================================================================================
function makeDb() {
  return reduce(db => {
    let item = makeMonster()
    db[item.id] = item
    return db
  }, {}, range(0, 50))
}

exports.makeDb = makeDb
exports.db = makeDb()
