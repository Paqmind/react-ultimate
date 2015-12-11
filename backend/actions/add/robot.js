import Tc from "tcomb";
import Express from "express";
import {merge} from "shared/helpers/common";
import {Robot} from "shared/types";
import {parseAs} from "shared/parsers";
import makeRobot from "shared/makers/robot";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";

let router = Express.Router();

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let item = parseAs(Robot, merge(makeRobot(), req.body));
    DB[item.id] = item;
    let payload = {
      data: item,
    };
    return res.status(201).send(payload); // Status: created
  }
);

export default router;
