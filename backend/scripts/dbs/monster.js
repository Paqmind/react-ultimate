// IMPORTS =========================================================================================
import {sortBy, range} from "lodash";
import makeMonster from "shared/makers/monster";

// PSEUDO DB =======================================================================================
// Create first monster with predefined id separately (useful for tests)
let monsterHead = makeMonster({id: "7f368fc0-5754-493d-b5f6-b5729fc298f7"});
let monsterTail = range(1, 42).map(makeMonster);
let monstersDB = [monsterHead]
  .concat(sortBy(monsterTail, model => model.name))
  .reduce((obj, model) => {
    obj[model.id] = model;
    return obj;
  }, {});

export default monstersDB;