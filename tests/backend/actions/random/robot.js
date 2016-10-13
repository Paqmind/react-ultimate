let {keys} = require("ramda")
let assert = require("assert")
let Axios = require("axios")
let api = require("common/api/robot")
let makeRobot = require("common/makers/robot")
let {db, makeDb} = require("backend/dbs/robot")
let app = require("backend/app")
import "backend/server"

let assertEq = assert.deepStrictEqual

// VARS ============================================================================================
let apiHost = "http://localhost:" + process.env.HTTP_PORT

function resetDb() {
  let newDb = makeDb()
  for (let x of keys(db)) {
    delete db[x]
  }
  for (let x of keys(newDb)) {
    db[x] = newDb[x]
  }
}

// SPECS ===========================================================================================
describe(api.randomUrl + " GET", function () {
  let id, total, status, body

  before(function () {
    resetDb()
    id = makeRobot().id
    total = keys(db).length

    return Axios.get(apiHost + api.randomUrl)
      .then(response => [response.status, response.data])
      .catch(response => [response.status, response.data])
      .then(([_status, _body]) => {
        status = _status
        body = _body
      })
  })

  it("should not change db length", function () {
    assertEq(keys(db).length, total)
  })

  it("should respond with 200 status", function () {
    assertEq(status, 200)
  })
})
