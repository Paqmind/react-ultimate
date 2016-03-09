import {keys} from "ramda";
import assert from "assert";
import Axios from "axios";
import api from "shared/api/robot";
import makeRobot from "shared/makers/robot";
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
describe(api.randomUrl + " GET", function () {
  let id, total, status, body;

  before(function () {
    resetDB();
    id = makeRobot().id;
    total = keys(DB).length;

    return Axios.get(apiHost + api.randomUrl)
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
});
