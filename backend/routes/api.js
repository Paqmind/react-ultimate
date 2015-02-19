// IMPORTS =========================================================================================
let Immutable = require("immutable");
let {OrderedMap, Map, Range, List} = Immutable;
let Ld = require("lodash");
let Joi = require("joi");
let Express = require("express");
let CommonHelpers = require("../../common/helpers");
let Helpers = require("../helpers");

// PSEUDO DB =======================================================================================
// Create first robot with predefined id separately (useful for tests)
let firstRobot = Helpers.generateRobot({id: "7f368fc0-5754-493d-b5f6-b5729fc298f7"});
let robotListHead = [[firstRobot.id, Map(firstRobot)]];
let robotList = [for (robot of Range(1, 10).map(Helpers.generateRobot)) [robot.id, robot]];
let robots = OrderedMap(
  List(robotListHead).concat(
    Immutable.fromJS(robotList).sortBy(pair => pair.get(1).get("name")).map(pair => pair.toArray()) // `map` is required because of bug in Immutable. Wait for solve...
  )
);

// ROUTES ==========================================================================================
let router = Express.Router();

router.param("uid", function(req, res, next, id) {
  let schema = {
    uid: Joi.string().guid()
  };
  let data = {
    uid: id
  };
  let validation = Joi.validate(data, schema);
  if (validation.error) {
    let validationMessage = Ld.map(validation.error.details.map(error => error.message)).concat(["xxx"]).join(". ");
    next("route");
  } else {
    // `req` may be mutated here (req.user = user)...
    next();
  }
});

router.get("/robots/", function(req, res) {
  res.status(200).send(robots.toList()); // Status: ok
});

router.get("/robots/count", function(req, res) {
  res.status(200).send(`${robots.size}`); // Status: ok
});

router.get("/robots/random", function(req, res) {
  let robot = Helpers.generateRobot();
  res.status(200).send(robot); // Status: ok
});

router.post("/robots/", function(req, res) {
  let robot = Map(Helpers.generateRobot());
  robot = robot.mergeDeep(req.body);
  robots = robots.set(robot.id, robot);
  res.status(201).send(robot); // Status: created
});

router.get("/robots/:uid", function(req, res, next) {
  let robot = robots.get(req.params.uid);
  if (robot) {
    res.status(200).send(robot); // Status: ok
  } else {
    next();
  }
});

router.delete("/robots/:uid", function(req, res) {
  let robot = robots.get(req.params.uid);
  if (robot) {
    robots = robots.delete(req.params.uid);
    res.status(204).send(); // Status: no-content
  } else {
    next();
  }
});

router.put("/robots/:uid", function(req, res) {
  let robot = robots.get(req.params.uid);
  if (robot) {
    robot = robot.mergeDeep(req.body);
    robots = robots.set(robot.get("id"), robot);
    res.status(204).send(); // Status: no-content
  } else {
    robot = Map(Helpers.generateRobot());
    robot = robot.mergeDeep(req.body);
    robots = robots.set(robot.id, robot);
    res.status(201).send(); // Status: created
  }
});

module.exports = router;
