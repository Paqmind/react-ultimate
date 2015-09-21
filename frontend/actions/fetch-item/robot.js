import api from "shared/api/robot";
import {Robot} from "shared/types/robot";
import {parseAs} from "shared/parsers";
import state from "frontend/state";
import ajax from "frontend/ajax";

let $data = state.select(api.plural);
let $items = $data.select("items");

// Id -> Maybe Robot
export default function fetchItem(id) {
  console.debug(api.plural + `.fetchItem(${id})`);

  return ajax.get(api.itemUrl.replace(`:id`, id))
    .then(response => {
      if (response.status.startsWith("2")) {
        let data = response.data.data;
        let item = parseAs(data, Robot);
        $items.set(id, item);
        return item;
      } else {
        return undefined;
      }
    });
}
