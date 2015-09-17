import {range, reduce} from "ramda";
import makeRobot from "shared/makers/robot";

// FAKE DB =========================================================================================
export function makeDB() {
  return reduce(db => {
    let item = makeRobot();
    db[item.id] = item;
    return db;
  }, {}, range(0, 50));
}

export default makeDB();
