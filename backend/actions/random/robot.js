import Tc from "tcomb";
import makeRobot from "shared/makers/robot";
import middlewares from "backend/middlewares";
import router from "backend/routers/robot";

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
