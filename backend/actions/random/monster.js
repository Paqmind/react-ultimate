import Tc from "tcomb";
import makeMonster from "shared/makers/monster";
import middlewares from "backend/middlewares";
import router from "backend/routers/monster";

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
