import makeModel from "shared/makers/monster";
import middlewares from "backend/middlewares";
import router from "backend/routers/monster";

// ROUTES ==========================================================================================
router.get("/random",
  middlewares.createParseQuery({}),
  function handler(req, res, cb) {
    let model = makeModel();
    let payload = {
      data: model,
    };
    return res.status(200).send(payload); // Status: ok
  }
);
