import Tc from "tcomb";
import Express from "express";
import {merge} from "shared/helpers/common";
import {Uid, Robot} from "shared/types";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";

let router = Express.Router();

router.patch("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let oldItem = DB[req.params.id];
    let newItem = req.body;
    if (oldItem) {
      DB[newItem.id] = merge(oldItem, newItem);
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
