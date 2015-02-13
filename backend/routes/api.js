// IMPORTS =========================================================================================
let Ld = require("lodash");
let Express = require("express");
let CommonHelpers = require("../../common/helpers");
let Helpers = require("../helpers");

// EXPORTS =========================================================================================
let router = Express.Router();

let robots = Ld.range(1, 10).map(Helpers.generateRobot);

router.get("/robots/", function(req, res) {
  res.status(200);
  res.send(robots);
});

router.get("/robots/random", function(req, res) {
  let robot = Helpers.generateRobot();
  res.status(200);
  res.send(robot);
});

router.post("/robots/", function(req, res) {
  let robot = req.body;
  robots.push(robot);
  res.status(201);
  res.send(robot);
});

// EXPORTS =========================================================================================
export function generateRobot(id) {
  // no support to pick name by gender for now in Faker :(
  return {
    id: Faker.random.uuid(),
    name: Faker.name.firstName(),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.array_element(["Russia", "USA", "China"]),
  };
}

// TODO add typecheck for :id (on express level)
router.get("/robots/:id", function(req, res) {
  var robot = Ld.findWhere(robots, {id: req.params.id});
  if (robot) {
    res.status(200);
    res.send(robot);
  } else {
    res.status(404);
  }
});

// TODO add typecheck for :id (on express level)
router.delete("/robots/:id", function(req, res) {
  var robot = Ld.findWhere(robots, {id: req.params.id});
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
  var robot = Ld.findWhere(robots, {id: req.params.id});
  if (robot) {
    Ld.extend(robot, req.body);
    res.status(200);
    res.send(robot);
  } else {
    res.status(404);
  }
});

module.exports = router;
