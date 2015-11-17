import Tc from "tcomb";
import Express from "express";
import {merge} from "shared/helpers/common";
import {Uid, Monster} from "shared/types";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";

let router = Express.Router();

router.patch("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Monster),
  function handler(req, res, cb) {
    let oldItem = DB[req.params.id];
    let newItem = req.body;
    if (oldItem) {
      DB[newItem.id] = merge(newItem, oldItem);
      return res.status(204).send(); // Status: no-content
    } else {
      DB[newItem.id] = newItem;
      let payload = {
        data: newItem,
      };
      return res.status(201).send(payload); // Status: created
    }
  }
);

export default router;
