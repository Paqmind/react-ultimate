(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

var React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var HistoryLocation = ReactRouter.HistoryLocation;

// Shims, polyfills
require("shared/shims");

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
  React.createElement(Route, { name: "about", path: "/about", handler: About }),
  React.createElement(Route, { name: "robot-index", handler: RobotIndex }),
  React.createElement(Route, { name: "robot-add", path: "add", handler: RobotAdd }),
  React.createElement(Route, { name: "robot-detail", path: ":id", handler: RobotDetail }),
  React.createElement(Route, { name: "robot-edit", path: ":id/edit", handler: RobotEdit }),
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

},{"frontend/alert/actions/loadmany":4,"frontend/common/components/about":9,"frontend/common/components/body":10,"frontend/common/components/home":13,"frontend/common/components/notfound":15,"frontend/robot/actions/loadmany":20,"frontend/robot/components/add":22,"frontend/robot/components/detail":23,"frontend/robot/components/edit":24,"frontend/robot/components/index":25,"react":"react","react-router":"react-router","shared/shims":30}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================
var State = require("frontend/state");
var Alert = require("frontend/alert/models");
function add(model) {
  var newModel = Alert(model);
  var id = newModel.id;
  var apiURL = "/api/alerts/" + id;

  // Nonpersistent add
  State.select("alerts", "models").set(id, newModel);
}

module.exports = exports["default"];

},{"frontend/alert/models":8,"frontend/state":29}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadMany;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var Router = require("frontend/router");
var State = require("frontend/state");
function loadMany() {
  var apiURL = "api/alerts";

  State.select("alerts").edit({ loading: false, loadError: undefined, models: {} });
  return {};
  // TODO: backend
  //return Axios.get(apiURL)
  //  .then(response => {
  //    let models = toObject(response.data);
  //    State.select("alerts").edit({loading: false, loadError: undefined, models: models});
  //    State.select("alerts").edit({loading: false, loadError: undefined, models: models});
  //    return models;
  //  })
  //  .catch(response => {
  //    if (response instanceof Error) {
  //      throw response;
  //    } else {
  //      let loadError = {status: response.statusText, url: apiURL};
  //      State.select("alerts").set("loading", false);
  //      State.select("alerts").set("loadError", loadError);
  //      addAlert({message: "Action `Alert.loadMany` failed", category: "error"});
  //      return loadError;
  //    }
  //  });
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/helpers":17,"frontend/router":28,"frontend/state":29}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================
var State = require("frontend/state");
function remove(id) {
  var apiURL = "/api/alerts/" + id;

  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}

module.exports = exports["default"];

},{"frontend/state":29}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
//let CSSTransitionGroup = require("rc-css-transition-group");

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var AlertItem = require("frontend/alert/components/item");

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
  displayName: "index",

  mixins: [State.mixin],

  cursors: {
    alerts: ["alerts"] },

  render: function render() {
    var _state$cursors$alerts = this.state.cursors.alerts;
    var models = _state$cursors$alerts.models;
    var loading = _state$cursors$alerts.loading;
    var loadError = _state$cursors$alerts.loadError;

    models = toArray(models);

    if (loadError) {
      return React.createElement(Error, { loadError: loadError });
    } else {
      return React.createElement(
        "div",
        { className: "notifications top-left" },
        models.map(function (model) {
          return React.createElement(AlertItem, { model: model, key: model.id });
        }),
        loading ? React.createElement(Loading, null) : ""
      );
    }
  }
});

// Can't run this crap for now
// 1) react/addons pulls whole new react clone in browserify
// 2) rc-css-transition-group contains uncompiled JSX syntax
// OMG what an idiots &_&

//<CSSTransitionGroup transitionName="fade" component="div">
//  {models.map(model => <AlertItem model={model} key={model.id}/>)}
//</CSSTransitionGroup>
module.exports = exports["default"];

},{"frontend/alert/components/item":7,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/common/helpers":17,"frontend/state":29,"react":"react"}],7:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports["default"] = Item;

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
module.exports = exports["default"];

//onExpire: React.PropTypes.function,

//onExpire: undefined,

},{"classnames":"classnames","frontend/alert/actions/remove":5,"react":"react","react-router":"react-router"}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
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
    expire: data.category == "error" ? 0 : 5000 }, data);
}

module.exports = exports["default"];

},{"node-uuid":"node-uuid"}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "about",

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
module.exports = exports["default"];

},{"react":"react","react-document-title":"react-document-title"}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var AlertIndex = require("frontend/alert/components/index");
var Headroom = require("frontend/common/components/headroom");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "body",

  render: function render() {
    var headroomClassNames = { visible: "navbar-down", hidden: "navbar-up" };
    return React.createElement(
      "div",
      null,
      React.createElement(
        Headroom,
        { component: "header", id: "page-header", className: "navbar navbar-default", headroomClassNames: headroomClassNames },
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
module.exports = exports["default"];

},{"frontend/alert/components/index":6,"frontend/common/components/headroom":12,"react":"react","react-router":"react-router"}],11:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Class = require("classnames");
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "error",

  propTypes: {
    loadError: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]) },

  getDefaultProps: function getDefaultProps() {
    return {
      size: "md" };
  },

  render: function render() {
    return React.createElement(
      DocumentTitle,
      { title: "Error " + this.props.loadError.status + ": " + this.props.loadError.description },
      React.createElement(
        "div",
        { className: Class(_defineProperty({
            "alert-as-icon": true,
            "fa-stack": true }, this.props.size, true)) },
        React.createElement("i", { className: "fa fa-cog fa-stack-1x" }),
        React.createElement("i", { className: "fa fa-ban fa-stack-2x" })
      )
    );
  }
});
module.exports = exports["default"];

},{"classnames":"classnames","react":"react","react-document-title":"react-document-title"}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var throttle = require("lodash.throttle");

// EXPORTS =========================================================================================
var Headroom = React.createClass({
  displayName: "Headroom",

  propTypes: function propTypes() {
    return {
      component: React.PropTypes.string,
      headroomClassNames: React.PropTypes.object };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      component: "div" };
  },

  hasScrolled: function hasScrolled() {
    var topPosition = $(window).scrollTop();

    // Make sure users scroll more than delta
    if (Math.abs(this.lastScrollTop - topPosition) <= this.deltaHeight) {
      return;
    } // If they scrolled down and are past the navbar, add class `this.props.headroomClassNames.visible`.
    // This is necessary so you never see what is "behind" the navbar.
    if (topPosition > this.lastScrollTop && topPosition > this.elementHeight) {
      this.setState({ className: this.props.headroomClassNames.hidden });
    } else {
      if (topPosition + $(window).height() < $(document).height()) {
        this.setState({ className: this.props.headroomClassNames.visible });
      }
    }
    this.lastScrollTop = topPosition;
  },

  getInitialState: function getInitialState() {
    return {
      className: ""
    };
  },

  componentDidMount: function componentDidMount() {
    // Init options
    this.deltaHeight = this.props.deltaHeight ? this.props.deltaHeight : 5;
    this.delay = this.props.delay ? this.props.delay : 250;
    this.lastScrollTop = 0;
    this.elementHeight = document.getElementById(this.props.id).offsetHeight;

    // Add event handler on scroll
    window.addEventListener("scroll", throttle(this.hasScrolled, this.delay), false);

    // Update component"s className
    this.setState({ className: this.props.headroomClassNames.visible });
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener("scroll", this.hasScrolled, false);
  },

  render: function render() {
    var component = this.props.component;
    var props = { id: this.props.id, className: this.props.className + " " + this.state.className };
    return React.createElement(component, props, this.props.children);
  }
});

exports["default"] = Headroom;
module.exports = exports["default"];

},{"lodash.throttle":"lodash.throttle","react":"react"}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "home",

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

/*
* TODO
*
* <li><a href="http://socket.io/">SocketIO</a> real-time engine</li>
* validation
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
module.exports = exports["default"];

},{"react":"react","react-document-title":"react-document-title"}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "loading",

  render: function render() {
    var sizeClass = this.props.size ? " loading-" + this.props.size : "";
    return React.createElement(
      DocumentTitle,
      { title: "Loading..." },
      React.createElement(
        "div",
        { className: "alert-as-icon" + sizeClass },
        React.createElement("i", { className: "fa fa-cog fa-spin" })
      )
    );
  }
});
module.exports = exports["default"];

},{"react":"react","react-document-title":"react-document-title"}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "notfound",

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
module.exports = exports["default"];

},{"react":"react","react-document-title":"react-document-title"}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Class = require("classnames");
var React = require("react");

// EXPORTS =========================================================================================
exports["default"] = React.createClass({
  displayName: "pagination",

  propTypes: {
    endpoint: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    perpage: React.PropTypes.number.isRequired },

  totalPages: function totalPages() {
    return Math.ceil(this.props.total / this.props.perpage);
  },

  render: function render() {
    var _this = this;

    return React.createElement(
      "nav",
      null,
      React.createElement(
        "ul",
        { className: "pagination" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "#" },
            React.createElement(
              "span",
              null,
              "«"
            )
          )
        ),
        Array.range(1, this.totalPages() + 1).map(function (p) {
          var offset = (p - 1) * _this.props.perpage;
          var limit = _this.props.perpage;
          var url = _this.props.endpoint + ("?page.offset=" + offset + "&page.limit=" + limit);
          return React.createElement(
            "li",
            { key: p },
            React.createElement(
              "a",
              { href: url },
              p
            )
          );
        }),
        React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { href: "#" },
            React.createElement(
              "span",
              null,
              "»"
            )
          )
        )
      ),
      "Total: ",
      this.props.total,
      React.createElement("br", null),
      "Perpage: ",
      this.props.perpage,
      React.createElement("br", null),
      "TotalPages: ",
      this.totalPages(),
      React.createElement("br", null)
    );
  }
});

//<Pagination endpoint="/api/robots" total="10" perpage="2"/>
module.exports = exports["default"];

},{"classnames":"classnames","react":"react"}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
var Robot = require("frontend/robot/models");
function add(model) {
  var newModel = Robot(model);
  var id = newModel.id;
  var apiURL = "/api/robots/" + id;

  // Optimistic add
  State.select("robots").set("loading", true);
  State.select("robots", "models").set(id, newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Action `Robot.add` succeed", category: "success" });
    return response.status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var loadError = {
        status: response.status,
        description: response.statusText,
        url: apiURL
      };
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", loadError);
      State.select("robots", "models").unset(id); // Cancel add
      addAlert({ message: "Action `Robot.add` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").unset(id); // Cancel add
    return status;
  } // else
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({message: "Action `Robot.edit` failed", category: "error"});
    return status;
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":27,"frontend/router":28,"frontend/state":29}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = edit;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
var Robot = require("frontend/robot/models");
function edit(model) {
  var newModel = Robot(model);
  var id = newModel.id;
  var oldModel = State.select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic edit
  State.select("robots").set("loading", true);
  State.select("robots", "models").set(id, newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Action `Robot.edit` succeed", category: "success" });
    return response.status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var loadError = {
        status: response.status,
        description: response.statusText,
        url: apiURL
      };
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", loadError);
      State.select("robots", "models").set(id, oldModel); // Cancel edit
      addAlert({ message: "Action `Robot.edit` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel edit
    return status;
  } // else
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({message: "Action `Robot.edit` failed", category: "error"});
    return status;
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":27,"frontend/router":28,"frontend/state":29}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadMany;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
function loadMany() {
  var apiURL = "/api/robots/";

  State.select("robots").set("loading", true);
  return Axios.get(apiURL).then(function (response) {
    var _response$data = response.data;
    var data = _response$data.data;
    var meta = _response$data.meta;

    var models = toObject(data);
    State.select("robots").edit({
      loading: false,
      loadError: undefined,
      models: models,
      total: meta.total || Object.keys(models).length });
    return response.status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var loadError = {
        status: response.status,
        description: response.statusText,
        url: apiURL
      };
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", loadError);
      addAlert({ message: "Action `Robot.loadMany` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  });
}

module.exports = exports["default"];

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/common/helpers":17,"frontend/router":28,"frontend/state":29}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================
var Axios = require("axios");
var Router = require("frontend/router");
var addAlert = require("frontend/alert/actions/add");
var State = require("frontend/state");
function remove(id) {
  var oldModel = State.select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic remove
  State.select("robots").set("loading", true);
  State.select("robots", "models").unset(id);

  return Axios["delete"](apiURL).then(function (response) {
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    Router.transitionTo("robot-index");
    addAlert({ message: "Action `Robot.remove` succeed", category: "success" });
    return response.status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var loadError = {
        status: response.status,
        description: response.statusText,
        url: apiURL
      };
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", status);
      State.select("robots", "models").set(id, oldModel); // Cancel remove
      addAlert({ message: "Action `Robot.remove` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  });

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", status);
    State.select("robots", "models").set(id, oldModel); // Cancel remove
    return status;
  } // else
    let status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    return status;
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/router":28,"frontend/state":29}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var result = require("lodash.result");
var isArray = require("lodash.isarray");
var isPlainObject = require("lodash.isplainobject");
var isEmpty = require("lodash.isempty");
var merge = require("lodash.merge");
var debounce = require("lodash.debounce");
var flatten = require("lodash.flatten");
var Class = require("classnames");
//let Joi = require("joi");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");
//let Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var Error = require("frontend/common/components/error");
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

//function validate(joiSchema, data, key) {
//  joiSchema = joiSchema || {};
//  data = data || {};
//  let joiOptions = {
//    abortEarly: false,
//    allowUnknown: true,
//  };
//  let errors = formatErrors(Joi.validate(data, joiSchema, joiOptions));
//  if (key === undefined) {
//    return Object.assign(
//      flattenAndResetTo(joiSchema, []),
//      errors
//    );
//  } else {
//    let result = {};
//    result[key] = errors[key] || [];
//    return result;
//  }
//}

//function formatErrors(joiResult) {
//  if (joiResult.error !== null) {
//    return joiResult.error.details.reduce(function (memo, detail) {
//      if (!Array.isArray(memo[detail.path])) {
//        memo[detail.path] = [];
//      }
//      memo[detail.path].push(detail.message);
//      return memo;
//    }, {});
//  } else {
//    return {};
//  }
//}

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
  displayName: "add",

  mixins: [ReactRouter.State, State.mixin],

  cursors: function cursors() {
    return {
      robots: ["robots"] };
  },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var loading = _state$cursors$robots.loading;
    var loadError = _state$cursors$robots.loadError;

    return React.createElement(Form, { models: models, loading: loading, loadError: loadError });
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

  //validatorTypes() {
  //  return Validators.model;
  //},

  //validatorData() {
  //  return this.state.model;
  //},

  validate: function validate(key) {},

  handleChangeFor: function handleChangeFor(key) {},

  validateDebounced: debounce(function validateDebounced(key) {}, 500),

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
    var loading = _props.loading;
    var loadError = _props.loadError;

    var model = this.state.model;

    if (loading) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(Error, { loadError: loadError });
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
module.exports = exports["default"];

//let schema = result(this, "validatorTypes") || {};
//let data = result(this, "validatorData") || this.state;
//let nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
//  return isArray(b) ? b : undefined;
//});
//return new Promise((resolve, reject) => {
//  this.setState({
//    errors: nextErrors
//  }, () => resolve(this.isValid(key)));
//});

//return function handleChange(event) {
//  event.persist();
//  let model = this.state.model;
//  model[key] = event.currentTarget.value;
//  this.setState({model: model});
//  this.validateDebounced(key);
//}.bind(this);

//return this.validate(key);

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/add":18,"frontend/state":29,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var isEmpty = require("lodash.isempty");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");
var Loading = require("frontend/common/components/loading");
var Error = require("frontend/common/components/error");
var NotFound = require("frontend/common/components/notfound");
var State = require("frontend/state");
var removeRobot = require("frontend/robot/actions/remove");

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
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
    var loading = _state$cursors$robots.loading;
    var loadError = _state$cursors$robots.loadError;

    var model = this.state.cursors.model;

    if (loading) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(Error, { loadError: loadError });
    } else if (isEmpty(model)) {
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
module.exports = exports["default"];

},{"frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/remove":21,"frontend/state":29,"lodash.isempty":"lodash.isempty","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var result = require("lodash.result");
var isArray = require("lodash.isarray");
var isPlainObject = require("lodash.isplainobject");
var isEmpty = require("lodash.isempty");
var merge = require("lodash.merge");
var debounce = require("lodash.debounce");
var flatten = require("lodash.flatten");
var Class = require("classnames");
//let Joi = require("joi");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");
//let Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var Error = require("frontend/common/components/error");
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

//function validate(joiSchema, data, key) {
//  joiSchema = joiSchema || {};
//  data = data || {};
//  let joiOptions = {
//    abortEarly: false,
//    allowUnknown: true,
//  };
//  let errors = formatErrors(Joi.validate(data, joiSchema, joiOptions));
//  if (key === undefined) {
//    return Object.assign(
//      flattenAndResetTo(joiSchema, []),
//      errors
//    );
//  } else {
//    let result = {};
//    result[key] = errors[key] || [];
//    return result;
//  }
//}

//function formatErrors(joiResult) {
//  if (joiResult.error !== null) {
//    return joiResult.error.details.reduce(function (memo, detail) {
//      if (!Array.isArray(memo[detail.path])) {
//        memo[detail.path] = [];
//      }
//      memo[detail.path].push(detail.message);
//      return memo;
//    }, {});
//  } else {
//    return {};
//  }
//}

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
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
    var loading = _state$cursors$robots.loading;
    var loadError = _state$cursors$robots.loadError;

    var loadModel = this.state.cursors.loadModel;
    return React.createElement(Form, { models: models, loading: loading, loadError: loadError, loadModel: loadModel });
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
    return {};
    //return Validators.model;
  },

  validatorData: function validatorData() {
    return {};
    //  return this.state.model;
  },

  validate: function validate(key) {},

  handleChangeFor: function handleChangeFor(key) {
    return (function handleChange(event) {
      event.persist();
      var model = this.state.model;
      model[key] = event.currentTarget.value;
      this.setState({ model: model });
      //  this.validateDebounced(key);
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
    return true;
    //return isEmpty(this.getValidationMessages(key));
  },

  render: function render() {
    var _props = this.props;
    var models = _props.models;
    var loading = _props.loading;
    var loadError = _props.loadError;
    var loadModel = _props.loadModel;

    var model = this.state.model;

    if (loading) {
      return React.createElement(Loading, null);
    } else if (loadError) {
      return React.createElement(Error, { loadError: loadError });
    } else if (isEmpty(model)) {
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
                          required: false,
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
                          required: false,
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
                          required: false,
                          error: !this.isValid("manufacturer") }) },
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

//(this.validatorTypes().manufacturer._flags.presence == "required")
//(this.validatorTypes().name._flags.presence == "required"),
//(this.validatorTypes().assemblyDate._flags.presence == "required"),
module.exports = exports["default"];

//let schema = result(this, "validatorTypes") || {};
//let data = result(this, "validatorData") || this.state;
//let nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
//  return isArray(b) ? b : undefined;
//});
//return new Promise((resolve, reject) => {
//  this.setState({
//    errors: nextErrors
//  }, () => resolve(this.isValid(key)));
//});

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/edit":19,"frontend/robot/actions/remove":21,"frontend/state":29,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

var Pagination = require("frontend/common/components/pagination");
var Loading = require("frontend/common/components/loading");
var Error = require("frontend/common/components/error");
var State = require("frontend/state");
var RobotItem = require("frontend/robot/components/item");

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
  displayName: "index",

  mixins: [State.mixin],

  cursors: {
    robots: ["robots"] },

  render: function render() {
    var _state$cursors$robots = this.state.cursors.robots;
    var models = _state$cursors$robots.models;
    var total = _state$cursors$robots.total;
    var loading = _state$cursors$robots.loading;
    var loadError = _state$cursors$robots.loadError;

    models = toArray(models);

    if (loadError) {
      return React.createElement(Error, { loadError: loadError });
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
          ),
          loading ? React.createElement(Loading, null) : ""
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
module.exports = exports["default"];

},{"frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/pagination":16,"frontend/common/helpers":17,"frontend/robot/components/item":26,"frontend/state":29,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var removeRobot = require("frontend/robot/actions/remove");

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
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
module.exports = exports["default"];

},{"frontend/robot/actions/remove":21,"react":"react","react-router":"react-router"}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
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

module.exports = exports["default"];

},{"node-uuid":"node-uuid"}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports["default"] = proxy;
module.exports = exports["default"];

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Baobab = require("baobab");

// STATE ===========================================================================================
exports["default"] = new Baobab({
  robots: {
    models: {},
    modelIds: [1, 2, 3, 4, 5],
    total: 0,
    loading: true,
    loadError: undefined },
  alerts: {
    models: {},
    total: 0,
    loading: true,
    loadError: undefined } });
module.exports = exports["default"];

},{"baobab":"baobab"}],30:[function(require,module,exports){
(function (process){
// IMPORTS =========================================================================================
"use strict";

var Inspect = require("util-inspect");

require("babel/polyfill");

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

// (c) Lodash. Super required method, bored to import this
Array.range = function range(start, end, step) {
  if (step && isIterateeCall(start, end, step)) {
    end = step = null;
  }
  start = +start || 0;
  step = step == null ? 1 : +step || 0;

  if (end == null) {
    end = start;
    start = 0;
  } else {
    end = +end || 0;
  }
  // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
  // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
  var index = -1,
      length = Math.max(Math.ceil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
};

// Required for pagination
// `Array.chunked([1, 2, 3, 4, 5], 2)` => [[1, 2], [3, 4], [5]]
Array.chunked = function chunked(array, n) {
  var l = Math.ceil(array.length / n);
  return Array.range(l).map(function (x, i) {
    return array.slice(i * n, i * n + n);
  });
};

if (process) {
  // IOJS has `unhandledRejection` hook
  process.on("unhandledRejection", function (reason, p) {
    throw Error("UnhandledRejection: " + reason);
  });
} else {
  // BROWSER (Canary logs unhandled exceptions others just swallow)
  Promise.prototype.done = function (resolve, reject) {
    this.then(resolve, reject)["catch"](function (e) {
      setTimeout(function () {
        throw e;
      }, 1);
    });
  };

  // Workaround method as native browser string representation of Immutable is awful
  window.console.echo = function log() {
    console.log.apply(console, Array.prototype.slice.call(arguments).map(function (v) {
      return Inspect(v);
    }));
  };
}

}).call(this,require('_process'))

},{"_process":2,"babel/polyfill":"babel/polyfill","util-inspect":"util-inspect"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmcuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkbWFueS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssR0FBa0QsV0FBVyxDQUFsRSxLQUFLO0lBQUUsWUFBWSxHQUFvQyxXQUFXLENBQTNELFlBQVk7SUFBRSxhQUFhLEdBQXFCLFdBQVcsQ0FBN0MsYUFBYTtJQUFFLGVBQWUsR0FBSSxXQUFXLENBQTlCLGVBQWU7OztBQUd4RCxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7OztBQUd4QixJQUFJLElBQUksR0FBRyxPQUFP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LElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQ2hCLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDbEIsZ0JBQVUsQ0FBQyxZQUFZO0FBQUUsY0FBTSxDQUFDLENBQUM7T0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3pDLENBQUMsQ0FBQztHQUNOLENBQUM7OztBQUdGLFFBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHO0FBQ25DLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQztHQUN4RixDQUFDO0NBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7Um91dGUsIERlZmF1bHRSb3V0ZSwgTm90Rm91bmRSb3V0ZSwgSGlzdG9yeUxvY2F0aW9ufSA9IFJlYWN0Um91dGVyO1xuXG4vLyBTaGltcywgcG9seWZpbGxzXG5yZXF1aXJlKFwic2hhcmVkL3NoaW1zXCIpO1xuXG4vLyBDb21tb25cbmxldCBCb2R5ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHlcIik7XG5sZXQgSG9tZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lXCIpO1xubGV0IEFib3V0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0XCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xuXG4vLyBBbGVydFxubGV0IGxvYWRNYW55QWxlcnRzID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvbG9hZG1hbnlcIik7XG5cbi8vIFJvYm90XG5sZXQgbG9hZE1hbnlSb2JvdHMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkbWFueVwiKTtcbmxldCBSb2JvdEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIik7XG5sZXQgUm9ib3RBZGQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIik7XG5sZXQgUm9ib3REZXRhaWwgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIik7XG5sZXQgUm9ib3RFZGl0ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiKTtcblxuLy8gUk9VVEVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJvdXRlcyA9IChcbiAgPFJvdXRlIGhhbmRsZXI9e0JvZHl9IHBhdGg9XCIvXCI+XG4gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwiaG9tZVwiIGhhbmRsZXI9e0hvbWV9Lz5cbiAgICA8Um91dGUgbmFtZT1cImFib3V0XCIgcGF0aD1cIi9hYm91dFwiIGhhbmRsZXI9e0Fib3V0fS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1pbmRleFwiIGhhbmRsZXI9e1JvYm90SW5kZXh9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWFkZFwiIHBhdGg9XCJhZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZGV0YWlsXCIgcGF0aD1cIjppZFwiIGhhbmRsZXI9e1JvYm90RGV0YWlsfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1lZGl0XCIgcGF0aD1cIjppZC9lZGl0XCIgaGFuZGxlcj17Um9ib3RFZGl0fS8+XG4gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cbndpbmRvdy5yb3V0ZXIgPSBSZWFjdFJvdXRlci5jcmVhdGUoe1xuICByb3V0ZXM6IHJvdXRlcyxcbiAgbG9jYXRpb246IEhpc3RvcnlMb2NhdGlvblxufSk7XG5cbndpbmRvdy5yb3V0ZXIucnVuKChIYW5kbGVyLCBzdGF0ZSkgPT4ge1xuICAvLyB5b3UgbWlnaHQgd2FudCB0byBwdXNoIHRoZSBzdGF0ZSBvZiB0aGUgcm91dGVyIHRvIGFcbiAgLy8gc3RvcmUgZm9yIHdoYXRldmVyIHJlYXNvblxuICAvLyBSb3V0ZXJBY3Rpb25zLnJvdXRlQ2hhbmdlKHtyb3V0ZXJTdGF0ZTogc3RhdGV9KTtcblxuICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG59KTtcblxubG9hZE1hbnlBbGVydHMoKTtcbmxvYWRNYW55Um9ib3RzKCk7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQge3RvT2JqZWN0fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTWFueSgpIHtcbiAgbGV0IGFwaVVSTCA9IGBhcGkvYWxlcnRzYDtcblxuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IHt9fSk7XG4gIHJldHVybiB7fTtcbiAgLy8gVE9ETzogYmFja2VuZFxuICAvL3JldHVybiBBeGlvcy5nZXQoYXBpVVJMKVxuICAvLyAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAvLyAgICBsZXQgbW9kZWxzID0gdG9PYmplY3QocmVzcG9uc2UuZGF0YSk7XG4gIC8vICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gIC8vICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gIC8vICAgIHJldHVybiBtb2RlbHM7XG4gIC8vICB9KVxuICAvLyAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgLy8gICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgLy8gICAgICB0aHJvdyByZXNwb25zZTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBsZXQgbG9hZEVycm9yID0ge3N0YXR1czogcmVzcG9uc2Uuc3RhdHVzVGV4dCwgdXJsOiBhcGlVUkx9O1xuICAvLyAgICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgLy8gICAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gIC8vICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBBbGVydC5sb2FkTWFueWAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgLy8gICAgICByZXR1cm4gbG9hZEVycm9yO1xuICAvLyAgICB9XG4gIC8vICB9KTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb24tcGVyc2lzdGVudCByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKFwicmMtY3NzLXRyYW5zaXRpb24tZ3JvdXBcIik7XG5sZXQge3RvQXJyYXl9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBBbGVydEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pdGVtXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1N0YXRlLm1peGluXSxcblxuICBjdXJzb3JzOiB7XG4gICAgYWxlcnRzOiBbXCJhbGVydHNcIl0sXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmFsZXJ0cztcbiAgICBtb2RlbHMgPSB0b0FycmF5KG1vZGVscyk7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbnMgdG9wLWxlZnRcIj5cbiAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAge2xvYWRpbmcgPyA8TG9hZGluZy8+IDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIENhbid0IHJ1biB0aGlzIGNyYXAgZm9yIG5vd1xuLy8gMSkgcmVhY3QvYWRkb25zIHB1bGxzIHdob2xlIG5ldyByZWFjdCBjbG9uZSBpbiBicm93c2VyaWZ5XG4vLyAyKSByYy1jc3MtdHJhbnNpdGlvbi1ncm91cCBjb250YWlucyB1bmNvbXBpbGVkIEpTWCBzeW50YXhcbi8vIE9NRyB3aGF0IGFuIGlkaW90cyAmXyZcblxuLy88Q1NTVHJhbnNpdGlvbkdyb3VwIHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiIGNvbXBvbmVudD1cImRpdlwiPlxuLy8gIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbi8vPC9DU1NUcmFuc2l0aW9uR3JvdXA+XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgY2xhc3NOYW1lcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgcmVtb3ZlQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9yZW1vdmVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBFeHBpcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGRlbGF5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIC8vb25FeHBpcmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jdGlvbixcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlbGF5OiA1MDAsXG4gICAgICAvL29uRXhwaXJlOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vIFJlc2V0IHRoZSB0aW1lciBpZiBjaGlsZHJlbiBhcmUgY2hhbmdlZFxuICAgIGlmIChuZXh0UHJvcHMuY2hpbGRyZW4gIT09IHRoaXMucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICAgIH1cbiAgfSxcblxuICBzdGFydFRpbWVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICAvLyBDbGVhciBleGlzdGluZyB0aW1lclxuICAgIGlmICh0aGlzLl90aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgYWZ0ZXIgYG1vZGVsLmRlbGF5YCBtc1xuICAgIGlmICh0aGlzLnByb3BzLmRlbGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uRXhwaXJlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLm9uRXhwaXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX3RpbWVyO1xuICAgICAgfSwgdGhpcy5wcm9wcy5kZWxheSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj47XG4gIH0sXG59KTtcblxubGV0IENsb3NlTGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMub25DbGljaygpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwiY2xvc2UgcHVsbC1yaWdodFwiIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+JnRpbWVzOzwvYT5cbiAgICApO1xuICB9XG59KTtcblxubGV0IEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgbGV0IGNsYXNzZXMgPSBjbGFzc05hbWVzKHtcbiAgICAgIFwiYWxlcnRcIjogdHJ1ZSxcbiAgICAgIFtcImFsZXJ0LVwiICsgbW9kZWwuY2F0ZWdvcnldOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttb2RlbC5jbG9zYWJsZSA/IDxDbG9zZUxpbmsgb25DbGljaz17cmVtb3ZlQWxlcnQuYmluZCh0aGlzLCBtb2RlbC5pZCl9Lz4gOiBcIlwifVxuICAgICAgICB7bW9kZWwubWVzc2FnZX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICBpZiAobW9kZWwuZXhwaXJlKSB7XG4gICAgICByZXN1bHQgPSA8RXhwaXJlIG9uRXhwaXJlPXtyZW1vdmVBbGVydC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0gZGVsYXk9e21vZGVsLmV4cGlyZX0+e3Jlc3VsdH08L0V4cGlyZT47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuXG5cbi8qXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG5cbiAgdGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy4kbm90ZSk7XG4gIHRoaXMuJG5vdGUuYWxlcnQoKTtcbn07XG5cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcbiAgZWxzZSBvbkNsb3NlLmNhbGwodGhpcyk7XG59O1xuXG4kLmZuLm5vdGlmeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKHRoaXMsIG9wdGlvbnMpO1xufTtcbiovXG5cbi8vIFRPRE8gY2hlY2sgdGhpcyBodHRwczovL2dpdGh1Yi5jb20vZ29vZHliYWcvYm9vdHN0cmFwLW5vdGlmeS90cmVlL21hc3Rlci9jc3Mvc3R5bGVzXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVVVJRCA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5cbi8vIE1PREVMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0KGRhdGEpIHtcbiAgaWYgKCFkYXRhLm1lc3NhZ2UpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLm1lc3NhZ2VgIGlzIHJlcXVpcmVkXCIpO1xuICB9XG4gIGlmICghZGF0YS5jYXRlZ29yeSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEuY2F0ZWdvcnlgIGlzIHJlcXVpcmVkXCIpO1xuICB9XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogZGF0YS5jYXRlZ29yeSA9PSBcImVycm9yXCIgPyAwIDogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkFib3V0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGluZm9cIj5cbiAgICAgICAgICA8aDE+U2ltcGxlIFBhZ2UgRXhhbXBsZTwvaDE+XG4gICAgICAgICAgPHA+VGhpcyBwYWdlIHdhcyByZW5kZXJlZCBieSBhIEphdmFTY3JpcHQ8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgQWxlcnRJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IEhlYWRyb29tID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaGVhZHJvb21DbGFzc05hbWVzID0ge3Zpc2libGU6IFwibmF2YmFyLWRvd25cIiwgaGlkZGVuOiBcIm5hdmJhci11cFwifTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPEhlYWRyb29tIGNvbXBvbmVudD1cImhlYWRlclwiIGlkPVwicGFnZS1oZWFkZXJcIiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIiBoZWFkcm9vbUNsYXNzTmFtZXM9e2hlYWRyb29tQ2xhc3NOYW1lc30+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiPlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0hlYWRyb29tPlxuXG4gICAgICAgIDxtYWluIGlkPVwicGFnZS1tYWluXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvbWFpbj5cblxuICAgICAgICA8QWxlcnRJbmRleC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbG9hZEVycm9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFtcInhzXCIsIFwic21cIiwgXCJtZFwiLCBcImxnXCJdKSxcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IFwibWRcIixcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFcnJvciBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLnN0YXR1cyArIFwiOiBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLmRlc2NyaXB0aW9ufT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICBcImFsZXJ0LWFzLWljb25cIjogdHJ1ZSxcbiAgICAgICAgICBcImZhLXN0YWNrXCI6IHRydWUsXG4gICAgICAgICAgW3RoaXMucHJvcHMuc2l6ZV06IHRydWVcbiAgICAgICAgfSl9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zdGFjay0xeFwiPjwvaT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1iYW4gZmEtc3RhY2stMnhcIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHRocm90dGxlID0gcmVxdWlyZShcImxvZGFzaC50aHJvdHRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhlYWRyb29tID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGhlYWRyb29tQ2xhc3NOYW1lczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICB9XG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21wb25lbnQ6IFwiZGl2XCIsXG4gICAgfVxuICB9LFxuXG4gIGhhc1Njcm9sbGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfSxcblxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWU6IFwiXCJcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRyb29tO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJlYWN0IFN0YXJ0ZXJcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaG9tZVwiPlxuICAgICAgICAgIDxoMT5SZWFjdCBzdGFydGVyIGFwcDwvaDE+XG4gICAgICAgICAgPHA+UHJvb2Ygb2YgY29uY2VwdHMsIENSVUQsIHdoYXRldmVyLi4uPC9wPlxuICAgICAgICAgIDxwPlByb3VkbHkgYnVpbGQgb24gRVM2IHdpdGggdGhlIGhlbHAgb2YgPGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gdHJhbnNwaWxlci48L3A+XG4gICAgICAgICAgPGgzPkZyb250ZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvXCI+UmVhY3Q8L2E+IGRlY2xhcmF0aXZlIFVJPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1lvbWd1aXRoZXJlYWwvYmFvYmFiXCI+QmFvYmFiPC9hPiBKUyBkYXRhIHRyZWUgd2l0aCBjdXJzb3JzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3JhY2t0L3JlYWN0LXJvdXRlclwiPlJlYWN0LVJvdXRlcjwvYT4gZGVjbGFyYXRpdmUgcm91dGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtZG9jdW1lbnQtdGl0bGVcIj5SZWFjdC1Eb2N1bWVudC1UaXRsZTwvYT4gZGVjbGFyYXRpdmUgZG9jdW1lbnQgdGl0bGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vXCI+UmVhY3QtQm9vdHN0cmFwPC9hPiBCb290c3RyYXAgY29tcG9uZW50cyBpbiBSZWFjdDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9icm93c2VyaWZ5Lm9yZy9cIj5Ccm93c2VyaWZ5PC9hPiAmYW1wOyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL3dhdGNoaWZ5XCI+V2F0Y2hpZnk8L2E+IGJ1bmRsZSBOUE0gbW9kdWxlcyB0byBmcm9udGVuZDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ib3dlci5pby9cIj5Cb3dlcjwvYT4gZnJvbnRlbmQgcGFja2FnZSBtYW5hZ2VyPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2V4cHJlc3Nqcy5jb20vXCI+RXhwcmVzczwvYT4gd2ViLWFwcCBiYWNrZW5kIGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb3ppbGxhLmdpdGh1Yi5pby9udW5qdWNrcy9cIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2VsZWl0aC9lbWFpbGpzXCI+RW1haWxKUzwvYT4gU01UUCBjbGllbnQ8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gSlMgdHJhbnNwaWxlcjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ndWxwanMuY29tL1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2xvZGFzaC5jb20vXCI+TG9kYXNoPC9hPiB1dGlsaXR5IGxpYnJhcnk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvc1wiPkF4aW9zPC9hPiBwcm9taXNlLWJhc2VkIEhUVFAgY2xpZW50PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2ltbXV0YWJsZS1qc1wiPkltbXV0YWJsZTwvYT4gcGVyc2lzdGVudCBpbW11dGFibGUgZGF0YSBmb3IgSlM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW9tZW50anMuY29tL1wiPk1vbWVudDwvYT4gZGF0ZS10aW1lIHN0dWZmPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hcmFrL0Zha2VyLmpzL1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2dpdC1zY20uY29tL1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG4vKlxuKiBUT0RPXG4qXG4qIDxsaT48YSBocmVmPVwiaHR0cDovL3NvY2tldC5pby9cIj5Tb2NrZXRJTzwvYT4gcmVhbC10aW1lIGVuZ2luZTwvbGk+XG4qIHZhbGlkYXRpb25cbiogYmFiZWxpZnk/XG4qIGNoYWk/XG4qIGNsYXNzbmFtZXM/XG4qIGNvbmZpZz9cbiogY2xpZW50Y29uZmlnP1xuKiBoZWxtZXQ/XG4qIGh1c2t5dlxuKiBtb2NoYT9cbiogbW9yZ2FuP1xuKiB3aW5zdG9uP1xuKiB5YXJncz9cbiogKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImFsZXJ0LWFzLWljb25cIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZW5kcG9pbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHBlcnBhZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfSxcblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMucGVycGFnZSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bmF2PlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwicGFnaW5hdGlvblwiPlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCI+XG4gICAgICAgICAgICAgIDxzcGFuPiZsYXF1bzs8L3NwYW4+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICB7QXJyYXkucmFuZ2UoMSwgdGhpcy50b3RhbFBhZ2VzKCkgKyAxKS5tYXAocCA9PiB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gKHAgLSAxKSAqIHRoaXMucHJvcHMucGVycGFnZTtcbiAgICAgICAgICAgIGxldCBsaW1pdCA9IHRoaXMucHJvcHMucGVycGFnZTtcbiAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLnByb3BzLmVuZHBvaW50ICsgYD9wYWdlLm9mZnNldD0ke29mZnNldH0mcGFnZS5saW1pdD0ke2xpbWl0fWA7XG4gICAgICAgICAgICByZXR1cm4gPGxpIGtleT17cH0+PGEgaHJlZj17dXJsfT57cH08L2E+PC9saT47XG4gICAgICAgICAgfSl9XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIj5cbiAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICBUb3RhbDoge3RoaXMucHJvcHMudG90YWx9PGJyLz5cbiAgICAgICAgUGVycGFnZToge3RoaXMucHJvcHMucGVycGFnZX08YnIvPlxuICAgICAgICBUb3RhbFBhZ2VzOiB7dGhpcy50b3RhbFBhZ2VzKCl9PGJyLz5cbiAgICAgIDwvbmF2PlxuICAgICk7XG4gIH1cbn0pO1xuXG4vLzxQYWdpbmF0aW9uIGVuZHBvaW50PVwiL2FwaS9yb2JvdHNcIiB0b3RhbD1cIjEwXCIgcGVycGFnZT1cIjJcIi8+XG5cblxuXG5cblxuXG5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBzb3J0QnkgPSByZXF1aXJlKFwibG9kYXNoLnNvcnRieVwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xuICBpZiAoaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihcImV4cGVjdGVkIHR5cGUgaXMgQXJyYXksIGdldCBcIiArIHR5cGVvZiBhcnJheSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoXCJleHBlY3RlZCB0eXBlIGlzIE9iamVjdCwgZ2V0IFwiICsgdHlwZW9mIG9iamVjdCk7XG4gIH1cbn1cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTsgLy8gQ2FuY2VsIGFkZFxuICAgICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgc3RhdHVzKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZFwiLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IGFkZEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L21vZGVsc1wiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWRpdChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgb2xkTW9kZWwgPSBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXNcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICByZXR1cm4gc3RhdHVzO1xuICB9IC8vIGVsc2VcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IHt0b09iamVjdH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1hbnkoKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvYDtcblxuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldChhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHtkYXRhLCBtZXRhfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBsZXQgbW9kZWxzID0gdG9PYmplY3QoZGF0YSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuZWRpdCh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgbW9kZWxzOiBtb2RlbHMsXG4gICAgICAgIHRvdGFsOiBtZXRhLnRvdGFsIHx8IE9iamVjdC5rZXlzKG1vZGVscykubGVuZ3RoLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5sb2FkTWFueWAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pO1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgb2xkTW9kZWwgPSBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcblxuICByZXR1cm4gQXhpb3MuZGVsZXRlKGFwaVVSTClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJlc3VsdCA9IHJlcXVpcmUoXCJsb2Rhc2gucmVzdWx0XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IG1lcmdlID0gcmVxdWlyZShcImxvZGFzaC5tZXJnZVwiKTtcbmxldCBkZWJvdW5jZSA9IHJlcXVpcmUoXCJsb2Rhc2guZGVib3VuY2VcIik7XG5sZXQgZmxhdHRlbiA9IHJlcXVpcmUoXCJsb2Rhc2guZmxhdHRlblwiKTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuLy9sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbi8vbGV0IFZhbGlkYXRvcnMgPSByZXF1aXJlKFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IEVycm9yID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IGFkZFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfVxuICB9LFxuXG4gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4gIC8vICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbiAgLy99LFxuXG4gIC8vdmFsaWRhdG9yRGF0YSgpIHtcbiAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuICAvL30sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIC8vfSk7XG4gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIC8vfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgLy8gIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgLy8gIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgLy99LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIC8vcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcblxuICBoYW5kbGVSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuICAgICAgICBhZGRSb2JvdCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbiAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzRW1wdHkodGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPkFkZCBSb2JvdDwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBFcnJvciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvclwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWFjdFJvdXRlci5TdGF0ZSwgU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAgICAgbW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSBpZiAoaXNFbXB0eShtb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmlkfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5hc3NlbWJseURhdGV9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwubWFudWZhY3R1cmVyfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByZXN1bHQgPSByZXF1aXJlKFwibG9kYXNoLnJlc3VsdFwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5sZXQgaXNFbXB0eSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNlbXB0eVwiKTtcbmxldCBtZXJnZSA9IHJlcXVpcmUoXCJsb2Rhc2gubWVyZ2VcIik7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IGZsYXR0ZW4gPSByZXF1aXJlKFwibG9kYXNoLmZsYXR0ZW5cIik7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbi8vbGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG4vL2xldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBFcnJvciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvclwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBlZGl0Um9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0XCIpO1xubGV0IHJlbW92ZVJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBsZXQgbG9hZE1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmxvYWRNb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiB7fTtcbiAgICAvL3JldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgcmV0dXJuIHt9O1xuICAvLyAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIC8vfSk7XG4gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIC8vfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIG1vZGVsW2tleV0gPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4gICAgLy8gIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbiAgICB9LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4gIH0sIDUwMCksXG5cbiAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4gICAgfSwgdGhpcy52YWxpZGF0ZSk7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4gICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4gICAgICAgIGVkaXRSb2JvdCh7XG4gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbiAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gICAgLy9yZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvciwgbG9hZE1vZGVsfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2UgaWYgKGlzRW1wdHkobW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8qXG48VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiovXG5cbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIilcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5uYW1lLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8odGhpcy52YWxpZGF0b3JUeXBlcygpLmFzc2VtYmx5RGF0ZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSwiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge3RvQXJyYXl9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IFBhZ2luYXRpb24gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvblwiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgRXJyb3IgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvZXJyb3JcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3RJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgdG90YWwsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtYWRkXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tZ3JlZW5cIiB0aXRsZT1cIkFkZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1wbHVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxoMT5Sb2JvdHM8L2gxPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfSxcbn0pO1xuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgcmVtb3ZlUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBtZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgY2F0ZWdvcnk6IHVuZGVmaW5lZCxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIFBST1hZIFJPVVRFUiBUTyBTT0xWRSBDSVJDVUxBUiBERVBFTkRFTkNZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgbWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci50cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci5yZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEJhb2JhYiA9IHJlcXVpcmUoXCJiYW9iYWJcIik7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoe1xuICByb2JvdHM6IHtcbiAgICBtb2RlbHM6IHt9LFxuICAgIG1vZGVsSWRzOiBbMSwgMiwgMywgNCwgNV0sXG4gICAgdG90YWw6IDAsXG4gICAgbG9hZGluZzogdHJ1ZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgfSxcbiAgYWxlcnRzOiB7XG4gICAgbW9kZWxzOiB7fSxcbiAgICB0b3RhbDogMCxcbiAgICBsb2FkaW5nOiB0cnVlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICB9LFxufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSW5zcGVjdCA9IHJlcXVpcmUoXCJ1dGlsLWluc3BlY3RcIik7XG5cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSG93IGl0J3MgZXZlciBtaXNzZWQ/IVxuUmVnRXhwLmVzY2FwZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufTtcblxuLy8gKGMpIExvZGFzaC4gU3VwZXIgcmVxdWlyZWQgbWV0aG9kLCBib3JlZCB0byBpbXBvcnQgdGhpc1xuQXJyYXkucmFuZ2UgPSBmdW5jdGlvbiByYW5nZShzdGFydCwgZW5kLCBzdGVwKSB7XG4gIGlmIChzdGVwICYmIGlzSXRlcmF0ZWVDYWxsKHN0YXJ0LCBlbmQsIHN0ZXApKSB7XG4gICAgZW5kID0gc3RlcCA9IG51bGw7XG4gIH1cbiAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiAoK3N0ZXAgfHwgMCk7XG5cbiAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgZW5kID0gc3RhcnQ7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGVuZCA9ICtlbmQgfHwgMDtcbiAgfVxuICAvLyBVc2UgYEFycmF5KGxlbmd0aClgIHNvIGVuZ2luZXMgbGlrZSBDaGFrcmEgYW5kIFY4IGF2b2lkIHNsb3dlciBtb2Rlcy5cbiAgLy8gU2VlIGh0dHBzOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXMgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIFJlcXVpcmVkIGZvciBwYWdpbmF0aW9uXG4vLyBgQXJyYXkuY2h1bmtlZChbMSwgMiwgMywgNCwgNV0sIDIpYCA9PiBbWzEsIDJdLCBbMywgNF0sIFs1XV1cbkFycmF5LmNodW5rZWQgPSBmdW5jdGlvbiBjaHVua2VkKGFycmF5LCBuKSB7XG4gIGxldCBsID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIG4pO1xuICByZXR1cm4gQXJyYXkucmFuZ2UobCkubWFwKCh4LCBpKSA9PiBhcnJheS5zbGljZShpKm4sIGkqbiArIG4pKTtcbn07XG5cbmlmIChwcm9jZXNzKSB7XG4gIC8vIElPSlMgaGFzIGB1bmhhbmRsZWRSZWplY3Rpb25gIGhvb2tcbiAgcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBmdW5jdGlvbiAocmVhc29uLCBwKSB7XG4gICAgdGhyb3cgRXJyb3IoYFVuaGFuZGxlZFJlamVjdGlvbjogJHtyZWFzb259YCk7XG4gIH0pO1xufSBlbHNlIHtcbiAgLy8gQlJPV1NFUiAoQ2FuYXJ5IGxvZ3MgdW5oYW5kbGVkIGV4Y2VwdGlvbnMgb3RoZXJzIGp1c3Qgc3dhbGxvdylcbiAgUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzXG4gICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHRocm93IGU7IH0sIDEpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgLy8gV29ya2Fyb3VuZCBtZXRob2QgYXMgbmF0aXZlIGJyb3dzZXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIEltbXV0YWJsZSBpcyBhd2Z1bFxuICB3aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gbG9nKCkge1xuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykubWFwKHYgPT4gSW5zcGVjdCh2KSkpO1xuICB9O1xufSJdfQ==
