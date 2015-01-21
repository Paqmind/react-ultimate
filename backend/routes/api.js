var ld      = require("lodash"),
    express = require("express");

var router = express.Router();

var people = [
  {
    id: 1,
    firstName: "Henrik",
    lastName: "Joreteg",
    coolnessFactor: 11
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Saget",
    coolnessFactor: 2
  },
  {
    id: 3,
    firstName: "Larry",
    lastName: "King",
    coolnessFactor: 4
  },
  {
    id: 4,
    firstName: "Diana",
    lastName: "Ross",
    coolnessFactor: 6
  },
  {
    id: 5,
    firstName: "Crazy",
    lastName: "Dave",
    coolnessFactor: 8
  },
  {
    id: 6,
    firstName: "Larry",
    lastName: "Johannson",
    coolnessFactor: 4
  }
];

var id = 7;

/**
 * @api {get} /robots Get the list of robots
 * @apiName RobotIndex
 * @apiGroup Robot
 * @apiDescription In this case "apiUse" is defined and used.
 * @apiVersion 0.2.0
 * @apiParam (URL) {String} name New name of the user
 * @apiParam (query) {String} name New name of the user
 * @apiError NameEmptyError The name was empty. Minimum of <code>1</code> character is required.
 * @apiSuccess {String} name The robots name
 * @apiSuccess {Number} age Calculated age from Birthday
 * @apiSuccessExample Example data on success:
 * {
 *   name: "Paul",
 *   age: 27
 * }
 */
router.get("/robots", function (req, res) {
  res.send(people);
});

router.post("/robots", function (req, res) {
  var person = req.body;
  id += 1;
  person.id = id;
  people.push(person);
  res.status(201);
  res.send(person);
});

router.get("/robots/:id", function(req, res) {
  var found = ld.findWhere(people, {id: parseInt(req.params.id + "", 10)});
  res.status(found ? 200 : 404);
  res.send(found);
});

router.delete("/robots/:id", function (req, res) {
  var found = ld.findWhere(people, {id: parseInt(req.params.id + "", 10)});
  if (found) {
    people = ld.without(people, found);
  }
  res.status(found ? 200 : 404);
  res.send(found);
});

router.put("/robots/:id", function(req, res) {
  var found = ld.findWhere(people, {id: parseInt(req.params.id + "", 10)});
  if (found) {
    ld.extend(found, req.body);
  }
  res.status(found ? 200 : 404);
  res.send(found);
});

module.exports = router;
