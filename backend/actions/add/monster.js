import Tc from "tcomb";
import Express from "express";
import {merge} from "shared/helpers/common";
import {Monster} from "shared/types";
import {parseAs} from "shared/parsers";
import makeMonster from "shared/makers/monster";
import * as middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";

let router = Express.Router();

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Monster),
  function handler(req, res, cb) {
    let item = parseAs(Monster, merge(makeMonster(), req.body));
    DB[item.id] = item;
    let payload = {
      data: item,
    };
    return res.status(201).send(payload); // Status: created
  }
);

export default router;
