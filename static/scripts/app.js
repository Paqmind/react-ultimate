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
var Shims = require("./shims");

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

},{"./shims":2,"frontend/alert/actions/loadmany":4,"frontend/common/components/about":9,"frontend/common/components/body":10,"frontend/common/components/home":13,"frontend/common/components/notfound":15,"frontend/robot/actions/loadmany":19,"frontend/robot/components/add":21,"frontend/robot/components/detail":22,"frontend/robot/components/edit":23,"frontend/robot/components/index":24,"react":"react","react-router":"react-router"}],2:[function(require,module,exports){
"use strict";

var Inspect = require("util-inspect");
require("babel/polyfill");

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

},{"babel/polyfill":"babel/polyfill","util-inspect":"util-inspect"}],3:[function(require,module,exports){


// ACTIONS =========================================================================================
"use strict";

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


// ACTIONS =========================================================================================
"use strict";

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


// ACTIONS =========================================================================================
"use strict";

module.exports = remove;
// IMPORTS =========================================================================================
var State = require("frontend/state");
function remove(id) {
  var apiURL = "/api/alerts/" + id;

  // Non-persistent remove
  State.select("alerts", "models").unset(id);
}

},{"frontend/state":28}],6:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

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
    var loading = _state$cursors$alerts.loading;
    var loadError = _state$cursors$alerts.loadError;

    models = toArray(models);

    if (loadError) {
      return React.createElement(Error, { loadError: loadError });
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
        ),
        loading ? React.createElement(Loading, null) : ""
      );
    }
  }
});

},{"frontend/alert/components/item":7,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/common/helpers":16,"frontend/state":28,"react":"react","react/addons":"react/addons"}],7:[function(require,module,exports){
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


// MODELS ==========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],14:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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


// HELPERS =========================================================================================
"use strict";

exports.toObject = toObject;
exports.toArray = toArray;
Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],17:[function(require,module,exports){


// ACTIONS =========================================================================================
"use strict";

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


// ACTIONS =========================================================================================
"use strict";

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


// ACTIONS =========================================================================================
"use strict";

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


// ACTIONS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
var Validators = require("shared/robot/validators");
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

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/add":17,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],22:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
var Validators = require("shared/robot/validators");
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

},{"classnames":"classnames","frontend/common/components/error":11,"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/edit":18,"frontend/robot/actions/remove":20,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],24:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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


// MODELS ==========================================================================================
"use strict";

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
// PROXY ROUTER TO SOLVE CIRCULAR DEPENDENCY =======================================================
"use strict";

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
// IMPORTS =========================================================================================
"use strict";

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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Joi = require("joi");

// RULES ===========================================================================================
var model = {
  name: Joi.string().required(),
  assemblyDate: Joi.date().max("now").required(),
  manufacturer: Joi.string().required() };
exports.model = model;

},{"joi":"joi"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsImZyb250ZW5kL3NjcmlwdHMvc2hpbXMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmcuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZG1hbnkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L21vZGVscy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb3V0ZXIuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvc3RhdGUuanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3JvYm90L3ZhbGlkYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssR0FBa0QsV0FBVyxDQUFsRSxLQUFLO0lBQUUsWUFBWSxHQUFvQyxXQUFXLENBQTNELFlBQVk7SUFBRSxhQUFhLEdBQXFCLFdBQVcsQ0FBN0MsYUFBYTtJQUFFLGVBQWUsR0FBSSxXQUFXLENBQTlCLGVBQWU7OztBQUd4RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUcvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUN4RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7O0FBRzlELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzs7QUFHaEUsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDaEUsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDeEQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDOUQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7OztBQUcxRCxJQUFJLE1BQU0sR0FDUjtBQUFDLE9BQUs7SUFBQyxPQUFPLEVBQUUsSUFBSSxBQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUc7RUFDNUIsb0JBQUMsWUFBWSxJQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFFLElBQUksQUFBQyxHQUFFO0VBQzFDLG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLEtBQUssQUFBQyxHQUFFO0VBQ25ELG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsYUFBYSxFQUFDLE9BQU8sRUFBRSxVQUFVLEFBQUMsR0FBRTtFQUNoRCxvQkFBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFdBQVcsRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBRSxRQUFRLEFBQUMsR0FBRTtFQUN2RCxvQkFBQyxLQUFLLElBQUMsSUFBSSxFQUFDLGNBQWMsRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBRSxXQUFXLEFBQUMsR0FBRTtFQUM3RCxvQkFBQyxLQUFLLElBQUMsSUFBSSxFQUFDLFlBQVksRUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBRSxTQUFTLEFBQUMsR0FBRTtFQUM5RCxvQkFBQyxhQUFhLElBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0NBQzdCLEFBQ1QsQ0FBQzs7QUFFRixNQUFNLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7QUFDakMsUUFBTSxFQUFFLE1BQU07QUFDZCxVQUFRLEVBQUUsZUFBZTtDQUMxQixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFLOzs7OztBQUtwQyxPQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFDLE9BQU8sT0FBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN6QyxDQUFDLENBQUM7O0FBRUgsY0FBYyxFQUFFLENBQUM7QUFDakIsY0FBYyxFQUFFLENBQUM7Ozs7O0FDbkRqQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRTtBQUMxRCxNQUFJLENBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FDeEIsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNsQixjQUFVLENBQUMsWUFBWTtBQUFFLFlBQU0sQ0FBQyxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUN6QyxDQUFDLENBQUM7Q0FDTixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHO0FBQ25DLFNBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztXQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUMsQ0FBQztDQUN4RixDQUFDOzs7Ozs7OztpQkNSc0IsR0FBRzs7QUFKM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFHOUIsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQ2pDLE1BQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixNQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQ3JCLE1BQUksTUFBTSxvQkFBa0IsRUFBRSxBQUFFLENBQUM7OztBQUdqQyxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ3BEOzs7Ozs7OztpQkNMdUIsUUFBUTs7QUFOaEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNaLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzs7SUFBOUMsUUFBUSxZQUFSLFFBQVE7O0FBQ2IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHdkIsU0FBUyxRQUFRLEdBQUc7QUFDakMsTUFBSSxNQUFNLGVBQWUsQ0FBQzs7QUFFMUIsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7QUFDaEYsU0FBTyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBb0JYOzs7Ozs7OztpQkMzQnVCLE1BQU07O0FBSDlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBR3ZCLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNqQyxNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQzVDOzs7Ozs7QUNSRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0lBQ3hCLGtCQUFrQixHQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQXBELGtCQUFrQjs7ZUFDUCxPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTdDLE9BQU8sWUFBUCxPQUFPOztBQUNaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzVELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBQzlELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOzs7aUJBRzNDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztBQUVyQixTQUFPLEVBQUU7QUFDUCxVQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFDbkI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO2dDQUM0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQXZELE1BQU0seUJBQU4sTUFBTTtRQUFFLE9BQU8seUJBQVAsT0FBTztRQUFFLFNBQVMseUJBQVQsU0FBUzs7QUFDL0IsVUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxTQUFTLEVBQUU7QUFDYixhQUFPLG9CQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsU0FBUyxBQUFDLEdBQUUsQ0FBQztLQUN2QyxNQUFNO0FBQ0wsYUFDRTs7VUFBSyxTQUFTLEVBQUMsd0JBQXdCO1FBQ3JDO0FBQUMsNEJBQWtCO1lBQUMsY0FBYyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsS0FBSztVQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzttQkFBSSxvQkFBQyxTQUFTLElBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxBQUFDLEdBQUU7V0FBQSxDQUFDO1NBQzVDO1FBQ3BCLE9BQU8sR0FBRyxvQkFBQyxPQUFPLE9BQUUsR0FBRyxFQUFFO09BQ3RCLENBQ047S0FDSDtHQUNGO0NBQ0YsQ0FBQzs7Ozs7Ozs7OztBQ2pDRixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdkMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNoQixPQUFPLENBQUMsY0FBYyxDQUFDOztJQUEvQixJQUFJLFlBQUosSUFBSTs7QUFDVCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQzs7O0FBRzNELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUM3QixXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBRTlCOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLFdBQUssRUFBRSxHQUFHLEVBRVgsQ0FBQztHQUNIOztBQUVELG1CQUFpQixFQUFBLDZCQUFHO0FBQ2xCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjs7QUFFRCwyQkFBeUIsRUFBQSxtQ0FBQyxTQUFTLEVBQUU7O0FBRW5DLFFBQUksU0FBUyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUM5QyxVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7R0FDRjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7OztBQUNYLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOzs7QUFHN0IsUUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUM3QixrQkFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQjs7O0FBR0QsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDbEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsWUFBTTtBQUM3QixZQUFJLE1BQUssS0FBSyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7QUFDckMsZ0JBQUssS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO0FBQ0QsZUFBTyxNQUFLLE1BQU0sQ0FBQztPQUNwQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEI7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxXQUFPOzs7TUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7S0FBTyxDQUFDO0dBQ3pDLEVBQ0YsQ0FBQyxDQUFDOztBQUVILElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUNoQyxhQUFXLEVBQUEscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3RCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFdBQ0U7O1FBQUcsU0FBUyxFQUFDLGtCQUFrQixFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEFBQUM7O0tBQVksQ0FDL0U7R0FDSDtDQUNGLENBQUMsQ0FBQzs7QUFFSCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDM0IsV0FBUyxFQUFFO0FBQ1QsU0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUM5Qjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7QUFFN0IsUUFBSSxPQUFPLEdBQUcsVUFBVTtBQUN0QixhQUFTLElBQUksSUFDWixRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRyxJQUFJLEVBQ2pDLENBQUM7O0FBRUgsUUFBSSxNQUFNLEdBQ1I7O2lCQUFLLFNBQVMsRUFBRSxPQUFPLEFBQUMsSUFBSyxJQUFJLENBQUMsS0FBSztNQUNwQyxLQUFLLENBQUMsUUFBUSxHQUFHLG9CQUFDLFNBQVMsSUFBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxBQUFDLEdBQUUsR0FBRyxFQUFFO01BQzdFLEtBQUssQ0FBQyxPQUFPO0tBQ1YsQUFDUCxDQUFDOztBQUVGLFFBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUNoQixZQUFNLEdBQUc7QUFBQyxjQUFNO1VBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxBQUFDO1FBQUUsTUFBTTtPQUFVLENBQUM7S0FDckc7O0FBRUQsV0FBTyxNQUFNLENBQUM7R0FDZixFQUNGLENBQUMsQ0FBQzs7aUJBRVksSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQkM1RkssS0FBSzs7QUFIN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBR2pCLFNBQVMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUNsQyxNQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixVQUFNLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0dBQzNDO0FBQ0QsTUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbEIsVUFBTSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztHQUM1QztBQUNELFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuQixNQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNiLFlBQVEsRUFBRSxJQUFJO0FBQ2QsVUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQzVDLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDVjs7Ozs7O0FDZkQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQWtCLFdBQVcsQ0FBakMsSUFBSTtJQUFFLFlBQVksR0FBSSxXQUFXLENBQTNCLFlBQVk7O0FBQ3ZCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7aUJBR3JDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUEsa0JBQUc7QUFDUCxXQUNFO0FBQUMsbUJBQWE7UUFBQyxLQUFLLEVBQUMsT0FBTztNQUMxQjs7VUFBUyxTQUFTLEVBQUMscUJBQXFCO1FBQ3RDOzs7O1NBQTRCO1FBQzVCOzs7O1NBQTZDO09BQ3JDO0tBQ0ksQ0FDaEI7R0FDSDtDQUNGLENBQUM7Ozs7OztBQ2pCRixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBa0IsV0FBVyxDQUFqQyxJQUFJO0lBQUUsWUFBWSxHQUFJLFdBQVcsQ0FBM0IsWUFBWTs7QUFDdkIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7OztpQkFHL0MsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQy9CLFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQUksa0JBQWtCLEdBQUcsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQztBQUN2RSxXQUNFOzs7TUFDRTtBQUFDLGdCQUFRO1VBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyx1QkFBdUIsRUFBQyxrQkFBa0IsRUFBRSxrQkFBa0IsQUFBQztRQUNySDs7WUFBSyxTQUFTLEVBQUMsV0FBVztVQUN4Qjs7Y0FBSyxTQUFTLEVBQUMsZUFBZTtZQUM1Qjs7Z0JBQVEsU0FBUyxFQUFDLHlCQUF5QixFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsZUFBWSxVQUFVLEVBQUMsZUFBWSxxQkFBcUI7Y0FDaEg7O2tCQUFNLFNBQVMsRUFBQyxTQUFTOztlQUF5QjtjQUNsRCw4QkFBTSxTQUFTLEVBQUMsa0JBQWtCLEdBQVE7YUFDbkM7WUFDVDtBQUFDLGtCQUFJO2dCQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsRUFBRSxFQUFDLE1BQU07Y0FBQzs7a0JBQU0sU0FBUyxFQUFDLE9BQU87O2VBQWE7O2FBQWM7V0FDdkY7VUFDTjs7Y0FBSyxTQUFTLEVBQUMsMEVBQTBFO1lBQ3ZGOztnQkFBSSxTQUFTLEVBQUMsZ0JBQWdCO2NBQzVCOzs7Z0JBQUk7QUFBQyxzQkFBSTtvQkFBQyxFQUFFLEVBQUMsTUFBTTs7aUJBQVk7ZUFBSztjQUNwQzs7O2dCQUFJO0FBQUMsc0JBQUk7b0JBQUMsRUFBRSxFQUFDLGFBQWE7O2lCQUFjO2VBQUs7Y0FDN0M7OztnQkFBSTtBQUFDLHNCQUFJO29CQUFDLEVBQUUsRUFBQyxPQUFPOztpQkFBYTtlQUFLO2FBQ25DO1dBQ0Q7U0FDRjtPQUNHO01BRVg7O1VBQU0sRUFBRSxFQUFDLFdBQVc7UUFDbEIsb0JBQUMsWUFBWSxPQUFFO09BQ1Y7TUFFUCxvQkFBQyxVQUFVLE9BQUU7S0FDVCxDQUNOO0dBQ0g7Q0FDRixDQUFDOzs7Ozs7QUN2Q0YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQWtCLFdBQVcsQ0FBakMsSUFBSTtJQUFFLFlBQVksR0FBSSxXQUFXLENBQTNCLFlBQVk7O0FBQ3ZCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7aUJBR3JDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3JFLFdBQ0U7QUFBQyxtQkFBYTtRQUFDLEtBQUssRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEFBQUM7TUFDckc7O1VBQUssU0FBUyxFQUFFLHdCQUF3QixHQUFHLFNBQVMsQUFBQztRQUNuRCwyQkFBRyxTQUFTLEVBQUMsdUJBQXVCLEdBQUs7UUFDekMsMkJBQUcsU0FBUyxFQUFDLHVCQUF1QixHQUFLO09BQ3JDO0tBQ1EsQ0FDaEI7R0FDSDtDQUNGLENBQUM7Ozs7OztBQ2xCRixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7OztBQUcxQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDL0IsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsV0FBTztBQUNMLGVBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDakMsd0JBQWtCLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQzNDLENBQUE7R0FDRjs7QUFFRCxpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxlQUFTLEVBQUUsS0FBSyxFQUNqQixDQUFBO0dBQ0Y7O0FBRUQsYUFBVyxFQUFFLHVCQUFZO0FBQ3ZCLFFBQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7O0FBR3hDLFFBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXO0FBQUUsYUFBTztLQUFBOztBQUkzRSxRQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3hFLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO0tBQ2xFLE1BQ0k7QUFDSCxVQUFJLEFBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDN0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7T0FDbkU7S0FDRjtBQUNELFFBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDO0dBQ2xDOztBQUdELGlCQUFlLEVBQUUsMkJBQVk7QUFDM0IsV0FBTztBQUNMLGVBQVMsRUFBRSxFQUFFO0tBQ2QsQ0FBQztHQUNIOztBQUVELG1CQUFpQixFQUFFLDZCQUFZOztBQUU3QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUN2RSxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN2RCxRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7OztBQUd6RSxVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBR2pGLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO0dBQ25FOztBQUVELHNCQUFvQixFQUFFLGdDQUFZO0FBQ2hDLFVBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMvRDs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUNyQyxRQUFJLEtBQUssR0FBRyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFDLENBQUM7QUFDOUYsV0FBTyxLQUFLLENBQUMsYUFBYSxDQUN4QixTQUFTLEVBQ1QsS0FBSyxFQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUNwQixDQUFDO0dBQ0g7Q0FDRixDQUFDLENBQUM7O2lCQUVZLFFBQVE7Ozs7OztBQ3pFdkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQWtCLFdBQVcsQ0FBakMsSUFBSTtJQUFFLFlBQVksR0FBSSxXQUFXLENBQTNCLFlBQVk7O0FBQ3ZCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7aUJBR3JDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUEsa0JBQUc7QUFDUCxXQUNFO0FBQUMsbUJBQWE7UUFBQyxLQUFLLEVBQUMsZUFBZTtNQUNsQzs7VUFBUyxTQUFTLEVBQUMscUJBQXFCO1FBQ3RDOzs7O1NBQTBCO1FBQzFCOzs7O1NBQTJDO1FBQzNDOzs7O1VBQXlDOztjQUFHLElBQUksRUFBQyxxQkFBcUI7O1dBQVU7O1NBQWdCO1FBQ2hHOzs7O1NBQWlCO1FBQ2pCOzs7VUFDRTs7O1lBQUk7O2dCQUFHLElBQUksRUFBQyxrQ0FBa0M7O2FBQVU7O1dBQW9CO1VBQzVFOzs7WUFBSTs7Z0JBQUcsSUFBSSxFQUFDLHlDQUF5Qzs7YUFBVzs7V0FBK0I7VUFDL0Y7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsdUNBQXVDOzthQUFpQjs7V0FBd0I7VUFDNUY7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsaURBQWlEOzthQUF5Qjs7V0FBaUM7VUFDdkg7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsbUNBQW1DOzthQUFvQjs7V0FBbUM7VUFDdEc7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsd0JBQXdCOzthQUFlOztZQUFPOztnQkFBRyxJQUFJLEVBQUMsc0NBQXNDOzthQUFhOztXQUFvQztVQUN6Sjs7O1lBQUk7O2dCQUFHLElBQUksRUFBQyxrQkFBa0I7O2FBQVU7O1dBQThCO1NBQ25FO1FBRUw7Ozs7U0FBZ0I7UUFDaEI7OztVQUNFOzs7WUFBSTs7Z0JBQUcsSUFBSSxFQUFDLHVCQUF1Qjs7YUFBWTs7V0FBK0I7VUFDOUU7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsb0NBQW9DOzthQUFhOztXQUFxQjtVQUNsRjs7O1lBQUk7O2dCQUFHLElBQUksRUFBQyxtQ0FBbUM7O2FBQVk7O1dBQWlCO1NBQ3pFO1FBRUw7Ozs7U0FBZTtRQUNmOzs7VUFDRTs7O1lBQUk7O2dCQUFHLElBQUksRUFBQyxxQkFBcUI7O2FBQVU7O1dBQW1CO1VBQzlEOzs7WUFBSTs7Z0JBQUcsSUFBSSxFQUFDLG9CQUFvQjs7YUFBUzs7V0FBNEI7VUFDckU7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMscUJBQXFCOzthQUFXOztXQUFxQjtVQUNqRTs7O1lBQUk7O2dCQUFHLElBQUksRUFBQyxtQkFBbUI7O2FBQWE7O1dBQXNCO1VBQ2xFOzs7WUFBSTs7Z0JBQUcsSUFBSSxFQUFDLHFDQUFxQzs7YUFBVTs7V0FBK0I7VUFDMUY7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsMENBQTBDOzthQUFjOztXQUFzQztVQUMxRzs7O1lBQUk7O2dCQUFHLElBQUksRUFBQywrQkFBK0I7O2FBQVE7O1dBQThCO1VBQ2pGOzs7WUFBSTs7Z0JBQUcsSUFBSSxFQUFDLHNCQUFzQjs7YUFBVzs7V0FBcUI7VUFDbEU7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMsb0NBQW9DOzthQUFVOztXQUEwQjtTQUNqRjtRQUVMOzs7O1NBQVk7UUFDWjs7O1VBQ0U7OztZQUFJOztnQkFBRyxJQUFJLEVBQUMscUJBQXFCOzthQUFROztXQUE0QjtTQUNsRTtPQUNHO0tBQ0ksQ0FDaEI7R0FDSDtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREYsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOzs7aUJBR3JDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3JFLFdBQ0U7QUFBQyxtQkFBYTtRQUFDLEtBQUssRUFBQyxZQUFZO01BQy9COztVQUFLLFNBQVMsRUFBRSxlQUFlLEdBQUcsU0FBUyxBQUFDO1FBQzFDLDJCQUFHLFNBQVMsRUFBQyxtQkFBbUIsR0FBSztPQUNqQztLQUNRLENBQ2hCO0dBQ0g7Q0FDRixDQUFDOzs7Ozs7QUNmRixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBa0IsV0FBVyxDQUFqQyxJQUFJO0lBQUUsWUFBWSxHQUFJLFdBQVcsQ0FBM0IsWUFBWTs7QUFDdkIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7OztpQkFHckMsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQy9CLFFBQU0sRUFBQSxrQkFBRztBQUNQLFdBQ0U7QUFBQyxtQkFBYTtRQUFDLEtBQUssRUFBQyxXQUFXO01BQzlCOztVQUFTLFNBQVMsRUFBQyxnQkFBZ0I7UUFDakM7Ozs7U0FBdUI7UUFDdkI7Ozs7U0FBeUI7T0FDakI7S0FDSSxDQUNoQjtHQUNIO0NBQ0YsQ0FBQzs7Ozs7Ozs7UUNaYyxRQUFRLEdBQVIsUUFBUTtRQVdSLE9BQU8sR0FBUCxPQUFPOzs7OztBQWhCdkIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRzdDLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUM5QixNQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNsQixXQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFLO0FBQ3BDLFlBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGFBQU8sTUFBTSxDQUFDO0tBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLE1BQU07QUFDTCxVQUFNLEtBQUssQ0FBQyw4QkFBOEIsR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDO0dBQzVEO0NBQ0Y7O0FBRU0sU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzlCLE1BQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sTUFBTSxDQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRzthQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FBQSxDQUFDLEVBQzNDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxFQUFFO0tBQUEsQ0FDaEIsQ0FBQztHQUNILE1BQU07QUFDTCxVQUFNLEtBQUssQ0FBQywrQkFBK0IsR0FBRyxPQUFPLE1BQU0sQ0FBQyxDQUFDO0dBQzlEO0NBQ0Y7Ozs7Ozs7O2lCQ2xCdUIsR0FBRzs7QUFQM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3JELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRzlCLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNqQyxNQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsTUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUNyQixNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLE9BQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRW5ELFNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoQixRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0FBQ2pDLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxTQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsWUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3ZFLFdBQU8sTUFBTSxDQUFDO0dBQ2YsQ0FBQyxTQUNJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDakIsUUFBSSxRQUFRLFlBQVksS0FBSyxFQUFFO0FBQzdCLFlBQU0sUUFBUSxDQUFDO0tBQ2hCLE1BQU07QUFDTCxVQUFJLFNBQVMsR0FBRztBQUNkLGNBQU0sRUFBRSxRQUFRLENBQUMsTUFBTTtBQUN2QixtQkFBVyxFQUFFLFFBQVEsQ0FBQyxVQUFVO0FBQ2hDLFdBQUcsRUFBRSxNQUFNO09BQ1osQ0FBQztBQUNGLFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxXQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbkQsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLGNBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSw2QkFBNkIsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQzlGLGFBQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQztLQUM5QjtHQUNGLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0JOOzs7Ozs7OztpQkN0RHVCLElBQUk7O0FBUDVCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN0QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUc5QixTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbEMsTUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLE1BQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDckIsTUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFELE1BQUksTUFBTSxvQkFBa0IsRUFBRSxBQUFFLENBQUM7OztBQUdqQyxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FDL0IsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2hCLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDakMsU0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxZQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDeEUsV0FBTyxNQUFNLENBQUM7R0FDZixDQUFDLFNBQ0ksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNqQixRQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7QUFDN0IsWUFBTSxRQUFRLENBQUM7S0FDaEIsTUFBTTtBQUNMLFVBQUksU0FBUyxHQUFHO0FBQ2QsY0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLG1CQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVU7QUFDaEMsV0FBRyxFQUFFLE1BQU07T0FDWixDQUFDO0FBQ0YsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxXQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELGNBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSw4QkFBOEIsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0FBQy9GLGFBQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQztLQUM5QjtHQUNGLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0JOOzs7Ozs7OztpQkN2RHVCLFFBQVE7O0FBUGhDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7ZUFDWixPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTlDLFFBQVEsWUFBUixRQUFROztBQUNiLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3JELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBR3ZCLFNBQVMsUUFBUSxHQUFHO0FBQ2pDLE1BQUksTUFBTSxpQkFBaUIsQ0FBQzs7QUFFNUIsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLFNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FDckIsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2hCLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsU0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7QUFDcEYsU0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7QUFDcEYsV0FBTyxNQUFNLENBQUM7R0FDZixDQUFDLFNBQ0ksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNqQixRQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7QUFDN0IsWUFBTSxRQUFRLENBQUM7S0FDaEIsTUFBTTtBQUNMLFVBQUksU0FBUyxHQUFHO0FBQ2QsY0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLG1CQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVU7QUFDaEMsV0FBRyxFQUFFLE1BQU07T0FDWixDQUFDO0FBQ0YsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxjQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsa0NBQWtDLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNuRyxhQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUM7S0FDOUI7R0FDRixDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7aUJDM0J1QixNQUFNOztBQU45QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDckQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHdkIsU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFFO0FBQ2pDLE1BQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxRCxNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzVDLE9BQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFM0MsU0FBTyxLQUFLLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FDeEIsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2hCLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7QUFDakMsU0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRCxVQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ25DLFlBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUMxRSxXQUFPLE1BQU0sQ0FBQztHQUNmLENBQUMsU0FDSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2pCLFFBQUksUUFBUSxZQUFZLEtBQUssRUFBRTtBQUM3QixZQUFNLFFBQVEsQ0FBQztLQUNoQixNQUFNO0FBQ0wsVUFBSSxTQUFTLEdBQUc7QUFDZCxjQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsbUJBQVcsRUFBRSxRQUFRLENBQUMsVUFBVTtBQUNoQyxXQUFHLEVBQUUsTUFBTTtPQUNaLENBQUM7QUFDRixXQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0MsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsY0FBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLGdDQUFnQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDakcsYUFBTyxTQUFTLENBQUMsV0FBVyxDQUFDO0tBQzlCO0dBQ0YsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCTjs7Ozs7O0FDM0RELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBSSxXQUFXLENBQW5CLElBQUk7O0FBQ1QsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDOUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7OztBQUdyRCxTQUFTLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3hDLE1BQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xCLFNBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2xELFFBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNCLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFLE1BQU07QUFDTCxVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUN2QjtBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2IsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNSOztBQUVELFNBQVMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLFdBQVMsR0FBRyxTQUFTLElBQUksRUFBRSxDQUFDO0FBQzVCLE1BQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xCLE1BQUksVUFBVSxHQUFHO0FBQ2YsY0FBVSxFQUFFLEtBQUs7QUFDakIsZ0JBQVksRUFBRSxJQUFJLEVBQ25CLENBQUM7QUFDRixNQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDckUsTUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQ3JCLFdBQU8sTUFBTSxDQUFDLE1BQU0sQ0FDbEIsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUNoQyxNQUFNLENBQ1AsQ0FBQztHQUNILE1BQU07QUFDTCxRQUFJLE9BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsV0FBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsV0FBTyxPQUFNLENBQUM7R0FDZjtDQUNGOztBQUVELFNBQVMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMvQixNQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQzVCLFdBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUM1RCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDckMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7T0FDeEI7QUFDRCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkMsYUFBTyxJQUFJLENBQUM7S0FDYixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1IsTUFBTTtBQUNMLFdBQU8sRUFBRSxDQUFDO0dBQ1g7Q0FDRjs7O2lCQUdjLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRXhDLFNBQU8sRUFBQSxtQkFBRztBQUNSLFdBQU87QUFDTCxZQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFDbkIsQ0FBQTtHQUNGOztBQUVELFFBQU0sRUFBQSxrQkFBRztnQ0FDNEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUF2RCxNQUFNLHlCQUFOLE1BQU07UUFBRSxPQUFPLHlCQUFQLE9BQU87UUFBRSxTQUFTLHlCQUFULFNBQVM7O0FBQy9CLFdBQ0Usb0JBQUMsSUFBSSxJQUFDLE1BQU0sRUFBRSxNQUFNLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEVBQUMsU0FBUyxFQUFFLFNBQVMsQUFBQyxHQUFFLENBQy9EO0dBQ0g7Q0FDRixDQUFDOztBQUVGLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMzQixpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsU0FBUztBQUNmLG9CQUFZLEVBQUUsU0FBUztBQUN2QixvQkFBWSxFQUFFLFNBQVMsRUFDeEIsRUFDRixDQUFBO0dBQ0Y7O0FBRUQsZ0JBQWMsRUFBQSwwQkFBRztBQUNmLFdBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQztHQUN6Qjs7QUFFRCxlQUFhLEVBQUEseUJBQUc7QUFDZCxXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0dBQ3pCOztBQUVELFVBQVE7Ozs7Ozs7Ozs7S0FBRSxVQUFVLEdBQUcsRUFBRTs7O0FBQ3ZCLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEQsUUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZELFFBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pGLGFBQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7S0FDbkMsQ0FBQyxDQUFDO0FBQ0gsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsWUFBSyxRQUFRLENBQUM7QUFDWixjQUFNLEVBQUUsVUFBVTtPQUNuQixFQUFFO2VBQU0sT0FBTyxDQUFDLE1BQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ3RDLENBQUMsQ0FBQztHQUNKLENBQUE7O0FBRUQsaUJBQWUsRUFBRSx5QkFBVSxHQUFHLEVBQUU7QUFDOUIsV0FBTyxDQUFBLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtBQUNsQyxXQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDN0IsV0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUM5QixVQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDN0IsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNkOztBQUVELG1CQUFpQixFQUFFLFFBQVEsQ0FBQyxTQUFTLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtBQUMxRCxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDM0IsRUFBRSxHQUFHLENBQUM7O0FBRVAsYUFBVyxFQUFBLHFCQUFDLEtBQUssRUFBRTtBQUNqQixTQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsU0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLENBQUM7QUFDWixXQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUN2RCxDQUFDLENBQUM7R0FDSjs7QUFFRCxjQUFZLEVBQUEsc0JBQUMsS0FBSyxFQUFFOzs7QUFDbEIsU0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzlCLFVBQUksT0FBTyxFQUFFOztBQUVYLGdCQUFRLENBQUM7QUFDUCxjQUFJLEVBQUUsTUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUs7QUFDdkMsc0JBQVksRUFBRSxNQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSztBQUN2RCxzQkFBWSxFQUFFLE1BQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQ3hELENBQUMsQ0FBQztPQUNKLE1BQU07QUFDTCxhQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztPQUN4QztLQUNGLENBQUMsQ0FBQztHQUNKOztBQUVELHVCQUFxQixFQUFFLCtCQUFVLEdBQUcsRUFBRTtBQUNwQyxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDckMsUUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkIsYUFBTyxFQUFFLENBQUM7S0FDWCxNQUFNO0FBQ0wsVUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQ3JCLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQ3RELGlCQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUIsQ0FBQyxDQUFDLENBQUM7T0FDTCxNQUFNO0FBQ0wsZUFBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzFCO0tBQ0Y7R0FDRjs7QUFFRCxTQUFPLEVBQUUsaUJBQVUsR0FBRyxFQUFFO0FBQ3RCLFdBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ2pEOztBQUVELFFBQU0sRUFBQSxrQkFBRztpQkFDNEIsSUFBSSxDQUFDLEtBQUs7UUFBeEMsTUFBTSxVQUFOLE1BQU07UUFBRSxPQUFPLFVBQVAsT0FBTztRQUFFLFNBQVMsVUFBVCxTQUFTOztBQUMvQixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7QUFFN0IsUUFBSSxPQUFPLEVBQUU7QUFDWCxhQUFPLG9CQUFDLE9BQU8sT0FBRSxDQUFDO0tBQ25CLE1BQU0sSUFBSSxTQUFTLEVBQUU7QUFDcEIsYUFBTyxvQkFBQyxLQUFLLElBQUMsU0FBUyxFQUFFLFNBQVMsQUFBQyxHQUFFLENBQUM7S0FDdkMsTUFBTTtBQUNMLGFBQ0U7QUFBQyxxQkFBYTtVQUFDLEtBQUssRUFBRSxXQUFXLEFBQUM7UUFDaEM7OztVQUNFOztjQUFLLEVBQUUsRUFBQyxjQUFjO1lBQ3BCOztnQkFBSyxTQUFTLEVBQUMsV0FBVztjQUN4Qjs7a0JBQUssU0FBUyxFQUFDLGtDQUFrQztnQkFDL0M7QUFBQyxzQkFBSTtvQkFBQyxFQUFFLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyxvQkFBb0IsRUFBQyxLQUFLLEVBQUMsY0FBYztrQkFDeEUsOEJBQU0sU0FBUyxFQUFDLGtCQUFrQixHQUFRO2tCQUMxQzs7c0JBQU0sU0FBUyxFQUFDLDBCQUEwQjs7bUJBQW9CO2lCQUN6RDtlQUNIO2FBQ0Y7V0FDRjtVQUNOOztjQUFTLFNBQVMsRUFBQyx5QkFBeUI7WUFDMUM7O2dCQUFLLFNBQVMsRUFBQyxLQUFLO2NBQ2xCOztrQkFBSyxTQUFTLEVBQUMsb0JBQW9CO2dCQUNqQzs7b0JBQUksU0FBUyxFQUFDLGNBQWM7O2lCQUFlO2dCQUMzQzs7b0JBQU0sUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7a0JBQ2hDOzs7b0JBQ0U7O3dCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsc0NBQVksRUFBRSxJQUFJO0FBQ2xCLG9DQUFhLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxVQUFVLEFBQUM7QUFDdEUsaUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLEFBQUM7c0JBQ0Q7OzBCQUFPLE9BQU8sRUFBQyxNQUFNOzt1QkFBYTtzQkFDbEMsK0JBQU8sSUFBSSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEFBQUMsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQUFBQyxHQUFFO3NCQUN2Szs7MEJBQUssU0FBUyxFQUFFLEtBQUssQ0FBQztBQUNwQixrQ0FBUSxJQUFJO0FBQ1osbUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLEFBQUM7d0JBQ0EsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87aUNBQUk7OzhCQUFNLEdBQUcsRUFBQyxFQUFFOzRCQUFFLE9BQU87MkJBQVE7eUJBQUEsQ0FBQzt1QkFDN0U7cUJBQ0Y7b0JBRU47O3dCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsc0NBQVksRUFBRSxJQUFJO0FBQ2xCLG9DQUFhLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxVQUFVLEFBQUM7QUFDOUUsaUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQzt5QkFDdkMsQ0FBQyxBQUFDO3NCQUNEOzswQkFBTyxPQUFPLEVBQUMsY0FBYzs7dUJBQXNCO3NCQUNuRCwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQUFBQyxFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsRUFBRSxFQUFDLGNBQWMsRUFBQyxHQUFHLEVBQUMsY0FBYyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxBQUFDLEdBQUU7c0JBQy9NOzswQkFBSyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQ3BCLGtDQUFRLElBQUk7QUFDWixtQ0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQ3ZDLENBQUMsQUFBQzt3QkFDQSxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTztpQ0FBSTs7OEJBQU0sR0FBRyxFQUFDLEVBQUU7NEJBQUUsT0FBTzsyQkFBUTt5QkFBQSxDQUFDO3VCQUNyRjtxQkFDRjtvQkFFTjs7d0JBQUssU0FBUyxFQUFFLEtBQUssQ0FBQztBQUNwQixzQ0FBWSxFQUFFLElBQUk7QUFDbEIsb0NBQWEsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFVBQVUsQUFBQztBQUM5RSxpQ0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO3lCQUN2QyxDQUFDLEFBQUM7c0JBQ0Q7OzBCQUFPLE9BQU8sRUFBQyxjQUFjOzt1QkFBcUI7c0JBQ2xELCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEdBQUcsRUFBQyxjQUFjLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLEFBQUMsR0FBRTtzQkFDL007OzBCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsa0NBQVEsSUFBSTtBQUNaLG1DQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFDdkMsQ0FBQyxBQUFDO3dCQUNBLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2lDQUFJOzs4QkFBTSxHQUFHLEVBQUMsRUFBRTs0QkFBRSxPQUFPOzJCQUFRO3lCQUFBLENBQUM7dUJBQ3JGO3FCQUNGO21CQUNHO2tCQUNYOztzQkFBSyxTQUFTLEVBQUMsV0FBVztvQkFDeEI7O3dCQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDOztxQkFBZTtvQkFDM0Y7O3dCQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEFBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUTs7cUJBQWdCO21CQUN4RjtpQkFDRDtlQUNIO2FBQ0Y7V0FDRTtTQUNOO09BQ1EsQ0FDaEI7S0FDSDtHQUNGO0NBQ0YsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUNyUUgsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQUksV0FBVyxDQUFuQixJQUFJOztBQUNULElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3hELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBQzlELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOzs7aUJBRzVDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRXhDLFNBQU8sRUFBQSxtQkFBRztBQUNSLFdBQU87QUFDTCxZQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDbEIsV0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ2pELENBQUM7R0FDSDs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7Z0NBQzRCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07UUFBdkQsTUFBTSx5QkFBTixNQUFNO1FBQUUsT0FBTyx5QkFBUCxPQUFPO1FBQUUsU0FBUyx5QkFBVCxTQUFTOztBQUMvQixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBRXJDLFFBQUksT0FBTyxFQUFFO0FBQ1gsYUFBTyxvQkFBQyxPQUFPLE9BQUUsQ0FBQztLQUNuQixNQUFNLElBQUksU0FBUyxFQUFFO0FBQ3BCLGFBQU8sb0JBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxTQUFTLEFBQUMsR0FBRSxDQUFDO0tBQ3ZDLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekIsYUFBTyxvQkFBQyxRQUFRLE9BQUUsQ0FBQztLQUNwQixNQUFNO0FBQ0wsYUFDRTtBQUFDLHFCQUFhO1VBQUMsS0FBSyxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxBQUFDO1FBQzNDOzs7VUFDRTs7Y0FBSyxFQUFFLEVBQUMsY0FBYztZQUNwQjs7Z0JBQUssU0FBUyxFQUFDLFdBQVc7Y0FDeEI7O2tCQUFLLFNBQVMsRUFBQyxrQ0FBa0M7Z0JBQy9DO0FBQUMsc0JBQUk7b0JBQUMsRUFBRSxFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsb0JBQW9CLEVBQUMsS0FBSyxFQUFDLGNBQWM7a0JBQ3hFLDhCQUFNLFNBQVMsRUFBQyxrQkFBa0IsR0FBUTtrQkFDMUM7O3NCQUFNLFNBQVMsRUFBQywwQkFBMEI7O21CQUFvQjtpQkFDekQ7ZUFDSDtjQUNOOztrQkFBSyxTQUFTLEVBQUMsbUNBQW1DO2dCQUNoRDtBQUFDLHNCQUFJO29CQUFDLEVBQUUsRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQyxFQUFDLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUMsTUFBTTtrQkFDbkYsOEJBQU0sU0FBUyxFQUFDLFlBQVksR0FBUTtpQkFDL0I7Z0JBQ1A7O29CQUFHLFNBQVMsRUFBQyxhQUFhLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxBQUFDO2tCQUNsRiw4QkFBTSxTQUFTLEVBQUMsYUFBYSxHQUFRO2lCQUNuQztlQUNBO2FBQ0Y7V0FDRjtVQUNOOztjQUFTLFNBQVMsRUFBQyx5QkFBeUI7WUFDMUM7O2dCQUFLLFNBQVMsRUFBQyxLQUFLO2NBQ2xCOztrQkFBSyxTQUFTLEVBQUMsb0JBQW9CO2dCQUNqQzs7b0JBQUssU0FBUyxFQUFDLDJCQUEyQjtrQkFDeEMsNkJBQUssR0FBRyxFQUFFLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsZUFBZSxBQUFDLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsT0FBTyxHQUFFO2lCQUN6RjtlQUNGO2NBQ047O2tCQUFLLFNBQVMsRUFBQyxvQkFBb0I7Z0JBQ2pDOztvQkFBSSxTQUFTLEVBQUMsY0FBYztrQkFBRSxLQUFLLENBQUMsSUFBSTtpQkFBTTtnQkFDOUM7OztrQkFDRTs7OzttQkFBc0I7a0JBQ3RCOzs7b0JBQUssS0FBSyxDQUFDLEVBQUU7bUJBQU07a0JBQ25COzs7O21CQUFzQjtrQkFDdEI7OztvQkFBSyxLQUFLLENBQUMsWUFBWTttQkFBTTtrQkFDN0I7Ozs7bUJBQXFCO2tCQUNyQjs7O29CQUFLLEtBQUssQ0FBQyxZQUFZO21CQUFNO2lCQUMxQjtlQUNEO2FBQ0Y7V0FDRTtTQUNOO09BQ1EsQ0FDaEI7S0FDSDtHQUNGLEVBQ0YsQ0FBQzs7Ozs7O0FDL0VGLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBSSxXQUFXLENBQW5CLElBQUk7O0FBQ1QsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDeEQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDOUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdkQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7OztBQUczRCxTQUFTLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3hDLE1BQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xCLFNBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ2xELFFBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNCLFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3ZFLE1BQU07QUFDTCxVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUN2QjtBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2IsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNSOztBQUVELFNBQVMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLFdBQVMsR0FBRyxTQUFTLElBQUksRUFBRSxDQUFDO0FBQzVCLE1BQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2xCLE1BQUksVUFBVSxHQUFHO0FBQ2YsY0FBVSxFQUFFLEtBQUs7QUFDakIsZ0JBQVksRUFBRSxJQUFJLEVBQ25CLENBQUM7QUFDRixNQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDckUsTUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQ3JCLFdBQU8sTUFBTSxDQUFDLE1BQU0sQ0FDbEIsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUNoQyxNQUFNLENBQ1AsQ0FBQztHQUNILE1BQU07QUFDTCxRQUFJLE9BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsV0FBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsV0FBTyxPQUFNLENBQUM7R0FDZjtDQUNGOztBQUVELFNBQVMsWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMvQixNQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQzVCLFdBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUM1RCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDckMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7T0FDeEI7QUFDRCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkMsYUFBTyxJQUFJLENBQUM7S0FDYixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1IsTUFBTTtBQUNMLFdBQU8sRUFBRSxDQUFDO0dBQ1g7Q0FDRjs7O2lCQUdjLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRXhDLFNBQU8sRUFBQSxtQkFBRztBQUNSLFdBQU87QUFDTCxZQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDbEIsZUFBUyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3JELENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7Z0NBQzRCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07UUFBdkQsTUFBTSx5QkFBTixNQUFNO1FBQUUsT0FBTyx5QkFBUCxPQUFPO1FBQUUsU0FBUyx5QkFBVCxTQUFTOztBQUMvQixRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDN0MsV0FDRSxvQkFBQyxJQUFJLElBQUMsTUFBTSxFQUFFLE1BQU0sQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsRUFBQyxTQUFTLEVBQUUsU0FBUyxBQUFDLEVBQUMsU0FBUyxFQUFFLFNBQVMsQUFBQyxHQUFFLENBQ3JGO0dBQ0g7Q0FDRixDQUFDOztBQUVGLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMzQixpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxXQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFDL0MsQ0FBQTtHQUNGOztBQUVELDJCQUF5QixFQUFBLG1DQUFDLEtBQUssRUFBRTtBQUMvQixRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFVBQUksQ0FBQyxRQUFRLENBQUM7QUFDWixhQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUMxQyxDQUFDLENBQUE7S0FDSDtHQUNGOztBQUVELGdCQUFjLEVBQUEsMEJBQUc7QUFDZixXQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUM7R0FDekI7O0FBRUQsZUFBYSxFQUFBLHlCQUFHO0FBQ2QsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztHQUN6Qjs7QUFFRCxVQUFROzs7Ozs7Ozs7O0tBQUUsVUFBVSxHQUFHLEVBQUU7OztBQUN2QixRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xELFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN2RCxRQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN6RixhQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO0tBQ25DLENBQUMsQ0FBQztBQUNILFdBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLFlBQUssUUFBUSxDQUFDO0FBQ1osY0FBTSxFQUFFLFVBQVU7T0FDbkIsRUFBRTtlQUFNLE9BQU8sQ0FBQyxNQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUN0QyxDQUFDLENBQUM7R0FDSixDQUFBOztBQUVELGlCQUFlLEVBQUUseUJBQVUsR0FBRyxFQUFFO0FBQzlCLFdBQU8sQ0FBQSxTQUFTLFlBQVksQ0FBQyxLQUFLLEVBQUU7QUFDbEMsV0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzdCLFdBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUN2QyxVQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzdCLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDZDs7QUFFRCxtQkFBaUIsRUFBRSxRQUFRLENBQUMsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7QUFDMUQsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQzNCLEVBQUUsR0FBRyxDQUFDOztBQUVQLGFBQVcsRUFBQSxxQkFBQyxLQUFLLEVBQUU7QUFDakIsU0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQixRQUFJLENBQUMsUUFBUSxDQUFDO0FBQ1osV0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQy9DLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ25COztBQUVELGNBQVksRUFBQSxzQkFBQyxLQUFLLEVBQUU7OztBQUNsQixTQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdkIsU0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDOUIsVUFBSSxPQUFPLEVBQUU7O0FBRVgsaUJBQVMsQ0FBQztBQUNSLFlBQUUsRUFBRSxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2QixjQUFJLEVBQUUsTUFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUs7QUFDdkMsc0JBQVksRUFBRSxNQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSztBQUN2RCxzQkFBWSxFQUFFLE1BQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQ3hELENBQUMsQ0FBQztPQUNKLE1BQU07QUFDTCxhQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztPQUN4QztLQUNGLENBQUMsQ0FBQztHQUNKOztBQUVELHVCQUFxQixFQUFFLCtCQUFVLEdBQUcsRUFBRTtBQUNwQyxRQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDckMsUUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDbkIsYUFBTyxFQUFFLENBQUM7S0FDWCxNQUFNO0FBQ0wsVUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO0FBQ3JCLGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxFQUFFO0FBQ3RELGlCQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUIsQ0FBQyxDQUFDLENBQUM7T0FDTCxNQUFNO0FBQ0wsZUFBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzFCO0tBQ0Y7R0FDRjs7QUFFRCxTQUFPLEVBQUUsaUJBQVUsR0FBRyxFQUFFO0FBQ3RCLFdBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ2pEOztBQUVELFFBQU0sRUFBQSxrQkFBRztpQkFDdUMsSUFBSSxDQUFDLEtBQUs7UUFBbkQsTUFBTSxVQUFOLE1BQU07UUFBRSxPQUFPLFVBQVAsT0FBTztRQUFFLFNBQVMsVUFBVCxTQUFTO1FBQUUsU0FBUyxVQUFULFNBQVM7O0FBQzFDLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztBQUU3QixRQUFJLE9BQU8sRUFBRTtBQUNYLGFBQU8sb0JBQUMsT0FBTyxPQUFFLENBQUM7S0FDbkIsTUFBTSxJQUFJLFNBQVMsRUFBRTtBQUNwQixhQUFPLG9CQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsU0FBUyxBQUFDLEdBQUUsQ0FBQztLQUN2QyxNQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLGFBQU8sb0JBQUMsUUFBUSxPQUFFLENBQUM7S0FDcEIsTUFBTTtBQUNMLGFBQ0U7QUFBQyxxQkFBYTtVQUFDLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQUFBQztRQUN6Qzs7O1VBQ0U7O2NBQUssRUFBRSxFQUFDLGNBQWM7WUFDcEI7O2dCQUFLLFNBQVMsRUFBQyxXQUFXO2NBQ3hCOztrQkFBSyxTQUFTLEVBQUMsa0NBQWtDO2dCQUMvQztBQUFDLHNCQUFJO29CQUFDLEVBQUUsRUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLG9CQUFvQixFQUFDLEtBQUssRUFBQyxjQUFjO2tCQUN4RSw4QkFBTSxTQUFTLEVBQUMsa0JBQWtCLEdBQVE7a0JBQzFDOztzQkFBTSxTQUFTLEVBQUMsMEJBQTBCOzttQkFBb0I7aUJBQ3pEO2VBQ0g7Y0FDTjs7a0JBQUssU0FBUyxFQUFDLG1DQUFtQztnQkFDaEQ7QUFBQyxzQkFBSTtvQkFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLE1BQU0sRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFDLEFBQUMsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLEtBQUssRUFBQyxRQUFRO2tCQUNyRiw4QkFBTSxTQUFTLEVBQUMsV0FBVyxHQUFRO2lCQUM5QjtnQkFDUDs7b0JBQUcsU0FBUyxFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEFBQUM7a0JBQ2xGLDhCQUFNLFNBQVMsRUFBQyxhQUFhLEdBQVE7aUJBQ25DO2VBQ0E7YUFDRjtXQUNGO1VBQ047O2NBQVMsU0FBUyxFQUFDLHlCQUF5QjtZQUMxQzs7Z0JBQUssU0FBUyxFQUFDLEtBQUs7Y0FDbEI7O2tCQUFLLFNBQVMsRUFBQyxvQkFBb0I7Z0JBQ2pDOztvQkFBSyxTQUFTLEVBQUMsMkJBQTJCO2tCQUN4Qyw2QkFBSyxHQUFHLEVBQUUsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxlQUFlLEFBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxPQUFPLEdBQUU7aUJBQ3pGO2VBQ0Y7Y0FDTjs7a0JBQUssU0FBUyxFQUFDLG9CQUFvQjtnQkFDakM7O29CQUFJLFNBQVMsRUFBQyxjQUFjO2tCQUFFLEtBQUssQ0FBQyxJQUFJO2lCQUFNO2dCQUM5Qzs7b0JBQU0sUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUM7a0JBQ2hDOzs7b0JBQ0U7O3dCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsc0NBQVksRUFBRSxJQUFJO0FBQ2xCLG9DQUFhLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxVQUFVLEFBQUM7QUFDdEUsaUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLEFBQUM7c0JBQ0Q7OzBCQUFPLE9BQU8sRUFBQyxNQUFNOzt1QkFBYTtzQkFDbEMsK0JBQU8sSUFBSSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxBQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEFBQUMsRUFBQyxTQUFTLEVBQUMsY0FBYyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksQUFBQyxHQUFFO3NCQUN2Szs7MEJBQUssU0FBUyxFQUFFLEtBQUssQ0FBQztBQUNwQixrQ0FBUSxJQUFJO0FBQ1osbUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUMvQixDQUFDLEFBQUM7d0JBQ0EsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87aUNBQUk7OzhCQUFNLEdBQUcsRUFBQyxFQUFFOzRCQUFFLE9BQU87MkJBQVE7eUJBQUEsQ0FBQzt1QkFDN0U7cUJBQ0Y7b0JBRU47O3dCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsc0NBQVksRUFBRSxJQUFJO0FBQ2xCLG9DQUFhLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxVQUFVLEFBQUM7QUFDOUUsaUNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQzt5QkFDdkMsQ0FBQyxBQUFDO3NCQUNEOzswQkFBTyxPQUFPLEVBQUMsY0FBYzs7dUJBQXNCO3NCQUNuRCwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLEFBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQUFBQyxFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsRUFBRSxFQUFDLGNBQWMsRUFBQyxHQUFHLEVBQUMsY0FBYyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxBQUFDLEdBQUU7c0JBQy9NOzswQkFBSyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQ3BCLGtDQUFRLElBQUk7QUFDWixtQ0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQ3ZDLENBQUMsQUFBQzt3QkFDQSxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTztpQ0FBSTs7OEJBQU0sR0FBRyxFQUFDLEVBQUU7NEJBQUUsT0FBTzsyQkFBUTt5QkFBQSxDQUFDO3VCQUNyRjtxQkFDRjtvQkFFTjs7d0JBQUssU0FBUyxFQUFFLEtBQUssQ0FBQztBQUNwQixzQ0FBWSxFQUFFLElBQUk7QUFDbEIsb0NBQWEsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLFVBQVUsQUFBQztBQUM5RSxpQ0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO3lCQUN2QyxDQUFDLEFBQUM7c0JBQ0Q7OzBCQUFPLE9BQU8sRUFBQyxjQUFjOzt1QkFBcUI7c0JBQ2xELCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEdBQUcsRUFBQyxjQUFjLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZLEFBQUMsR0FBRTtzQkFDL007OzBCQUFLLFNBQVMsRUFBRSxLQUFLLENBQUM7QUFDcEIsa0NBQVEsSUFBSTtBQUNaLG1DQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFDdkMsQ0FBQyxBQUFDO3dCQUNBLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO2lDQUFJOzs4QkFBTSxHQUFHLEVBQUMsRUFBRTs0QkFBRSxPQUFPOzJCQUFRO3lCQUFBLENBQUM7dUJBQ3JGO3FCQUNGO21CQUNHO2tCQUNYOztzQkFBSyxTQUFTLEVBQUMsV0FBVztvQkFDeEI7O3dCQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDOztxQkFBZTtvQkFDM0Y7O3dCQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEFBQUMsRUFBQyxJQUFJLEVBQUMsUUFBUTs7cUJBQWdCO21CQUN4RjtpQkFDRDtlQUNIO2FBQ0Y7V0FDRTtTQUNOO09BQ1EsQ0FDaEI7S0FDSDtHQUNGO0NBQ0YsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUM1UkgsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxJQUFJLEdBQUksV0FBVyxDQUFuQixJQUFJOztBQUNULElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztlQUNwQyxPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTdDLE9BQU8sWUFBUCxPQUFPOztBQUNaLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzVELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3hELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOzs7aUJBRzNDLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQixRQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztBQUVyQixTQUFPLEVBQUU7QUFDUCxVQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFDbkI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO2dDQUM0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQXZELE1BQU0seUJBQU4sTUFBTTtRQUFFLE9BQU8seUJBQVAsT0FBTztRQUFFLFNBQVMseUJBQVQsU0FBUzs7QUFDL0IsVUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxTQUFTLEVBQUU7QUFDYixhQUFPLG9CQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsU0FBUyxBQUFDLEdBQUUsQ0FBQztLQUN2QyxNQUFNO0FBQ0wsYUFDRTtBQUFDLHFCQUFhO1VBQUMsS0FBSyxFQUFDLFFBQVE7UUFDM0I7OztVQUNFOztjQUFLLEVBQUUsRUFBQyxjQUFjO1lBQ3BCOztnQkFBSyxTQUFTLEVBQUMsV0FBVztjQUN4Qjs7a0JBQUssU0FBUyxFQUFDLFlBQVk7Z0JBQ3pCO0FBQUMsc0JBQUk7b0JBQUMsRUFBRSxFQUFDLFdBQVcsRUFBQyxTQUFTLEVBQUMsc0JBQXNCLEVBQUMsS0FBSyxFQUFDLEtBQUs7a0JBQy9ELDhCQUFNLFNBQVMsRUFBQyxZQUFZLEdBQVE7aUJBQy9CO2VBQ0g7YUFDRjtXQUNGO1VBQ047O2NBQVMsU0FBUyxFQUFDLFdBQVc7WUFDNUI7Ozs7YUFBZTtZQUNmOztnQkFBSyxTQUFTLEVBQUMsS0FBSztjQUNqQixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzt1QkFBSSxvQkFBQyxTQUFTLElBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxBQUFDLEdBQUU7ZUFBQSxDQUFDO2FBQzNEO1dBQ0U7VUFDVCxPQUFPLEdBQUcsb0JBQUMsT0FBTyxPQUFFLEdBQUcsRUFBRTtTQUN0QjtPQUNRLENBQ2hCO0tBQ0g7R0FDRixFQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqREYsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNoQixPQUFPLENBQUMsY0FBYyxDQUFDOztJQUEvQixJQUFJLFlBQUosSUFBSTs7QUFDVCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQzs7O2lCQUc1QyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDL0IsV0FBUyxFQUFFO0FBQ1QsU0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUM5Qjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM3QixXQUNFOztRQUFLLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxBQUFDLEVBQUMsU0FBUyxFQUFDLG1CQUFtQjtNQUMvQzs7VUFBSyxTQUFTLEVBQUMscUJBQXFCLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEFBQUM7UUFDakQ7O1lBQUssU0FBUyxFQUFDLGVBQWU7VUFDNUI7O2NBQUksU0FBUyxFQUFDLGFBQWE7WUFBQztBQUFDLGtCQUFJO2dCQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQztjQUFFLEtBQUssQ0FBQyxJQUFJO2FBQVE7V0FBSztTQUNoRztRQUNOOztZQUFLLFNBQVMsRUFBQyxrQ0FBa0M7VUFDL0M7QUFBQyxnQkFBSTtjQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQztZQUM3Qyw2QkFBSyxHQUFHLEVBQUUsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxlQUFlLEFBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxPQUFPLEdBQUU7V0FDeEY7U0FDSDtRQUNOOztZQUFLLFNBQVMsRUFBQyxjQUFjO1VBQzNCOztjQUFLLFNBQVMsRUFBQyxVQUFVO1lBQ3ZCOztnQkFBSyxTQUFTLEVBQUMsbUNBQW1DO2NBQ2hEO0FBQUMsb0JBQUk7a0JBQUMsRUFBRSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxLQUFLLEVBQUMsUUFBUTtnQkFDckYsOEJBQU0sU0FBUyxFQUFDLFdBQVcsR0FBUTtlQUM5QjtjQUNQO0FBQUMsb0JBQUk7a0JBQUMsRUFBRSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBQyxNQUFNO2dCQUNuRiw4QkFBTSxTQUFTLEVBQUMsWUFBWSxHQUFRO2VBQy9CO2NBQ1A7O2tCQUFHLFNBQVMsRUFBQyxhQUFhLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxBQUFDO2dCQUNsRiw4QkFBTSxTQUFTLEVBQUMsYUFBYSxHQUFRO2VBQ25DO2FBQ0E7V0FDRjtTQUNGO09BQ0Y7S0FDRixDQUNOO0dBQ0gsRUFDRixDQUFDOzs7Ozs7OztpQkN2Q3NCLEtBQUs7O0FBSDdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUdqQixTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDbEMsU0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ25CLE1BQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ2IsV0FBTyxFQUFFLFNBQVM7QUFDbEIsWUFBUSxFQUFFLFNBQVM7QUFDbkIsWUFBUSxFQUFFLElBQUk7QUFDZCxVQUFNLEVBQUUsSUFBSSxFQUNiLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDVjs7Ozs7O0FDWEQsSUFBSSxLQUFLLEdBQUc7QUFDVixVQUFRLEVBQUEsa0JBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDMUIsV0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ2xEOztBQUVELFVBQVEsRUFBQSxrQkFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMxQixXQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDbEQ7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzlCLFVBQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0M7O0FBRUQsYUFBVyxFQUFBLHFCQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzdCLFVBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDOUM7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsVUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUN4Qjs7QUFFRCxLQUFHLEVBQUEsYUFBQyxNQUFNLEVBQUU7QUFDVixVQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMzQjtDQUNGLENBQUM7O2lCQUVhLEtBQUs7Ozs7OztBQzFCcEIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7aUJBR2hCLElBQUksTUFBTSxDQUFDO0FBQ3hCLFFBQU0sRUFBRTtBQUNOLFVBQU0sRUFBRSxFQUFFO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixhQUFTLEVBQUUsU0FBUyxFQUNyQjtBQUNELFFBQU0sRUFBRTtBQUNOLFVBQU0sRUFBRSxFQUFFO0FBQ1YsV0FBTyxFQUFFLElBQUk7QUFDYixhQUFTLEVBQUUsU0FBUyxFQUNyQixFQUNGLENBQUM7Ozs7Ozs7OztBQ2RGLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7O0FBR2xCLElBQUksS0FBSyxHQUFHO0FBQ2pCLE1BQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0FBQzdCLGNBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUM5QyxjQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUN0QyxDQUFDO1FBSlMsS0FBSyxHQUFMLEtBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7Um91dGUsIERlZmF1bHRSb3V0ZSwgTm90Rm91bmRSb3V0ZSwgSGlzdG9yeUxvY2F0aW9ufSA9IFJlYWN0Um91dGVyO1xuXG4vLyBTaGltcywgcG9seWZpbGxzXG5sZXQgU2hpbXMgPSByZXF1aXJlKFwiLi9zaGltc1wiKTtcblxuLy8gQ29tbW9uXG5sZXQgQm9keSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5XCIpO1xubGV0IEhvbWUgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZVwiKTtcbmxldCBBYm91dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dFwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcblxuLy8gQWxlcnRcbmxldCBsb2FkTWFueUFsZXJ0cyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2xvYWRtYW55XCIpO1xuXG4vLyBSb2JvdFxubGV0IGxvYWRNYW55Um9ib3RzID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZG1hbnlcIik7XG5sZXQgUm9ib3RJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IFJvYm90QWRkID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCIpO1xubGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xubGV0IFJvYm90RWRpdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIik7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJhYm91dFwiIHBhdGg9XCIvYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1hZGRcIiBwYXRoPVwiYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZWRpdFwiIHBhdGg9XCI6aWQvZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pO1xuXG53aW5kb3cucm91dGVyID0gUmVhY3RSb3V0ZXIuY3JlYXRlKHtcbiAgcm91dGVzOiByb3V0ZXMsXG4gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbn0pO1xuXG53aW5kb3cucm91dGVyLnJ1bigoSGFuZGxlciwgc3RhdGUpID0+IHtcbiAgLy8geW91IG1pZ2h0IHdhbnQgdG8gcHVzaCB0aGUgc3RhdGUgb2YgdGhlIHJvdXRlciB0byBhXG4gIC8vIHN0b3JlIGZvciB3aGF0ZXZlciByZWFzb25cbiAgLy8gUm91dGVyQWN0aW9ucy5yb3V0ZUNoYW5nZSh7cm91dGVyU3RhdGU6IHN0YXRlfSk7XG5cbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG5cbmxvYWRNYW55QWxlcnRzKCk7XG5sb2FkTWFueVJvYm90cygpOyIsImxldCBJbnNwZWN0ID0gcmVxdWlyZShcInV0aWwtaW5zcGVjdFwiKTtcbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB0aGlzXG4gICAgLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSwgMSk7XG4gICAgfSk7XG59O1xuXG53aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gbG9nKCkge1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IEluc3BlY3QodikpKTtcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L21vZGVsc1wiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IEFsZXJ0KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbnBlcnNpc3RlbnQgYWRkXG4gIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCB7dG9PYmplY3R9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNYW55KCkge1xuICBsZXQgYXBpVVJMID0gYGFwaS9hbGVydHNgO1xuXG4gIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczoge319KTtcbiAgcmV0dXJuIHt9O1xuICAvLyBUT0RPOiBiYWNrZW5kXG4gIC8vcmV0dXJuIEF4aW9zLmdldChhcGlVUkwpXG4gIC8vICAudGhlbihyZXNwb25zZSA9PiB7XG4gIC8vICAgIGxldCBtb2RlbHMgPSB0b09iamVjdChyZXNwb25zZS5kYXRhKTtcbiAgLy8gICAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpLmVkaXQoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgLy8gICAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpLmVkaXQoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgLy8gICAgcmV0dXJuIG1vZGVscztcbiAgLy8gIH0pXG4gIC8vICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAvLyAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAvLyAgICAgIHRocm93IHJlc3BvbnNlO1xuICAvLyAgICB9IGVsc2Uge1xuICAvLyAgICAgIGxldCBsb2FkRXJyb3IgPSB7c3RhdHVzOiByZXNwb25zZS5zdGF0dXNUZXh0LCB1cmw6IGFwaVVSTH07XG4gIC8vICAgICAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAvLyAgICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgbG9hZEVycm9yKTtcbiAgLy8gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYEFsZXJ0LmxvYWRNYW55YCBmYWlsZWRcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAvLyAgICAgIHJldHVybiBsb2FkRXJyb3I7XG4gIC8vICAgIH1cbiAgLy8gIH0pO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbi1wZXJzaXN0ZW50IHJlbW92ZVxuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7Q1NTVHJhbnNpdGlvbkdyb3VwfSA9IHJlcXVpcmUoXCJyZWFjdC9hZGRvbnNcIikuYWRkb25zO1xubGV0IHt0b0FycmF5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgQWxlcnRJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIGFsZXJ0czogW1wiYWxlcnRzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5hbGVydHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgICAgPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbiAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICA8L0NTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjbGFzc05hbWVzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCByZW1vdmVBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtyZW1vdmVBbGVydC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e3JlbW92ZUFsZXJ0LmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICBpZiAoIWRhdGEubWVzc2FnZSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEubWVzc2FnZWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgaWYgKCFkYXRhLmNhdGVnb3J5KSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5jYXRlZ29yeWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgIGlkOiBVVUlELnY0KCksXG4gICAgY2xvc2FibGU6IHRydWUsXG4gICAgZXhwaXJlOiBkYXRhLmNhdGVnb3J5ID09IFwiZXJyb3JcIiA/IDAgOiA1MDAwLFxuICB9LCBkYXRhKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5sZXQgSGVhZHJvb20gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaGVhZHJvb21cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBoZWFkcm9vbUNsYXNzTmFtZXMgPSB7dmlzaWJsZTogXCJuYXZiYXItZG93blwiLCBoaWRkZW46IFwibmF2YmFyLXVwXCJ9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8SGVhZHJvb20gY29tcG9uZW50PVwiaGVhZGVyXCIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiIGhlYWRyb29tQ2xhc3NOYW1lcz17aGVhZHJvb21DbGFzc05hbWVzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1wYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1iYXJzIGZhLWxnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgdG89XCJob21lXCI+PHNwYW4gY2xhc3NOYW1lPVwibGlnaHRcIj5SZWFjdDwvc3Bhbj5TdGFydGVyPC9MaW5rPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZSBuYXZiYXItcGFnZS1oZWFkZXIgbmF2YmFyLXJpZ2h0IGJyYWNrZXRzLWVmZmVjdFwiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJob21lXCI+SG9tZTwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cInJvYm90LWluZGV4XCI+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIDxBbGVydEluZGV4Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBzaXplQ2xhc3MgPSB0aGlzLnByb3BzLnNpemUgPyAnIGxvYWRpbmctJyArIHRoaXMucHJvcHMuc2l6ZSA6ICcnO1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFcnJvciBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLnN0YXR1cyArIFwiOiBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLmRlc2NyaXB0aW9ufT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e1wiYWxlcnQtYXMtaWNvbiBmYS1zdGFja1wiICsgc2l6ZUNsYXNzfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3RhY2stMXhcIj48L2k+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtYmFuIGZhLXN0YWNrLTJ4XCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB0aHJvdHRsZSA9IHJlcXVpcmUoXCJsb2Rhc2gudGhyb3R0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBIZWFkcm9vbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBoZWFkcm9vbUNsYXNzTmFtZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgfVxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tcG9uZW50OiBcImRpdlwiLFxuICAgIH1cbiAgfSxcblxuICBoYXNTY3JvbGxlZDogZnVuY3Rpb24gKCkge1xuICAgIGxldCB0b3BQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB1c2VycyBzY3JvbGwgbW9yZSB0aGFuIGRlbHRhXG4gICAgaWYgKE1hdGguYWJzKHRoaXMubGFzdFNjcm9sbFRvcCAtIHRvcFBvc2l0aW9uKSA8PSB0aGlzLmRlbHRhSGVpZ2h0KSByZXR1cm47XG5cbiAgICAvLyBJZiB0aGV5IHNjcm9sbGVkIGRvd24gYW5kIGFyZSBwYXN0IHRoZSBuYXZiYXIsIGFkZCBjbGFzcyBgdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZWAuXG4gICAgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgc28geW91IG5ldmVyIHNlZSB3aGF0IGlzIFwiYmVoaW5kXCIgdGhlIG5hdmJhci5cbiAgICBpZiAodG9wUG9zaXRpb24gPiB0aGlzLmxhc3RTY3JvbGxUb3AgJiYgdG9wUG9zaXRpb24gPiB0aGlzLmVsZW1lbnRIZWlnaHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMuaGlkZGVufSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKCh0b3BQb3NpdGlvbiArICQod2luZG93KS5oZWlnaHQoKSkgPCAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gdG9wUG9zaXRpb247XG4gIH0sXG5cblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3NOYW1lOiBcIlwiXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIC8vIEluaXQgb3B0aW9uc1xuICAgIHRoaXMuZGVsdGFIZWlnaHQgPSB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0ID8gdGhpcy5wcm9wcy5kZWx0YUhlaWdodCA6IDU7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMucHJvcHMuZGVsYXkgPyB0aGlzLnByb3BzLmRlbGF5IDogMjUwO1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9wcy5pZCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhyb3R0bGUodGhpcy5oYXNTY3JvbGxlZCwgdGhpcy5kZWxheSksIGZhbHNlKTtcblxuICAgIC8vIFVwZGF0ZSBjb21wb25lbnRcInMgY2xhc3NOYW1lXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmhhc1Njcm9sbGVkLCBmYWxzZSk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBjb21wb25lbnQgPSB0aGlzLnByb3BzLmNvbXBvbmVudDtcbiAgICBsZXQgcHJvcHMgPSB7aWQ6IHRoaXMucHJvcHMuaWQsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUgKyBcIiBcIiArIHRoaXMuc3RhdGUuY2xhc3NOYW1lfTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIHByb3BzLFxuICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIZWFkcm9vbTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYlwiPkJhb2JhYjwvYT4gSlMgZGF0YSB0cmVlIHdpdGggY3Vyc29yczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXJcIj5SZWFjdC1Sb3V0ZXI8L2E+IGRlY2xhcmF0aXZlIHJvdXRlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlYWN0LWRvY3VtZW50LXRpdGxlXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+IGRlY2xhcmF0aXZlIGRvY3VtZW50IHRpdGxlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL1wiPlJlYWN0LUJvb3RzdHJhcDwvYT4gQm9vdHN0cmFwIGNvbXBvbmVudHMgaW4gUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYnJvd3NlcmlmeS5vcmcvXCI+QnJvd3NlcmlmeTwvYT4gJmFtcDsgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay93YXRjaGlmeVwiPldhdGNoaWZ5PC9hPiBidW5kbGUgTlBNIG1vZHVsZXMgdG8gZnJvbnRlbmQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYm93ZXIuaW8vXCI+Qm93ZXI8L2E+IGZyb250ZW5kIHBhY2thZ2UgbWFuYWdlcjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9leHByZXNzanMuY29tL1wiPkV4cHJlc3M8L2E+IHdlYi1hcHAgYmFja2VuZCBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW96aWxsYS5naXRodWIuaW8vbnVuanVja3MvXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9lbGVpdGgvZW1haWxqc1wiPkVtYWlsSlM8L2E+IFNNVFAgY2xpZW50PC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IEpTIHRyYW5zcGlsZXI8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ3VscGpzLmNvbS9cIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9sb2Rhc2guY29tL1wiPkxvZGFzaDwvYT4gdXRpbGl0eSBsaWJyYXJ5PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3NvY2tldC5pby9cIj5Tb2NrZXRJTzwvYT4gcmVhbC10aW1lIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXCI+QXhpb3M8L2E+IHByb21pc2UtYmFzZWQgSFRUUCBjbGllbnQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svaW1tdXRhYmxlLWpzXCI+SW1tdXRhYmxlPC9hPiBwZXJzaXN0ZW50IGltbXV0YWJsZSBkYXRhIGZvciBKUzwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9oYXBpanMvam9pXCI+Sm9pPC9hPiBvYmplY3Qgc2NoZW1hIHZhbGlkYXRpb248L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW9tZW50anMuY29tL1wiPk1vbWVudDwvYT4gZGF0ZS10aW1lIHN0dWZmPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hcmFrL0Zha2VyLmpzL1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2dpdC1zY20uY29tL1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG4vKlxuKiBUT0RPXG4qXG4qIGJhYmVsaWZ5P1xuKiBjaGFpP1xuKiBjbGFzc25hbWVzP1xuKiBjb25maWc/XG4qIGNsaWVudGNvbmZpZz9cbiogaGVsbWV0P1xuKiBodXNreXZcbiogbW9jaGE/XG4qIG1vcmdhbj9cbiogd2luc3Rvbj9cbiogeWFyZ3M/XG4qICovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBzb3J0QnkgPSByZXF1aXJlKFwibG9kYXNoLnNvcnRieVwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xuICBpZiAoaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihcImV4cGVjdGVkIHR5cGUgaXMgQXJyYXksIGdldCBcIiArIHR5cGVvZiBhcnJheSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoXCJleHBlY3RlZCB0eXBlIGlzIE9iamVjdCwgZ2V0IFwiICsgdHlwZW9mIG9iamVjdCk7XG4gIH1cbn1cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBsb2FkRXJyb3IpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiBsb2FkRXJyb3IuZGVzY3JpcHRpb247IC8vIFRPRE86IGRvIHdlIG5lZWQgdGhpcz9cbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTsgLy8gQ2FuY2VsIGFkZFxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0gLy8gZWxzZVxuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWRcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgIHJldHVybiBzdGF0dXM7XG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVkaXQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IG9sZE1vZGVsID0gU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dChhcGlVUkwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiBsb2FkRXJyb3IuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgc3RhdHVzKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZFwiLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCB7dG9PYmplY3R9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNYW55KCkge1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzL2A7XG5cbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIHJldHVybiBBeGlvcy5nZXQoYXBpVVJMKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBtb2RlbHMgPSB0b09iamVjdChyZXNwb25zZS5kYXRhKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IG1vZGVsc30pO1xuICAgICAgcmV0dXJuIG1vZGVsczsgLy8gVE9ETzogd2h5IGhlcmUgbW9kZWxzIGFyZSByZXR1cm5pbmcsIGFuZCBpbiBhZGQvZWRpdCBzdGF0dXM/XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBsb2FkRXJyb3IpO1xuICAgICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmxvYWRNYW55YCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiBsb2FkRXJyb3IuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfSk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBhZGRBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL2FkZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCBvbGRNb2RlbCA9IFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xuXG4gIHJldHVybiBBeGlvcy5kZWxldGUoYXBpVVJMKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgICAgUm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpO1xuICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgc3RhdHVzKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QucmVtb3ZlYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiBsb2FkRXJyb3IuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIHJlbW92ZVxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0gLy8gZWxzZVxuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByZXN1bHQgPSByZXF1aXJlKFwibG9kYXNoLnJlc3VsdFwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5sZXQgaXNFbXB0eSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNlbXB0eVwiKTtcbmxldCBtZXJnZSA9IHJlcXVpcmUoXCJsb2Rhc2gubWVyZ2VcIik7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IGZsYXR0ZW4gPSByZXF1aXJlKFwibG9kYXNoLmZsYXR0ZW5cIik7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbmxldCBKb2kgPSByZXF1aXJlKFwiam9pXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IFZhbGlkYXRvcnMgPSByZXF1aXJlKFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IEVycm9yID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IGFkZFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4gIGRhdGEgPSBkYXRhIHx8IHt9O1xuICBsZXQgam9pT3B0aW9ucyA9IHtcbiAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbiAgICBhbGxvd1Vua25vd246IHRydWUsXG4gIH07XG4gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuICAgICAgZXJyb3JzXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbiAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lbW9bZGV0YWlsLnBhdGhdKSkge1xuICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuICAgICAgfVxuICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVhY3RSb3V0ZXIuU3RhdGUsIFN0YXRlLm1peGluXSxcblxuICBjdXJzb3JzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfS8+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgYXNzZW1ibHlEYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9XG4gIH0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdG9yRGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgfSxcblxuICB2YWxpZGF0ZTogZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICBsZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbiAgICBsZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JzOiBuZXh0RXJyb3JzXG4gICAgICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIG1vZGVsW2tleV0gPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4gICAgICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgfS5iaW5kKHRoaXMpO1xuICB9LFxuXG4gIHZhbGlkYXRlRGVib3VuY2VkOiBkZWJvdW5jZShmdW5jdGlvbiB2YWxpZGF0ZURlYm91bmNlZChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuICB9LCA1MDApLFxuXG4gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRJbml0aWFsU3RhdGUoKS5tb2RlbCksXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4gICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4gICAgICAgIGFkZFJvYm90KHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzO1xuICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkFkZCBSb2JvdFwifT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+QWRkIFJvYm90PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzRW1wdHkgPSByZXF1aXJlKFwibG9kYXNoLmlzZW1wdHlcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IEVycm9yID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IHJlbW92ZVJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBtb2RlbDogW1wicm9ib3RzXCIsIFwibW9kZWxzXCIsIHRoaXMuZ2V0UGFyYW1zKCkuaWRdLFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubW9kZWw7XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIGlmIChpc0VtcHR5KG1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJEZXRhaWwgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZWRpdFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tb3JhbmdlXCIgdGl0bGU9XCJFZGl0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cmVtb3ZlUm9ib3QuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuaWR9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmFzc2VtYmx5RGF0ZX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5tYW51ZmFjdHVyZXJ9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfSxcbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJlc3VsdCA9IHJlcXVpcmUoXCJsb2Rhc2gucmVzdWx0XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IG1lcmdlID0gcmVxdWlyZShcImxvZGFzaC5tZXJnZVwiKTtcbmxldCBkZWJvdW5jZSA9IHJlcXVpcmUoXCJsb2Rhc2guZGVib3VuY2VcIik7XG5sZXQgZmxhdHRlbiA9IHJlcXVpcmUoXCJsb2Rhc2guZmxhdHRlblwiKTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgRXJyb3IgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvZXJyb3JcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgZWRpdFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdFwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbiAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgbGV0IGpvaU9wdGlvbnMgPSB7XG4gICAgYWJvcnRFYXJseTogZmFsc2UsXG4gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuICB9O1xuICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbiAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbiAgICAgIGVycm9yc1xuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbiAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbiAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfSwge30pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBsZXQgbG9hZE1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmxvYWRNb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBsZXQgc2NoZW1hID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yVHlwZXNcIikgfHwge307XG4gICAgbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4gICAgbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBpc0FycmF5KGIpID8gYiA6IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yczogbmV4dEVycm9yc1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgICAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgfSxcblxuICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcblxuICBoYW5kbGVSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbiAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbiAgICAgICAgZWRpdFJvYm90KHtcbiAgICAgICAgICBpZDogdGhpcy5zdGF0ZS5tb2RlbC5pZCxcbiAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvciwgbG9hZE1vZGVsfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2UgaWYgKGlzRW1wdHkobW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IHt0b0FycmF5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgRXJyb3IgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvZXJyb3JcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3RJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSb2JvdHNcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1hZGRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmVlblwiIHRpdGxlPVwiQWRkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPFJvYm90SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9LFxufSk7XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e21vZGVsLmlkfSBjbGFzc05hbWU9XCJjb2wtc20tNiBjb2wtbWQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBrZXk9e21vZGVsLmlkfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPjxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+e21vZGVsLm5hbWV9PC9MaW5rPjwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHRleHQtY2VudGVyIG5vcGFkZGluZ1wiPlxuICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fT5cbiAgICAgICAgICAgICAgPGltZyBzcmM9eydodHRwOi8vcm9ib2hhc2gub3JnLycgKyBtb2RlbC5pZCArICc/c2l6ZT0yMDB4MjAwJ30gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxufSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gUFJPWFkgUk9VVEVSIFRPIFNPTFZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBtYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICB0cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93LnJvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93LnJvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQmFvYmFiID0gcmVxdWlyZShcImJhb2JhYlwiKTtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhb2JhYih7XG4gIHJvYm90czoge1xuICAgIG1vZGVsczoge30sXG4gICAgbG9hZGluZzogdHJ1ZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgfSxcbiAgYWxlcnRzOiB7XG4gICAgbW9kZWxzOiB7fSxcbiAgICBsb2FkaW5nOiB0cnVlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICB9LFxufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcblxuLy8gUlVMRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHZhciBtb2RlbCA9IHtcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFzc2VtYmx5RGF0ZTogSm9pLmRhdGUoKS5tYXgoXCJub3dcIikucmVxdWlyZWQoKSxcbiAgbWFudWZhY3R1cmVyOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbn07XG4iXX0=
