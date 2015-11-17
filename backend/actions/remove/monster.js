import Tc from "tcomb";
import Express from "express";
import {Uid} from "shared/types";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";

let router = Express.Router();

router.delete("/:id",
  middlewares.createParseParams(Tc.struct({id: Uid})),
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = DB[req.params.id];
    if (item) {
      delete DB[req.params.id];
      return res.status(204).send(); // Status: no-content
    } else {
      return cb();
    }
  }
);

export default router;
