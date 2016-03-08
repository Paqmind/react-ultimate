import Tc from "tcomb";
import Express from "express";
import makeRobot from "shared/makers/robot";
import * as middlewares from "backend/middlewares";

let router = Express.Router();

router.get("/random",
  middlewares.createParseQuery(Tc.Any),
  function handler(req, res, cb) {
    let item = makeRobot();
    let payload = {
      data: item,
    };
    return res.status(200).send(payload); // Status: ok
  }
);

export default router;
