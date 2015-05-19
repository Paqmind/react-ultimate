// IMPORTS =========================================================================================
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug(`fetchModel(${id})`);
  let url = `/api/monsters/${id}`;

  let cursor = state.select("monsters");
  cursor.set("loading", true);

  return Axios.get(url)
    .then(response => {
      let {data, meta} = response.data;
      let model = Monster(data);

      cursor.merge({loading: false, loadError: undefined});
      cursor.select("models").set(id, model);

      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        let loadError = {
          status: response.status,
          description: response.statusText,
          url: url
        };
        cursor.merge({loading: false, loadError});

        alertActions.addModel({message: "Action `Monster:fetchModel` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });
}