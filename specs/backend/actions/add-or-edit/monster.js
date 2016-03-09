import {assoc, dissoc, keys} from "ramda";
import assert from "assert";
import Axios from "axios";
import api from "shared/api/monster";
import {Monster} from "shared/types";
import makeMonster from "shared/makers/monster";
import {parseAs} from "shared/parsers";
import DB, {makeDB} from "backend/dbs/monster";
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

describe(api.itemUrl + " PUT", function () {
  describe("valid data (item does not exist)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeMonster();
      id = item.id;
      total = keys(DB).length;

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
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
      assertEq(parseAs(Monster, body.data), item);
    });
  });

  describe("valid data (item exists)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      id = keys(DB).pop();
      item = DB[id];
      total = keys(DB).length;

      item = assoc("name", "foobar", item);

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should update item", function () {
      assertEq(DB[id], item);
      assertEq(keys(DB).length, total);
    });

    it("should respond with 204 status", function () {
      assertEq(status, 204);
    });

    it("should respond with valid body", function () {
      assertEq(body, "");
    });
  });

  describe("invalid data (name is missed) (item does not exist)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeMonster();
      id = item.id;
      total = keys(DB).length;

      item = dissoc("name", item);

      return Axios.put(apiHost + api.itemUrl.replace(":id", id), item)
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

  describe("invalid id", function () {
    let id, item, status, body;

    before(function () {
      resetDB();
      item = makeMonster();
      id = item.id;

      return Axios.put(apiHost + api.itemUrl.replace(":id", id + "x"), item)
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
});
