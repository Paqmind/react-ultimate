// IMPORTS =========================================================================================
import {sortBy, range} from "lodash";
import {generateRobot} from "backend/robot/common/helpers";

// PSEUDO DB =======================================================================================
// Create first robot with predefined id separately (useful for tests)
let robotHead = generateRobot({id: "7f368fc0-5754-493d-b5f6-b5729fc298f7"});
let robotTail = range(1, 42).map(generateRobot);
let robotsDB = [robotHead]
  .concat(sortBy(robotTail, model => model.name))
  .reduce((obj, model) => {
    obj[model.id] = model;
    return obj;
  }, {});

export default robotsDB;