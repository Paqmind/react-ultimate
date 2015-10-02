import {drop, indexOf} from "ramda";
import Axios from "axios";
import {AJAX} from "shared/constants";
import state from "frontend/state";

let ajaxQueue$ = state.select("ajaxQueue");

// We need to be sure that order of Backend responses is the same
// as order of Frontend requests. Otherwise data consistency will break.
// That's why each item is processed after previous one was handled
// More sophisticated techniques will require declarations of data-dependencies
// (say Relay, GraphQL) because we need to know which endpoint provides which data
// and which data requests may not block each other. We don't have this information presently.
export function processAjaxQueue() {
  let ajaxQueue = ajaxQueue$.get();
  if (ajaxQueue.length) {
    let pendingRequest = ajaxQueue[0];

    let response;
    if (indexOf(pendingRequest.verb, ["head", "get", "delete"]) >= 0) {
      response = Axios[pendingRequest.verb](pendingRequest.url, pendingRequest.config);
    } else {
      response = Axios[pendingRequest.verb](pendingRequest.url, pendingRequest.data, pendingRequest.config);
    }

    response
      .then(response => {
        ajaxQueue$.apply(data => drop(1, data));
        response.status = String(response.status);
        pendingRequest.resolve(response);
        setImmediate(processAjaxQueue);
      })
      .catch(response => {
        if (response instanceof Error) {
          throw response;
        } else {
          ajaxQueue$.apply(data => drop(1, data));
          response.status = String(response.status);
          pendingRequest.resolve(response);
          setImmediate(processAjaxQueue);
        }
      });
  } else {
    setTimeout(processAjaxQueue, AJAX.throttleTimeoutMs);
  }
}

export default {
  head: function HEAD(url, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "head", url, config, resolve, reject});
    });
  },

  get: function GET(url, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "get", url, config, resolve, reject});
    });
  },

  delete: function DELETE(url, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "delete", url, config, resolve, reject});
    });
  },

  post: function POST(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "post", url, data, config, resolve, reject});
    });
  },

  put: function PUT(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "put", url, data, config, resolve, reject});
    });
  },

  //put: function PUT(url, data={}, config={}) {
  //  return new Promise((resolve, reject) => {
  //    setTimeout(() => {
  //      ajaxQueue$.push({verb: "put", url: url + "/!!!/", data, config, resolve, reject});
  //    }, 6000);
  //  });
  //},

  patch: function PATCH(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      ajaxQueue$.push({verb: "patch", url, data, config, resolve, reject});
    });
  },
};
