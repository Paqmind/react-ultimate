// IMPORTS =========================================================================================
let {fromJS, OrderedMap, Map, Range, List} = require("immutable");
let {generateRobot} = require("backend/robot/helpers");

// PSEUDO DB =======================================================================================
// Create first robot with predefined id separately (useful for tests)
let firstRobot = generateRobot({id: "7f368fc0-5754-493d-b5f6-b5729fc298f7"});
let robotListHead = [[firstRobot.id, Map(firstRobot)]];
let robotList = [for (robot of Range(1, 42).map(generateRobot)) [robot.id, robot]];
let robots = OrderedMap(
  List(robotListHead).concat(
    fromJS(robotList).sortBy(pair => pair.get(1).get("name"))
  )
);

export default robots;