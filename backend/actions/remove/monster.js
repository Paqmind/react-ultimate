import Tc from "tcomb";
import {Uid} from "shared/types/common";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/monster";
import router from "backend/routers/monster";

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
