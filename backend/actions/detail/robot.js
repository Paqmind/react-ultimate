import Tc from "tcomb";
import Express from "express";
import {Uid} from "shared/types";
import * as middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";

let router = Express.Router();

router.get("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = DB[req.params.id];
    if (item) {
      let payload = {
        data: item,
      };
      return res.status(200).send(payload); // Status: ok
    } else {
      return cb();
    }
  }
);

export default router;
