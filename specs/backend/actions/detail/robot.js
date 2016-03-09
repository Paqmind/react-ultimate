import {keys} from "ramda";
import assert from "assert";
import Axios from "axios";
import api from "shared/api/robot";
import {Robot} from "shared/types";
import makeRobot from "shared/makers/robot";
import {parseAs} from "shared/parsers";
import DB, {makeDB} from "backend/dbs/robot";
import app from "backend/app";
import "backend/server";

let assertEq = assert.deepStrictEqual;

// VARS ============================================================================================
let apiHost = "http://localhost:" + process.env.HTTP_PORT;

function resetDB() {
  let newDB = makeDB();
  for (let x of keys(DB)) {
    delete DB[x];
  }
  for (let x of keys(newDB)) {
    DB[x] = newDB[x];
  }
}

// SPECS ===========================================================================================
describe(api.itemUrl + " GET", function () {
  describe("invalid id", function () {
    let id, status, body;

    before(function () {
      resetDB();
      id = makeRobot().id;

      return Axios.get(apiHost + api.itemUrl.replace(":id", id + "x"))
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should respond with 400 status", function () {
      assertEq(status, 400);
    });
  });

  describe("valid id (model does not exist)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      id = makeRobot().id;
      total = keys(DB).length;

      return Axios.get(apiHost + api.itemUrl.replace(":id", id))
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should not change DB length", function () {
      assertEq(keys(DB).length, total);
    });

    it("should respond with 404 status", function () {
      assertEq(status, 404);
    });
  });

  describe("valid id (model exists)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      id = keys(DB).pop();
      model = DB[id];
      total = keys(DB).length;

      return Axios.get(apiHost + api.itemUrl.replace(":id", id))
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should not change DB length", function () {
      assertEq(keys(DB).length, total);
    });

    it("should respond with 200 status", function () {
      assertEq(status, 200);
    });

    it("should respond with valid body", function () {
      assert(body.data);
      assertEq(parseAs(Robot, body.data), model);
    });
  });
});
