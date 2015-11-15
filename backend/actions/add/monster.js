import Tc from "tcomb";
import {merge} from "shared/helpers/common";
import {Monster} from "shared/types/monster";
import {parseAs} from "shared/parsers";
import makeMonster from "shared/makers/monster";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";
import router from "backend/routers/monster";

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Monster),
  function handler(req, res, cb) {
    let item = parseAs(Monster, merge(req.body, makeMonster()));
    DB[item.id] = item;
    let payload = {
      data: item,
    };
    return res.status(201).send(payload); // Status: created
  }
);
