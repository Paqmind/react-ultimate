// IMPORTS =========================================================================================
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import Monster from "shared/models/monster";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// CURSORS =========================================================================================
let modelCursor = state.select("monsters");

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug(`fetchModel(${id})`);

  modelCursor.set("loading", true);

  return Axios.get(`/api/monsters/${id}`)
    .then(response => {
      let {data, meta} = response.data;
      let model = Monster(data);

      modelCursor.merge({
        loading: false,
        loadError: undefined
      });
      modelCursor.select("models").set(id, model);

      return response.status;
    })
    .catch(response => {
      if (response instanceof Error) {
        throw response;
      } else {
        modelCursor.merge({
          loading: false,
          loadError: {
            status: response.status,
            description: response.statusText,
            url: url
          }
        });

        // Add alert
        alertActions.addModel({message: "Action `Monster:fetchModel` failed: " + loadError.description, category: "error"});
        return response.status;
      }
    });
}
