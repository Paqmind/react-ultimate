import {keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import makeRobot from "shared/makers/robot";
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
describe("/api/robots POST", function () {
  describe("valid data", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      model = makeRobot();
      id = model.id;
      total = keys(DB).length;

      return Axios.post(apiRootURL + "/robots", model)
        .then(response => [response.status, response.data])
        .catch(response => [response.status, response.data])
        .then(([_status, _body]) => {
          status = _status;
          body = _body;
        });
    });

    it("should change DB length", function () {
      expect(keys(DB).length).eql(total + 1);
    });

    it("should create a model", function () {
      expect(DB[id]).eql(model);
    });

    it("should respond with 201 status", function () {
      expect(status).eql(201);
    });

    it("should respond with valid body", function () {
      expect(body).to.have.property("data");
      expect(body.data).eql(model);
    });
  });

  describe("invalid data (name is missed)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      model = makeRobot();
      id = model.id;
      total = keys(DB).length;

      delete model.name;

      return Axios.post(apiRootURL + "/robots", model)
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

    it("should not create a model", function () {
      expect(DB[id]).eql(undefined);
    });

    it("should respond with 400 status", function () {
      expect(status).eql(400);
    });

    //it("body ???", function () {
    //  TODO ???
    //});
  });
});
