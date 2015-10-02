import {keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import api from "shared/api/monster";
import {Monster} from "shared/types/monster";
import makeMonster from "shared/makers/monster";
import {parseAs} from "shared/parsers";
import DB, {makeDB} from "backend/dbs/monster";
import app from "backend/app";
import "backend/server";

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
      id = makeMonster().id;

      return Axios.get(apiHost + api.itemUrl.replace(":id", id + "x"))
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

  describe("valid id (model does not exist)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      id = makeMonster().id;
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
      expect(keys(DB).length).eql(total);
    });

    it("should respond with 404 status", function () {
      expect(status).eql(404);
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
      expect(keys(DB).length).eql(total);
    });

    it("should respond with 200 status", function () {
      expect(status).eql(200);
    });

    it("should respond with valid body", function () {
      expect(body).to.have.property("data");
      expect(parseAs(body.data, Monster)).eql(model);
    });
  });
});
