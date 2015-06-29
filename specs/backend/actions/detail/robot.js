import {keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import makeModel from "shared/makers/robot";
import DB, {makeDB} from "backend/dbs/robot";
import app from "backend/app";
import "backend/server";

// VARS ============================================================================================
let apiRootURL = "http://localhost:" + process.env.HTTP_PORT + "/api";

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
describe("/api/robots/:id GET", function () {
  describe("invalid id", function () {
    let id, status, body;

    before(function () {
      resetDB();
      id = makeModel().id;

      return Axios.get(apiRootURL + "/robots/" + id + "x")
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
      id = makeModel().id;
      total = keys(DB).length;

      return Axios.get(apiRootURL + "/robots/" + id)
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

      return Axios.get(apiRootURL + "/robots/" + id)
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
      expect(body.data).eql(model);
    });
  });
});
