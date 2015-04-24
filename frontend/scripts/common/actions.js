import alertAdd from "./actions/alert-add";
import alertLoadPage from "./actions/alert-load-page";
import alertLoadModel from "./actions/alert-load-model";
import alertRemove from "./actions/alert-remove";

export default {
  alert: {
    add: alertAdd,
    loadPage: alertLoadPage,
    loadModel: alertLoadModel,
    remove: alertRemove,
  },
};