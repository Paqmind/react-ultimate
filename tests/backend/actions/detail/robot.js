let {keys} = require("ramda")
let assert = require("assert")
let Axios = require("axios")
let api = require("common/api/robot")
let {Robot} = require("common/types")
let makeRobot = require("common/makers/robot")
let {parseAs} = require("common/parsers")
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
describe(api.itemUrl + " GET", function () {
  describe("invalid id", function () {
    let id, status, body

    before(function () {
      resetDb()
      id = makeRobot().id

      return Axios.get(apiHost + api.itemUrl.replace(":id", id + "x"))
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status
          body = _body
        })
    })

    it("should respond with 400 status", function () {
      assertEq(status, 400)
    })
  })

  describe("valid id (model does not exist)", function () {
    let id, model, total, status, body

    before(function () {
      resetDb()
      id = makeRobot().id
      total = keys(db).length

      return Axios.get(apiHost + api.itemUrl.replace(":id", id))
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

    it("should respond with 404 status", function () {
      assertEq(status, 404)
    })
  })

  describe("valid id (model exists)", function () {
    let id, model, total, status, body

    before(function () {
      resetDb()
      id = keys(db).pop()
      model = db[id]
      total = keys(db).length

      return Axios.get(apiHost + api.itemUrl.replace(":id", id))
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
      assertEq(parseAs(Robot, body.data), model)
    })
  })
})
