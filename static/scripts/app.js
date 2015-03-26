(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var HistoryLocation = ReactRouter.HistoryLocation;

// Shims, polyfills
var Shims = require("./shims");

// Init stores
var RobotStore = require("frontend/robot/stores");
var AlertStore = require("frontend/alert/stores");

// Common
var Body = require("frontend/common/components/body");
var Home = require("frontend/common/components/home");
var About = require("frontend/common/components/about");
var NotFound = require("frontend/common/components/notfound");

// Alert
var loadManyAlerts = require("frontend/alert/actions/loadmany");

// Robot
var loadManyRobots = require("frontend/robot/actions/loadmany");
var RobotIndex = require("frontend/robot/components/index");
var RobotAdd = require("frontend/robot/components/add");
var RobotDetail = require("frontend/robot/components/detail");
var RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
var routes = React.createElement(
  Route,
  { handler: Body, path: "/" },
  React.createElement(DefaultRoute, { name: "home", handler: Home }),
  React.createElement(Route, { name: "robot-index", handler: RobotIndex }),
  React.createElement(Route, { name: "robot-add", path: "add", handler: RobotAdd }),
  React.createElement(Route, { name: "robot-detail", path: ":id", handler: RobotDetail }),
  React.createElement(Route, { name: "robot-edit", path: ":id/edit", handler: RobotEdit }),
  React.createElement(Route, { name: "about", path: "/about", handler: About }),
  React.createElement(NotFoundRoute, { handler: NotFound })
);

window.router = ReactRouter.create({
  routes: routes,
  location: HistoryLocation
});

window.router.run(function (Handler, state) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  React.render(React.createElement(Handler, null), document.body);
});

loadManyAlerts();
loadManyRobots();

},{"./shims":2,"frontend/alert/actions/loadmany":4,"frontend/alert/stores":9,"frontend/common/components/about":10,"frontend/common/components/body":11,"frontend/common/components/home":12,"frontend/common/components/notfound":14,"frontend/robot/actions/loadmany":18,"frontend/robot/components/add":20,"frontend/robot/components/detail":21,"frontend/robot/components/edit":22,"frontend/robot/components/index":23,"frontend/robot/stores":26,"react":"react","react-router":"react-router"}],2:[function(require,module,exports){
"use strict";

var Inspect = require("util-inspect");
require("object.assign").shim();

Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)["catch"](function (e) {
    setTimeout(function () {
      throw e;
    }, 1);
  });
};

window.console.echo = function log() {
  console.log.apply(console, Array.prototype.slice.call(arguments).map(function (v) {
    return Inspect(v);
  }));
};

},{"object.assign":"object.assign","util-inspect":"util-inspect"}],3:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = add;
// IMPORTS =========================================================================================
var State = require("frontend/state");
var Alert = require("frontend/alert/models");
function add(model) {
  var newModel = Alert(model);
  var id = newModel.id;

  // Nonpersistent add
  State.select("alerts", "models").set(id, newModel);
}

},{"frontend/alert/models":8,"frontend/state":28}],4:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = loadMany;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var Router = require("frontend/router");
var State = require("frontend/state");
function loadMany() {
  State.select("alerts").edit({ loaded: true, loadError: undefined, models: {} });
  return {};
  // TODO: backend
  //return Axios.get(`/api/alerts/`)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("alerts").edit({loaded: true, loadError: undefined, models: models});
  //    State.select("alerts").edit({loaded: true, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = response.status.toString();
  //      State.select("alerts").set("loaded", true);
  //      State.select("alerts").set("loadError", loadError);
  //      return loadError;
  //    }
  //  });
}

},{"axios":"axios","frontend/common/helpers":15,"frontend/router":27,"frontend/state":28}],5:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = remove;
// IMPORTS =========================================================================================
var State = require("frontend/state");
function remove(id) {
  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}

},{"frontend/state":28}],6:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");

var CSSTransitionGroup = require("react/addons").addons.CSSTransitionGroup;

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var AlertItem = require("frontend/alert/components/item");

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "index",

  mixins: [State.mixin],

  cursors: {
    alerts: ["alerts"] },

  render: function render() {
    var _state$cursors$alerts = this.state.cursors.alerts;
    var models = _state$cursors$alerts.models;
    var loaded = _state$cursors$alerts.loaded;
    var loadError = _state$cursors$alerts.loadError;

    models = toArray(models);

    if (!loaded) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(
        "div",
        { className: "notifications top-left" },
        React.createElement(
          CSSTransitionGroup,
          { transitionName: "fade", component: "div" },
          models.map(function (model) {
            return React.createElement(AlertItem, { model: model, key: model.id });
          })
        )
      );
    }
  }
});

},{"frontend/alert/components/item":7,"frontend/common/components/loading":13,"frontend/common/components/notfound":14,"frontend/common/helpers":15,"frontend/state":28,"react":"react","react/addons":"react/addons"}],7:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// IMPORTS =========================================================================================
var classNames = require("classnames");
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var removeAlert = require("frontend/alert/actions/remove");

// EXPORTS =========================================================================================
var Expire = React.createClass({
  displayName: "Expire",

  propTypes: {
    delay: React.PropTypes.number },

  getDefaultProps: function getDefaultProps() {
    return {
      delay: 500 };
  },

  componentDidMount: function componentDidMount() {
    this.startTimer();
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // Reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.startTimer();
    }
  },

  startTimer: function startTimer() {
    var _this = this;

    var model = this.props.model;

    // Clear existing timer
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
    }

    // Hide after `model.delay` ms
    if (this.props.delay !== undefined) {
      this._timer = setTimeout(function () {
        if (_this.props.onExpire !== undefined) {
          _this.props.onExpire();
        }
        delete _this._timer;
      }, this.props.delay);
    }
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      this.props.children
    );
  } });

var CloseLink = React.createClass({
  displayName: "CloseLink",

  handleClick: function handleClick(event) {
    event.preventDefault();
    this.props.onClick();
  },

  render: function render() {
    return React.createElement(
      "a",
      { className: "close pull-right", href: "#", onClick: this.handleClick },
      "×"
    );
  }
});

var Item = React.createClass({
  displayName: "Item",

  propTypes: {
    model: React.PropTypes.object },

  render: function render() {
    var model = this.props.model;

    var classes = classNames(_defineProperty({
      alert: true }, "alert-" + model.category, true));

    var result = React.createElement(
      "div",
      _extends({ className: classes }, this.props),
      model.closable ? React.createElement(CloseLink, { onClick: removeAlert.bind(this, model.id) }) : "",
      model.message
    );

    if (model.expire) {
      result = React.createElement(
        Expire,
        { onExpire: removeAlert.bind(this, model.id), delay: model.expire },
        result
      );
    }

    return result;
  } });

module.exports = Item;

/*
Notification.prototype.show = function () {
  if(this.options.fadeOut.enabled)
    this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(onClose, this));

  this.$element.append(this.$note);
  this.$note.alert();
};

Notification.prototype.hide = function () {
  if(this.options.fadeOut.enabled)
    this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(onClose, this));
  else onClose.call(this);
};

$.fn.notify = function (options) {
  return new Notification(this, options);
};
*/

// TODO check this https://github.com/goodybag/bootstrap-notify/tree/master/css/styles

//onExpire: React.PropTypes.function,

//onExpire: undefined,

},{"classnames":"classnames","frontend/alert/actions/remove":5,"react":"react","react-router":"react-router"}],8:[function(require,module,exports){
"use strict";

// MODELS ==========================================================================================
module.exports = Alert;
// IMPORTS =========================================================================================
var UUID = require("node-uuid");
function Alert(data) {
  if (!data.message) {
    throw Error("`data.message` is required");
  }
  if (!data.category) {
    throw Error("`data.category` is required");
  }
  return Object.assign({
    id: UUID.v4(),
    closable: true,
    expire: 5000 }, data);
}

},{"node-uuid":"node-uuid"}],9:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================

var _require = require("immutable");

var List = _require.List;
var Map = _require.Map;
var OrderedMap = _require.OrderedMap;

var ReactRouter = require("react-router");

// EXPORTS =========================================================================================
/*
let AlertStore = Reflux.createStore({
  getInitialState() {
    return OrderedMap();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.resetState();
  },

  resetState() {
    this.setState(this.getInitialState());
  },

  setState(state) {
    if (state === undefined) {
      throw Error("`state` is required");
    } else {
      this.state = state;
      this.shareState();
    }
  },

  shareState() {
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
  normalize(message, category) {
    if (isString(model)) {
      model = {
        message: model,
        category
      }
    }
    return Object.assign({}, model, {id: UUID.v4()});
  },

  add(model) {
    model = model.merge({id: UUID.v4()});
    this.setState(this.state.set(model.id, model));
  },

  remove(index) {
    if (index === undefined || index === null) {
      throw Error("`index` is required");
    } else {
      this.setState(this.state.delete(index));
    }
  },

  pop() {
    this.setState(this.state.pop());
  }
});

export default AlertStore;
*/

},{"immutable":"immutable","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
var About = React.createClass({
  displayName: "About",

  render: function render() {
    return React.createElement(
      DocumentTitle,
      { title: "About" },
      React.createElement(
        "section",
        { className: "container page info" },
        React.createElement(
          "h1",
          null,
          "Simple Page Example"
        ),
        React.createElement(
          "p",
          null,
          "This page was rendered by a JavaScript"
        )
      )
    );
  }
});

module.exports = About;

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],11:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var AlertIndex = require("frontend/alert/components/index");

// EXPORTS =========================================================================================
var Body = React.createClass({
  displayName: "Body",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "header",
        { id: "page-header", className: "navbar navbar-default navbar-fixed-top navbar-down" },
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "navbar-header" },
            React.createElement(
              "button",
              { className: "navbar-toggle collapsed", type: "button", "data-toggle": "collapse", "data-target": ".navbar-page-header" },
              React.createElement(
                "span",
                { className: "sr-only" },
                "Toggle navigation"
              ),
              React.createElement("span", { className: "fa fa-bars fa-lg" })
            ),
            React.createElement(
              Link,
              { className: "navbar-brand", to: "home" },
              React.createElement(
                "span",
                { className: "light" },
                "React"
              ),
              "Starter"
            )
          ),
          React.createElement(
            "nav",
            { className: "collapse navbar-collapse navbar-page-header navbar-right brackets-effect" },
            React.createElement(
              "ul",
              { className: "nav navbar-nav" },
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "home" },
                  "Home"
                )
              ),
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "robot-index" },
                  "Robots"
                )
              ),
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "about" },
                  "About"
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "main",
        { id: "page-main" },
        React.createElement(RouteHandler, null)
      ),
      React.createElement(AlertIndex, null)
    );
  }
});

module.exports = Body;

},{"frontend/alert/components/index":6,"react":"react","react-router":"react-router"}],12:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
var Home = React.createClass({
  displayName: "Home",

  render: function render() {
    return React.createElement(
      DocumentTitle,
      { title: "React Starter" },
      React.createElement(
        "section",
        { className: "container page home" },
        React.createElement(
          "h1",
          null,
          "React starter app"
        ),
        React.createElement(
          "p",
          null,
          "Proof of concepts, CRUD, whatever..."
        ),
        React.createElement(
          "p",
          null,
          "Proudly build on ES6 with the help of ",
          React.createElement(
            "a",
            { href: "https://babeljs.io/" },
            "Babel"
          ),
          " transpiler."
        ),
        React.createElement(
          "h3",
          null,
          "Frontend"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://facebook.github.io/react/" },
              "React"
            ),
            " declarative UI"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/Yomguithereal/baobab" },
              "Baobab"
            ),
            " JS data tree with cursors"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/rackt/react-router" },
              "React-Router"
            ),
            " declarative routes"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/gaearon/react-document-title" },
              "React-Document-Title"
            ),
            " declarative document titles"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://react-bootstrap.github.io/" },
              "React-Bootstrap"
            ),
            " Bootstrap components in React"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://browserify.org/" },
              "Browserify"
            ),
            " & ",
            React.createElement(
              "a",
              { href: "https://github.com/substack/watchify" },
              "Watchify"
            ),
            " bundle NPM modules to frontend"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://bower.io/" },
              "Bower"
            ),
            " frontend package manager"
          )
        ),
        React.createElement(
          "h3",
          null,
          "Backend"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://expressjs.com/" },
              "Express"
            ),
            " web-app backend framework"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://mozilla.github.io/nunjucks/" },
              "Nunjucks"
            ),
            " template engine"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/eleith/emailjs" },
              "EmailJS"
            ),
            " SMTP client"
          )
        ),
        React.createElement(
          "h3",
          null,
          "Common"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://babeljs.io/" },
              "Babel"
            ),
            " JS transpiler"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://gulpjs.com/" },
              "Gulp"
            ),
            " streaming build system"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://lodash.com/" },
              "Lodash"
            ),
            " utility library"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://socket.io/" },
              "SocketIO"
            ),
            " real-time engine"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/mzabriskie/axios" },
              "Axios"
            ),
            " promise-based HTTP client"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/facebook/immutable-js" },
              "Immutable"
            ),
            " persistent immutable data for JS"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/hapijs/joi" },
              "Joi"
            ),
            " object schema validation"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://momentjs.com/" },
              "Moment"
            ),
            " date-time stuff"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "https://github.com/marak/Faker.js/" },
              "Faker"
            ),
            " fake data generation"
          )
        ),
        React.createElement(
          "h3",
          null,
          "VCS"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "http://git-scm.com/" },
              "Git"
            ),
            " version control system"
          )
        )
      )
    );
  }
});

module.exports = Home;

/*
* TODO
*
* babelify?
* chai?
* classnames?
* config?
* clientconfig?
* helmet?
* huskyv
* mocha?
* morgan?
* winston?
* yargs?
* */

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],13:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
var Loading = React.createClass({
  displayName: "Loading",

  render: function render() {
    var sizeClass = this.props.size ? " loading-" + this.props.size : "";
    return React.createElement(
      DocumentTitle,
      { title: "Loading..." },
      React.createElement(
        "div",
        { className: "loading" + sizeClass },
        React.createElement("i", { className: "fa fa-cog fa-spin" })
      )
    );
  }
});

module.exports = Loading;

},{"react":"react","react-document-title":"react-document-title"}],14:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
var NotFound = React.createClass({
  displayName: "NotFound",

  render: function render() {
    return React.createElement(
      DocumentTitle,
      { title: "Not Found" },
      React.createElement(
        "section",
        { className: "container page" },
        React.createElement(
          "h1",
          null,
          "Page not Found"
        ),
        React.createElement(
          "p",
          null,
          "Something is wrong"
        )
      )
    );
  }
});

module.exports = NotFound;

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],15:[function(require,module,exports){
"use strict";

// HELPERS =========================================================================================
exports.toObject = toObject;
exports.toArray = toArray;
// IMPORTS =========================================================================================
var sortBy = require("lodash.sortby");
var isArray = require("lodash.isarray");
var isPlainObject = require("lodash.isplainobject");
function toObject(array) {
  if (isArray(array)) {
    return array.reduce(function (object, item) {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error("expected type is Array, get " + typeof array);
  }
}

function toArray(object) {
  if (isPlainObject(object)) {
    return sortBy(Object.keys(object).map(function (key) {
      return object[key];
    }), function (item) {
      return item.id;
    });
  } else {
    throw Error("expected type is Object, get " + typeof object);
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],16:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = add;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
var Robot = require("frontend/robot/models");
function add(model) {
  var newModel = Robot(model);
  var id = newModel.id;

  // Optimistic add
  State.select("robots", "models").set(id, newModel);

  return Axios.put("/api/robots/" + id, newModel).then(function (response) {
    var status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Robot added.", category: "success" });
    return status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var _status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").unset(id); // Cancel add
      return _status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  State.select("robots", "models").set(id, newModel);
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").unset(id); // Cancel add
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":25,"frontend/router":27,"frontend/state":28}],17:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = edit;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
var Robot = require("frontend/robot/models");
function edit(model) {
  var newModel = Robot(model);
  var id = newModel.id;
  var oldModel = State.select("robots", "models", id);

  // Optimistic edit
  State.select("robots", "models").set(id, newModel);

  return Axios.put("/api/robots/" + id, newModel).then(function (response) {
    var status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Robot edited.", category: "success" });
    return status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var _status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").set(id, oldModel); // Cancel edit
      return _status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
  State.select("robots", "models").set(id, newModel);
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel edit
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":25,"frontend/router":27,"frontend/state":28}],18:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = loadMany;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var Router = require("frontend/router");
var Alert = require("frontend/alert/models");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
function loadMany() {
  return Axios.get("/api/robots/").then(function (response) {
    var models = toObject(response.data);
    State.select("robots").edit({ loaded: true, loadError: undefined, models: models });
    State.select("robots").edit({ loaded: true, loadError: undefined, models: models });
    return models;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var loadError = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", loadError);
      return loadError;
    }
  });
}

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/alert/models":8,"frontend/common/helpers":15,"frontend/router":27,"frontend/state":28}],19:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = remove;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var Alert = require("frontend/alert/models");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
function remove(id) {
  var oldModel = State.select("robots", "models", id);

  // Optimistic remove
  State.select("robots", "models").unset(id);

  return Axios["delete"]("/api/robots/" + id).then(function (response) {
    var status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    Router.transitionTo("robot-index");
    addAlert(Alert({ message: "Robot removed.", category: "success" }));
    return status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var _status = response.status.toString();
      State.select("robots").set("loaded", true);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").set(id, oldModel); // Cancel remove
      return _status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  State.select("robots", "models").unset(id);
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel remove
    return status;
  } // else
    let status = response.status.toString();
    State.select("robots").set("loaded", true);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/alert/models":8,"frontend/router":27,"frontend/state":28}],20:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var result = require("lodash.result");
var isArray = require("lodash.isarray");
var isPlainObject = require("lodash.isplainobject");
var isEmpty = require("lodash.isempty");
var merge = require("lodash.merge");
var debounce = require("lodash.debounce");
var flatten = require("lodash.flatten");
var Class = require("classnames");
var Joi = require("joi");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");

var _require = require("react-bootstrap");

var Alert = _require.Alert;
var Input = _require.Input;
var Button = _require.Button;

var Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var addRobot = require("frontend/robot/actions/add");

// HELPERS =========================================================================================
function flattenAndResetTo(obj, to, path) {
  path = path || "";
  return Object.keys(obj).reduce(function (memo, key) {
    if (isPlainObject(obj[key])) {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key + "."));
    } else {
      memo[path + key] = to;
    }
    return memo;
  }, {});
}

function validate(joiSchema, data, key) {
  joiSchema = joiSchema || {};
  data = data || {};
  var joiOptions = {
    abortEarly: false,
    allowUnknown: true };
  var errors = formatErrors(Joi.validate(data, joiSchema, joiOptions));
  if (key === undefined) {
    return Object.assign(flattenAndResetTo(joiSchema, []), errors);
  } else {
    var _result = {};
    _result[key] = errors[key] || [];
    return _result;
  }
}

function formatErrors(joiResult) {
  if (joiResult.error !== null) {
    return joiResult.error.details.reduce(function (memo, detail) {
      if (!Array.isArray(memo[detail.path])) {
        memo[detail.path] = [];
      }
      memo[detail.path].push(detail.message);
      return memo;
    }, {});
  } else {
    return {};
  }
}

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "add",

  mixins: [ReactRouter.State, State.mixin],

  cursors: function cursors() {
    return {
      robots: ["robots"] };
  },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var loaded = _state$cursors$robots.loaded;
    var loadError = _state$cursors$robots.loadError;

    return React.createElement(Form, { models: models, loaded: loaded, loadError: loadError });
  }
});

var Form = React.createClass({
  displayName: "Form",

  getInitialState: function getInitialState() {
    return {
      model: {
        name: undefined,
        assemblyDate: undefined,
        manufacturer: undefined } };
  },

  validatorTypes: function validatorTypes() {
    return Validators.model;
  },

  validatorData: function validatorData() {
    return this.state.model;
  },

  validate: (function (_validate) {
    var _validateWrapper = function validate(_x) {
      return _validate.apply(this, arguments);
    };

    _validateWrapper.toString = function () {
      return _validate.toString();
    };

    return _validateWrapper;
  })(function (key) {
    var _this = this;

    var schema = result(this, "validatorTypes") || {};
    var data = result(this, "validatorData") || this.state;
    var nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
      return isArray(b) ? b : undefined;
    });
    return new Promise(function (resolve, reject) {
      _this.setState({
        errors: nextErrors
      }, function () {
        return resolve(_this.isValid(key));
      });
    });
  }),

  handleChangeFor: function handleChangeFor(key) {
    return (function handleChange(event) {
      event.persist();
      var model = this.state.model;
      model[key] = event.currentTarget.value;
      this.setState({ model: model });
      this.validateDebounced(key);
    }).bind(this);
  },

  validateDebounced: debounce(function validateDebounced(key) {
    return this.validate(key);
  }, 500),

  handleReset: function handleReset(event) {
    event.preventDefault();
    event.persist();
    this.setState({
      model: Object.assign({}, this.getInitialState().model) });
  },

  handleSubmit: function handleSubmit(event) {
    var _this = this;

    event.preventDefault();
    event.persist();
    this.validate().then(function (isValid) {
      if (isValid) {
        // TODO replace with React.findDOMNode at #0.13.0
        addRobot({
          name: _this.refs.name.getDOMNode().value,
          assemblyDate: _this.refs.assemblyDate.getDOMNode().value,
          manufacturer: _this.refs.manufacturer.getDOMNode().value });
      } else {
        alert("Can't submit form with errors");
      }
    });
  },

  getValidationMessages: function getValidationMessages(key) {
    var errors = this.state.errors || {};
    if (isEmpty(errors)) {
      return [];
    } else {
      if (key === undefined) {
        return flatten(Object.keys(errors).map(function (error) {
          return errors[error] || [];
        }));
      } else {
        return errors[key] || [];
      }
    }
  },

  isValid: function isValid(key) {
    return isEmpty(this.getValidationMessages(key));
  },

  render: function render() {
    var _props = this.props;
    var models = _props.models;
    var loaded = _props.loaded;
    var loadError = _props.loadError;

    var model = this.state.model;

    if (!loaded) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(
        DocumentTitle,
        { title: "Add Robot" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { id: "page-actions" },
            React.createElement(
              "div",
              { className: "container" },
              React.createElement(
                "div",
                { className: "btn-group btn-group-sm pull-left" },
                React.createElement(
                  Link,
                  { to: "robot-index", className: "btn btn-gray-light", title: "Back to list" },
                  React.createElement("span", { className: "fa fa-arrow-left" }),
                  React.createElement(
                    "span",
                    { className: "hidden-xs margin-left-sm" },
                    "Back to list"
                  )
                )
              )
            )
          ),
          React.createElement(
            "section",
            { className: "container margin-top-lg" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-9" },
                React.createElement(
                  "h1",
                  { className: "nomargin-top" },
                  "Add Robot"
                ),
                React.createElement(
                  "form",
                  { onSubmit: this.handleSubmit },
                  React.createElement(
                    "fieldset",
                    null,
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().name._flags.presence == "required",
                          error: !this.isValid("name") }) },
                      React.createElement(
                        "label",
                        { htmlFor: "name" },
                        "Name"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "name"), onChange: this.handleChangeFor("name"), className: "form-control", id: "name", ref: "name", value: model.name }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("name") }) },
                        this.getValidationMessages("name").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().assemblyDate._flags.presence == "required",
                          error: !this.isValid("assemblyDate")
                        }) },
                      React.createElement(
                        "label",
                        { htmlFor: "assemblyDate" },
                        "Assembly Date"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "assemblyDate"), onChange: this.handleChangeFor("assemblyDate"), className: "form-control", id: "assemblyDate", ref: "assemblyDate", value: model.assemblyDate }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("assemblyDate") }) },
                        this.getValidationMessages("assemblyDate").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().manufacturer._flags.presence == "required",
                          error: !this.isValid("manufacturer")
                        }) },
                      React.createElement(
                        "label",
                        { htmlFor: "manufacturer" },
                        "Manufacturer"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "manufacturer"), onChange: this.handleChangeFor("manufacturer"), className: "form-control", id: "manufacturer", ref: "manufacturer", value: model.manufacturer }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("manufacturer") }) },
                        this.getValidationMessages("manufacturer").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "btn-group" },
                    React.createElement(
                      "button",
                      { className: "btn btn-default", type: "button", onClick: this.handleReset },
                      "Reset"
                    ),
                    React.createElement(
                      "button",
                      { className: "btn btn-primary", disabled: !this.isValid(), type: "submit" },
                      "Submit"
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }
});

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/

},{"classnames":"classnames","frontend/common/components/loading":13,"frontend/common/components/notfound":14,"frontend/robot/actions/add":16,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],21:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var removeRobot = require("frontend/robot/actions/remove");

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "detail",

  mixins: [ReactRouter.State, State.mixin],

  cursors: function cursors() {
    return {
      robots: ["robots"],
      model: ["robots", "models", this.getParams().id] };
  },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var loaded = _state$cursors$robots.loaded;
    var loadError = _state$cursors$robots.loadError;

    var model = this.state.cursors.model;

    if (!loaded) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(
        DocumentTitle,
        { title: "Detail " + model.name },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { id: "page-actions" },
            React.createElement(
              "div",
              { className: "container" },
              React.createElement(
                "div",
                { className: "btn-group btn-group-sm pull-left" },
                React.createElement(
                  Link,
                  { to: "robot-index", className: "btn btn-gray-light", title: "Back to list" },
                  React.createElement("span", { className: "fa fa-arrow-left" }),
                  React.createElement(
                    "span",
                    { className: "hidden-xs margin-left-sm" },
                    "Back to list"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "btn-group btn-group-sm pull-right" },
                React.createElement(
                  Link,
                  { to: "robot-edit", params: { id: model.id }, className: "btn btn-orange", title: "Edit" },
                  React.createElement("span", { className: "fa fa-edit" })
                ),
                React.createElement(
                  "a",
                  { className: "btn btn-red", title: "Remove", onClick: removeRobot.bind(this, model.id) },
                  React.createElement("span", { className: "fa fa-times" })
                )
              )
            )
          ),
          React.createElement(
            "section",
            { className: "container margin-top-lg" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-3" },
                React.createElement(
                  "div",
                  { className: "thumbnail thumbnail-robot" },
                  React.createElement("img", { src: "http://robohash.org/" + model.id + "?size=200x200", width: "200px", height: "200px" })
                )
              ),
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-9" },
                React.createElement(
                  "h1",
                  { className: "nomargin-top" },
                  model.name
                ),
                React.createElement(
                  "dl",
                  null,
                  React.createElement(
                    "dt",
                    null,
                    "Serial Number"
                  ),
                  React.createElement(
                    "dd",
                    null,
                    model.id
                  ),
                  React.createElement(
                    "dt",
                    null,
                    "Assembly Date"
                  ),
                  React.createElement(
                    "dd",
                    null,
                    model.assemblyDate
                  ),
                  React.createElement(
                    "dt",
                    null,
                    "Manufacturer"
                  ),
                  React.createElement(
                    "dd",
                    null,
                    model.manufacturer
                  )
                )
              )
            )
          )
        )
      );
    }
  } });

},{"frontend/common/components/loading":13,"frontend/common/components/notfound":14,"frontend/robot/actions/remove":19,"frontend/state":28,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],22:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var result = require("lodash.result");
var isArray = require("lodash.isarray");
var isPlainObject = require("lodash.isplainobject");
var isEmpty = require("lodash.isempty");
var merge = require("lodash.merge");
var debounce = require("lodash.debounce");
var flatten = require("lodash.flatten");
var Class = require("classnames");
var Joi = require("joi");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");

var _require = require("react-bootstrap");

var Alert = _require.Alert;
var Input = _require.Input;
var Button = _require.Button;

var Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var editRobot = require("frontend/robot/actions/edit");
var removeRobot = require("frontend/robot/actions/remove");

// HELPERS =========================================================================================
function flattenAndResetTo(obj, to, path) {
  path = path || "";
  return Object.keys(obj).reduce(function (memo, key) {
    if (isPlainObject(obj[key])) {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key + "."));
    } else {
      memo[path + key] = to;
    }
    return memo;
  }, {});
}

function validate(joiSchema, data, key) {
  joiSchema = joiSchema || {};
  data = data || {};
  var joiOptions = {
    abortEarly: false,
    allowUnknown: true };
  var errors = formatErrors(Joi.validate(data, joiSchema, joiOptions));
  if (key === undefined) {
    return Object.assign(flattenAndResetTo(joiSchema, []), errors);
  } else {
    var _result = {};
    _result[key] = errors[key] || [];
    return _result;
  }
}

function formatErrors(joiResult) {
  if (joiResult.error !== null) {
    return joiResult.error.details.reduce(function (memo, detail) {
      if (!Array.isArray(memo[detail.path])) {
        memo[detail.path] = [];
      }
      memo[detail.path].push(detail.message);
      return memo;
    }, {});
  } else {
    return {};
  }
}

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "edit",

  mixins: [ReactRouter.State, State.mixin],

  cursors: function cursors() {
    return {
      robots: ["robots"],
      loadModel: ["robots", "models", this.getParams().id] };
  },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var loaded = _state$cursors$robots.loaded;
    var loadError = _state$cursors$robots.loadError;

    var loadModel = this.state.cursors.loadModel;
    return React.createElement(Form, { models: models, loaded: loaded, loadError: loadError, loadModel: loadModel });
  }
});

var Form = React.createClass({
  displayName: "Form",

  getInitialState: function getInitialState() {
    return {
      model: Object.assign({}, this.props.loadModel) };
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (isEmpty(this.state.model)) {
      this.setState({
        model: Object.assign({}, props.loadModel) });
    }
  },

  validatorTypes: function validatorTypes() {
    return Validators.model;
  },

  validatorData: function validatorData() {
    return this.state.model;
  },

  validate: (function (_validate) {
    var _validateWrapper = function validate(_x) {
      return _validate.apply(this, arguments);
    };

    _validateWrapper.toString = function () {
      return _validate.toString();
    };

    return _validateWrapper;
  })(function (key) {
    var _this = this;

    var schema = result(this, "validatorTypes") || {};
    var data = result(this, "validatorData") || this.state;
    var nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
      return isArray(b) ? b : undefined;
    });
    return new Promise(function (resolve, reject) {
      _this.setState({
        errors: nextErrors
      }, function () {
        return resolve(_this.isValid(key));
      });
    });
  }),

  handleChangeFor: function handleChangeFor(key) {
    return (function handleChange(event) {
      event.persist();
      var model = this.state.model;
      model[key] = event.currentTarget.value;
      this.setState({ model: model });
      this.validateDebounced(key);
    }).bind(this);
  },

  validateDebounced: debounce(function validateDebounced(key) {
    return this.validate(key);
  }, 500),

  handleReset: function handleReset(event) {
    event.preventDefault();
    event.persist();
    this.setState({
      model: Object.assign({}, this.props.loadModel) }, this.validate);
  },

  handleSubmit: function handleSubmit(event) {
    var _this = this;

    event.preventDefault();
    event.persist();
    this.validate().then(function (isValid) {
      if (isValid) {
        // TODO replace with React.findDOMNode at #0.13.0
        editRobot({
          id: _this.state.model.id,
          name: _this.refs.name.getDOMNode().value,
          assemblyDate: _this.refs.assemblyDate.getDOMNode().value,
          manufacturer: _this.refs.manufacturer.getDOMNode().value });
      } else {
        alert("Can't submit form with errors");
      }
    });
  },

  getValidationMessages: function getValidationMessages(key) {
    var errors = this.state.errors || {};
    if (isEmpty(errors)) {
      return [];
    } else {
      if (key === undefined) {
        return flatten(Object.keys(errors).map(function (error) {
          return errors[error] || [];
        }));
      } else {
        return errors[key] || [];
      }
    }
  },

  isValid: function isValid(key) {
    return isEmpty(this.getValidationMessages(key));
  },

  render: function render() {
    var _props = this.props;
    var models = _props.models;
    var loaded = _props.loaded;
    var loadError = _props.loadError;
    var loadModel = _props.loadModel;

    var model = this.state.model;

    if (!loaded) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(
        DocumentTitle,
        { title: "Edit " + model.name },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { id: "page-actions" },
            React.createElement(
              "div",
              { className: "container" },
              React.createElement(
                "div",
                { className: "btn-group btn-group-sm pull-left" },
                React.createElement(
                  Link,
                  { to: "robot-index", className: "btn btn-gray-light", title: "Back to list" },
                  React.createElement("span", { className: "fa fa-arrow-left" }),
                  React.createElement(
                    "span",
                    { className: "hidden-xs margin-left-sm" },
                    "Back to list"
                  )
                )
              ),
              React.createElement(
                "div",
                { className: "btn-group btn-group-sm pull-right" },
                React.createElement(
                  Link,
                  { to: "robot-detail", params: { id: model.id }, className: "btn btn-blue", title: "Detail" },
                  React.createElement("span", { className: "fa fa-eye" })
                ),
                React.createElement(
                  "a",
                  { className: "btn btn-red", title: "Remove", onClick: removeRobot.bind(this, model.id) },
                  React.createElement("span", { className: "fa fa-times" })
                )
              )
            )
          ),
          React.createElement(
            "section",
            { className: "container margin-top-lg" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-3" },
                React.createElement(
                  "div",
                  { className: "thumbnail thumbnail-robot" },
                  React.createElement("img", { src: "http://robohash.org/" + model.id + "?size=200x200", width: "200px", height: "200px" })
                )
              ),
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-9" },
                React.createElement(
                  "h1",
                  { className: "nomargin-top" },
                  model.name
                ),
                React.createElement(
                  "form",
                  { onSubmit: this.handleSubmit },
                  React.createElement(
                    "fieldset",
                    null,
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().name._flags.presence == "required",
                          error: !this.isValid("name") }) },
                      React.createElement(
                        "label",
                        { htmlFor: "name" },
                        "Name"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "name"), onChange: this.handleChangeFor("name"), className: "form-control", id: "name", ref: "name", value: model.name }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("name") }) },
                        this.getValidationMessages("name").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().assemblyDate._flags.presence == "required",
                          error: !this.isValid("assemblyDate")
                        }) },
                      React.createElement(
                        "label",
                        { htmlFor: "assemblyDate" },
                        "Assembly Date"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "assemblyDate"), onChange: this.handleChangeFor("assemblyDate"), className: "form-control", id: "assemblyDate", ref: "assemblyDate", value: model.assemblyDate }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("assemblyDate") }) },
                        this.getValidationMessages("assemblyDate").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: Class({
                          "form-group": true,
                          required: this.validatorTypes().manufacturer._flags.presence == "required",
                          error: !this.isValid("manufacturer")
                        }) },
                      React.createElement(
                        "label",
                        { htmlFor: "manufacturer" },
                        "Manufacturer"
                      ),
                      React.createElement("input", { type: "text", onBlur: this.validate.bind(this, "manufacturer"), onChange: this.handleChangeFor("manufacturer"), className: "form-control", id: "manufacturer", ref: "manufacturer", value: model.manufacturer }),
                      React.createElement(
                        "div",
                        { className: Class({
                            help: true,
                            error: !this.isValid("manufacturer") }) },
                        this.getValidationMessages("manufacturer").map(function (message) {
                          return React.createElement(
                            "span",
                            { key: "" },
                            message
                          );
                        })
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "btn-group" },
                    React.createElement(
                      "button",
                      { className: "btn btn-default", type: "button", onClick: this.handleReset },
                      "Reset"
                    ),
                    React.createElement(
                      "button",
                      { className: "btn btn-primary", disabled: !this.isValid(), type: "submit" },
                      "Submit"
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }
});

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/

},{"classnames":"classnames","frontend/common/components/loading":13,"frontend/common/components/notfound":14,"frontend/robot/actions/edit":17,"frontend/robot/actions/remove":19,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],23:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var RobotItem = require("frontend/robot/components/item");

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "index",

  mixins: [State.mixin],

  cursors: {
    robots: ["robots"] },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var loaded = _state$cursors$robots.loaded;
    var loadError = _state$cursors$robots.loadError;

    models = toArray(models);

    if (!loaded) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(
        DocumentTitle,
        { title: "Robots" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { id: "page-actions" },
            React.createElement(
              "div",
              { className: "container" },
              React.createElement(
                "div",
                { className: "pull-right" },
                React.createElement(
                  Link,
                  { to: "robot-add", className: "btn btn-sm btn-green", title: "Add" },
                  React.createElement("span", { className: "fa fa-plus" })
                )
              )
            )
          ),
          React.createElement(
            "section",
            { className: "container" },
            React.createElement(
              "h1",
              null,
              "Robots"
            ),
            React.createElement(
              "div",
              { className: "row" },
              models.map(function (model) {
                return React.createElement(RobotItem, { model: model, key: model.id });
              })
            )
          )
        )
      );
    }
  } });

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/

},{"frontend/common/components/loading":13,"frontend/common/components/notfound":14,"frontend/common/helpers":15,"frontend/robot/components/item":24,"frontend/state":28,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],24:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var removeRobot = require("frontend/robot/actions/remove");

// COMPONENTS ======================================================================================
module.exports = React.createClass({
  displayName: "item",

  propTypes: {
    model: React.PropTypes.object },

  render: function render() {
    var model = this.props.model;
    return React.createElement(
      "div",
      { key: model.id, className: "col-sm-6 col-md-3" },
      React.createElement(
        "div",
        { className: "panel panel-default", key: model.id },
        React.createElement(
          "div",
          { className: "panel-heading" },
          React.createElement(
            "h4",
            { className: "panel-title" },
            React.createElement(
              Link,
              { to: "robot-detail", params: { id: model.id } },
              model.name
            )
          )
        ),
        React.createElement(
          "div",
          { className: "panel-body text-center nopadding" },
          React.createElement(
            Link,
            { to: "robot-detail", params: { id: model.id } },
            React.createElement("img", { src: "http://robohash.org/" + model.id + "?size=200x200", width: "200px", height: "200px" })
          )
        ),
        React.createElement(
          "div",
          { className: "panel-footer" },
          React.createElement(
            "div",
            { className: "clearfix" },
            React.createElement(
              "div",
              { className: "btn-group btn-group-sm pull-right" },
              React.createElement(
                Link,
                { to: "robot-detail", params: { id: model.id }, className: "btn btn-blue", title: "Detail" },
                React.createElement("span", { className: "fa fa-eye" })
              ),
              React.createElement(
                Link,
                { to: "robot-edit", params: { id: model.id }, className: "btn btn-orange", title: "Edit" },
                React.createElement("span", { className: "fa fa-edit" })
              ),
              React.createElement(
                "a",
                { className: "btn btn-red", title: "Remove", onClick: removeRobot.bind(this, model.id) },
                React.createElement("span", { className: "fa fa-times" })
              )
            )
          )
        )
      )
    );
  } });

},{"frontend/robot/actions/remove":19,"react":"react","react-router":"react-router"}],25:[function(require,module,exports){
"use strict";

// MODELS ==========================================================================================
module.exports = Alert;
// IMPORTS =========================================================================================
var UUID = require("node-uuid");
function Alert(data) {
  return Object.assign({
    id: UUID.v4(),
    message: undefined,
    category: undefined,
    closable: true,
    expire: 5000 }, data);
}

},{"node-uuid":"node-uuid"}],26:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Axios = require("axios");
var ReactRouter = require("react-router");

// EXPORTS =========================================================================================
/*
let RobotStore = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [RobotActions],

  getInitialState() {
    return OrderedMap();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init() {
    this.resetState();
  },

  resetState() {
    this.setState(this.getInitialState());
  },

  setState(state) {
    if (state === undefined) {
      throw Error("`state` is required");
    } else {
      this.state = state;
      this.shareState();
    }
  },

  shareState() {
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
  loadMany() {
    // TODO check local storage
    if (this.indexLoaded) {
      this.shareState();
    } else {
      this.stopListeningTo(RobotActions.loadMany);
      RobotActions.loadMany.promise(Axios.get('/api/robots/'));
    }
  },

  loadManyFailed(res) {
    //console.echo("RobotStore.loadManyFailed", res);
    this.resetState();
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadManyCompleted(res) {
    //console.echo("RobotStore.loadManyCompleted", res);
    let models = List(res.data);
    this.setState(OrderedMap([for (model of models) [model.id, Map(model)]]));
    this.indexLoaded = true;
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadOne(id) {
    // TODO check local storage?!
    this.stopListeningTo(RobotActions.loadOne);
    if (this.state.has(id)) {
      this.shareState();
    } else {
      // TODO check local storage?!
      Axios.get(`/api/robots/${id}`)
        .catch(res => RobotActions.loadOne.failed(res, id))
        .then(res => RobotActions.loadOne.completed(res, id));
    }
  },

  loadOneFailed(res, id) {
    //console.echo("RobotStore.loadManyFailed", res, id);
    this.setState(this.state.set(id, "Not Found"));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  loadOneCompleted(res, id) {
    //console.echo("RobotStore.loadOneCompleted", id);
    let model = Map(res.data);
    this.setState(this.state.set(id, model));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  add(model) {
    RobotActions.add.promise(Axios.post(`/api/robots/`, model.toJS()));
  },

  addFailed(res) {
    //console.echo("RobotStore.addFailed", res);
  },

  addCompleted(res) {
    // TODO update local storage?!
    //console.echo("RobotStore.addCompleted", res);
    let model = Map(res.data);
    this.setState(this.state.set(model.get("id"), model));
  },

  edit(model) {
    // TODO update local storage?!
    let id = model.get("id");
    let oldModel = this.state.get(id);
    this.setState(this.state.set(id, model));
    Axios.put(`/api/robots/${id}`, model.toJS())
      .catch(res => RobotActions.edit.failed(res, id, oldModel))
      .done(res => RobotActions.edit.completed(res, id, oldModel));
  },

  editFailed(res, id, oldModel) {
    //console.echo("RobotStore.editFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  editCompleted(res, id, oldModel) {
    //console.echo("RobotStore.editCompleted", res);
  },

  remove(id) {
    // TODO update local storage?!
    let oldModel = this.state.get(id);
    this.setState(this.state.delete(id));
    Axios.delete(`/api/robots/${id}`)
      .catch(res => RobotActions.remove.failed(res, id, oldModel))
      .done(res => RobotActions.remove.completed(res, id, oldModel));
  },

  removeFailed(res, id, oldModel) {
    //console.echo("RobotStore.removeFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  removeCompleted(res, id, oldModel) {
    //console.echo("RobotStore.removeCompleted", res);
  },
});

export default RobotStore;
*/

},{"axios":"axios","react-router":"react-router"}],27:[function(require,module,exports){
"use strict";

// PROXY ROUTER TO SOLVE CIRCULAR DEPENDENCY =======================================================
var proxy = {
  makePath: function makePath(to, params, query) {
    return window.router.makePath(to, params, query);
  },

  makeHref: function makeHref(to, params, query) {
    return window.router.makeHref(to, params, query);
  },

  transitionTo: function transitionTo(to, params, query) {
    window.router.transitionTo(to, params, query);
  },

  replaceWith: function replaceWith(to, params, query) {
    window.router.replaceWith(to, params, query);
  },

  goBack: function goBack() {
    window.router.goBack();
  },

  run: function run(render) {
    window.router.run(render);
  }
};

module.exports = proxy;

},{}],28:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Baobab = require("baobab");

// STATE ===========================================================================================
module.exports = new Baobab({
  robots: {
    models: {},
    loaded: false,
    loadError: undefined },
  alerts: {
    models: {},
    loaded: false,
    loadError: null } });

},{"baobab":"baobab"}],29:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Joi = require("joi");

// RULES ===========================================================================================
var model = exports.model = {
  name: Joi.string().required(),
  assemblyDate: Joi.date().max("now").required(),
  manufacturer: Joi.string().required() };
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"joi":"joi"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImZyb250ZW5kL2FwcC9hcHAuanMiLCJmcm9udGVuZC9hcHAvc2hpbXMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvc3RvcmVzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWRtYW55LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3Qvc3RvcmVzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvcm9ib3QvdmFsaWRhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckMsS0FBSyxHQUFrRCxXQUFXLENBQWxFLEtBQUs7SUFBRSxZQUFZLEdBQW9DLFdBQVcsQ0FBM0QsWUFBWTtJQUFFLGFBQWEsR0FBcUIsV0FBVyxDQUE3QyxhQUFhO0lBQUUsZUFBZSxHQUFJLFdBQVcsQ0FBOUIsZUFBZTs7O0FBR3hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBRy9CLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2xELElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxD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Q2pCLE1BQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0FBQzdCLGNBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUM5QyxjQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUN0QyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gU2hpbXMsIHBvbHlmaWxsc1xubGV0IFNoaW1zID0gcmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIEluaXQgc3RvcmVzXG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5sZXQgQWxlcnRTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9zdG9yZXNcIik7XG5cbi8vIENvbW1vblxubGV0IEJvZHkgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keVwiKTtcbmxldCBIb21lID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWVcIik7XG5sZXQgQWJvdXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXRcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5cbi8vIEFsZXJ0XG5sZXQgbG9hZE1hbnlBbGVydHMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueVwiKTtcblxuLy8gUm9ib3RcbmxldCBsb2FkTWFueVJvYm90cyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWRtYW55XCIpO1xubGV0IFJvYm90SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleFwiKTtcbmxldCBSb2JvdEFkZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiKTtcbmxldCBSb2JvdERldGFpbCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbFwiKTtcbmxldCBSb2JvdEVkaXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0XCIpO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcm91dGVzID0gKFxuICA8Um91dGUgaGFuZGxlcj17Qm9keX0gcGF0aD1cIi9cIj5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJob21lXCIgaGFuZGxlcj17SG9tZX0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1hZGRcIiBwYXRoPVwiYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZWRpdFwiIHBhdGg9XCI6aWQvZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwiYWJvdXRcIiBwYXRoPVwiL2Fib3V0XCIgaGFuZGxlcj17QWJvdXR9Lz5cbiAgICA8Tm90Rm91bmRSb3V0ZSBoYW5kbGVyPXtOb3RGb3VuZH0vPlxuICA8L1JvdXRlPlxuKTtcblxud2luZG93LnJvdXRlciA9IFJlYWN0Um91dGVyLmNyZWF0ZSh7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93LnJvdXRlci5ydW4oKEhhbmRsZXIsIHN0YXRlKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuXG5sb2FkTWFueUFsZXJ0cygpO1xubG9hZE1hbnlSb2JvdHMoKTsiLCJsZXQgSW5zcGVjdCA9IHJlcXVpcmUoXCJ1dGlsLWluc3BlY3RcIik7XG5yZXF1aXJlKFwib2JqZWN0LmFzc2lnblwiKS5zaGltKCk7XG5cblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB0aGlzXG4gICAgLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGU7IH0sIDEpO1xuICAgIH0pO1xufTtcblxud2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBJbnNwZWN0KHYpKSk7XG59OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuXG4gIC8vIE5vbnBlcnNpc3RlbnQgYWRkXG4gIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCB7dG9PYmplY3R9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNYW55KCkge1xuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGVkOiB0cnVlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiB7fX0pO1xuICByZXR1cm4ge307XG4gIC8vIFRPRE86IGJhY2tlbmRcbiAgLy9yZXR1cm4gQXhpb3MuZ2V0KGAvYXBpL2FsZXJ0cy9gKVxuICAvLyAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAvLyAgICBsZXQgbW9kZWxzID0gdG9PYmplY3QocmVzcG9uc2UuZGF0YSk7XG4gIC8vICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkZWQ6IHRydWUsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IG1vZGVsc30pO1xuICAvLyAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGVkOiB0cnVlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgLy8gICAgcmV0dXJuIG1vZGVscztcbiAgLy8gIH0pXG4gIC8vICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAvLyAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAvLyAgICAgIHRocm93IHJlc3BvbnNlO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGxldCBsb2FkRXJyb3IgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgLy8gICAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuc2V0KFwibG9hZGVkXCIsIHRydWUpO1xuICAvLyAgICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgLy8gICAgICByZXR1cm4gbG9hZEVycm9yO1xuICAvLyAgICB9XG4gIC8vICB9KTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICAvLyBOb24tcGVyc2lzdGVudCByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0NTU1RyYW5zaXRpb25Hcm91cH0gPSByZXF1aXJlKFwicmVhY3QvYWRkb25zXCIpLmFkZG9ucztcbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IEFsZXJ0SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICBhbGVydHM6IFtcImFsZXJ0c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRlZCwgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5hbGVydHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9ucyB0b3AtbGVmdFwiPlxuICAgICAgICAgIDxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4gICAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAgPC9DU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGNsYXNzTmFtZXMgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHJlbW92ZUFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRXhwaXJlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBkZWxheTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAvL29uRXhwaXJlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY3Rpb24sXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWxheTogNTAwLFxuICAgICAgLy9vbkV4cGlyZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBSZXNldCB0aGUgdGltZXIgaWYgY2hpbGRyZW4gYXJlIGNoYW5nZWRcbiAgICBpZiAobmV4dFByb3BzLmNoaWxkcmVuICE9PSB0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRUaW1lcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgLy8gQ2xlYXIgZXhpc3RpbmcgdGltZXJcbiAgICBpZiAodGhpcy5fdGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFmdGVyIGBtb2RlbC5kZWxheWAgbXNcbiAgICBpZiAodGhpcy5wcm9wcy5kZWxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGlyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGlyZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgICAgIH0sIHRoaXMucHJvcHMuZGVsYXkpO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuICB9LFxufSk7XG5cbmxldCBDbG9zZUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImNsb3NlIHB1bGwtcmlnaHRcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PiZ0aW1lczs8L2E+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGxldCBjbGFzc2VzID0gY2xhc3NOYW1lcyh7XG4gICAgICBcImFsZXJ0XCI6IHRydWUsXG4gICAgICBbXCJhbGVydC1cIiArIG1vZGVsLmNhdGVnb3J5XTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bW9kZWwuY2xvc2FibGUgPyA8Q2xvc2VMaW5rIG9uQ2xpY2s9e3JlbW92ZUFsZXJ0LmJpbmQodGhpcywgbW9kZWwuaWQpfS8+IDogXCJcIn1cbiAgICAgICAge21vZGVsLm1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgaWYgKG1vZGVsLmV4cGlyZSkge1xuICAgICAgcmVzdWx0ID0gPEV4cGlyZSBvbkV4cGlyZT17cmVtb3ZlQWxlcnQuYmluZCh0aGlzLCBtb2RlbC5pZCl9IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB7TGlzdCwgTWFwLCBPcmRlcmVkTWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVhY3RSb3V0ZXI9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qXG5sZXQgQWxlcnRTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gT3JkZXJlZE1hcCgpO1xuICB9LFxuXG4gIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGF0IG1peGluIGxldmVsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGluaXQoKSB7XG4gICAgdGhpcy5yZXNldFN0YXRlKCk7XG4gIH0sXG5cbiAgcmVzZXRTdGF0ZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICB9LFxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiYHN0YXRlYCBpcyByZXF1aXJlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgdGhpcy5zaGFyZVN0YXRlKCk7XG4gICAgfVxuICB9LFxuXG4gIHNoYXJlU3RhdGUoKSB7XG4gICAgdGhpcy50cmlnZ2VyKHRoaXMuc3RhdGUpO1xuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBub3JtYWxpemUobWVzc2FnZSwgY2F0ZWdvcnkpIHtcbiAgICBpZiAoaXNTdHJpbmcobW9kZWwpKSB7XG4gICAgICBtb2RlbCA9IHtcbiAgICAgICAgbWVzc2FnZTogbW9kZWwsXG4gICAgICAgIGNhdGVnb3J5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBtb2RlbCwge2lkOiBVVUlELnY0KCl9KTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBtb2RlbCA9IG1vZGVsLm1lcmdlKHtpZDogVVVJRC52NCgpfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5pZCwgbW9kZWwpKTtcbiAgfSxcblxuICByZW1vdmUoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCB8fCBpbmRleCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgaW5kZXhgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGluZGV4KSk7XG4gICAgfVxuICB9LFxuXG4gIHBvcCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUucG9wKCkpO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnRTdG9yZTtcbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFib3V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBYm91dDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIG5hdmJhci1kb3duXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiPlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgPEFsZXJ0SW5kZXgvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEJvZHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYlwiPkJhb2JhYjwvYT4gSlMgZGF0YSB0cmVlIHdpdGggY3Vyc29yczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXJcIj5SZWFjdC1Sb3V0ZXI8L2E+IGRlY2xhcmF0aXZlIHJvdXRlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlYWN0LWRvY3VtZW50LXRpdGxlXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+IGRlY2xhcmF0aXZlIGRvY3VtZW50IHRpdGxlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL1wiPlJlYWN0LUJvb3RzdHJhcDwvYT4gQm9vdHN0cmFwIGNvbXBvbmVudHMgaW4gUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYnJvd3NlcmlmeS5vcmcvXCI+QnJvd3NlcmlmeTwvYT4gJmFtcDsgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay93YXRjaGlmeVwiPldhdGNoaWZ5PC9hPiBidW5kbGUgTlBNIG1vZHVsZXMgdG8gZnJvbnRlbmQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYm93ZXIuaW8vXCI+Qm93ZXI8L2E+IGZyb250ZW5kIHBhY2thZ2UgbWFuYWdlcjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9leHByZXNzanMuY29tL1wiPkV4cHJlc3M8L2E+IHdlYi1hcHAgYmFja2VuZCBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW96aWxsYS5naXRodWIuaW8vbnVuanVja3MvXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9lbGVpdGgvZW1haWxqc1wiPkVtYWlsSlM8L2E+IFNNVFAgY2xpZW50PC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IEpTIHRyYW5zcGlsZXI8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ3VscGpzLmNvbS9cIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9sb2Rhc2guY29tL1wiPkxvZGFzaDwvYT4gdXRpbGl0eSBsaWJyYXJ5PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3NvY2tldC5pby9cIj5Tb2NrZXRJTzwvYT4gcmVhbC10aW1lIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXCI+QXhpb3M8L2E+IHByb21pc2UtYmFzZWQgSFRUUCBjbGllbnQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svaW1tdXRhYmxlLWpzXCI+SW1tdXRhYmxlPC9hPiBwZXJzaXN0ZW50IGltbXV0YWJsZSBkYXRhIGZvciBKUzwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9oYXBpanMvam9pXCI+Sm9pPC9hPiBvYmplY3Qgc2NoZW1hIHZhbGlkYXRpb248L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW9tZW50anMuY29tL1wiPk1vbWVudDwvYT4gZGF0ZS10aW1lIHN0dWZmPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hcmFrL0Zha2VyLmpzL1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2dpdC1zY20uY29tL1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIb21lO1xuXG4vKlxuKiBUT0RPXG4qXG4qIGJhYmVsaWZ5P1xuKiBjaGFpP1xuKiBjbGFzc25hbWVzP1xuKiBjb25maWc/XG4qIGNsaWVudGNvbmZpZz9cbiogaGVsbWV0P1xuKiBodXNreXZcbiogbW9jaGE/XG4qIG1vcmdhbj9cbiogd2luc3Rvbj9cbiogeWFyZ3M/XG4qICovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IExvYWRpbmcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImxvYWRpbmdcIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FkaW5nO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBOb3RGb3VuZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE5vdEZvdW5kO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHNvcnRCeSA9IHJlcXVpcmUoXCJsb2Rhc2guc29ydGJ5XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XG4gIGlmIChpc0FycmF5KGFycmF5KSkge1xuICAgIHJldHVybiBhcnJheS5yZWR1Y2UoKG9iamVjdCwgaXRlbSkgPT4ge1xuICAgICAgb2JqZWN0W2l0ZW0uaWRdID0gaXRlbTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSwge30pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKFwiZXhwZWN0ZWQgdHlwZSBpcyBBcnJheSwgZ2V0IFwiICsgdHlwZW9mIGFycmF5KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShvYmplY3QpIHtcbiAgaWYgKGlzUGxhaW5PYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBzb3J0QnkoXG4gICAgICBPYmplY3Qua2V5cyhvYmplY3QpLm1hcChrZXkgPT4gb2JqZWN0W2tleV0pLFxuICAgICAgaXRlbSA9PiBpdGVtLmlkXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihcImV4cGVjdGVkIHR5cGUgaXMgT2JqZWN0LCBnZXQgXCIgKyB0eXBlb2Ygb2JqZWN0KTtcbiAgfVxufVxuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuXG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJSb2JvdCBhZGRlZC5cIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cy50b1N0cmluZygpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGVkXCIsIHRydWUpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzLnRvU3RyaW5nKCk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRlZFwiLCB0cnVlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTsgLy8gQ2FuY2VsIGFkZFxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0gLy8gZWxzZVxuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGVkXCIsIHRydWUpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCk7XG5cbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJSb2JvdCBlZGl0ZWQuXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRlZFwiLCB0cnVlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgbmV3TW9kZWwpO1xuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGVkXCIsIHRydWUpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgc3RhdHVzKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cy50b1N0cmluZygpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgIHJldHVybiBzdGF0dXM7XG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQge3RvT2JqZWN0fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L21vZGVsc1wiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1hbnkoKSB7XG4gIHJldHVybiBBeGlvcy5nZXQoYC9hcGkvcm9ib3RzL2ApXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IG1vZGVscyA9IHRvT2JqZWN0KHJlc3BvbnNlLmRhdGEpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLmVkaXQoe2xvYWRlZDogdHJ1ZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuZWRpdCh7bG9hZGVkOiB0cnVlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgICAgIHJldHVybiBtb2RlbHM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0gcmVzcG9uc2Uuc3RhdHVzLnRvU3RyaW5nKCk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxvYWRFcnJvcjtcbiAgICAgIH1cbiAgICB9KTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgb2xkTW9kZWwgPSBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpO1xuXG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZShgL2FwaS9yb2JvdHMvJHtpZH1gKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBhZGRBbGVydChBbGVydCh7bWVzc2FnZTogXCJSb2JvdCByZW1vdmVkLlwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cy50b1N0cmluZygpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGVkXCIsIHRydWUpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIHJlbW92ZVxuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzLnRvU3RyaW5nKCk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRlZFwiLCB0cnVlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cy50b1N0cmluZygpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkZWRcIiwgdHJ1ZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgIHJldHVybiBzdGF0dXM7XG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcmVzdWx0ID0gcmVxdWlyZShcImxvZGFzaC5yZXN1bHRcIik7XG5sZXQgaXNBcnJheSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNhcnJheVwiKTtcbmxldCBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc3BsYWlub2JqZWN0XCIpO1xubGV0IGlzRW1wdHkgPSByZXF1aXJlKFwibG9kYXNoLmlzZW1wdHlcIik7XG5sZXQgbWVyZ2UgPSByZXF1aXJlKFwibG9kYXNoLm1lcmdlXCIpO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBmbGF0dGVuID0gcmVxdWlyZShcImxvZGFzaC5mbGF0dGVuXCIpO1xubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBhZGRSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL2FkZFwiKTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24obWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4gIGRhdGEgPSBkYXRhIHx8IHt9O1xuICBsZXQgam9pT3B0aW9ucyA9IHtcbiAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbiAgICBhbGxvd1Vua25vd246IHRydWUsXG4gIH07XG4gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuICAgICAgZXJyb3JzXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbiAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgZGV0YWlsKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVtb1tkZXRhaWwucGF0aF0pKSB7XG4gICAgICAgIG1lbW9bZGV0YWlsLnBhdGhdID0gW107XG4gICAgICB9XG4gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWFjdFJvdXRlci5TdGF0ZSwgU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRlZCwgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkZWQ9e2xvYWRlZH0gbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz5cbiAgICApO1xuICB9XG59KTtcblxubGV0IEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBhc3NlbWJseURhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFudWZhY3R1cmVyOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH1cbiAgfSxcblxuICB2YWxpZGF0b3JUeXBlcygpIHtcbiAgICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbiAgfSxcblxuICB2YWxpZGF0b3JEYXRhKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuICB9LFxuXG4gIHZhbGlkYXRlOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgc2NoZW1hID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yVHlwZXNcIikgfHwge307XG4gICAgbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4gICAgbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JzOiBuZXh0RXJyb3JzXG4gICAgICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuICAgICAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbiAgICAgIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbiAgICB9LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4gIH0sIDUwMCksXG5cbiAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldEluaXRpYWxTdGF0ZSgpLm1vZGVsKSxcbiAgICB9KTtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbiAgICAgICAgYWRkUm9ib3Qoe1xuICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBhc3NlbWJseURhdGU6IHRoaXMucmVmcy5hc3NlbWJseURhdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBnZXRWYWxpZGF0aW9uTWVzc2FnZXM6IGZ1bmN0aW9uKGtleSkge1xuICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbiAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGVkLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuXG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkFkZCBSb2JvdFwifT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+QWRkIFJvYm90PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qLyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgcmVtb3ZlUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVhY3RSb3V0ZXIuU3RhdGUsIFN0YXRlLm1peGluXSxcblxuICBjdXJzb3JzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgICAgIG1vZGVsOiBbXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgdGhpcy5nZXRQYXJhbXMoKS5pZF0sXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRlZCwgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLm1vZGVsO1xuXG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLm5hbWV9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5pZCArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5uYW1lfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5TZXJpYWwgTnVtYmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5pZH08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+QXNzZW1ibHkgRGF0ZTwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuYXNzZW1ibHlEYXRlfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5NYW51ZmFjdHVyZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLm1hbnVmYWN0dXJlcn08L2RkPlxuICAgICAgICAgICAgICAgICAgPC9kbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9LFxufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcmVzdWx0ID0gcmVxdWlyZShcImxvZGFzaC5yZXN1bHRcIik7XG5sZXQgaXNBcnJheSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNhcnJheVwiKTtcbmxldCBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc3BsYWlub2JqZWN0XCIpO1xubGV0IGlzRW1wdHkgPSByZXF1aXJlKFwibG9kYXNoLmlzZW1wdHlcIik7XG5sZXQgbWVyZ2UgPSByZXF1aXJlKFwibG9kYXNoLm1lcmdlXCIpO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBmbGF0dGVuID0gcmVxdWlyZShcImxvZGFzaC5mbGF0dGVuXCIpO1xubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBlZGl0Um9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0XCIpO1xubGV0IHJlbW92ZVJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbihtZW1vLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbiAgZGF0YSA9IGRhdGEgfHwge307XG4gIGxldCBqb2lPcHRpb25zID0ge1xuICAgIGFib3J0RWFybHk6IGZhbHNlLFxuICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbiAgfTtcbiAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4gICAgICBlcnJvcnNcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBkZXRhaWwpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbiAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfSwge30pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkZWQsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIGxldCBsb2FkTW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubG9hZE1vZGVsO1xuICAgIHJldHVybiAoXG4gICAgICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGVkPXtsb2FkZWR9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uKGtleSkge1xuICAgIGxldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICBsZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbiAgICBsZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gaXNBcnJheShiKSA/IGIgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAgIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbiAgICB9KTtcbiAgfSxcblxuICBoYW5kbGVDaGFuZ2VGb3I6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgICAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgfSxcblxuICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcblxuICBoYW5kbGVSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbiAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbiAgICAgICAgZWRpdFJvYm90KHtcbiAgICAgICAgICBpZDogdGhpcy5zdGF0ZS5tb2RlbC5pZCxcbiAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRlZCwgbG9hZEVycm9yLCBsb2FkTW9kZWx9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuXG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qLyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IFJvYm90SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRlZCwgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtYWRkXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tZ3JlZW5cIiB0aXRsZT1cIkFkZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1wbHVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxoMT5Sb2JvdHM8L2gxPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9LFxufSk7XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgcmVtb3ZlUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBtZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgY2F0ZWdvcnk6IHVuZGVmaW5lZCxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSZWFjdFJvdXRlcj0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLypcbmxldCBSb2JvdFN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgLy8gdGhpcyB3aWxsIHNldCB1cCBsaXN0ZW5lcnMgdG8gYWxsIHB1Ymxpc2hlcnMgaW4gVG9kb0FjdGlvbnMsIHVzaW5nIG9uS2V5bmFtZSAob3Iga2V5bmFtZSkgYXMgY2FsbGJhY2tzXG4gIGxpc3RlbmFibGVzOiBbUm9ib3RBY3Rpb25zXSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoKTtcbiAgfSxcblxuICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhdCBtaXhpbiBsZXZlbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBpbml0KCkge1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICB9LFxuXG4gIHJlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgfSxcblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBzdGF0ZWAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH1cbiAgfSxcblxuICBzaGFyZVN0YXRlKCkge1xuICAgIHRoaXMudHJpZ2dlcih0aGlzLnN0YXRlKTtcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9hZE1hbnkoKSB7XG4gICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuaW5kZXhMb2FkZWQpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmdUbyhSb2JvdEFjdGlvbnMubG9hZE1hbnkpO1xuICAgICAgUm9ib3RBY3Rpb25zLmxvYWRNYW55LnByb21pc2UoQXhpb3MuZ2V0KCcvYXBpL3JvYm90cy8nKSk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRNYW55RmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55LCB0aGlzLmxvYWRNYW55KTtcbiAgfSxcblxuICBsb2FkTWFueUNvbXBsZXRlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlDb21wbGV0ZWRcIiwgcmVzKTtcbiAgICBsZXQgbW9kZWxzID0gTGlzdChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZShPcmRlcmVkTWFwKFtmb3IgKG1vZGVsIG9mIG1vZGVscykgW21vZGVsLmlkLCBNYXAobW9kZWwpXV0pKTtcbiAgICB0aGlzLmluZGV4TG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkTWFueSwgdGhpcy5sb2FkTWFueSk7XG4gIH0sXG5cbiAgbG9hZE9uZShpZCkge1xuICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZT8hXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUpO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2U/IVxuICAgICAgQXhpb3MuZ2V0KGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuZmFpbGVkKHJlcywgaWQpKVxuICAgICAgICAudGhlbihyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuY29tcGxldGVkKHJlcywgaWQpKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZE9uZUZhaWxlZChyZXMsIGlkKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55RmFpbGVkXCIsIHJlcywgaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIFwiTm90IEZvdW5kXCIpKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkT25lLCB0aGlzLmxvYWRPbmUpO1xuICB9LFxuXG4gIGxvYWRPbmVDb21wbGV0ZWQocmVzLCBpZCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkT25lQ29tcGxldGVkXCIsIGlkKTtcbiAgICBsZXQgbW9kZWwgPSBNYXAocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE9uZSwgdGhpcy5sb2FkT25lKTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBSb2JvdEFjdGlvbnMuYWRkLnByb21pc2UoQXhpb3MucG9zdChgL2FwaS9yb2JvdHMvYCwgbW9kZWwudG9KUygpKSk7XG4gIH0sXG5cbiAgYWRkRmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5hZGRGYWlsZWRcIiwgcmVzKTtcbiAgfSxcblxuICBhZGRDb21wbGV0ZWQocmVzKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmFkZENvbXBsZXRlZFwiLCByZXMpO1xuICAgIGxldCBtb2RlbCA9IE1hcChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5nZXQoXCJpZFwiKSwgbW9kZWwpKTtcbiAgfSxcblxuICBlZGl0KG1vZGVsKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgbGV0IGlkID0gbW9kZWwuZ2V0KFwiaWRcIik7XG4gICAgbGV0IG9sZE1vZGVsID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG1vZGVsLnRvSlMoKSlcbiAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmVkaXQuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMuZWRpdC5jb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICBlZGl0RmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmVkaXRGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIGVkaXRDb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuZWRpdENvbXBsZXRlZFwiLCByZXMpO1xuICB9LFxuXG4gIHJlbW92ZShpZCkge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIGxldCBvbGRNb2RlbCA9IHRoaXMuc3RhdGUuZ2V0KGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGlkKSk7XG4gICAgQXhpb3MuZGVsZXRlKGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVDb21wbGV0ZWRcIiwgcmVzKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSb2JvdFN0b3JlO1xuKi9cbiIsIi8vIFBST1hZIFJPVVRFUiBUTyBTT0xWRSBDSVJDVUxBUiBERVBFTkRFTkNZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgbWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci50cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci5yZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEJhb2JhYiA9IHJlcXVpcmUoXCJiYW9iYWJcIik7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoe1xuICByb2JvdHM6IHtcbiAgICBtb2RlbHM6IHt9LFxuICAgIGxvYWRlZDogZmFsc2UsXG4gICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gIH0sXG4gIGFsZXJ0czoge1xuICAgIG1vZGVsczoge30sXG4gICAgbG9hZGVkOiBmYWxzZSxcbiAgICBsb2FkRXJyb3I6IG51bGwsXG4gIH0sXG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcblxuLy8gUlVMRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHZhciBtb2RlbCA9IHtcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFzc2VtYmx5RGF0ZTogSm9pLmRhdGUoKS5tYXgoXCJub3dcIikucmVxdWlyZWQoKSxcbiAgbWFudWZhY3R1cmVyOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbn07XG4iXX0=
