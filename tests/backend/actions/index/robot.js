let {keys} = require("ramda")
let assert = require("assert")
let Axios = require("axios")
let {db, makeDb} = require("backend/dbs/robot")
let app = require("backend/app")
import "backend/server"

let assertEq = assert.deepStrictEqual

// VARS ============================================================================================
let apiRootURL = "http://localhost:" + process.env.HTTP_PORT + "/api"

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
describe("/api/robots GET", function () {
  let id, model, total, status, body

  before(function () {
    resetDb()
    id = keys(db).pop()
    model = db[id]
    total = keys(db).length

    return Axios.get(apiRootURL + "/robots")
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

  it("should respond with valid body", function () {
    assert(body.data)
    assert(body.data instanceof Array)
  })
})
