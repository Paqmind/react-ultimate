import {assoc, dissoc, keys} from "ramda";
import {expect} from "chai";
import Axios from "axios";
import api from "shared/api/monster";
import {Monster} from "shared/types";
import makeMonster from "shared/makers/monster";
import {parseAs} from "shared/parsers";
import DB, {makeDB} from "backend/dbs/monster";
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

describe(api.indexUrl + " POST", function () {
  describe("valid data", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeMonster();
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
      expect(DB[id]).eql(item);
      expect(keys(DB).length).eql(total + 1);
    });

    it("should respond with 201 status", function () {
      expect(status).eql(201);
    });

    it("should respond with valid body", function () {
      expect(body).to.have.property("data");
      expect(parseAs(Monster, body.data)).eql(item);
    });
  });

  describe("invalid data (name is missed)", function () {
    let id, item, total, status, body;

    before(function () {
      resetDB();
      item = makeMonster();
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
});
