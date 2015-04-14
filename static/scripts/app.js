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

},{"frontend/alert/actions/loadmany":4,"frontend/common/components/about":9,"frontend/common/components/body":10,"frontend/common/components/home":13,"frontend/common/components/notfound":15,"frontend/robot/actions/loadmany":19,"frontend/robot/components/add":21,"frontend/robot/components/detail":22,"frontend/robot/components/edit":23,"frontend/robot/components/index":24,"react":"react","react-router":"react-router","shared/shims":29}],2:[function(require,module,exports){
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

// ACTIONS =========================================================================================
module.exports = add;
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

},{"axios":"axios","frontend/common/helpers":16,"frontend/router":27,"frontend/state":28}],5:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = remove;
// IMPORTS =========================================================================================
var State = require("frontend/state");
function remove(id) {
  var apiURL = "/api/alerts/" + id;

  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}

},{"frontend/state":28}],6:[function(require,module,exports){
"use strict";

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
module.exports = React.createClass({
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

},{"frontend/alert/components/item":7,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/common/helpers":16,"frontend/state":28,"react":"react"}],7:[function(require,module,exports){
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
    expire: data.category == "error" ? 0 : 5000 }, data);
}

},{"node-uuid":"node-uuid"}],9:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var AlertIndex = require("frontend/alert/components/index");
var Headroom = require("frontend/common/components/headroom");

// EXPORTS =========================================================================================
module.exports = React.createClass({
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

},{"frontend/alert/components/index":6,"frontend/common/components/headroom":12,"react":"react","react-router":"react-router"}],11:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  displayName: "error",

  render: function render() {
    var sizeClass = this.props.size ? " loading-" + this.props.size : "";
    return React.createElement(
      DocumentTitle,
      { title: "Error " + this.props.loadError.status + ": " + this.props.loadError.description },
      React.createElement(
        "div",
        { className: "alert-as-icon fa-stack" + sizeClass },
        React.createElement("i", { className: "fa fa-cog fa-stack-1x" }),
        React.createElement("i", { className: "fa fa-ban fa-stack-2x" })
      )
    );
  }
});

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],12:[function(require,module,exports){
"use strict";

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

module.exports = Headroom;

},{"lodash.throttle":"lodash.throttle","react":"react"}],13:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],14:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
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

},{"react":"react","react-document-title":"react-document-title"}],15:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],16:[function(require,module,exports){
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

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],17:[function(require,module,exports){
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
  var apiURL = "/api/robots/" + id;

  // Optimistic add
  State.select("robots").set("loading", true);
  State.select("robots", "models").set(id, newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    var status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Action `Robot.add` succeed", category: "success" });
    return status;
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
      return loadError.description; // TODO: do we need this?
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

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":26,"frontend/router":27,"frontend/state":28}],18:[function(require,module,exports){
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
  var oldModel = State.select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic edit
  State.select("robots").set("loading", true);
  State.select("robots", "models").set(id, newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    var status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    addAlert({ message: "Action `Robot.edit` succeed", category: "success" });
    return status;
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
      return loadError.description;
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

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/robot/models":26,"frontend/router":27,"frontend/state":28}],19:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = loadMany;
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
    var models = toObject(response.data);
    State.select("robots").edit({ loading: false, loadError: undefined, models: models });
    State.select("robots").edit({ loading: false, loadError: undefined, models: models });
    return models; // TODO: why here models are returning, and in add/edit status?
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
      return loadError.description;
    }
  });
}

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/common/helpers":16,"frontend/router":27,"frontend/state":28}],20:[function(require,module,exports){
"use strict";

// ACTIONS =========================================================================================
module.exports = remove;
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
    var status = response.statusText;
    State.select("robots").set("loading", false);
    State.select("robots").set("loadError", undefined);
    Router.transitionTo("robot-index");
    addAlert({ message: "Action `Robot.remove` succeed", category: "success" });
    return status;
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
      return loadError.description;
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

},{"axios":"axios","frontend/alert/actions/add":3,"frontend/router":27,"frontend/state":28}],21:[function(require,module,exports){
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

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/add":17,"frontend/state":28,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],22:[function(require,module,exports){
"use strict";

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

},{"frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/remove":20,"frontend/state":28,"lodash.isempty":"lodash.isempty","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],23:[function(require,module,exports){
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

  //validatorTypes() {
  //  return Validators.model;
  //},

  //validatorData() {
  //  return this.state.model;
  //},

  validate: function validate(key) {},

  handleChangeFor: function handleChangeFor(key) {},

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

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/edit":18,"frontend/robot/actions/remove":20,"frontend/state":28,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],24:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

var Loading = require("frontend/common/components/loading");
var Error = require("frontend/common/components/error");
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

},{"frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/helpers":16,"frontend/robot/components/item":25,"frontend/state":28,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],25:[function(require,module,exports){
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

},{"frontend/robot/actions/remove":20,"react":"react","react-router":"react-router"}],26:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],27:[function(require,module,exports){
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
    loading: true,
    loadError: undefined },
  alerts: {
    models: {},
    loading: true,
    loadError: undefined } });

},{"baobab":"baobab"}],29:[function(require,module,exports){
(function (process){
"use strict";

// IMPORTS =========================================================================================
var Inspect = require("util-inspect");

require("babel/polyfill");

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

// Super required method, bored to import `lodash.range`
// `Array.range(5)` => [0, 1, 2, 3, 4]
Array.range = function range(n) {
  return Array.apply(null, new Array(n)).map(function (x, i) {
    return i;
  });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmcuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZG1hbnkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L21vZGVscy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvc3RhdGUuanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxLQUFLLEdBQWtELFdBQVcsQ0FBbEUsS0FBSztJQUFFLFlBQVksR0FBb0MsV0FBVyxDQUEzRCxZQUFZO0lBQUUsYUFBYSxHQUFxQixXQUFXLENBQTdDLGFBQWE7SUFBRSxlQUFlLEdBQUksV0FBVyxDQUE5QixlQUFlOzs7QUFHeEQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7QUFHeEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlD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LEdBQUcsR0FBRztBQUNuQyxXQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7YUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUM7R0FDeEYsQ0FBQztDQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gU2hpbXMsIHBvbHlmaWxsc1xucmVxdWlyZShcInNoYXJlZC9zaGltc1wiKTtcblxuLy8gQ29tbW9uXG5sZXQgQm9keSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5XCIpO1xubGV0IEhvbWUgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZVwiKTtcbmxldCBBYm91dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dFwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcblxuLy8gQWxlcnRcbmxldCBsb2FkTWFueUFsZXJ0cyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2xvYWRtYW55XCIpO1xuXG4vLyBSb2JvdFxubGV0IGxvYWRNYW55Um9ib3RzID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZG1hbnlcIik7XG5sZXQgUm9ib3RJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IFJvYm90QWRkID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCIpO1xubGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xubGV0IFJvYm90RWRpdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIik7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJhYm91dFwiIHBhdGg9XCIvYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1hZGRcIiBwYXRoPVwiYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZWRpdFwiIHBhdGg9XCI6aWQvZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pO1xuXG53aW5kb3cucm91dGVyID0gUmVhY3RSb3V0ZXIuY3JlYXRlKHtcbiAgcm91dGVzOiByb3V0ZXMsXG4gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbn0pO1xuXG53aW5kb3cucm91dGVyLnJ1bigoSGFuZGxlciwgc3RhdGUpID0+IHtcbiAgLy8geW91IG1pZ2h0IHdhbnQgdG8gcHVzaCB0aGUgc3RhdGUgb2YgdGhlIHJvdXRlciB0byBhXG4gIC8vIHN0b3JlIGZvciB3aGF0ZXZlciByZWFzb25cbiAgLy8gUm91dGVyQWN0aW9ucy5yb3V0ZUNoYW5nZSh7cm91dGVyU3RhdGU6IHN0YXRlfSk7XG5cbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG5cbmxvYWRNYW55QWxlcnRzKCk7XG5sb2FkTWFueVJvYm90cygpOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gQWxlcnQobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9ucGVyc2lzdGVudCBhZGRcbiAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgbmV3TW9kZWwpO1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IHt0b09iamVjdH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1hbnkoKSB7XG4gIGxldCBhcGlVUkwgPSBgYXBpL2FsZXJ0c2A7XG5cbiAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpLmVkaXQoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiB7fX0pO1xuICByZXR1cm4ge307XG4gIC8vIFRPRE86IGJhY2tlbmRcbiAgLy9yZXR1cm4gQXhpb3MuZ2V0KGFwaVVSTClcbiAgLy8gIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgLy8gICAgbGV0IG1vZGVscyA9IHRvT2JqZWN0KHJlc3BvbnNlLmRhdGEpO1xuICAvLyAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IG1vZGVsc30pO1xuICAvLyAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IG1vZGVsc30pO1xuICAvLyAgICByZXR1cm4gbW9kZWxzO1xuICAvLyAgfSlcbiAgLy8gIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gIC8vICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gIC8vICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gIC8vICAgIH0gZWxzZSB7XG4gIC8vICAgICAgbGV0IGxvYWRFcnJvciA9IHtzdGF0dXM6IHJlc3BvbnNlLnN0YXR1c1RleHQsIHVybDogYXBpVVJMfTtcbiAgLy8gICAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gIC8vICAgICAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpLnNldChcImxvYWRFcnJvclwiLCBsb2FkRXJyb3IpO1xuICAvLyAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgQWxlcnQubG9hZE1hbnlgIGZhaWxlZFwiLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gIC8vICAgICAgcmV0dXJuIGxvYWRFcnJvcjtcbiAgLy8gICAgfVxuICAvLyAgfSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9uLXBlcnNpc3RlbnQgcmVtb3ZlXG4gIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuLy9sZXQgQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZShcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCIpO1xubGV0IHt0b0FycmF5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgQWxlcnRJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIGFsZXJ0czogW1wiYWxlcnRzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5hbGVydHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBDYW4ndCBydW4gdGhpcyBjcmFwIGZvciBub3dcbi8vIDEpIHJlYWN0L2FkZG9ucyBwdWxscyB3aG9sZSBuZXcgcmVhY3QgY2xvbmUgaW4gYnJvd3NlcmlmeVxuLy8gMikgcmMtY3NzLXRyYW5zaXRpb24tZ3JvdXAgY29udGFpbnMgdW5jb21waWxlZCBKU1ggc3ludGF4XG4vLyBPTUcgd2hhdCBhbiBpZGlvdHMgJl8mXG5cbi8vPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbi8vICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4vLzwvQ1NTVHJhbnNpdGlvbkdyb3VwPlxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGNsYXNzTmFtZXMgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHJlbW92ZUFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRXhwaXJlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBkZWxheTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAvL29uRXhwaXJlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY3Rpb24sXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWxheTogNTAwLFxuICAgICAgLy9vbkV4cGlyZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBSZXNldCB0aGUgdGltZXIgaWYgY2hpbGRyZW4gYXJlIGNoYW5nZWRcbiAgICBpZiAobmV4dFByb3BzLmNoaWxkcmVuICE9PSB0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRUaW1lcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgLy8gQ2xlYXIgZXhpc3RpbmcgdGltZXJcbiAgICBpZiAodGhpcy5fdGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFmdGVyIGBtb2RlbC5kZWxheWAgbXNcbiAgICBpZiAodGhpcy5wcm9wcy5kZWxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGlyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGlyZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgICAgIH0sIHRoaXMucHJvcHMuZGVsYXkpO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuICB9LFxufSk7XG5cbmxldCBDbG9zZUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImNsb3NlIHB1bGwtcmlnaHRcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PiZ0aW1lczs8L2E+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGxldCBjbGFzc2VzID0gY2xhc3NOYW1lcyh7XG4gICAgICBcImFsZXJ0XCI6IHRydWUsXG4gICAgICBbXCJhbGVydC1cIiArIG1vZGVsLmNhdGVnb3J5XTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bW9kZWwuY2xvc2FibGUgPyA8Q2xvc2VMaW5rIG9uQ2xpY2s9e3JlbW92ZUFsZXJ0LmJpbmQodGhpcywgbW9kZWwuaWQpfS8+IDogXCJcIn1cbiAgICAgICAge21vZGVsLm1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgaWYgKG1vZGVsLmV4cGlyZSkge1xuICAgICAgcmVzdWx0ID0gPEV4cGlyZSBvbkV4cGlyZT17cmVtb3ZlQWxlcnQuYmluZCh0aGlzLCBtb2RlbC5pZCl9IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IGRhdGEuY2F0ZWdvcnkgPT0gXCJlcnJvclwiID8gMCA6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJBYm91dFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBpbmZvXCI+XG4gICAgICAgICAgPGgxPlNpbXBsZSBQYWdlIEV4YW1wbGU8L2gxPlxuICAgICAgICAgIDxwPlRoaXMgcGFnZSB3YXMgcmVuZGVyZWQgYnkgYSBKYXZhU2NyaXB0PC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IEFsZXJ0SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pbmRleFwiKTtcbmxldCBIZWFkcm9vbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgbGV0IGhlYWRyb29tQ2xhc3NOYW1lcyA9IHt2aXNpYmxlOiBcIm5hdmJhci1kb3duXCIsIGhpZGRlbjogXCJuYXZiYXItdXBcIn07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxIZWFkcm9vbSBjb21wb25lbnQ9XCJoZWFkZXJcIiBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIj5Sb2JvdHM8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJhYm91dFwiPkFib3V0PC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9IZWFkcm9vbT5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgPEFsZXJ0SW5kZXgvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVycm9yIFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3Iuc3RhdHVzICsgXCI6IFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3IuZGVzY3JpcHRpb259PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uIGZhLXN0YWNrXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zdGFjay0xeFwiPjwvaT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1iYW4gZmEtc3RhY2stMnhcIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHRocm90dGxlID0gcmVxdWlyZShcImxvZGFzaC50aHJvdHRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhlYWRyb29tID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIGhlYWRyb29tQ2xhc3NOYW1lczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgICB9XG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21wb25lbnQ6IFwiZGl2XCIsXG4gICAgfVxuICB9LFxuXG4gIGhhc1Njcm9sbGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfSxcblxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWU6IFwiXCJcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRyb29tO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJlYWN0IFN0YXJ0ZXJcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaG9tZVwiPlxuICAgICAgICAgIDxoMT5SZWFjdCBzdGFydGVyIGFwcDwvaDE+XG4gICAgICAgICAgPHA+UHJvb2Ygb2YgY29uY2VwdHMsIENSVUQsIHdoYXRldmVyLi4uPC9wPlxuICAgICAgICAgIDxwPlByb3VkbHkgYnVpbGQgb24gRVM2IHdpdGggdGhlIGhlbHAgb2YgPGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gdHJhbnNwaWxlci48L3A+XG4gICAgICAgICAgPGgzPkZyb250ZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvXCI+UmVhY3Q8L2E+IGRlY2xhcmF0aXZlIFVJPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1lvbWd1aXRoZXJlYWwvYmFvYmFiXCI+QmFvYmFiPC9hPiBKUyBkYXRhIHRyZWUgd2l0aCBjdXJzb3JzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3JhY2t0L3JlYWN0LXJvdXRlclwiPlJlYWN0LVJvdXRlcjwvYT4gZGVjbGFyYXRpdmUgcm91dGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtZG9jdW1lbnQtdGl0bGVcIj5SZWFjdC1Eb2N1bWVudC1UaXRsZTwvYT4gZGVjbGFyYXRpdmUgZG9jdW1lbnQgdGl0bGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vXCI+UmVhY3QtQm9vdHN0cmFwPC9hPiBCb290c3RyYXAgY29tcG9uZW50cyBpbiBSZWFjdDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9icm93c2VyaWZ5Lm9yZy9cIj5Ccm93c2VyaWZ5PC9hPiAmYW1wOyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL3dhdGNoaWZ5XCI+V2F0Y2hpZnk8L2E+IGJ1bmRsZSBOUE0gbW9kdWxlcyB0byBmcm9udGVuZDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ib3dlci5pby9cIj5Cb3dlcjwvYT4gZnJvbnRlbmQgcGFja2FnZSBtYW5hZ2VyPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2V4cHJlc3Nqcy5jb20vXCI+RXhwcmVzczwvYT4gd2ViLWFwcCBiYWNrZW5kIGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb3ppbGxhLmdpdGh1Yi5pby9udW5qdWNrcy9cIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2VsZWl0aC9lbWFpbGpzXCI+RW1haWxKUzwvYT4gU01UUCBjbGllbnQ8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gSlMgdHJhbnNwaWxlcjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ndWxwanMuY29tL1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2xvZGFzaC5jb20vXCI+TG9kYXNoPC9hPiB1dGlsaXR5IGxpYnJhcnk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvc1wiPkF4aW9zPC9hPiBwcm9taXNlLWJhc2VkIEhUVFAgY2xpZW50PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2ltbXV0YWJsZS1qc1wiPkltbXV0YWJsZTwvYT4gcGVyc2lzdGVudCBpbW11dGFibGUgZGF0YSBmb3IgSlM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW9tZW50anMuY29tL1wiPk1vbWVudDwvYT4gZGF0ZS10aW1lIHN0dWZmPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hcmFrL0Zha2VyLmpzL1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2dpdC1zY20uY29tL1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG4vKlxuKiBUT0RPXG4qXG4qIDxsaT48YSBocmVmPVwiaHR0cDovL3NvY2tldC5pby9cIj5Tb2NrZXRJTzwvYT4gcmVhbC10aW1lIGVuZ2luZTwvbGk+XG4qIHZhbGlkYXRpb25cbiogYmFiZWxpZnk/XG4qIGNoYWk/XG4qIGNsYXNzbmFtZXM/XG4qIGNvbmZpZz9cbiogY2xpZW50Y29uZmlnP1xuKiBoZWxtZXQ/XG4qIGh1c2t5dlxuKiBtb2NoYT9cbiogbW9yZ2FuP1xuKiB3aW5zdG9uP1xuKiB5YXJncz9cbiogKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImFsZXJ0LWFzLWljb25cIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHNvcnRCeSA9IHJlcXVpcmUoXCJsb2Rhc2guc29ydGJ5XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XG4gIGlmIChpc0FycmF5KGFycmF5KSkge1xuICAgIHJldHVybiBhcnJheS5yZWR1Y2UoKG9iamVjdCwgaXRlbSkgPT4ge1xuICAgICAgb2JqZWN0W2l0ZW0uaWRdID0gaXRlbTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSwge30pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKFwiZXhwZWN0ZWQgdHlwZSBpcyBBcnJheSwgZ2V0IFwiICsgdHlwZW9mIGFycmF5KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheShvYmplY3QpIHtcbiAgaWYgKGlzUGxhaW5PYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBzb3J0QnkoXG4gICAgICBPYmplY3Qua2V5cyhvYmplY3QpLm1hcChrZXkgPT4gb2JqZWN0W2tleV0pLFxuICAgICAgaXRlbSA9PiBpdGVtLmlkXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihcImV4cGVjdGVkIHR5cGUgaXMgT2JqZWN0LCBnZXQgXCIgKyB0eXBlb2Ygb2JqZWN0KTtcbiAgfVxufVxuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGFkZFxuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgbmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQoYXBpVVJMLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIGxvYWRFcnJvci5kZXNjcmlwdGlvbjsgLy8gVE9ETzogZG8gd2UgbmVlZCB0aGlzP1xuICAgICAgfVxuICAgIH0pO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgc3RhdHVzKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZFwiLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IGFkZEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L21vZGVsc1wiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWRpdChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgb2xkTW9kZWwgPSBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgZWRpdFxuICAgICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIGxvYWRFcnJvci5kZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICByZXR1cm4gc3RhdHVzO1xuICB9IC8vIGVsc2VcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IHt0b09iamVjdH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1hbnkoKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvYDtcblxuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldChhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IG1vZGVscyA9IHRvT2JqZWN0KHJlc3BvbnNlLmRhdGEpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLmVkaXQoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gICAgICByZXR1cm4gbW9kZWxzOyAvLyBUT0RPOiB3aHkgaGVyZSBtb2RlbHMgYXJlIHJldHVybmluZywgYW5kIGluIGFkZC9lZGl0IHN0YXR1cz9cbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gICAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QubG9hZE1hbnlgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIGxvYWRFcnJvci5kZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IGFkZEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZShhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIGxvYWRFcnJvci5kZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJlc3VsdCA9IHJlcXVpcmUoXCJsb2Rhc2gucmVzdWx0XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IG1lcmdlID0gcmVxdWlyZShcImxvZGFzaC5tZXJnZVwiKTtcbmxldCBkZWJvdW5jZSA9IHJlcXVpcmUoXCJsb2Rhc2guZGVib3VuY2VcIik7XG5sZXQgZmxhdHRlbiA9IHJlcXVpcmUoXCJsb2Rhc2guZmxhdHRlblwiKTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuLy9sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbi8vbGV0IFZhbGlkYXRvcnMgPSByZXF1aXJlKFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IEVycm9yID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IGFkZFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDoge1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfVxuICB9LFxuXG4gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4gIC8vICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbiAgLy99LFxuXG4gIC8vdmFsaWRhdG9yRGF0YSgpIHtcbiAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuICAvL30sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIC8vfSk7XG4gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIC8vfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgLy8gIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgLy8gIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgLy99LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIC8vcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcblxuICBoYW5kbGVSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuICAgICAgICBhZGRSb2JvdCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbiAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzRW1wdHkodGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPkFkZCBSb2JvdDwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBFcnJvciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvclwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWFjdFJvdXRlci5TdGF0ZSwgU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAgICAgbW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSBpZiAoaXNFbXB0eShtb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmlkfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5hc3NlbWJseURhdGV9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwubWFudWZhY3R1cmVyfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByZXN1bHQgPSByZXF1aXJlKFwibG9kYXNoLnJlc3VsdFwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5sZXQgaXNFbXB0eSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNlbXB0eVwiKTtcbmxldCBtZXJnZSA9IHJlcXVpcmUoXCJsb2Rhc2gubWVyZ2VcIik7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IGZsYXR0ZW4gPSByZXF1aXJlKFwibG9kYXNoLmZsYXR0ZW5cIik7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbi8vbGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG4vL2xldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBFcnJvciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvclwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBlZGl0Um9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0XCIpO1xubGV0IHJlbW92ZVJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBsZXQgbG9hZE1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmxvYWRNb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4gIC8vICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbiAgLy99LFxuXG4gIC8vdmFsaWRhdG9yRGF0YSgpIHtcbiAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuICAvL30sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIC8vfSk7XG4gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbiAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIC8vfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgLy8gIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgLy8gIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgLy99LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4gIH0sIDUwMCksXG5cbiAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4gICAgfSwgdGhpcy52YWxpZGF0ZSk7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4gICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4gICAgICAgIGVkaXRSb2JvdCh7XG4gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbiAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGlzRW1wdHkodGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3IsIGxvYWRNb2RlbH0gPSB0aGlzLnByb3BzO1xuICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIGlmIChpc0VtcHR5KG1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFZGl0IFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5pZCArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5uYW1lfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IEVycm9yID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IFJvYm90SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtYWRkXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tZ3JlZW5cIiB0aXRsZT1cIkFkZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1wbHVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxoMT5Sb2JvdHM8L2gxPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfSxcbn0pO1xuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgcmVtb3ZlUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBtZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgY2F0ZWdvcnk6IHVuZGVmaW5lZCxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIFBST1hZIFJPVVRFUiBUTyBTT0xWRSBDSVJDVUxBUiBERVBFTkRFTkNZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgbWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci50cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci5yZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEJhb2JhYiA9IHJlcXVpcmUoXCJiYW9iYWJcIik7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoe1xuICByb2JvdHM6IHtcbiAgICBtb2RlbHM6IHt9LFxuICAgIGxvYWRpbmc6IHRydWUsXG4gICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gIH0sXG4gIGFsZXJ0czoge1xuICAgIG1vZGVsczoge30sXG4gICAgbG9hZGluZzogdHJ1ZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgfSxcbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEluc3BlY3QgPSByZXF1aXJlKFwidXRpbC1pbnNwZWN0XCIpO1xuXG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhvdyBpdCdzIGV2ZXIgbWlzc2VkPyFcblJlZ0V4cC5lc2NhcGUgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbn07XG5cbi8vIFN1cGVyIHJlcXVpcmVkIG1ldGhvZCwgYm9yZWQgdG8gaW1wb3J0IGBsb2Rhc2gucmFuZ2VgXG4vLyBgQXJyYXkucmFuZ2UoNSlgID0+IFswLCAxLCAyLCAzLCA0XVxuQXJyYXkucmFuZ2UgPSBmdW5jdGlvbiByYW5nZShuKSB7XG4gIHJldHVybiBBcnJheS5hcHBseShudWxsLCBuZXcgQXJyYXkobikpLm1hcCgoeCwgaSkgPT4gaSk7XG59O1xuXG4vLyBSZXF1aXJlZCBmb3IgcGFnaW5hdGlvblxuLy8gYEFycmF5LmNodW5rZWQoWzEsIDIsIDMsIDQsIDVdLCAyKWAgPT4gW1sxLCAyXSwgWzMsIDRdLCBbNV1dXG5BcnJheS5jaHVua2VkID0gZnVuY3Rpb24gY2h1bmtlZChhcnJheSwgbikge1xuICBsZXQgbCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyBuKTtcbiAgcmV0dXJuIEFycmF5LnJhbmdlKGwpLm1hcCgoeCwgaSkgPT4gYXJyYXkuc2xpY2UoaSpuLCBpKm4gKyBuKSk7XG59O1xuXG5pZiAocHJvY2Vzcykge1xuICAvLyBJT0pTIGhhcyBgdW5oYW5kbGVkUmVqZWN0aW9uYCBob29rXG4gIHByb2Nlc3Mub24oXCJ1bmhhbmRsZWRSZWplY3Rpb25cIiwgZnVuY3Rpb24gKHJlYXNvbiwgcCkge1xuICAgIHRocm93IEVycm9yKGBVbmhhbmRsZWRSZWplY3Rpb246ICR7cmVhc29ufWApO1xuICB9KTtcbn0gZWxzZSB7XG4gIC8vIEJST1dTRVIgKENhbmFyeSBsb2dzIHVuaGFuZGxlZCBleGNlcHRpb25zIG90aGVycyBqdXN0IHN3YWxsb3cpXG4gIFByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpc1xuICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aHJvdyBlOyB9LCAxKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIC8vIFdvcmthcm91bmQgbWV0aG9kIGFzIG5hdGl2ZSBicm93c2VyIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBJbW11dGFibGUgaXMgYXdmdWxcbiAgd2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IEluc3BlY3QodikpKTtcbiAgfTtcbn0iXX0=
