// IMPORTS =========================================================================================
import Axios from "axios";
import {toObject} from "shared/helpers/common";
import Robot from "shared/models/robot";
import state from "frontend/state";
import alertActions from "frontend/actions/alert";

// ACTIONS =========================================================================================
export default function fetchModel(id) {
  console.debug(`fetchModel(${id})`);

  let cursor = state.select("robots");
  cursor.set("loading", true);

  let url = `/api/robots/${id}`;

  return Axios.get(url)
    .then(response => {
      let {data, meta} = response.data;
      let model = Robot(data);

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

        alertActions.addModel({message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error"});

        return response.status;
      }
    });
}