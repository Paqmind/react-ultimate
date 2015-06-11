// IMPORTS =========================================================================================
import {keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import Config from "config";
import makeModel from "shared/makers/monster";
import DB, {makeDB} from "backend/dbs/monster";
import app from "backend/app";
import "backend/server";

// VARS =================================================`===========================================
let apiRootURL = "http://localhost:" + Config.get("http-port") + "/api";

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
describe("/api/monsters GET", function () {
  let id, model, total, status, body;

  before(function () {
    resetDB();
    id = keys(DB).pop();
    model = DB[id];
    total = keys(DB).length;

    return Axios.get(apiRootURL + "/monsters")
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
    expect(body.data).is.instanceof(Array);
  });
});
