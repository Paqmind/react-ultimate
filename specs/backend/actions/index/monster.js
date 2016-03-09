import {keys} from "ramda";
import assert from "assert";
import Axios from "axios";
import DB, {makeDB} from "backend/dbs/monster";
import app from "backend/app";
import "backend/server";

let assertEq = assert.deepStrictEqual;

// VARS =================================================`===========================================
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
    assertEq(keys(DB).length, total);
  });

  it("should respond with 200 status", function () {
    assertEq(status, 200);
  });

  it("should respond with valid body", function () {
    assert(body.data);
    assert(body.data instanceof Array);
  });
});
