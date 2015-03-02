(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ivankleshnin/JavaScript/twitto/frontend/app/app.js":[function(require,module,exports){
"use strict";

// SHIMS ===========================================================================================
var inspect = require("util-inspect");
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
    return inspect(v);
  }));
};

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var HistoryLocation = ReactRouter.HistoryLocation;

// Init stores
var RobotStore = require("frontend/robot/stores");
var AlertStore = require("frontend/alert/stores");

// Common components
var Body = require("frontend/common/components/body");
var Home = require("frontend/common/components/home");
var About = require("frontend/common/components/about");
var NotFound = require("frontend/common/components/not-found");

// Robot components
var RobotRoot = require("frontend/robot/components/root");
var RobotIndex = require("frontend/robot/components/index");
var RobotDetail = require("frontend/robot/components/detail");
var RobotAdd = require("frontend/robot/components/add");
var RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
var routes = React.createElement(
  Route,
  { handler: Body, path: "/" },
  React.createElement(DefaultRoute, { name: "home", handler: Home }),
  React.createElement(
    Route,
    { name: "robot", path: "/robots/", handler: RobotRoot },
    React.createElement(DefaultRoute, { name: "robot-index", handler: RobotIndex }),
    React.createElement(Route, { name: "robot-add", path: "add", handler: RobotAdd }),
    React.createElement(Route, { name: "robot-detail", path: ":id", handler: RobotDetail }),
    React.createElement(Route, { name: "robot-edit", path: ":id/edit", handler: RobotEdit })
  ),
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

},{"frontend/alert/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/stores.js","frontend/common/components/about":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/about.js","frontend/common/components/body":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/body.js","frontend/common/components/home":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/home.js","frontend/common/components/not-found":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/not-found.js","frontend/robot/components/add":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/add.js","frontend/robot/components/detail":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/detail.js","frontend/robot/components/edit":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/edit.js","frontend/robot/components/index":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/index.js","frontend/robot/components/root":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/root.js","frontend/robot/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js","object.assign":"object.assign","react":"react","react-router":"react-router","util-inspect":"util-inspect"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/actions.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var isObject = require("lodash.isobject");

var _require = require("immutable");

var Map = _require.Map;

var Reflux = require("reflux");

// EXPORTS =========================================================================================
var AlertActions = Reflux.createActions({
  loadMany: { asyncResult: true },
  add: {},
  remove: {} });

module.exports = AlertActions;

},{"immutable":"immutable","lodash.isobject":"lodash.isobject","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/components/index.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");

var CSSTransitionGroup = require("react/addons").addons.CSSTransitionGroup;

var Reflux = require("reflux");
var AlertActions = require("frontend/alert/actions");
var AlertStore = require("frontend/alert/stores");
var AlertItem = require("frontend/alert/components/item");

// EXPORTS =========================================================================================
var Index = React.createClass({
  displayName: "Index",

  mixins: [Reflux.connect(AlertStore, "models")],

  componentDidMount: function componentDidMount() {
    AlertActions.loadMany();
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "notifications top-left" },
      React.createElement(
        CSSTransitionGroup,
        { transitionName: "fade", component: "div" },
        this.state.models.toArray().map(function (model) {
          return React.createElement(AlertItem, { model: model, key: model.id });
        })
      )
    );
  }
});

module.exports = Index;

},{"frontend/alert/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/actions.js","frontend/alert/components/item":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/components/item.js","frontend/alert/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/stores.js","react":"react","react/addons":"react/addons","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/components/item.js":[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// IMPORTS =========================================================================================
var classNames = require("classnames");
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var AlertActions = require("frontend/alert/actions");

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

    var removeItem = AlertActions.remove.bind(this, model.id);
    var result = React.createElement(
      "div",
      _extends({ className: classes }, this.props),
      model.closable ? React.createElement(CloseLink, { onClick: removeItem }) : "",
      model.message
    );

    if (model.expire) {
      result = React.createElement(
        Expire,
        { onExpire: removeItem, delay: model.expire },
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

},{"classnames":"classnames","frontend/alert/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/actions.js","react":"react","react-router":"react-router"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/models.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================

var _require = require("immutable");

var Record = _require.Record;

// EXPORTS =========================================================================================
var Alert = Record({
  id: undefined,
  message: undefined,
  category: undefined,
  closable: true,
  expire: 5000 });

module.exports = Alert;

},{"immutable":"immutable"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/stores.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var UUID = require("node-uuid");

var _require = require("immutable");

var List = _require.List;
var Map = _require.Map;
var OrderedMap = _require.OrderedMap;

var Reflux = require("reflux");
var ReactRouter = require("react-router");
var AlertActions = require("frontend/alert/actions");

// EXPORTS =========================================================================================
var AlertStore = Reflux.createStore({
  listenables: [AlertActions],

  getInitialState: function getInitialState() {
    return OrderedMap();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init: function init() {
    this.resetState();
  },

  resetState: function resetState() {
    this.setState(this.getInitialState());
  },

  setState: function setState(state) {
    if (state === undefined) {
      throw Error("`state` is required");
    } else {
      this.state = state;
      this.shareState();
    }
  },

  shareState: function shareState() {
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
  normalize: function normalize(message, category) {
    if (isString(model)) {
      model = {
        message: model,
        category: category
      };
    }
    return Object.assign({}, model, { id: UUID.v4() });
  },

  add: function add(model) {
    model = model.merge({ id: UUID.v4() });
    this.setState(this.state.set(model.id, model));
  },

  remove: function remove(index) {
    if (index === undefined || index === null) {
      throw Error("`index` is required");
    } else {
      this.setState(this.state["delete"](index));
    }
  },

  pop: function pop() {
    this.setState(this.state.pop());
  }
});

module.exports = AlertStore;

},{"frontend/alert/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/actions.js","immutable":"immutable","node-uuid":"node-uuid","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/about.js":[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/body.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Reflux = require("reflux");
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

},{"frontend/alert/components/index":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/components/index.js","react":"react","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/home.js":[function(require,module,exports){
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
              { href: "#" },
              "React"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "React-Router"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "React-Document-Title"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Browserify"
            )
          ),
          React.createElement(
            "li",
            null,
            "In production mode, it will serve minfied, uniquely named files with super agressive cache headers. To test:",
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                "in dev_config.json set ",
                React.createElement(
                  "code",
                  null,
                  "isDev"
                ),
                " to ",
                React.createElement(
                  "code",
                  null,
                  "false"
                )
              ),
              React.createElement(
                "li",
                null,
                "restart the server"
              ),
              React.createElement(
                "li",
                null,
                "view source and you'll see minified css and js files with unique names"
              ),
              React.createElement(
                "li",
                null,
                "open the \"network\" tab in chrome dev tools (or something similar). You'll also want to make sure you haven't disabled your cache"
              ),
              React.createElement(
                "li",
                null,
                "without hitting \"refresh\" load the app again (selecting current URL in url bar and hitting \"enter\" works great)"
              ),
              React.createElement(
                "li",
                null,
                "you should now see that the JS and CSS files were both served from cache without making any request to the server at all"
              )
            )
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
              { href: "#" },
              "Express"
            ),
            " framework"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Nunjucks"
            ),
            " template engine"
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
              { href: "#" },
              "Gulp"
            ),
            " streaming build system"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
              "Joi"
            ),
            " data validation"
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#" },
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
              { href: "#" },
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

//seoTitle: "Home SEO title",

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/loading.js":[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/not-found.js":[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/text-input.js":[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// IMPORTS =========================================================================================
var immutableLens = require("paqmind.data-lens").immutableLens;
var debounce = require("lodash.debounce");
var React = require("react");

var _require = require("react-bootstrap");

var Alert = _require.Alert;
var Input = _require.Input;
var Button = _require.Button;

// EXPORTS =========================================================================================
var TextInput = React.createClass({
  displayName: "TextInput",

  propTypes: {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    form: React.PropTypes.object },

  render: function render() {
    var key = this.props.id;
    var form = this.props.form;
    var lens = immutableLens(key);
    return React.createElement(Input, _extends({ type: "text",
      key: key,
      ref: key,
      defaultValue: lens.get(form.state),
      onChange: this.handleChangeFor(key),
      bsStyle: form.isValid(key) ? undefined : "error",
      help: form.getValidationMessages(key).map(function (message) {
        return React.createElement(
          "span",
          { key: "", className: "help-block" },
          message
        );
      })
    }, this.props));
  },

  handleChangeFor: function handleChangeFor(key) {
    var form = this.props.form;
    var lens = immutableLens(key);
    return (function handleChange(event) {
      form.setState(lens.set(form.state, event.target.value));
      this.validateDebounced(key);
    }).bind(this);
  },

  validateDebounced: debounce(function validateDebounced(key) {
    var form = this.props.form;
    //console.echo("validateDebounced()");
    form.validate(key);
  }, 500) });

module.exports = TextInput;

},{"lodash.debounce":"lodash.debounce","paqmind.data-lens":"paqmind.data-lens","react":"react","react-bootstrap":"react-bootstrap"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Reflux = require("reflux");
var Router = require("frontend/router");
var Alert = require("frontend/alert/models");
var AlertActions = require("frontend/alert/actions");

// EXPORTS =========================================================================================
var RobotActions = Reflux.createActions({
  loadMany: { asyncResult: true },
  loadOne: { asyncResult: true },
  add: { asyncResult: true },
  edit: { asyncResult: true },
  remove: { asyncResult: true } });

RobotActions.add.completed.preEmit = function (res) {
  // We also can redirect to `/{res.data.id}/edit`
  AlertActions.add(Alert({ message: "Robot added!", category: "success" }));
  Router.transitionTo("robot-index"); // or use link = router.makePath("robot-index", params, query), concat anchor, this.transitionTo(link)
};

RobotActions.add.failed.preEmit = function (res) {
  AlertActions.add(Alert({ message: "Failed to add Robot!", category: "error" }));
};

RobotActions.remove.completed.preEmit = function (res) {
  AlertActions.add(Alert({ message: "Robot removed!", category: "success" }));
  Router.transitionTo("robot-index");
};

RobotActions.remove.failed.preEmit = function (res) {
  AlertActions.add(Alert({ message: "Failed to remove Robot!", category: "error" }));
};

module.exports = RobotActions;

},{"frontend/alert/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/actions.js","frontend/alert/models":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/alert/models.js","frontend/router":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/router.js","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/add.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var isObject = require("lodash.isobject");
var isString = require("lodash.isstring");

var _require = require("immutable");

var Map = _require.Map;

var React = require("react");
var Reflux = require("reflux");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

var _require2 = require("react-bootstrap");

var Alert = _require2.Alert;
var Input = _require2.Input;
var Button = _require2.Button;

var ValidationMixin = require("react-validation-mixin");
var Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/not-found");
var TextInput = require("frontend/common/components/text-input");
var RobotActions = require("frontend/robot/actions");
var RobotStore = require("frontend/robot/stores");

// EXPORTS =========================================================================================
var Add = React.createClass({
  displayName: "Add",

  mixins: [ValidationMixin],

  validatorTypes: function validatorTypes() {
    return {
      model: Validators.model
    };
  },

  validatorData: function validatorData() {
    console.echo("RobotAdd.validatorData", this.state);
    return {
      model: this.state.model.toJS()
    };
  },

  getInitialState: function getInitialState() {
    return {
      model: Map({
        name: undefined,
        assemblyDate: undefined,
        manufacturer: undefined }) };
  },

  render: function render() {
    if (isObject(this.state.model)) {
      var model = this.state.model;
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
                    React.createElement(TextInput, { label: "Name", placeholder: "Name", id: "model.name", form: this }),
                    React.createElement(TextInput, { label: "Assembly Date", placeholder: "Assembly Date", id: "model.assemblyDate", form: this }),
                    React.createElement(TextInput, { label: "Manufacturer", placeholder: "Manufacturer", id: "model.manufacturer", form: this })
                  ),
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "button",
                      { className: "btn btn-default", type: "button", onClick: this.handleReset },
                      "Reset"
                    ),
                    " ",
                    React.createElement(
                      "button",
                      { className: "btn btn-primary", type: "submit" },
                      "Submit"
                    )
                  )
                )
              )
            )
          )
        )
      );
    } else if (isString(this.state.model)) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(Loading, null);
    }
  },

  // Dirty hacks with setTimeout until valid callback architecture (mixin 4.0 branch) --------------
  handleSubmit: function handleSubmit(event) {
    var _this = this;

    console.echo("RobotAdd.handleSubmit");
    event.preventDefault();
    this.validate();
    setTimeout(function () {
      if (_this.isValid()) {
        RobotActions.add(_this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    }, 500);
  } });

module.exports = Add;

//handleReset(event) {
//  event.preventDefault();
//  this.setState(this.getInitialState());
//  setTimeout(function() {
//    alert("xxx")
//  }, 200);
//},
// -----------------------------------------------------------------------------------------------

},{"frontend/common/components/loading":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/loading.js","frontend/common/components/not-found":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/not-found.js","frontend/common/components/text-input":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/text-input.js","frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","frontend/robot/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js","immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":"/Users/ivankleshnin/JavaScript/twitto/node_modules/lodash.isstring/index.js","react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":"/Users/ivankleshnin/JavaScript/twitto/node_modules/shared/robot/validators.js"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/detail.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var isObject = require("lodash.isobject");
var isString = require("lodash.isstring");
var React = require("react");
var Reflux = require("reflux");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/not-found");
var RobotActions = require("frontend/robot/actions");
var RobotStore = require("frontend/robot/stores");

// EXPORTS =========================================================================================
var Detail = React.createClass({
  displayName: "Detail",

  mixins: [ReactRouter.State, Reflux.connectFilter(RobotStore, "model", function (models) {
    var id = this.getParams().id;
    return models.get(id);
  })],

  componentDidMount: function componentDidMount() {
    RobotActions.loadOne(this.getParams().id);
  },

  render: function render() {
    if (isObject(this.state.model)) {
      var model = this.state.model;
      return React.createElement(
        DocumentTitle,
        { title: "Detail " + model.get("name") },
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
                  { to: "robot-edit", params: { id: model.get("id") }, className: "btn btn-orange", title: "Edit" },
                  React.createElement("span", { className: "fa fa-edit" })
                ),
                React.createElement(
                  "a",
                  { className: "btn btn-red", title: "Remove", onClick: RobotActions.remove.bind(this, model.get("id")) },
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
                  React.createElement("img", { src: "http://robohash.org/" + model.get("id") + "?size=200x200", width: "200px", height: "200px" })
                )
              ),
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-9" },
                React.createElement(
                  "h1",
                  { className: "nomargin-top" },
                  model.get("name")
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
                    model.get("id")
                  ),
                  React.createElement(
                    "dt",
                    null,
                    "Assembly Date"
                  ),
                  React.createElement(
                    "dd",
                    null,
                    model.get("assemblyDate")
                  ),
                  React.createElement(
                    "dt",
                    null,
                    "Manufacturer"
                  ),
                  React.createElement(
                    "dd",
                    null,
                    model.get("manufacturer")
                  )
                )
              )
            )
          )
        )
      );
    } else if (isString(this.state.model)) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(Loading, null);
    }
  } });

module.exports = Detail;

},{"frontend/common/components/loading":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/loading.js","frontend/common/components/not-found":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/not-found.js","frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","frontend/robot/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js","lodash.isobject":"lodash.isobject","lodash.isstring":"/Users/ivankleshnin/JavaScript/twitto/node_modules/lodash.isstring/index.js","react":"react","react-document-title":"react-document-title","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/edit.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var isObject = require("lodash.isobject");
var isString = require("lodash.isstring");

var _require = require("immutable");

var Map = _require.Map;

var React = require("react");
var Reflux = require("reflux");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;

var DocumentTitle = require("react-document-title");

var _require2 = require("react-bootstrap");

var Alert = _require2.Alert;
var Input = _require2.Input;
var Button = _require2.Button;

var ValidationMixin = require("react-validation-mixin");
var Validators = require("shared/robot/validators");
var Loading = require("frontend/common/components/loading");
var NotFound = require("frontend/common/components/not-found");
var TextInput = require("frontend/common/components/text-input");
var RobotActions = require("frontend/robot/actions");
var RobotStore = require("frontend/robot/stores");

// EXPORTS =========================================================================================
var Edit = React.createClass({
  displayName: "Edit",

  mixins: [ReactRouter.State, ValidationMixin, Reflux.connectFilter(RobotStore, "model", function (models) {
    var id = this.getParams().id;
    return models.get(id);
  })],

  componentDidMount: function componentDidMount() {
    RobotActions.loadOne(this.getParams().id);
  },

  validatorTypes: function validatorTypes() {
    return {
      model: Validators.model
    };
  },

  validatorData: function validatorData() {
    console.echo("RobotEdit.validatorData", this.state);
    return {
      model: this.state.model.toJS()
    };
  },

  getInitialState: function getInitialState() {
    return {
      model: undefined
    };
  },

  render: function render() {
    if (isObject(this.state.model)) {
      var model = this.state.model;
      return React.createElement(
        DocumentTitle,
        { title: "Edit " + model.get("name") },
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
                  { to: "robot-detail", params: { id: model.get("id") }, className: "btn btn-blue", title: "Detail" },
                  React.createElement("span", { className: "fa fa-eye" })
                ),
                React.createElement(
                  "a",
                  { className: "btn btn-red", title: "Remove", onClick: RobotActions.remove.bind(this, model.get("id")) },
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
                  React.createElement("img", { src: "http://robohash.org/" + model.get("id") + "?size=200x200", width: "200px", height: "200px" })
                )
              ),
              React.createElement(
                "div",
                { className: "col-xs-12 col-sm-9" },
                React.createElement(
                  "h1",
                  { className: "nomargin-top" },
                  model.get("name")
                ),
                React.createElement(
                  "form",
                  { onSubmit: this.handleSubmit },
                  React.createElement(
                    "fieldset",
                    null,
                    React.createElement(TextInput, { label: "Name", placeholder: "Name", id: "model.name", form: this }),
                    React.createElement(TextInput, { label: "Assembly Date", placeholder: "Assembly Date", id: "model.assemblyDate", form: this }),
                    React.createElement(TextInput, { label: "Manufacturer", placeholder: "Manufacturer", id: "model.manufacturer", form: this })
                  ),
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "button",
                      { className: "btn btn-default", type: "button", onClick: this.handleReset },
                      "Reset"
                    ),
                    " ",
                    React.createElement(
                      "button",
                      { className: "btn btn-primary", type: "submit" },
                      "Submit"
                    )
                  )
                )
              )
            )
          )
        )
      );
    } else if (isString(this.state.model)) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(Loading, null);
    }
  },

  // Dirty hacks with setTimeout until valid callback architecture (mixin 4.0 branch) --------------
  handleSubmit: function handleSubmit(event) {
    var _this = this;

    console.echo("RobotEdit.handleSubmit");
    event.preventDefault();
    this.validate();
    setTimeout(function () {
      if (_this.isValid()) {
        RobotActions.edit(_this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    }, 500);
  } });

module.exports = Edit;

//handleReset(event) {
//  event.preventDefault();
//  this.setState(this.getInitialState());
//  setTimeout(function() {
//    alert("xxx")
//  }, 200);
//},
// -----------------------------------------------------------------------------------------------

},{"frontend/common/components/loading":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/loading.js","frontend/common/components/not-found":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/not-found.js","frontend/common/components/text-input":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/common/components/text-input.js","frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","frontend/robot/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js","immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":"/Users/ivankleshnin/JavaScript/twitto/node_modules/lodash.isstring/index.js","react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":"/Users/ivankleshnin/JavaScript/twitto/node_modules/shared/robot/validators.js"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/index.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Reflux = require("reflux");
var DocumentTitle = require("react-document-title");
var RobotActions = require("frontend/robot/actions");
var RobotStore = require("frontend/robot/stores");
var RobotItem = require("frontend/robot/components/item");

// EXPORTS =========================================================================================
var Index = React.createClass({
  displayName: "Index",

  mixins: [Reflux.connect(RobotStore, "models")],

  componentDidMount: function componentDidMount() {
    RobotActions.loadMany();
  },

  render: function render() {
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
            this.state.models.toArray().map(function (model) {
              return React.createElement(RobotItem, { model: model, key: model.get("id") });
            })
          )
        )
      )
    );
  }
});

module.exports = Index;

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/

},{"frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","frontend/robot/components/item":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/item.js","frontend/robot/stores":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js","react":"react","react-document-title":"react-document-title","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/item.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var RobotActions = require("frontend/robot/actions");

// EXPORTS =========================================================================================
var Item = React.createClass({
  displayName: "Item",

  propTypes: {
    model: React.PropTypes.object },

  render: function render() {
    var model = this.props.model;
    return React.createElement(
      "div",
      { key: model.get("id"), className: "col-sm-6 col-md-3" },
      React.createElement(
        "div",
        { className: "panel panel-default", key: model.get("id") },
        React.createElement(
          "div",
          { className: "panel-heading" },
          React.createElement(
            "h4",
            { className: "panel-title" },
            React.createElement(
              Link,
              { to: "robot-detail", params: { id: model.get("id") } },
              model.get("name")
            )
          )
        ),
        React.createElement(
          "div",
          { className: "panel-body text-center nopadding" },
          React.createElement(
            Link,
            { to: "robot-detail", params: { id: model.get("id") } },
            React.createElement("img", { src: "http://robohash.org/" + model.get("id") + "?size=200x200", width: "200px", height: "200px" })
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
                { to: "robot-detail", params: { id: model.get("id") }, className: "btn btn-blue", title: "Detail" },
                React.createElement("span", { className: "fa fa-eye" })
              ),
              React.createElement(
                Link,
                { to: "robot-edit", params: { id: model.get("id") }, className: "btn btn-orange", title: "Edit" },
                React.createElement("span", { className: "fa fa-edit" })
              ),
              React.createElement(
                "a",
                { className: "btn btn-red", title: "Remove", onClick: RobotActions.remove.bind(this, model.get("id")) },
                React.createElement("span", { className: "fa fa-times" })
              )
            )
          )
        )
      )
    );
  } });

module.exports = Item;

},{"frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","react":"react","react-router":"react-router"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/components/root.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Reflux = require("reflux");
var ReactRouter = require("react-router");
var RouteHandler = ReactRouter.RouteHandler;

// EXPORTS =========================================================================================
var Root = React.createClass({
  displayName: "Root",

  componentDidMount: function componentDidMount() {},

  render: function render() {
    return React.createElement(RouteHandler, null);
  }
});

module.exports = Root;

},{"react":"react","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/stores.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================

var _require = require("immutable");

var List = _require.List;
var Map = _require.Map;
var OrderedMap = _require.OrderedMap;

var Axios = require("axios");
var Reflux = require("reflux");
var ReactRouter = require("react-router");
var RobotActions = require("frontend/robot/actions");

// EXPORTS =========================================================================================
var RobotStore = Reflux.createStore({
  // this will set up listeners to all publishers in TodoActions, using onKeyname (or keyname) as callbacks
  listenables: [RobotActions],

  getInitialState: function getInitialState() {
    return OrderedMap();
  },

  // TODO: this should be at mixin level -----------------------------------------------------------
  init: function init() {
    this.resetState();
  },

  resetState: function resetState() {
    this.setState(this.getInitialState());
  },

  setState: function setState(state) {
    if (state === undefined) {
      throw Error("`state` is required");
    } else {
      this.state = state;
      this.shareState();
    }
  },

  shareState: function shareState() {
    this.trigger(this.state);
  },
  //------------------------------------------------------------------------------------------------
  loadMany: function loadMany() {
    // TODO check local storage
    if (this.indexLoaded) {
      this.shareState();
    } else {
      this.stopListeningTo(RobotActions.loadMany);
      RobotActions.loadMany.promise(Axios.get("/api/robots/"));
    }
  },

  loadManyFailed: function loadManyFailed(res) {
    //console.echo("RobotStore.loadManyFailed", res);
    this.resetState();
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadManyCompleted: function loadManyCompleted(res) {
    //console.echo("RobotStore.loadManyCompleted", res);
    var models = List(res.data);
    this.setState(OrderedMap((function () {
      var _OrderedMap = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var model = _step.value;

          _OrderedMap.push([model.id, Map(model)]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _OrderedMap;
    })()));
    this.indexLoaded = true;
    this.listenTo(RobotActions.loadMany, this.loadMany);
  },

  loadOne: function loadOne(id) {
    // TODO check local storage?!
    this.stopListeningTo(RobotActions.loadOne);
    if (this.state.has(id)) {
      this.shareState();
    } else {
      // TODO check local storage?!
      Axios.get("/api/robots/" + id)["catch"](function (res) {
        return RobotActions.loadOne.failed(res, id);
      }).then(function (res) {
        return RobotActions.loadOne.completed(res, id);
      });
    }
  },

  loadOneFailed: function loadOneFailed(res, id) {
    //console.echo("RobotStore.loadManyFailed", res, id);
    this.setState(this.state.set(id, "Not Found"));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  loadOneCompleted: function loadOneCompleted(res, id) {
    //console.echo("RobotStore.loadOneCompleted", id);
    var model = Map(res.data);
    this.setState(this.state.set(id, model));
    this.listenTo(RobotActions.loadOne, this.loadOne);
  },

  add: function add(model) {
    RobotActions.add.promise(Axios.post("/api/robots/", model.toJS()));
  },

  addFailed: function addFailed(res) {},

  addCompleted: function addCompleted(res) {
    // TODO update local storage?!
    //console.echo("RobotStore.addCompleted", res);
    var model = Map(res.data);
    this.setState(this.state.set(model.get("id"), model));
  },

  edit: function edit(model) {
    // TODO update local storage?!
    var id = model.get("id");
    var oldModel = this.state.get(id);
    this.setState(this.state.set(id, model));
    Axios.put("/api/robots/" + id, model.toJS())["catch"](function (res) {
      return RobotActions.edit.failed(res, id, oldModel);
    }).done(function (res) {
      return RobotActions.edit.completed(res, id, oldModel);
    });
  },

  editFailed: function editFailed(res, id, oldModel) {
    //console.echo("RobotStore.editFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  editCompleted: function editCompleted(res, id, oldModel) {},

  remove: function remove(id) {
    // TODO update local storage?!
    var oldModel = this.state.get(id);
    this.setState(this.state["delete"](id));
    Axios["delete"]("/api/robots/" + id)["catch"](function (res) {
      return RobotActions.remove.failed(res, id, oldModel);
    }).done(function (res) {
      return RobotActions.remove.completed(res, id, oldModel);
    });
  },

  removeFailed: function removeFailed(res, id, oldModel) {
    //console.echo("RobotStore.removeFailed", res);
    this.setState(this.state.set(id, oldModel));
  },

  removeCompleted: function removeCompleted(res, id, oldModel) {} });

module.exports = RobotStore;

//console.echo("RobotStore.addFailed", res);

//console.echo("RobotStore.editCompleted", res);

//console.echo("RobotStore.removeCompleted", res);

},{"axios":"axios","frontend/robot/actions":"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/robot/actions.js","immutable":"immutable","react-router":"react-router","reflux":"reflux"}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/frontend/router.js":[function(require,module,exports){
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

},{}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/lodash.isstring/index.js":[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return (value && typeof value == 'object') || false;
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the `toStringTag` of values.
 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * for more details.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
}

module.exports = isString;

},{}],"/Users/ivankleshnin/JavaScript/twitto/node_modules/shared/robot/validators.js":[function(require,module,exports){
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

},{"joi":"joi"}]},{},["/Users/ivankleshnin/JavaScript/twitto/frontend/app/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9hcHAvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2FjdGlvbnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L3N0b3Jlcy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvdGV4dC1pbnB1dC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL3Jvb3QuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3Qvc3RvcmVzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNzdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3JvYm90L3ZhbGlkYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFTLFdBQVcsRUFBRSxVQUFVLEVBQUU7QUFDekQsTUFBSSxDQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFNBQ3hCLENBQUMsVUFBUyxDQUFDLEVBQUU7QUFDakIsY0FBVSxDQUFDLFlBQVc7QUFBRSxZQUFNLENBQUMsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDeEMsQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRztBQUNuQyxTQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7V0FBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDLENBQUM7Q0FDeEYsQ0FBQzs7O0FBR0YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8s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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyREEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7QUFHbEIsSUFBSSxLQUFLLFdBQUwsS0FBSyxHQUFHO0FBQ2pCLE1BQUksRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0FBQzdCLGNBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUM5QyxjQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUN0QyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbnNwZWN0ID0gcmVxdWlyZShcInV0aWwtaW5zcGVjdFwiKTtcbnJlcXVpcmUoXCJvYmplY3QuYXNzaWduXCIpLnNoaW0oKTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHRoaXNcbiAgICAudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICAuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZTsgfSwgMSk7XG4gICAgfSk7XG59O1xuXG53aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gbG9nKCkge1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IGluc3BlY3QodikpKTtcbn07XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gSW5pdCBzdG9yZXNcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcbmxldCBBbGVydFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L3N0b3Jlc1wiKTtcblxuLy8gQ29tbW9uIGNvbXBvbmVudHNcbmxldCBCb2R5ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHlcIik7XG5sZXQgSG9tZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lXCIpO1xubGV0IEFib3V0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0XCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcblxuLy8gUm9ib3QgY29tcG9uZW50c1xubGV0IFJvYm90Um9vdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL3Jvb3RcIik7XG5sZXQgUm9ib3RJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xubGV0IFJvYm90QWRkID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCIpO1xubGV0IFJvYm90RWRpdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIik7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdFwiIHBhdGg9XCIvcm9ib3RzL1wiIGhhbmRsZXI9e1JvYm90Um9vdH0+XG4gICAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJyb2JvdC1pbmRleFwiIGhhbmRsZXI9e1JvYm90SW5kZXh9Lz5cbiAgICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtYWRkXCIgcGF0aD1cImFkZFwiIGhhbmRsZXI9e1JvYm90QWRkfS8+XG4gICAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1lZGl0XCIgcGF0aD1cIjppZC9lZGl0XCIgaGFuZGxlcj17Um9ib3RFZGl0fS8+XG4gICAgPC9Sb3V0ZT5cbiAgICA8Um91dGUgbmFtZT1cImFib3V0XCIgcGF0aD1cIi9hYm91dFwiIGhhbmRsZXI9e0Fib3V0fS8+XG4gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cbndpbmRvdy5yb3V0ZXIgPSBSZWFjdFJvdXRlci5jcmVhdGUoe1xuICByb3V0ZXM6IHJvdXRlcyxcbiAgbG9jYXRpb246IEhpc3RvcnlMb2NhdGlvblxufSk7XG5cbndpbmRvdy5yb3V0ZXIucnVuKGZ1bmN0aW9uKEhhbmRsZXIsIHN0YXRlKSB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWxlcnRBY3Rpb25zID0gUmVmbHV4LmNyZWF0ZUFjdGlvbnMoe1xuICBcImxvYWRNYW55XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiYWRkXCI6IHt9LFxuICBcInJlbW92ZVwiOiB7fSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydEFjdGlvbnM7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0NTU1RyYW5zaXRpb25Hcm91cH0gPSByZXF1aXJlKFwicmVhY3QvYWRkb25zXCIpLmFkZG9ucztcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xubGV0IEFsZXJ0U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvc3RvcmVzXCIpO1xubGV0IEFsZXJ0SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoQWxlcnRTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIEFsZXJ0QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgIDxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUubW9kZWxzLnRvQXJyYXkoKS5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICA8L0NTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjbGFzc05hbWVzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVtb3ZlSXRlbSA9IEFsZXJ0QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCk7XG4gICAgbGV0IHJlc3VsdCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttb2RlbC5jbG9zYWJsZSA/IDxDbG9zZUxpbmsgb25DbGljaz17cmVtb3ZlSXRlbX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e3JlbW92ZUl0ZW19IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtSZWNvcmR9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0ID0gUmVjb3JkKHtcbiAgaWQ6IHVuZGVmaW5lZCxcbiAgbWVzc2FnZTogdW5kZWZpbmVkLFxuICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICBjbG9zYWJsZTogdHJ1ZSxcbiAgZXhwaXJlOiA1MDAwLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcbmxldCB7TGlzdCwgTWFwLCBPcmRlcmVkTWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlcj0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0U3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICBsaXN0ZW5hYmxlczogW0FsZXJ0QWN0aW9uc10sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiBPcmRlcmVkTWFwKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgYXQgbWl4aW4gbGV2ZWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlc2V0U3RhdGUoKTtcbiAgfSxcblxuICByZXNldFN0YXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIH0sXG5cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgc3RhdGVgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2hhcmVTdGF0ZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIodGhpcy5zdGF0ZSk7XG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5vcm1hbGl6ZShtZXNzYWdlLCBjYXRlZ29yeSkge1xuICAgIGlmIChpc1N0cmluZyhtb2RlbCkpIHtcbiAgICAgIG1vZGVsID0ge1xuICAgICAgICBtZXNzYWdlOiBtb2RlbCxcbiAgICAgICAgY2F0ZWdvcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLCB7aWQ6IFVVSUQudjQoKX0pO1xuICB9LFxuXG4gIGFkZChtb2RlbCkge1xuICAgIG1vZGVsID0gbW9kZWwubWVyZ2Uoe2lkOiBVVUlELnY0KCl9KTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KG1vZGVsLmlkLCBtb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZShpbmRleCkge1xuICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkIHx8IGluZGV4ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBpbmRleGAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5kZWxldGUoaW5kZXgpKTtcbiAgICB9XG4gIH0sXG5cbiAgcG9wKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5wb3AoKSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydFN0b3JlO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBYm91dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkFib3V0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGluZm9cIj5cbiAgICAgICAgICA8aDE+U2ltcGxlIFBhZ2UgRXhhbXBsZTwvaDE+XG4gICAgICAgICAgPHA+VGhpcyBwYWdlIHdhcyByZW5kZXJlZCBieSBhIEphdmFTY3JpcHQ8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWJvdXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIG5hdmJhci1kb3duXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiPlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgPEFsZXJ0SW5kZXgvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEJvZHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+UmVhY3Q8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlJlYWN0LVJvdXRlcjwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkJyb3dzZXJpZnk8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT5JbiBwcm9kdWN0aW9uIG1vZGUsIGl0IHdpbGwgc2VydmUgbWluZmllZCwgdW5pcXVlbHkgbmFtZWQgZmlsZXMgd2l0aCBzdXBlciBhZ3Jlc3NpdmUgY2FjaGUgaGVhZGVycy4gVG8gdGVzdDpcbiAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgIDxsaT5pbiBkZXZfY29uZmlnLmpzb24gc2V0IDxjb2RlPmlzRGV2PC9jb2RlPiB0byA8Y29kZT5mYWxzZTwvY29kZT48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5yZXN0YXJ0IHRoZSBzZXJ2ZXI8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT52aWV3IHNvdXJjZSBhbmQgeW91J2xsIHNlZSBtaW5pZmllZCBjc3MgYW5kIGpzIGZpbGVzIHdpdGggdW5pcXVlIG5hbWVzPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+b3BlbiB0aGUgXCJuZXR3b3JrXCIgdGFiIGluIGNocm9tZSBkZXYgdG9vbHMgKG9yIHNvbWV0aGluZyBzaW1pbGFyKS4gWW91J2xsIGFsc28gd2FudCB0byBtYWtlIHN1cmUgeW91IGhhdmVuJ3QgZGlzYWJsZWQgeW91ciBjYWNoZTwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPndpdGhvdXQgaGl0dGluZyBcInJlZnJlc2hcIiBsb2FkIHRoZSBhcHAgYWdhaW4gKHNlbGVjdGluZyBjdXJyZW50IFVSTCBpbiB1cmwgYmFyIGFuZCBoaXR0aW5nIFwiZW50ZXJcIiB3b3JrcyBncmVhdCk8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT55b3Ugc2hvdWxkIG5vdyBzZWUgdGhhdCB0aGUgSlMgYW5kIENTUyBmaWxlcyB3ZXJlIGJvdGggc2VydmVkIGZyb20gY2FjaGUgd2l0aG91dCBtYWtpbmcgYW55IHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhdCBhbGw8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkV4cHJlc3M8L2E+IGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+R3VscDwvYT4gc3RyZWFtaW5nIGJ1aWxkIHN5c3RlbTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Kb2k8L2E+IGRhdGEgdmFsaWRhdGlvbjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5GYWtlcjwvYT4gZmFrZSBkYXRhIGdlbmVyYXRpb248L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+VkNTPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5HaXQ8L2E+IHZlcnNpb24gY29udHJvbCBzeXN0ZW08L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSG9tZTtcblxuLy9zZW9UaXRsZTogXCJIb21lIFNFTyB0aXRsZVwiLFxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBMb2FkaW5nID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJsb2FkaW5nXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGluZztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTm90Rm91bmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBOb3RGb3VuZDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbW11dGFibGVMZW5zID0gcmVxdWlyZShcInBhcW1pbmQuZGF0YS1sZW5zXCIpLmltbXV0YWJsZUxlbnM7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtBbGVydCwgSW5wdXQsIEJ1dHRvbn0gPSByZXF1aXJlKFwicmVhY3QtYm9vdHN0cmFwXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmb3JtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGtleSA9IHRoaXMucHJvcHMuaWQ7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgbGV0IGxlbnMgPSBpbW11dGFibGVMZW5zKGtleSk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPElucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICByZWY9e2tleX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e2xlbnMuZ2V0KGZvcm0uc3RhdGUpfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihrZXkpfVxuICAgICAgICAgIGJzU3R5bGU9e2Zvcm0uaXNWYWxpZChrZXkpID8gdW5kZWZpbmVkIDogXCJlcnJvclwifVxuICAgICAgICAgIGhlbHA9e2Zvcm0uZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCIgY2xhc3NOYW1lPVwiaGVscC1ibG9ja1wiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAvPlxuICAgICk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgZm9ybSA9IHRoaXMucHJvcHMuZm9ybTtcbiAgICBsZXQgbGVucyA9IGltbXV0YWJsZUxlbnMoa2V5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICBmb3JtLnNldFN0YXRlKGxlbnMuc2V0KGZvcm0uc3RhdGUsIGV2ZW50LnRhcmdldC52YWx1ZSkpO1xuICAgICAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgfSxcblxuICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgLy9jb25zb2xlLmVjaG8oXCJ2YWxpZGF0ZURlYm91bmNlZCgpXCIpO1xuICAgIGZvcm0udmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZXh0SW5wdXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L21vZGVsc1wiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvYm90QWN0aW9ucyA9IFJlZmx1eC5jcmVhdGVBY3Rpb25zKHtcbiAgXCJsb2FkTWFueVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcImxvYWRPbmVcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJhZGRcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJlZGl0XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwicmVtb3ZlXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG59KTtcblxuUm9ib3RBY3Rpb25zLmFkZC5jb21wbGV0ZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICAvLyBXZSBhbHNvIGNhbiByZWRpcmVjdCB0byBgL3tyZXMuZGF0YS5pZH0vZWRpdGBcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJSb2JvdCBhZGRlZCFcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSkpO1xuICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7IC8vIG9yIHVzZSBsaW5rID0gcm91dGVyLm1ha2VQYXRoKFwicm9ib3QtaW5kZXhcIiwgcGFyYW1zLCBxdWVyeSksIGNvbmNhdCBhbmNob3IsIHRoaXMudHJhbnNpdGlvblRvKGxpbmspXG59O1xuXG5Sb2JvdEFjdGlvbnMuYWRkLmZhaWxlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiRmFpbGVkIHRvIGFkZCBSb2JvdCFcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pKTtcbn07XG5cblJvYm90QWN0aW9ucy5yZW1vdmUuY29tcGxldGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJSb2JvdCByZW1vdmVkIVwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KSk7XG4gIFJvdXRlci50cmFuc2l0aW9uVG8oXCJyb2JvdC1pbmRleFwiKTtcbn07XG5cblJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJGYWlsZWQgdG8gcmVtb3ZlIFJvYm90IVwiLCBjYXRlZ29yeTogXCJlcnJvclwifSkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUm9ib3RBY3Rpb25zO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQge01hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0aW9uTWl4aW4gPSByZXF1aXJlKFwicmVhY3QtdmFsaWRhdGlvbi1taXhpblwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgVGV4dElucHV0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3RleHQtaW5wdXRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBZGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFZhbGlkYXRpb25NaXhpbixcbiAgXSxcblxuICB2YWxpZGF0b3JUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IFZhbGlkYXRvcnMubW9kZWxcbiAgICB9O1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RBZGQudmFsaWRhdG9yRGF0YVwiLCB0aGlzLnN0YXRlKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHRoaXMuc3RhdGUubW9kZWwudG9KUygpXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBNYXAoe1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbiAgICAgIH0pLFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkFkZCBSb2JvdFwifT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+QWRkIFJvYm90PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgJm5ic3A7XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfVxuICB9LFxuXG4gIC8vIERpcnR5IGhhY2tzIHdpdGggc2V0VGltZW91dCB1bnRpbCB2YWxpZCBjYWxsYmFjayBhcmNoaXRlY3R1cmUgKG1peGluIDQuMCBicmFuY2gpIC0tLS0tLS0tLS0tLS0tXG4gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90QWRkLmhhbmRsZVN1Ym1pdFwiKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICBSb2JvdEFjdGlvbnMuYWRkKHRoaXMuc3RhdGUubW9kZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9LFxuXG4gIC8vaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgLy8gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIC8vICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICAvLyAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgLy8gICAgYWxlcnQoXCJ4eHhcIilcbiAgLy8gIH0sIDIwMCk7XG4gIC8vfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBZGQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IGlzU3RyaW5nID0gcmVxdWlyZShcImxvZGFzaC5pc3N0cmluZ1wiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IERldGFpbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbXG4gICAgUmVhY3RSb3V0ZXIuU3RhdGUsXG4gICAgUmVmbHV4LmNvbm5lY3RGaWx0ZXIoUm9ib3RTdG9yZSwgXCJtb2RlbFwiLCBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIGxldCBpZCA9IHRoaXMuZ2V0UGFyYW1zKCkuaWQ7XG4gICAgICByZXR1cm4gbW9kZWxzLmdldChpZCk7XG4gICAgfSlcbiAgXSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBSb2JvdEFjdGlvbnMubG9hZE9uZSh0aGlzLmdldFBhcmFtcygpLmlkKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwuZ2V0KFwibmFtZVwiKX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e1JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5nZXQoXCJpZFwiKSl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuZ2V0KFwiaWRcIikgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwuZ2V0KFwibmFtZVwiKX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+PGRkPnttb2RlbC5nZXQoXCJpZFwiKX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+QXNzZW1ibHkgRGF0ZTwvZHQ+PGRkPnttb2RlbC5nZXQoXCJhc3NlbWJseURhdGVcIil9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+PGRkPnttb2RlbC5nZXQoXCJtYW51ZmFjdHVyZXJcIil9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRGV0YWlsO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQge01hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0aW9uTWl4aW4gPSByZXF1aXJlKFwicmVhY3QtdmFsaWRhdGlvbi1taXhpblwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgVGV4dElucHV0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3RleHQtaW5wdXRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBFZGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtcbiAgICBSZWFjdFJvdXRlci5TdGF0ZSxcbiAgICBWYWxpZGF0aW9uTWl4aW4sXG4gICAgUmVmbHV4LmNvbm5lY3RGaWx0ZXIoUm9ib3RTdG9yZSwgXCJtb2RlbFwiLCBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIGxldCBpZCA9IHRoaXMuZ2V0UGFyYW1zKCkuaWQ7XG4gICAgICByZXR1cm4gbW9kZWxzLmdldChpZCk7XG4gICAgfSlcbiAgXSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBSb2JvdEFjdGlvbnMubG9hZE9uZSh0aGlzLmdldFBhcmFtcygpLmlkKTtcbiAgfSxcblxuICB2YWxpZGF0b3JUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IFZhbGlkYXRvcnMubW9kZWxcbiAgICB9O1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RFZGl0LnZhbGlkYXRvckRhdGFcIiwgdGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB0aGlzLnN0YXRlLm1vZGVsLnRvSlMoKVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogdW5kZWZpbmVkXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRWRpdCBcIiArIG1vZGVsLmdldChcIm5hbWVcIil9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leWVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17Um9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmdldChcImlkXCIpKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5nZXQoXCJpZFwiKSArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5nZXQoXCJuYW1lXCIpfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICZuYnNwO1xuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH1cbiAgfSxcblxuICAvLyBEaXJ0eSBoYWNrcyB3aXRoIHNldFRpbWVvdXQgdW50aWwgdmFsaWQgY2FsbGJhY2sgYXJjaGl0ZWN0dXJlIChtaXhpbiA0LjAgYnJhbmNoKSAtLS0tLS0tLS0tLS0tLVxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEVkaXQuaGFuZGxlU3VibWl0XCIpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIFJvYm90QWN0aW9ucy5lZGl0KHRoaXMuc3RhdGUubW9kZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9LFxuXG4gIC8vaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgLy8gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIC8vICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICAvLyAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgLy8gICAgYWxlcnQoXCJ4eHhcIilcbiAgLy8gIH0sIDIwMCk7XG4gIC8vfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGlua30gPSBSZWFjdFJvdXRlcjtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5sZXQgUm9ib3RJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWZsdXguY29ubmVjdChSb2JvdFN0b3JlLCBcIm1vZGVsc1wiKV0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRNYW55KCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtYWRkXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tZ3JlZW5cIiB0aXRsZT1cIkFkZFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8aDE+Um9ib3RzPC9oMT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLm1vZGVscy50b0FycmF5KCkubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmdldChcImlkXCIpfS8+KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4O1xuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e21vZGVsLmdldChcImlkXCIpfSBjbGFzc05hbWU9XCJjb2wtc20tNiBjb2wtbWQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBrZXk9e21vZGVsLmdldChcImlkXCIpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPjxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0+e21vZGVsLmdldChcIm5hbWVcIil9PC9MaW5rPjwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHRleHQtY2VudGVyIG5vcGFkZGluZ1wiPlxuICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fT5cbiAgICAgICAgICAgICAgPGltZyBzcmM9eydodHRwOi8vcm9ib2hhc2gub3JnLycgKyBtb2RlbC5nZXQoXCJpZFwiKSArICc/c2l6ZT0yMDB4MjAwJ30gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e1JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5nZXQoXCJpZFwiKSl9PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7Um91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUm9vdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUm9vdDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB7TGlzdCwgTWFwLCBPcmRlcmVkTWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlcj0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvYm90U3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICAvLyB0aGlzIHdpbGwgc2V0IHVwIGxpc3RlbmVycyB0byBhbGwgcHVibGlzaGVycyBpbiBUb2RvQWN0aW9ucywgdXNpbmcgb25LZXluYW1lIChvciBrZXluYW1lKSBhcyBjYWxsYmFja3NcbiAgbGlzdGVuYWJsZXM6IFtSb2JvdEFjdGlvbnNdLFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gT3JkZXJlZE1hcCgpO1xuICB9LFxuXG4gIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGF0IG1peGluIGxldmVsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGluaXQoKSB7XG4gICAgdGhpcy5yZXNldFN0YXRlKCk7XG4gIH0sXG5cbiAgcmVzZXRTdGF0ZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICB9LFxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiYHN0YXRlYCBpcyByZXF1aXJlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgdGhpcy5zaGFyZVN0YXRlKCk7XG4gICAgfVxuICB9LFxuXG4gIHNoYXJlU3RhdGUoKSB7XG4gICAgdGhpcy50cmlnZ2VyKHRoaXMuc3RhdGUpO1xuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBsb2FkTWFueSgpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5pbmRleExvYWRlZCkge1xuICAgICAgdGhpcy5zaGFyZVN0YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RvcExpc3RlbmluZ1RvKFJvYm90QWN0aW9ucy5sb2FkTWFueSk7XG4gICAgICBSb2JvdEFjdGlvbnMubG9hZE1hbnkucHJvbWlzZShBeGlvcy5nZXQoJy9hcGkvcm9ib3RzLycpKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZE1hbnlGYWlsZWQocmVzKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55RmFpbGVkXCIsIHJlcyk7XG4gICAgdGhpcy5yZXNldFN0YXRlKCk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE1hbnksIHRoaXMubG9hZE1hbnkpO1xuICB9LFxuXG4gIGxvYWRNYW55Q29tcGxldGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUNvbXBsZXRlZFwiLCByZXMpO1xuICAgIGxldCBtb2RlbHMgPSBMaXN0KHJlcy5kYXRhKTtcbiAgICB0aGlzLnNldFN0YXRlKE9yZGVyZWRNYXAoW2ZvciAobW9kZWwgb2YgbW9kZWxzKSBbbW9kZWwuaWQsIE1hcChtb2RlbCldXSkpO1xuICAgIHRoaXMuaW5kZXhMb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55LCB0aGlzLmxvYWRNYW55KTtcbiAgfSxcblxuICBsb2FkT25lKGlkKSB7XG4gICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlPyFcbiAgICB0aGlzLnN0b3BMaXN0ZW5pbmdUbyhSb2JvdEFjdGlvbnMubG9hZE9uZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzKGlkKSkge1xuICAgICAgdGhpcy5zaGFyZVN0YXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZT8hXG4gICAgICBBeGlvcy5nZXQoYC9hcGkvcm9ib3RzLyR7aWR9YClcbiAgICAgICAgLmNhdGNoKHJlcyA9PiBSb2JvdEFjdGlvbnMubG9hZE9uZS5mYWlsZWQocmVzLCBpZCkpXG4gICAgICAgIC50aGVuKHJlcyA9PiBSb2JvdEFjdGlvbnMubG9hZE9uZS5jb21wbGV0ZWQocmVzLCBpZCkpO1xuICAgIH1cbiAgfSxcblxuICBsb2FkT25lRmFpbGVkKHJlcywgaWQpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlGYWlsZWRcIiwgcmVzLCBpZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChpZCwgXCJOb3QgRm91bmRcIikpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUsIHRoaXMubG9hZE9uZSk7XG4gIH0sXG5cbiAgbG9hZE9uZUNvbXBsZXRlZChyZXMsIGlkKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRPbmVDb21wbGV0ZWRcIiwgaWQpO1xuICAgIGxldCBtb2RlbCA9IE1hcChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChpZCwgbW9kZWwpKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkT25lLCB0aGlzLmxvYWRPbmUpO1xuICB9LFxuXG4gIGFkZChtb2RlbCkge1xuICAgIFJvYm90QWN0aW9ucy5hZGQucHJvbWlzZShBeGlvcy5wb3N0KGAvYXBpL3JvYm90cy9gLCBtb2RlbC50b0pTKCkpKTtcbiAgfSxcblxuICBhZGRGYWlsZWQocmVzKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmFkZEZhaWxlZFwiLCByZXMpO1xuICB9LFxuXG4gIGFkZENvbXBsZXRlZChyZXMpIHtcbiAgICAvLyBUT0RPIHVwZGF0ZSBsb2NhbCBzdG9yYWdlPyFcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuYWRkQ29tcGxldGVkXCIsIHJlcyk7XG4gICAgbGV0IG1vZGVsID0gTWFwKHJlcy5kYXRhKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KG1vZGVsLmdldChcImlkXCIpLCBtb2RlbCkpO1xuICB9LFxuXG4gIGVkaXQobW9kZWwpIHtcbiAgICAvLyBUT0RPIHVwZGF0ZSBsb2NhbCBzdG9yYWdlPyFcbiAgICBsZXQgaWQgPSBtb2RlbC5nZXQoXCJpZFwiKTtcbiAgICBsZXQgb2xkTW9kZWwgPSB0aGlzLnN0YXRlLmdldChpZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChpZCwgbW9kZWwpKTtcbiAgICBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbW9kZWwudG9KUygpKVxuICAgICAgLmNhdGNoKHJlcyA9PiBSb2JvdEFjdGlvbnMuZWRpdC5mYWlsZWQocmVzLCBpZCwgb2xkTW9kZWwpKVxuICAgICAgLmRvbmUocmVzID0+IFJvYm90QWN0aW9ucy5lZGl0LmNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIGVkaXRGYWlsZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuZWRpdEZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG9sZE1vZGVsKSk7XG4gIH0sXG5cbiAgZWRpdENvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5lZGl0Q29tcGxldGVkXCIsIHJlcyk7XG4gIH0sXG5cbiAgcmVtb3ZlKGlkKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgbGV0IG9sZE1vZGVsID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5kZWxldGUoaWQpKTtcbiAgICBBeGlvcy5kZWxldGUoYC9hcGkvcm9ib3RzLyR7aWR9YClcbiAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLnJlbW92ZS5mYWlsZWQocmVzLCBpZCwgb2xkTW9kZWwpKVxuICAgICAgLmRvbmUocmVzID0+IFJvYm90QWN0aW9ucy5yZW1vdmUuY29tcGxldGVkKHJlcywgaWQsIG9sZE1vZGVsKSk7XG4gIH0sXG5cbiAgcmVtb3ZlRmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLnJlbW92ZUZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG9sZE1vZGVsKSk7XG4gIH0sXG5cbiAgcmVtb3ZlQ29tcGxldGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLnJlbW92ZUNvbXBsZXRlZFwiLCByZXMpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvYm90U3RvcmU7XG4iLCIvLyBQUk9YWSBST1VURVIgVE8gU09MVkUgQ0lSQ1VMQVIgREVQRU5ERU5DWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcHJveHkgPSB7XG4gIG1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5yb3V0ZXIubWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIG1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5yb3V0ZXIubWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHdpbmRvdy5yb3V0ZXIudHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICByZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHdpbmRvdy5yb3V0ZXIucmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIGdvQmFjaygpIHtcbiAgICB3aW5kb3cucm91dGVyLmdvQmFjaygpO1xuICB9LFxuXG4gIHJ1bihyZW5kZXIpIHtcbiAgICB3aW5kb3cucm91dGVyLnJ1bihyZW5kZXIpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcm94eTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHx8IGZhbHNlO1xufVxuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgdmFsdWVzLlxuICogU2VlIHRoZSBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3RyaW5nVGFnKSB8fCBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBKb2kgPSByZXF1aXJlKFwiam9pXCIpO1xuXG4vLyBSVUxFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgdmFyIG1vZGVsID0ge1xuICBuYW1lOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgYXNzZW1ibHlEYXRlOiBKb2kuZGF0ZSgpLm1heChcIm5vd1wiKS5yZXF1aXJlZCgpLFxuICBtYW51ZmFjdHVyZXI6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxufTtcbiJdfQ==
