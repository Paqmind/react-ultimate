import Tc from "tcomb";
import {merge} from "shared/helpers/common";
import {Robot} from "shared/types/robot";
import makeRobot from "shared/makers/robot";
import middlewares from "backend/middlewares";
import DB from "backend/dbs/robot";
import router from "backend/routers/robot";

router.post("/",
  middlewares.createParseQuery(Tc.Any),
  middlewares.createParseBody(Robot),
  function handler(req, res, cb) {
    let item = merge(req.body, makeRobot());
    DB[item.id] = item;
    let payload = {
      data: item,
    };
    return res.status(201).send(payload); // Status: created
  }
);
