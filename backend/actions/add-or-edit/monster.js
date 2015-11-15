import Tc from "tcomb";
import Express from "express";
import {Uid} from "shared/types/common";
import {Monster} from "shared/types/monster";
import {parseAs} from "shared/parsers";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";

let router = Express.Router();

router.put("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Monster),
  function handler(req, res, cb) {
    let oldItem = DB[req.params.id];
    let newItem = parseAs(Monster, req.body);
    DB[newItem.id] = newItem;
    if (oldItem) {
      return res.status(204).send(); // Status: no-content
    } else {
      let payload = {
        data: newItem,
      };
      return res.status(201).send(payload); // Status: created
    }
  }
);

export default router;
