import alertFetchModel from "./actions/alert-fetch-model";
import alertFetchIndex from "./actions/alert-fetch-index";

import alertLoadModel from "./actions/alert-load-model";
import alertLoadIndex from "./actions/alert-load-index";

import alertAdd from "./actions/alert-add";
import alertRemove from "./actions/alert-remove";

export default {
  alert: {
    fetchModel: alertFetchModel,
    fetchIndex: alertFetchIndex,
    loadModel: alertLoadModel,
    loadIndex: alertLoadIndex,
    add: alertAdd,
    remove: alertRemove,
  },
};