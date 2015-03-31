// IMPORTS =========================================================================================
let Immutable = require("immutable");
let {OrderedMap, Map, Range, List} = Immutable;
let Joi = require("joi");
let Express = require("express");
let CommonValidators = require("shared/common/validators");
let RobotValidators = require("shared/robot/validators");
let Helpers = require("backend/helpers");

// PSEUDO DB =======================================================================================
// Create first robot with predefined id separately (useful for tests)
let firstRobot = Helpers.generateRobot({id: "7f368fc0-5754-493d-b5f6-b5729fc298f7"});
let robotListHead = [[firstRobot.id, Map(firstRobot)]];
let robotList = [for (robot of Range(1, 10).map(Helpers.generateRobot)) [robot.id, robot]];
let robots = OrderedMap(
  List(robotListHead).concat(
    Immutable.fromJS(robotList).sortBy(pair => pair.get(1).get("name"))
  )
);

// MIDDLEWARES =====================================================================================
function toSingleMessage(joiResult) {
  return joiResult.error.details.map(error => error.message);
}

function createParamsMiddleware(scheme, options={allowUnknown: true}) {
  if (!scheme) throw Error("`scheme` is required");
  return function paramsMiddleware(req, res, next) {
    let result = Joi.validate(req.params, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.params = result.value;
      return next();
    }
  };
}

function createQueryMiddleware(scheme, options={allowUnknown: true}) {
  if (!scheme) throw Error("`scheme` is required");
  return function queryMiddleware(req, res, next) {
    let result = Joi.validate(req.query, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.query = result.value;
      return next();
    }
  };
}

function createBodyMiddleware(scheme, options={allowUnknown: true}) {
  if (!scheme) throw Error("`scheme` is required");
  return function bodyMiddleware(req, res, next) {
    let result = Joi.validate(req.body, scheme, options);
    if (result.error) {
      return res.status(400).render("errors/400.html", {
        errors: toSingleMessage(result)
      });
    } else {
      req.body = result.value;
      return next();
    }
  };
}

// ROUTES ==========================================================================================
let router = Express.Router();

router.get("/robots/",
  createQueryMiddleware({}),
  function handler(req, res, next) {
    return res.status(200).send(robots.toList()); // Status: ok
  }
);

router.get("/robots/count",
  createQueryMiddleware({}),
  function handler(req, res, next) {
    return res.status(200).send(`${robots.size}`); // Status: ok
  }
);

router.get("/robots/random",
  createQueryMiddleware({}),
  function handler(req, res, next) {
    let robot = Helpers.generateRobot();
    return res.status(200).send(robot); // Status: ok
  }
);

router.post("/robots/",
  createQueryMiddleware({}),
  createBodyMiddleware(RobotValidators.model),
  function handler(req, res, next) {
    let data = req.body;
    let scheme = RobotValidators.model;
    let validation = Joi.validate(data, scheme);
    if (validation.error) {
      return res.status(400).render("errors/400.html", {
        message: validation.error.details.map(error => error.message).join(". ")}
      );
    } else {
      let robot = Map(Helpers.generateRobot());
      robot = robot.mergeDeep(req.body);
      robots = robots.set(robot.get("id"), robot);
      return res.status(201).send(robot); // Status: created
    }
  }
);

router.get("/robots/:id",
  createParamsMiddleware(CommonValidators.id),
  function handler(req, res, next) {
    let robot = robots.get(req.params.id);
    if (robot) {
      return res.status(200).send(robot); // Status: ok
    } else {
      return next();
    }
  }
);

router.delete("/robots/:id",
  createParamsMiddleware(CommonValidators.id),
  function handler(req, res, next) {
    let robot = robots.get(req.params.id);
    if (robot) {
      robots = robots.delete(req.params.id);
      return res.status(204).send(); // Status: no-content
    } else {
      return next();
    }
  }
);

router.put("/robots/:id",
  createParamsMiddleware(CommonValidators.id),
  createBodyMiddleware(RobotValidators.model),
  function handler(req, res, next) {
    let robot = robots.get(req.params.id);
    if (robot) {
      robot = robot.mergeDeep(req.body);
      robots = robots.set(robot.get("id"), robot);
      return res.status(204).send(); // Status: no-content
    } else {
      robot = Map(Helpers.generateRobot());
      robot = robot.mergeDeep(req.body);
      robots = robots.set(robot.get("id"), robot);
      return res.status(201).send(); // Status: created
    }
  }
);

export default router;
