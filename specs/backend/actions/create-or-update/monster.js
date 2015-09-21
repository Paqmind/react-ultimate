import {keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import makeMonster from "shared/makers/monster";
import DB, {makeDB} from "backend/dbs/monster";
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
describe("/api/monsters/:id PUT", function () {
  describe("invalid id", function () {
    let id, model, status, body;

    before(function () {
      resetDB();
      model = makeMonster();
      id = model.id;

      return Axios.put(apiRootURL + "/monsters/" + id + "x", model)
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

  describe("valid data (model does not exist)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      model = makeMonster();
      id = model.id;
      total = keys(DB).length;

      return Axios.put(apiRootURL + "/monsters/" + id, model)
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

  describe("valid data (model exists)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      id = keys(DB).pop();
      model = DB[id];
      total = keys(DB).length;

      model.name = "foobar";

      return Axios.put(apiRootURL + "/monsters/" + id, model)
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

    it("should update model", function () {
      expect(DB[id]).eql(model);
    });

    it("should respond with 204 status", function () {
      expect(status).eql(204);
    });

    it("should respond with valid body", function () {
      expect(body).eql("");
    });
  });

  describe("invalid data (name is missed) (model does not exist)", function () {
    let id, model, total, status, body;

    before(function () {
      resetDB();
      model = makeMonster();
      id = model.id;
      total = keys(DB).length;

      delete model.name;

      return Axios.put(apiRootURL + "/monsters/" + id, model)
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
