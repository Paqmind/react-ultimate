import {assoc, dissoc, keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import api from "shared/api/robot";
import {Robot} from "shared/types/robot";
import makeRobot from "shared/makers/robot";
import {parseAs} from "shared/parsers";
import DB, {makeDB} from "backend/dbs/robot";
import app from "backend/app";
import "backend/server";

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
      item = makeRobot();
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
      expect(DB[id]).eql(item);
      expect(keys(DB).length).eql(total + 1);
    });

    it("should respond with 201 status", function () {
      expect(status).eql(201);
    });

    it("should respond with valid body", function () {
      expect(body).to.have.property("data");
      expect(parseAs(body.data, Robot)).eql(item);
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
      expect(DB[id]).eql(item);
      expect(keys(DB).length).eql(total);
    });

    it("should respond with 204 status", function () {
      expect(status).eql(204);
    });

    it("should respond with valid body", function () {
      expect(body).eql("");
    });
  });

  describe("invalid data (name is missed) (item does not exist)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeRobot();
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
      expect(DB[id]).eql(undefined);
      expect(keys(DB).length).eql(total);
    });

    it("should respond with 400 status", function () {
      expect(status).eql(400);
    });

    //it("body ???", function () {
    //  TODO ???
    //});
  });

  describe("invalid id", function () {
    let id, item, status, body;

    before(function () {
      resetDB();
      item = makeRobot();
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
      expect(status).eql(400);
    });
  });
});
