import {range, reduce} from "ramda";
import makeMonster from "shared/makers/monster";

// FAKE DB =========================================================================================
export function makeDB() {
  return reduce(db => {
    let item = makeMonster();
    db[item.id] = item;
    return db;
  }, {}, range(0, 50));
}

export default makeDB();
