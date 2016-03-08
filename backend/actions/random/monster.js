import Tc from "tcomb";
import Express from "express";
import makeMonster from "shared/makers/monster";
import * as middlewares from "backend/middlewares";

let router = Express.Router();

router.get("/random",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = makeMonster();
    let payload = {
      data: item,
    };
    return res.status(200).send(payload); // Status: ok
  }
);

export default router;
