let {range, reduce} = require("ramda")
let {Alert} = require("common/types")

// FAKE Db =========================================================================================
function makeDb() {
  if (process.env.NODE_ENV == "production") {
    return [
      Alert({
        message: "Note: this demo instance is resetted every 30 minutes",
        category: "info"
      })
    ]
  } else {
    return []
  }
}

exports.makeDb = makeDb
exports.db = makeDb()
