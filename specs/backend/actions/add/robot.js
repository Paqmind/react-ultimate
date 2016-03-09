import {assoc, dissoc, keys} from "ramda";
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

describe(api.indexUrl + " POST", function () {
  describe("valid data", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeRobot();
      id = item.id;
      total = keys(DB).length;

      return Axios.post(apiHost + api.indexUrl, item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should create an item", function () {
      assertEq(DB[id], item);
      assertEq(keys(DB).length, total + 1);
    });

    it("should respond with 201 status", function () {
      assertEq(status, 201);
    });

    it("should respond with valid body", function () {
      assert(body.data);
      assertEq(parseAs(Robot, body.data), item);
    });
  });

  describe("invalid data (name is missed)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeRobot();
      id = item.id;
      total = keys(DB).length;

      item = dissoc("name", item);

      return Axios.post(apiHost + api.indexUrl, item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should not create an item", function () {
      assertEq(DB[id], undefined);
      assertEq(keys(DB).length, total);
    });

    it("should respond with 400 status", function () {
      assertEq(status, 400);
    });

    //it("body ???", function () {
    //  TODO ???
    //});
  });
});
