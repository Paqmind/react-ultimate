// IMPORTS =========================================================================================
let Ld = require("lodash");
let Express = require("express");
let CommonHelpers = require("../../common/helpers");

// EXPORTS =========================================================================================
let router = Express.Router();

let robots = Ld.range(1, 10).map(CommonHelpers.generateRobot);

router.get("/robots/", function(req, res) {
  console.log(robots);
  res.status(200);
  res.send(robots);
});

router.post("/robots/", function(req, res) {
  let robot = req.body;
  robot.id = Ld.last(robots).id + 1;
  robots.push(robot);
  res.status(201);
  res.send(robot);
});

// TODO add typecheck for :id (on express level)
router.get("/robots/:id", function(req, res) {
  var robot = Ld.findWhere(robots, {id: parseInt(req.params.id)});
  if (robot) {
    res.status(200);
    res.send(robot);
  } else {
    res.status(404);
  }
});

// TODO add typecheck for :id (on express level)
router.delete("/robots/:id", function(req, res) {
  var robot = Ld.findWhere(robots, {id: parseInt(req.params.id)});
  if (robot) {
    robots = Ld.without(robots, robot);
    res.status(200);
    res.send(robot);
  } else {
    res.status(404);
  }
});

// TODO add typecheck for :id (on express level)
router.put("/robots/:id", function(req, res) {
  var robot = Ld.findWhere(robots, {id: parseInt(req.params.id)});
  if (robot) {
    Ld.extend(robot, req.body);
    res.status(200);
    res.send(robot);
  } else {
    res.status(404);
  }
});

module.exports = router;
