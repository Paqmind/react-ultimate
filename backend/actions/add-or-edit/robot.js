import Tc from "tcomb";
import Express from "express";
import {Uid, Robot} from "shared/types";
import {parseAs} from "shared/parsers";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";

let router = Express.Router();

router.put("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let oldItem = DB[req.params.id];
    let newItem = parseAs(Robot, req.body);
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
