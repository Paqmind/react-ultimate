import {drop, indexOf} from "ramda";
import Axios from "axios";
import {AJAX} from "frontend/constants";
import state from "frontend/state";

// CURSORS =========================================================================================
let $ajaxQueue = state.select("ajaxQueue");

// AJAX MANAGER ====================================================================================
export function handleAjaxQueue() {
  if ($ajaxQueue.get().length) {
    let pendingRequest = $ajaxQueue.get(0);

    let response;
    if (indexOf(pendingRequest.verb, ["head", "get", "delete"]) == -1) {
      response = Axios[pendingRequest.verb](pendingRequest.url, pendingRequest.data, pendingRequest.config);
    } else {
      response = Axios[pendingRequest.verb](pendingRequest.url, pendingRequest.config);
    }

    response
      .then(response => {
        $ajaxQueue.apply(data => drop(1, data));
        response.status = String(response.status);
        pendingRequest.resolve(response);
        setImmediate(handleAjaxQueue);
      })
      .catch(response => {
        if (response instanceof Error) {
          throw response;
        } else {
          $ajaxQueue.apply(data => drop(1, data));
          response.status = String(response.status);
          pendingRequest.resolve(response);
          setImmediate(handleAjaxQueue);
        }
      });
  } else {
    setTimeout(processAjaxQueue, AJAX.throttleTimeoutMs);
  }
}

export default {
  head: function HEAD(url, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "head", url, config, resolve, reject});
    });
  },

  get: function GET(url, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "get", url, config, resolve, reject});
    });
  },

  delete: function DELETE(url, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "delete", url, config, resolve, reject});
    });
  },

  post: function POST(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "post", url, data, config, resolve, reject});
    });
  },

  put: function PUT(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "put", url, data, config, resolve, reject});
    });
  },

  //put: function PUT(url, data={}, config={}) {
  //  return new Promise((resolve, reject) => {
  //    setTimeout(() => {
  //      $ajaxQueue.push({verb: "put", url: url + "/!!!/", data, config, resolve, reject});
  //    }, 6000);
  //  });
  //},

  patch: function PATCH(url, data={}, config={}) {
    return new Promise((resolve, reject) => {
      $ajaxQueue.push({verb: "patch", url, data, config, resolve, reject});
    });
  },
};
