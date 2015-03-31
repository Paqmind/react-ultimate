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

  propTypes: function propTypes() {
    return {
      title: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired };
  },

  render: function render() {
    return React.createElement(
      "section",
      { className: "container" },
      React.createElement(
        "h1",
        null,
        this.props.title
      ),
      React.createElement(
        "p",
        { className: "error" },
        this.props.description
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
        { className: "loading" + sizeClass },
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
      var _status = response.statusText;
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").unset(id); // Cancel add
      addAlert({ message: "Action `Robot.add` failed", category: "error" });
      return _status;
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
  var oldModel = State.select("robots", "models", id);
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
      var _status = response.statusText;
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").set(id, oldModel); // Cancel edit
      addAlert({ message: "Action `Robot.edit` failed", category: "error" });
      return _status;
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
    return models;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      //      let loadError = {status: response.statusText, url: apiURL};
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", loadError);
      addAlert({ message: "Action `Robot.loadMany` failed", category: "error" });
      return loadError;
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
  var oldModel = State.select("robots", "models", id);
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
      var _status = response.statusText;
      State.select("robots").set("loading", false);
      State.select("robots").set("loadError", _status);
      State.select("robots", "models").set(id, oldModel); // Cancel remove
      addAlert({ message: "Action `Robot.remove` failed", category: "error" });
      return _status;
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
var Joi = require("joi");
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var DocumentTitle = require("react-document-title");
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

},{"classnames":"classnames","frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/add":17,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],22:[function(require,module,exports){
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
    var loading = _state$cursors$robots.loading;
    var loadError = _state$cursors$robots.loadError;

    var model = this.state.cursors.model;

    if (loading) {
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

},{"frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/remove":20,"frontend/state":28,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],23:[function(require,module,exports){
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

},{"classnames":"classnames","frontend/common/components/loading":14,"frontend/common/components/notfound":15,"frontend/robot/actions/edit":18,"frontend/robot/actions/remove":20,"frontend/state":28,"joi":"joi","lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router","shared/robot/validators":29}],24:[function(require,module,exports){
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
      return React.createElement(Error, { title: "Load error", description: loadError.status });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9hcHAvYXBwLmpzIiwiZnJvbnRlbmQvYXBwL3NoaW1zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2FjdGlvbnMvbG9hZG1hbnkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9yZW1vdmUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvZXJyb3IuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaGVhZHJvb20uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWRtYW55LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3N0YXRlLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9yb2JvdC92YWxpZGF0b3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyQyxLQUFLLEdBQWtELFdBQVcsQ0FBbEUsS0FBSztJQUFFLFlBQVksR0FBb0MsV0FBVyxDQUEzRCxZQUFZO0lBQUUsYUFBYSxHQUFxQixXQUFXLENBQTdDLGFBQWE7SUFBRSxlQUFlLEdBQUksV0FBVyxDQUE5QixlQUFlOzs7QUFHeEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENB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QUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUN0QyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gU2hpbXMsIHBvbHlmaWxsc1xubGV0IFNoaW1zID0gcmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIENvbW1vblxubGV0IEJvZHkgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keVwiKTtcbmxldCBIb21lID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWVcIik7XG5sZXQgQWJvdXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXRcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5cbi8vIEFsZXJ0XG5sZXQgbG9hZE1hbnlBbGVydHMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9sb2FkbWFueVwiKTtcblxuLy8gUm9ib3RcbmxldCBsb2FkTWFueVJvYm90cyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWRtYW55XCIpO1xubGV0IFJvYm90SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleFwiKTtcbmxldCBSb2JvdEFkZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiKTtcbmxldCBSb2JvdERldGFpbCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbFwiKTtcbmxldCBSb2JvdEVkaXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0XCIpO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcm91dGVzID0gKFxuICA8Um91dGUgaGFuZGxlcj17Qm9keX0gcGF0aD1cIi9cIj5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJob21lXCIgaGFuZGxlcj17SG9tZX0vPlxuICAgIDxSb3V0ZSBuYW1lPVwiYWJvdXRcIiBwYXRoPVwiL2Fib3V0XCIgaGFuZGxlcj17QWJvdXR9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWluZGV4XCIgaGFuZGxlcj17Um9ib3RJbmRleH0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtYWRkXCIgcGF0aD1cImFkZFwiIGhhbmRsZXI9e1JvYm90QWRkfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1kZXRhaWxcIiBwYXRoPVwiOmlkXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90LWVkaXRcIiBwYXRoPVwiOmlkL2VkaXRcIiBoYW5kbGVyPXtSb2JvdEVkaXR9Lz5cbiAgICA8Tm90Rm91bmRSb3V0ZSBoYW5kbGVyPXtOb3RGb3VuZH0vPlxuICA8L1JvdXRlPlxuKTtcblxud2luZG93LnJvdXRlciA9IFJlYWN0Um91dGVyLmNyZWF0ZSh7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93LnJvdXRlci5ydW4oKEhhbmRsZXIsIHN0YXRlKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuXG5sb2FkTWFueUFsZXJ0cygpO1xubG9hZE1hbnlSb2JvdHMoKTsiLCJsZXQgSW5zcGVjdCA9IHJlcXVpcmUoXCJ1dGlsLWluc3BlY3RcIik7XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB0aGlzXG4gICAgLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGU7IH0sIDEpO1xuICAgIH0pO1xufTtcblxud2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBJbnNwZWN0KHYpKSk7XG59OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikuc2V0KGlkLCBuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQge3RvT2JqZWN0fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTWFueSgpIHtcbiAgbGV0IGFwaVVSTCA9IGBhcGkvYWxlcnRzYDtcblxuICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IHt9fSk7XG4gIHJldHVybiB7fTtcbiAgLy8gVE9ETzogYmFja2VuZFxuICAvL3JldHVybiBBeGlvcy5nZXQoYXBpVVJMKVxuICAvLyAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAvLyAgICBsZXQgbW9kZWxzID0gdG9PYmplY3QocmVzcG9uc2UuZGF0YSk7XG4gIC8vICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gIC8vICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5lZGl0KHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWQsIG1vZGVsczogbW9kZWxzfSk7XG4gIC8vICAgIHJldHVybiBtb2RlbHM7XG4gIC8vICB9KVxuICAvLyAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgLy8gICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgLy8gICAgICB0aHJvdyByZXNwb25zZTtcbiAgLy8gICAgfSBlbHNlIHtcbiAgLy8gICAgICBsZXQgbG9hZEVycm9yID0ge3N0YXR1czogcmVzcG9uc2Uuc3RhdHVzVGV4dCwgdXJsOiBhcGlVUkx9O1xuICAvLyAgICAgIFN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgLy8gICAgICBTdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikuc2V0KFwibG9hZEVycm9yXCIsIGxvYWRFcnJvcik7XG4gIC8vICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBBbGVydC5sb2FkTWFueWAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgLy8gICAgICByZXR1cm4gbG9hZEVycm9yO1xuICAvLyAgICB9XG4gIC8vICB9KTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb24tcGVyc2lzdGVudCByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0NTU1RyYW5zaXRpb25Hcm91cH0gPSByZXF1aXJlKFwicmVhY3QvYWRkb25zXCIpLmFkZG9ucztcbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdGZvdW5kXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xubGV0IEFsZXJ0SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICBhbGVydHM6IFtcImFsZXJ0c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMuYWxlcnRzO1xuICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgICAgPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbiAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICA8L0NTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjbGFzc05hbWVzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCByZW1vdmVBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtyZW1vdmVBbGVydC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e3JlbW92ZUFsZXJ0LmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICBpZiAoIWRhdGEubWVzc2FnZSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEubWVzc2FnZWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgaWYgKCFkYXRhLmNhdGVnb3J5KSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5jYXRlZ29yeWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgIGlkOiBVVUlELnY0KCksXG4gICAgY2xvc2FibGU6IHRydWUsXG4gICAgZXhwaXJlOiBkYXRhLmNhdGVnb3J5ID09IFwiZXJyb3JcIiA/IDAgOiA1MDAwLFxuICB9LCBkYXRhKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5sZXQgSGVhZHJvb20gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaGVhZHJvb21cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBoZWFkcm9vbUNsYXNzTmFtZXMgPSB7dmlzaWJsZTogXCJuYXZiYXItZG93blwiLCBoaWRkZW46IFwibmF2YmFyLXVwXCJ9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8SGVhZHJvb20gY29tcG9uZW50PVwiaGVhZGVyXCIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiIGhlYWRyb29tQ2xhc3NOYW1lcz17aGVhZHJvb21DbGFzc05hbWVzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1wYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1iYXJzIGZhLWxnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgdG89XCJob21lXCI+PHNwYW4gY2xhc3NOYW1lPVwibGlnaHRcIj5SZWFjdDwvc3Bhbj5TdGFydGVyPC9MaW5rPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZSBuYXZiYXItcGFnZS1oZWFkZXIgbmF2YmFyLXJpZ2h0IGJyYWNrZXRzLWVmZmVjdFwiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJob21lXCI+SG9tZTwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cInJvYm90LWluZGV4XCI+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIDxBbGVydEluZGV4Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgICAgZGVzY3JpcHRpb246IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxoMT57dGhpcy5wcm9wcy50aXRsZX08L2gxPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJlcnJvclwiPnt0aGlzLnByb3BzLmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgIDwvc2VjdGlvbj5cbiAgICApO1xuICB9XG59KTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB0aHJvdHRsZSA9IHJlcXVpcmUoXCJsb2Rhc2gudGhyb3R0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBIZWFkcm9vbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBoZWFkcm9vbUNsYXNzTmFtZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgfVxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tcG9uZW50OiBcImRpdlwiLFxuICAgIH1cbiAgfSxcblxuICBoYXNTY3JvbGxlZDogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfSxcblxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzTmFtZTogXCJcIlxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vIEluaXQgb3B0aW9uc1xuICAgIHRoaXMuZGVsdGFIZWlnaHQgPSB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0ID8gdGhpcy5wcm9wcy5kZWx0YUhlaWdodCA6IDU7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMucHJvcHMuZGVsYXkgPyB0aGlzLnByb3BzLmRlbGF5IDogMjUwO1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9wcy5pZCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhyb3R0bGUodGhpcy5oYXNTY3JvbGxlZCwgdGhpcy5kZWxheSksIGZhbHNlKTtcblxuICAgIC8vIFVwZGF0ZSBjb21wb25lbnRcInMgY2xhc3NOYW1lXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhlYWRyb29tO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJlYWN0IFN0YXJ0ZXJcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaG9tZVwiPlxuICAgICAgICAgIDxoMT5SZWFjdCBzdGFydGVyIGFwcDwvaDE+XG4gICAgICAgICAgPHA+UHJvb2Ygb2YgY29uY2VwdHMsIENSVUQsIHdoYXRldmVyLi4uPC9wPlxuICAgICAgICAgIDxwPlByb3VkbHkgYnVpbGQgb24gRVM2IHdpdGggdGhlIGhlbHAgb2YgPGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gdHJhbnNwaWxlci48L3A+XG4gICAgICAgICAgPGgzPkZyb250ZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvXCI+UmVhY3Q8L2E+IGRlY2xhcmF0aXZlIFVJPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1lvbWd1aXRoZXJlYWwvYmFvYmFiXCI+QmFvYmFiPC9hPiBKUyBkYXRhIHRyZWUgd2l0aCBjdXJzb3JzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3JhY2t0L3JlYWN0LXJvdXRlclwiPlJlYWN0LVJvdXRlcjwvYT4gZGVjbGFyYXRpdmUgcm91dGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtZG9jdW1lbnQtdGl0bGVcIj5SZWFjdC1Eb2N1bWVudC1UaXRsZTwvYT4gZGVjbGFyYXRpdmUgZG9jdW1lbnQgdGl0bGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vXCI+UmVhY3QtQm9vdHN0cmFwPC9hPiBCb290c3RyYXAgY29tcG9uZW50cyBpbiBSZWFjdDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9icm93c2VyaWZ5Lm9yZy9cIj5Ccm93c2VyaWZ5PC9hPiAmYW1wOyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL3dhdGNoaWZ5XCI+V2F0Y2hpZnk8L2E+IGJ1bmRsZSBOUE0gbW9kdWxlcyB0byBmcm9udGVuZDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ib3dlci5pby9cIj5Cb3dlcjwvYT4gZnJvbnRlbmQgcGFja2FnZSBtYW5hZ2VyPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2V4cHJlc3Nqcy5jb20vXCI+RXhwcmVzczwvYT4gd2ViLWFwcCBiYWNrZW5kIGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb3ppbGxhLmdpdGh1Yi5pby9udW5qdWNrcy9cIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2VsZWl0aC9lbWFpbGpzXCI+RW1haWxKUzwvYT4gU01UUCBjbGllbnQ8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gSlMgdHJhbnNwaWxlcjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ndWxwanMuY29tL1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2xvZGFzaC5jb20vXCI+TG9kYXNoPC9hPiB1dGlsaXR5IGxpYnJhcnk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vc29ja2V0LmlvL1wiPlNvY2tldElPPC9hPiByZWFsLXRpbWUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcIj5BeGlvczwvYT4gcHJvbWlzZS1iYXNlZCBIVFRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9pbW11dGFibGUtanNcIj5JbW11dGFibGU8L2E+IHBlcnNpc3RlbnQgaW1tdXRhYmxlIGRhdGEgZm9yIEpTPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2hhcGlqcy9qb2lcIj5Kb2k8L2E+IG9iamVjdCBzY2hlbWEgdmFsaWRhdGlvbjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbi8qXG4qIFRPRE9cbipcbiogYmFiZWxpZnk/XG4qIGNoYWk/XG4qIGNsYXNzbmFtZXM/XG4qIGNvbmZpZz9cbiogY2xpZW50Y29uZmlnP1xuKiBoZWxtZXQ/XG4qIGh1c2t5dlxuKiBtb2NoYT9cbiogbW9yZ2FuP1xuKiB3aW5zdG9uP1xuKiB5YXJncz9cbiogKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImxvYWRpbmdcIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBzb3J0QnkgPSByZXF1aXJlKFwibG9kYXNoLnNvcnRieVwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xuICBpZiAoaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihcImV4cGVjdGVkIHR5cGUgaXMgQXJyYXksIGdldCBcIiArIHR5cGVvZiBhcnJheSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoXCJleHBlY3RlZCB0eXBlIGlzIE9iamVjdCwgZ2V0IFwiICsgdHlwZW9mIG9iamVjdCk7XG4gIH1cbn1cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIGZhaWxlZFwiLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGFkZFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBzdGF0dXMpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICByZXR1cm4gc3RhdHVzO1xuICB9IC8vIGVsc2VcbiAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCB1bmRlZmluZWQpO1xuICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgYWRkQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy9hZGRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCk7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgbmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQoYXBpVVJMLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICAgIGFkZEFsZXJ0KHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICAgICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWRcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgZWRpdFxuICAgIHJldHVybiBzdGF0dXM7XG4gIH0gLy8gZWxzZVxuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgYWRkQWxlcnQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWRcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgIHJldHVybiBzdGF0dXM7XG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQge3RvT2JqZWN0fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IGFkZEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTWFueSgpIHtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy9gO1xuXG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KGFwaVVSTClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQgbW9kZWxzID0gdG9PYmplY3QocmVzcG9uc2UuZGF0YSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuZWRpdCh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkLCBtb2RlbHM6IG1vZGVsc30pO1xuICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLmVkaXQoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZCwgbW9kZWxzOiBtb2RlbHN9KTtcbiAgICAgIHJldHVybiBtb2RlbHM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAvLyAgICAgIGxldCBsb2FkRXJyb3IgPSB7c3RhdHVzOiByZXNwb25zZS5zdGF0dXNUZXh0LCB1cmw6IGFwaVVSTH07XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRFcnJvclwiLCBsb2FkRXJyb3IpO1xuICAgICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmxvYWRNYW55YCBmYWlsZWRcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gbG9hZEVycm9yO1xuICAgICAgfVxuICAgIH0pO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IGFkZEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnMvYWRkXCIpO1xubGV0IFN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKTtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgdHJ1ZSk7XG4gIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZShhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG4gICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHVuZGVmaW5lZCk7XG4gICAgICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICAgICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgICAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5zZXQoaWQsIG9sZE1vZGVsKTsgLy8gQ2FuY2VsIHJlbW92ZVxuICAgICAgICBhZGRBbGVydCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgZmFpbGVkXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cbiAgICB9KTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIGxldCBzdGF0dXMgPSByZXNwb25zZS5zdGF0dXNUZXh0O1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkaW5nXCIsIGZhbHNlKTtcbiAgICBTdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikuc2V0KFwibG9hZEVycm9yXCIsIHN0YXR1cyk7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnNldChpZCwgb2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSAvLyBlbHNlXG4gICAgbGV0IHN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1c1RleHQ7XG4gICAgU3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuICAgIFN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5zZXQoXCJsb2FkRXJyb3JcIiwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJlc3VsdCA9IHJlcXVpcmUoXCJsb2Rhc2gucmVzdWx0XCIpO1xubGV0IGlzQXJyYXkgPSByZXF1aXJlKFwibG9kYXNoLmlzYXJyYXlcIik7XG5sZXQgaXNQbGFpbk9iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiKTtcbmxldCBpc0VtcHR5ID0gcmVxdWlyZShcImxvZGFzaC5pc2VtcHR5XCIpO1xubGV0IG1lcmdlID0gcmVxdWlyZShcImxvZGFzaC5tZXJnZVwiKTtcbmxldCBkZWJvdW5jZSA9IHJlcXVpcmUoXCJsb2Rhc2guZGVib3VuY2VcIik7XG5sZXQgZmxhdHRlbiA9IHJlcXVpcmUoXCJsb2Rhc2guZmxhdHRlblwiKTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90Zm91bmRcIik7XG5sZXQgU3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5sZXQgYWRkUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9hZGRcIik7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbiAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgbGV0IGpvaU9wdGlvbnMgPSB7XG4gICAgYWJvcnRFYXJseTogZmFsc2UsXG4gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuICB9O1xuICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbiAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbiAgICAgIGVycm9yc1xuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbiAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIGRldGFpbCkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lbW9bZGV0YWlsLnBhdGhdKSkge1xuICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuICAgICAgfVxuICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVhY3RSb3V0ZXIuU3RhdGUsIFN0YXRlLm1peGluXSxcblxuICBjdXJzb3JzKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfS8+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgYXNzZW1ibHlEYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9XG4gIH0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdG9yRGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgfSxcblxuICB2YWxpZGF0ZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgbGV0IHNjaGVtYSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvclR5cGVzXCIpIHx8IHt9O1xuICAgIGxldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuICAgIGxldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBpc0FycmF5KGIpID8gYiA6IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yczogbmV4dEVycm9yc1xuICAgICAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZXZlbnQucGVyc2lzdCgpO1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIG1vZGVsW2tleV0gPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4gICAgICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgfS5iaW5kKHRoaXMpO1xuICB9LFxuXG4gIHZhbGlkYXRlRGVib3VuY2VkOiBkZWJvdW5jZShmdW5jdGlvbiB2YWxpZGF0ZURlYm91bmNlZChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuICB9LCA1MDApLFxuXG4gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRJbml0aWFsU3RhdGUoKS5tb2RlbCksXG4gICAgfSk7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5wZXJzaXN0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4gICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4gICAgICAgIGFkZFJvYm90KHtcbiAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzO1xuICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiQWRkIFJvYm90XCJ9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5uYW1lLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLmFzc2VtYmx5RGF0ZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYXNzZW1ibHlEYXRlXCI+QXNzZW1ibHkgRGF0ZTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcImFzc2VtYmx5RGF0ZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm1hbnVmYWN0dXJlci5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKVxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8qXG48VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiovIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWFjdFJvdXRlci5TdGF0ZSwgU3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAgICAgbW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLm5hbWV9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5pZCArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5uYW1lfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5TZXJpYWwgTnVtYmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5pZH08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+QXNzZW1ibHkgRGF0ZTwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuYXNzZW1ibHlEYXRlfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5NYW51ZmFjdHVyZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLm1hbnVmYWN0dXJlcn08L2RkPlxuICAgICAgICAgICAgICAgICAgPC9kbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9LFxufSk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcmVzdWx0ID0gcmVxdWlyZShcImxvZGFzaC5yZXN1bHRcIik7XG5sZXQgaXNBcnJheSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNhcnJheVwiKTtcbmxldCBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc3BsYWlub2JqZWN0XCIpO1xubGV0IGlzRW1wdHkgPSByZXF1aXJlKFwibG9kYXNoLmlzZW1wdHlcIik7XG5sZXQgbWVyZ2UgPSByZXF1aXJlKFwibG9kYXNoLm1lcmdlXCIpO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBmbGF0dGVuID0gcmVxdWlyZShcImxvZGFzaC5mbGF0dGVuXCIpO1xubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3Rmb3VuZFwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBlZGl0Um9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lZGl0XCIpO1xubGV0IHJlbW92ZVJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbihtZW1vLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbiAgZGF0YSA9IGRhdGEgfHwge307XG4gIGxldCBqb2lPcHRpb25zID0ge1xuICAgIGFib3J0RWFybHk6IGZhbHNlLFxuICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbiAgfTtcbiAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4gICAgICBlcnJvcnNcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBkZXRhaWwpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbiAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfSwge30pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlYWN0Um91dGVyLlN0YXRlLCBTdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29ycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gICAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBsZXQgbG9hZE1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmxvYWRNb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4gIH0sXG5cbiAgdmFsaWRhdGU6IGZ1bmN0aW9uKGtleSkge1xuICAgIGxldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbiAgICBsZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbiAgICBsZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gaXNBcnJheShiKSA/IGIgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvcnM6IG5leHRFcnJvcnNcbiAgICAgIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbiAgICB9KTtcbiAgfSxcblxuICBoYW5kbGVDaGFuZ2VGb3I6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuICAgICAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgfSxcblxuICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcblxuICBoYW5kbGVSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQucGVyc2lzdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbiAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnBlcnNpc3QoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbiAgICAgICAgZWRpdFJvYm90KHtcbiAgICAgICAgICBpZDogdGhpcy5zdGF0ZS5tb2RlbC5pZCxcbiAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbiAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBpc1ZhbGlkOiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvciwgbG9hZE1vZGVsfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFZGl0IFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyZW1vdmVSb2JvdC5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5pZCArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5uYW1lfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi8iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge3RvQXJyYXl9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBFcnJvciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvclwiKTtcbmxldCBTdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcbmxldCBSb2JvdEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1N0YXRlLm1peGluXSxcblxuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICBtb2RlbHMgPSB0b0FycmF5KG1vZGVscyk7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIHRpdGxlPVwiTG9hZCBlcnJvclwiIGRlc2NyaXB0aW9uPXtsb2FkRXJyb3Iuc3RhdHVzfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aDE+Um9ib3RzPC9oMT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8Um9ib3RJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAge2xvYWRpbmcgPyA8TG9hZGluZy8+IDogXCJcIn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH0sXG59KTtcblxuLypcbjxkaXYgY2xhc3NOYW1lPVwiYnV0dG9ucyBidG4tZ3JvdXBcIj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZXNldFwiPlJlc2V0IENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZW1vdmVcIj5SZW1vdmUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInNodWZmbGVcIj5TaHVmZmxlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJmZXRjaFwiPlJlZmV0Y2ggQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImFkZFwiPkFkZCBSYW5kb208L2J1dHRvbj5cbjwvZGl2PlxuKi8iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCByZW1vdmVSb2JvdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e21vZGVsLmlkfSBjbGFzc05hbWU9XCJjb2wtc20tNiBjb2wtbWQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBrZXk9e21vZGVsLmlkfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPjxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+e21vZGVsLm5hbWV9PC9MaW5rPjwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHRleHQtY2VudGVyIG5vcGFkZGluZ1wiPlxuICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fT5cbiAgICAgICAgICAgICAgPGltZyBzcmM9eydodHRwOi8vcm9ib2hhc2gub3JnLycgKyBtb2RlbC5pZCArICc/c2l6ZT0yMDB4MjAwJ30gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JlbW92ZVJvYm90LmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxufSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gUFJPWFkgUk9VVEVSIFRPIFNPTFZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBtYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICB0cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93LnJvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93LnJvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQmFvYmFiID0gcmVxdWlyZShcImJhb2JhYlwiKTtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhb2JhYih7XG4gIHJvYm90czoge1xuICAgIG1vZGVsczoge30sXG4gICAgbG9hZGluZzogdHJ1ZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgfSxcbiAgYWxlcnRzOiB7XG4gICAgbW9kZWxzOiB7fSxcbiAgICBsb2FkaW5nOiB0cnVlLFxuICAgIGxvYWRFcnJvcjogbnVsbCxcbiAgfSxcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBKb2kgPSByZXF1aXJlKFwiam9pXCIpO1xuXG4vLyBSVUxFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgdmFyIG1vZGVsID0ge1xuICBuYW1lOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgYXNzZW1ibHlEYXRlOiBKb2kuZGF0ZSgpLm1heChcIm5vd1wiKS5yZXF1aXJlZCgpLFxuICBtYW51ZmFjdHVyZXI6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxufTtcbiJdfQ==
