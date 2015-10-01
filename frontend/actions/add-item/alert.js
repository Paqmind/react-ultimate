import {assoc} from "ramda";
import UUID from "node-uuid";
import {Alert} from "shared/types/alert";
import {parseAs} from "shared/parsers";
import {ALERT} from "frontend/constants";
import state from "frontend/state";

let alertQueue$ = state.select("alertQueue");

// Object -> Maybe Alert
export default function addItem(data) {
  data = assoc("id", data.id || UUID.v4(), data);
  if (data.closable === undefined) {
    data.closable = data.category === "error" ? false : true;
  }
  if (data.expire === undefined) {
    data.expire = ALERT.expire;
  }
  let item = parseAs(data, Alert);
  alertQueue$.push(item);
  return Promise.resolve(item);
}
