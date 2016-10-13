let {assoc, dissoc, keys} = require("ramda")
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

describe(api.itemUrl + " PUT", function () {
  describe("valid data (item does not exist)", function () {
    let id, item, total, status, body

    before(function () {
      resetDb()
      item = makeRobot()
      id = item.id
      total = keys(db).length

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status
          body = _body
        })
    })

    it("should create an item", function () {
      assertEq(db[id], item)
      assertEq(keys(db).length, total + 1)
    })

    it("should respond with 201 status", function () {
      assertEq(status, 201)
    })

    it("should respond with valid body", function () {
      assert(body.data)
      assertEq(parseAs(Robot, body.data), item)
    })
  })

  describe("valid data (item exists)", function () {
    let id, item, total, status, body

    before(function () {
      resetDb()
      id = keys(db).pop()
      item = db[id]
      total = keys(db).length

      item = assoc("name", "foobar", item)

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status
          body = _body
        })
    })

    it("should update item", function () {
      assertEq(db[id], item)
      assertEq(keys(db).length, total)
    })

    it("should respond with 204 status", function () {
      assertEq(status, 204)
    })

    it("should respond with valid body", function () {
      assertEq(body, "")
    })
  })

  describe("invalid data (name is missed) (item does not exist)", function () {
    let id, item, total, status, body

    before(function () {
      resetDb()
      item = makeRobot()
      id = item.id
      total = keys(db).length

      item = dissoc("name", item)

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status
          body = _body
        })
    })

    it("should not create an item", function () {
      assertEq(db[id], undefined)
      assertEq(keys(db).length, total)
    })

    it("should respond with 400 status", function () {
      assertEq(status, 400)
    })

    //it("body ???", function () {
    //  TODO ???
    //})
  })

  describe("invalid id", function () {
    let id, item, status, body

    before(function () {
      resetDb()
      item = makeRobot()
      id = item.id

      return Axios.put(apiHost + api.itemUrl.replace(":id", id + "x"), item)
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
})
