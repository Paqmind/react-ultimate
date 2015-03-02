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
              { href: "https://github.com/spoike/refluxjs" },
              "Reflux"
            ),
            " dataflow over React"
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
              { href: "https://github.com/jurassix/react-validation-mixin" },
              "React-Validation-Mixin"
            ),
            " HTML form lifecycles"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9hcHAvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2FjdGlvbnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L3N0b3Jlcy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvdGV4dC1pbnB1dC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL3Jvb3QuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3Qvc3RvcmVzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNzdHJpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3JvYm90L3ZhbGlkYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVoQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFTLFdBQVcsRUFBRSxVQUFVLEVBQUU7QUFDekQsTUFBSSxDQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLFNBQ3hCLENBQUMsVUFBUyxDQUFDLEVBQUU7QUFDakIsY0FBVSxDQUFDLFlBQVc7QUFBRSxZQUFNLENBQUMsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDeEMsQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRztBQUNuQyxTQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7V0FBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDLENBQUM7Q0FDeEYsQ0FBQzs7O0FBR0YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8s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LENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUM5QyxjQUFZLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUN0QyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbnNwZWN0ID0gcmVxdWlyZShcInV0aWwtaW5zcGVjdFwiKTtcbnJlcXVpcmUoXCJvYmplY3QuYXNzaWduXCIpLnNoaW0oKTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHRoaXNcbiAgICAudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICAuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZTsgfSwgMSk7XG4gICAgfSk7XG59O1xuXG53aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gbG9nKCkge1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IGluc3BlY3QodikpKTtcbn07XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gSW5pdCBzdG9yZXNcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcbmxldCBBbGVydFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L3N0b3Jlc1wiKTtcblxuLy8gQ29tbW9uIGNvbXBvbmVudHNcbmxldCBCb2R5ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHlcIik7XG5sZXQgSG9tZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lXCIpO1xubGV0IEFib3V0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0XCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcblxuLy8gUm9ib3QgY29tcG9uZW50c1xubGV0IFJvYm90Um9vdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL3Jvb3RcIik7XG5sZXQgUm9ib3RJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xubGV0IFJvYm90QWRkID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCIpO1xubGV0IFJvYm90RWRpdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIik7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdFwiIHBhdGg9XCIvcm9ib3RzL1wiIGhhbmRsZXI9e1JvYm90Um9vdH0+XG4gICAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJyb2JvdC1pbmRleFwiIGhhbmRsZXI9e1JvYm90SW5kZXh9Lz5cbiAgICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtYWRkXCIgcGF0aD1cImFkZFwiIGhhbmRsZXI9e1JvYm90QWRkfS8+XG4gICAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1lZGl0XCIgcGF0aD1cIjppZC9lZGl0XCIgaGFuZGxlcj17Um9ib3RFZGl0fS8+XG4gICAgPC9Sb3V0ZT5cbiAgICA8Um91dGUgbmFtZT1cImFib3V0XCIgcGF0aD1cIi9hYm91dFwiIGhhbmRsZXI9e0Fib3V0fS8+XG4gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cbndpbmRvdy5yb3V0ZXIgPSBSZWFjdFJvdXRlci5jcmVhdGUoe1xuICByb3V0ZXM6IHJvdXRlcyxcbiAgbG9jYXRpb246IEhpc3RvcnlMb2NhdGlvblxufSk7XG5cbndpbmRvdy5yb3V0ZXIucnVuKGZ1bmN0aW9uKEhhbmRsZXIsIHN0YXRlKSB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWxlcnRBY3Rpb25zID0gUmVmbHV4LmNyZWF0ZUFjdGlvbnMoe1xuICBcImxvYWRNYW55XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiYWRkXCI6IHt9LFxuICBcInJlbW92ZVwiOiB7fSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydEFjdGlvbnM7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0NTU1RyYW5zaXRpb25Hcm91cH0gPSByZXF1aXJlKFwicmVhY3QvYWRkb25zXCIpLmFkZG9ucztcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xubGV0IEFsZXJ0U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvc3RvcmVzXCIpO1xubGV0IEFsZXJ0SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoQWxlcnRTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIEFsZXJ0QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgIDxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUubW9kZWxzLnRvQXJyYXkoKS5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICA8L0NTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjbGFzc05hbWVzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVtb3ZlSXRlbSA9IEFsZXJ0QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCk7XG4gICAgbGV0IHJlc3VsdCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttb2RlbC5jbG9zYWJsZSA/IDxDbG9zZUxpbmsgb25DbGljaz17cmVtb3ZlSXRlbX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e3JlbW92ZUl0ZW19IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtSZWNvcmR9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0ID0gUmVjb3JkKHtcbiAgaWQ6IHVuZGVmaW5lZCxcbiAgbWVzc2FnZTogdW5kZWZpbmVkLFxuICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICBjbG9zYWJsZTogdHJ1ZSxcbiAgZXhwaXJlOiA1MDAwLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcbmxldCB7TGlzdCwgTWFwLCBPcmRlcmVkTWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlcj0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0U3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICBsaXN0ZW5hYmxlczogW0FsZXJ0QWN0aW9uc10sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiBPcmRlcmVkTWFwKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgYXQgbWl4aW4gbGV2ZWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlc2V0U3RhdGUoKTtcbiAgfSxcblxuICByZXNldFN0YXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIH0sXG5cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgc3RhdGVgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2hhcmVTdGF0ZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIodGhpcy5zdGF0ZSk7XG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5vcm1hbGl6ZShtZXNzYWdlLCBjYXRlZ29yeSkge1xuICAgIGlmIChpc1N0cmluZyhtb2RlbCkpIHtcbiAgICAgIG1vZGVsID0ge1xuICAgICAgICBtZXNzYWdlOiBtb2RlbCxcbiAgICAgICAgY2F0ZWdvcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLCB7aWQ6IFVVSUQudjQoKX0pO1xuICB9LFxuXG4gIGFkZChtb2RlbCkge1xuICAgIG1vZGVsID0gbW9kZWwubWVyZ2Uoe2lkOiBVVUlELnY0KCl9KTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KG1vZGVsLmlkLCBtb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZShpbmRleCkge1xuICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkIHx8IGluZGV4ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBpbmRleGAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5kZWxldGUoaW5kZXgpKTtcbiAgICB9XG4gIH0sXG5cbiAgcG9wKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5wb3AoKSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydFN0b3JlO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBYm91dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkFib3V0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGluZm9cIj5cbiAgICAgICAgICA8aDE+U2ltcGxlIFBhZ2UgRXhhbXBsZTwvaDE+XG4gICAgICAgICAgPHA+VGhpcyBwYWdlIHdhcyByZW5kZXJlZCBieSBhIEphdmFTY3JpcHQ8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWJvdXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIG5hdmJhci1kb3duXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiPlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgPEFsZXJ0SW5kZXgvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEJvZHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zcG9pa2UvcmVmbHV4anNcIj5SZWZsdXg8L2E+IGRhdGFmbG93IG92ZXIgUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmFja3QvcmVhY3Qtcm91dGVyXCI+UmVhY3QtUm91dGVyPC9hPiBkZWNsYXJhdGl2ZSByb3V0ZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZ2FlYXJvbi9yZWFjdC1kb2N1bWVudC10aXRsZVwiPlJlYWN0LURvY3VtZW50LVRpdGxlPC9hPiBkZWNsYXJhdGl2ZSBkb2N1bWVudCB0aXRsZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9cIj5SZWFjdC1Cb290c3RyYXA8L2E+IEJvb3RzdHJhcCBjb21wb25lbnRzIGluIFJlYWN0PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2p1cmFzc2l4L3JlYWN0LXZhbGlkYXRpb24tbWl4aW5cIj5SZWFjdC1WYWxpZGF0aW9uLU1peGluPC9hPiBIVE1MIGZvcm0gbGlmZWN5Y2xlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9icm93c2VyaWZ5Lm9yZy9cIj5Ccm93c2VyaWZ5PC9hPiAmYW1wOyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL3dhdGNoaWZ5XCI+V2F0Y2hpZnk8L2E+IGJ1bmRsZSBOUE0gbW9kdWxlcyB0byBmcm9udGVuZDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ib3dlci5pby9cIj5Cb3dlcjwvYT4gZnJvbnRlbmQgcGFja2FnZSBtYW5hZ2VyPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2V4cHJlc3Nqcy5jb20vXCI+RXhwcmVzczwvYT4gd2ViLWFwcCBiYWNrZW5kIGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb3ppbGxhLmdpdGh1Yi5pby9udW5qdWNrcy9cIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2VsZWl0aC9lbWFpbGpzXCI+RW1haWxKUzwvYT4gU01UUCBjbGllbnQ8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gSlMgdHJhbnNwaWxlcjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ndWxwanMuY29tL1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2xvZGFzaC5jb20vXCI+TG9kYXNoPC9hPiB1dGlsaXR5IGxpYnJhcnk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vc29ja2V0LmlvL1wiPlNvY2tldElPPC9hPiByZWFsLXRpbWUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcIj5BeGlvczwvYT4gcHJvbWlzZS1iYXNlZCBIVFRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9pbW11dGFibGUtanNcIj5JbW11dGFibGU8L2E+IHBlcnNpc3RlbnQgaW1tdXRhYmxlIGRhdGEgZm9yIEpTPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2hhcGlqcy9qb2lcIj5Kb2k8L2E+IG9iamVjdCBzY2hlbWEgdmFsaWRhdGlvbjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhvbWU7XG5cbi8qXG4qIFRPRE9cbipcbiogYmFiZWxpZnk/XG4qIGNoYWk/XG4qIGNsYXNzbmFtZXM/XG4qIGNvbmZpZz9cbiogY2xpZW50Y29uZmlnP1xuKiBoZWxtZXQ/XG4qIGh1c2t5dlxuKiBtb2NoYT9cbiogbW9yZ2FuP1xuKiB3aW5zdG9uP1xuKiB5YXJncz9cbiogKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTG9hZGluZyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBzaXplQ2xhc3MgPSB0aGlzLnByb3BzLnNpemUgPyAnIGxvYWRpbmctJyArIHRoaXMucHJvcHMuc2l6ZSA6ICcnO1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkxvYWRpbmcuLi5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e1wibG9hZGluZ1wiICsgc2l6ZUNsYXNzfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3BpblwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRpbmc7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE5vdEZvdW5kID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTm90IEZvdW5kXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlXCI+XG4gICAgICAgICAgPGgxPlBhZ2Ugbm90IEZvdW5kPC9oMT5cbiAgICAgICAgICA8cD5Tb21ldGhpbmcgaXMgd3Jvbmc8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTm90Rm91bmQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaW1tdXRhYmxlTGVucyA9IHJlcXVpcmUoXCJwYXFtaW5kLmRhdGEtbGVuc1wiKS5pbW11dGFibGVMZW5zO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZm9ybTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBrZXkgPSB0aGlzLnByb3BzLmlkO1xuICAgIGxldCBmb3JtID0gdGhpcy5wcm9wcy5mb3JtO1xuICAgIGxldCBsZW5zID0gaW1tdXRhYmxlTGVucyhrZXkpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxJbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgcmVmPXtrZXl9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXtsZW5zLmdldChmb3JtLnN0YXRlKX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3Ioa2V5KX1cbiAgICAgICAgICBic1N0eWxlPXtmb3JtLmlzVmFsaWQoa2V5KSA/IHVuZGVmaW5lZCA6IFwiZXJyb3JcIn1cbiAgICAgICAgICBoZWxwPXtmb3JtLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiIGNsYXNzTmFtZT1cImhlbHAtYmxvY2tcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgLz5cbiAgICApO1xuICB9LFxuXG4gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24oa2V5KSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgbGV0IGxlbnMgPSBpbW11dGFibGVMZW5zKGtleSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZm9ybS5zZXRTdGF0ZShsZW5zLnNldChmb3JtLnN0YXRlLCBldmVudC50YXJnZXQudmFsdWUpKTtcbiAgICAgIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbiAgICB9LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIGxldCBmb3JtID0gdGhpcy5wcm9wcy5mb3JtO1xuICAgIC8vY29uc29sZS5lY2hvKFwidmFsaWRhdGVEZWJvdW5jZWQoKVwiKTtcbiAgICBmb3JtLnZhbGlkYXRlKGtleSk7XG4gIH0sIDUwMCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGV4dElucHV0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5sZXQgQWxlcnRBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb2JvdEFjdGlvbnMgPSBSZWZsdXguY3JlYXRlQWN0aW9ucyh7XG4gIFwibG9hZE1hbnlcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJsb2FkT25lXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiYWRkXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiZWRpdFwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcInJlbW92ZVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxufSk7XG5cblJvYm90QWN0aW9ucy5hZGQuY29tcGxldGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgLy8gV2UgYWxzbyBjYW4gcmVkaXJlY3QgdG8gYC97cmVzLmRhdGEuaWR9L2VkaXRgXG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiUm9ib3QgYWRkZWQhXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pKTtcbiAgUm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpOyAvLyBvciB1c2UgbGluayA9IHJvdXRlci5tYWtlUGF0aChcInJvYm90LWluZGV4XCIsIHBhcmFtcywgcXVlcnkpLCBjb25jYXQgYW5jaG9yLCB0aGlzLnRyYW5zaXRpb25UbyhsaW5rKVxufTtcblxuUm9ib3RBY3Rpb25zLmFkZC5mYWlsZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICBBbGVydEFjdGlvbnMuYWRkKEFsZXJ0KHttZXNzYWdlOiBcIkZhaWxlZCB0byBhZGQgUm9ib3QhXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KSk7XG59O1xuXG5Sb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiUm9ib3QgcmVtb3ZlZCFcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSkpO1xuICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG59O1xuXG5Sb2JvdEFjdGlvbnMucmVtb3ZlLmZhaWxlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiRmFpbGVkIHRvIHJlbW92ZSBSb2JvdCFcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJvYm90QWN0aW9ucztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQgaXNTdHJpbmcgPSByZXF1aXJlKFwibG9kYXNoLmlzc3RyaW5nXCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge0FsZXJ0LCBJbnB1dCwgQnV0dG9ufSA9IHJlcXVpcmUoXCJyZWFjdC1ib290c3RyYXBcIik7XG5sZXQgVmFsaWRhdGlvbk1peGluID0gcmVxdWlyZShcInJlYWN0LXZhbGlkYXRpb24tbWl4aW5cIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xubGV0IFRleHRJbnB1dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0XCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWRkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtcbiAgICBWYWxpZGF0aW9uTWl4aW4sXG4gIF0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBWYWxpZGF0b3JzLm1vZGVsXG4gICAgfTtcbiAgfSxcblxuICB2YWxpZGF0b3JEYXRhKCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90QWRkLnZhbGlkYXRvckRhdGFcIiwgdGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB0aGlzLnN0YXRlLm1vZGVsLnRvSlMoKVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogTWFwKHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBhc3NlbWJseURhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFudWZhY3R1cmVyOiB1bmRlZmluZWQsXG4gICAgICB9KSxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPkFkZCBSb2JvdDwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICZuYnNwO1xuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH1cbiAgfSxcblxuICAvLyBEaXJ0eSBoYWNrcyB3aXRoIHNldFRpbWVvdXQgdW50aWwgdmFsaWQgY2FsbGJhY2sgYXJjaGl0ZWN0dXJlIChtaXhpbiA0LjAgYnJhbmNoKSAtLS0tLS0tLS0tLS0tLVxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEFkZC5oYW5kbGVTdWJtaXRcIik7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgUm9ib3RBY3Rpb25zLmFkZCh0aGlzLnN0YXRlLm1vZGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfSxcblxuICAvL2hhbmRsZVJlc2V0KGV2ZW50KSB7XG4gIC8vICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvLyAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gIC8vICAgIGFsZXJ0KFwieHh4XCIpXG4gIC8vICB9LCAyMDApO1xuICAvL30sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWRkO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBEZXRhaWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFJlYWN0Um91dGVyLlN0YXRlLFxuICAgIFJlZmx1eC5jb25uZWN0RmlsdGVyKFJvYm90U3RvcmUsIFwibW9kZWxcIiwgZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICBsZXQgaWQgPSB0aGlzLmdldFBhcmFtcygpLmlkO1xuICAgICAgcmV0dXJuIG1vZGVscy5nZXQoaWQpO1xuICAgIH0pXG4gIF0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRPbmUodGhpcy5nZXRQYXJhbXMoKS5pZCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLmdldChcIm5hbWVcIil9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmdldChcImlkXCIpICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLmdldChcIm5hbWVcIil9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PjxkZD57bW9kZWwuZ2V0KFwiaWRcIil9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PjxkZD57bW9kZWwuZ2V0KFwiYXNzZW1ibHlEYXRlXCIpfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5NYW51ZmFjdHVyZXI8L2R0PjxkZD57bW9kZWwuZ2V0KFwibWFudWZhY3R1cmVyXCIpfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfVxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IERldGFpbDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQgaXNTdHJpbmcgPSByZXF1aXJlKFwibG9kYXNoLmlzc3RyaW5nXCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge0FsZXJ0LCBJbnB1dCwgQnV0dG9ufSA9IHJlcXVpcmUoXCJyZWFjdC1ib290c3RyYXBcIik7XG5sZXQgVmFsaWRhdGlvbk1peGluID0gcmVxdWlyZShcInJlYWN0LXZhbGlkYXRpb24tbWl4aW5cIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xubGV0IFRleHRJbnB1dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0XCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRWRpdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbXG4gICAgUmVhY3RSb3V0ZXIuU3RhdGUsXG4gICAgVmFsaWRhdGlvbk1peGluLFxuICAgIFJlZmx1eC5jb25uZWN0RmlsdGVyKFJvYm90U3RvcmUsIFwibW9kZWxcIiwgZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICBsZXQgaWQgPSB0aGlzLmdldFBhcmFtcygpLmlkO1xuICAgICAgcmV0dXJuIG1vZGVscy5nZXQoaWQpO1xuICAgIH0pXG4gIF0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRPbmUodGhpcy5nZXRQYXJhbXMoKS5pZCk7XG4gIH0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBWYWxpZGF0b3JzLm1vZGVsXG4gICAgfTtcbiAgfSxcblxuICB2YWxpZGF0b3JEYXRhKCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90RWRpdC52YWxpZGF0b3JEYXRhXCIsIHRoaXMuc3RhdGUpO1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogdGhpcy5zdGF0ZS5tb2RlbC50b0pTKClcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHVuZGVmaW5lZFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5nZXQoXCJuYW1lXCIpfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e1JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5nZXQoXCJpZFwiKSl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuZ2V0KFwiaWRcIikgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwuZ2V0KFwibmFtZVwiKX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGlydHkgaGFja3Mgd2l0aCBzZXRUaW1lb3V0IHVudGlsIHZhbGlkIGNhbGxiYWNrIGFyY2hpdGVjdHVyZSAobWl4aW4gNC4wIGJyYW5jaCkgLS0tLS0tLS0tLS0tLS1cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RFZGl0LmhhbmRsZVN1Ym1pdFwiKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICBSb2JvdEFjdGlvbnMuZWRpdCh0aGlzLnN0YXRlLm1vZGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfSxcblxuICAvL2hhbmRsZVJlc2V0KGV2ZW50KSB7XG4gIC8vICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvLyAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gIC8vICAgIGFsZXJ0KFwieHh4XCIpXG4gIC8vICB9LCAyMDApO1xuICAvL30sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xubGV0IFJvYm90SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoUm9ib3RTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIFJvYm90QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSb2JvdHNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5tb2RlbHMudG9BcnJheSgpLm1hcChtb2RlbCA9PiA8Um9ib3RJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0vPil9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcblxuLypcbjxkaXYgY2xhc3NOYW1lPVwiYnV0dG9ucyBidG4tZ3JvdXBcIj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZXNldFwiPlJlc2V0IENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZW1vdmVcIj5SZW1vdmUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInNodWZmbGVcIj5TaHVmZmxlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJmZXRjaFwiPlJlZmV0Y2ggQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImFkZFwiPkFkZCBSYW5kb208L2J1dHRvbj5cbjwvZGl2PlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19Pnttb2RlbC5nZXQoXCJuYW1lXCIpfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuZ2V0KFwiaWRcIikgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvb3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvb3Q7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQge0xpc3QsIE1hcCwgT3JkZXJlZE1hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXI9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb2JvdFN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgLy8gdGhpcyB3aWxsIHNldCB1cCBsaXN0ZW5lcnMgdG8gYWxsIHB1Ymxpc2hlcnMgaW4gVG9kb0FjdGlvbnMsIHVzaW5nIG9uS2V5bmFtZSAob3Iga2V5bmFtZSkgYXMgY2FsbGJhY2tzXG4gIGxpc3RlbmFibGVzOiBbUm9ib3RBY3Rpb25zXSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoKTtcbiAgfSxcblxuICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhdCBtaXhpbiBsZXZlbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBpbml0KCkge1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICB9LFxuXG4gIHJlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgfSxcblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBzdGF0ZWAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH1cbiAgfSxcblxuICBzaGFyZVN0YXRlKCkge1xuICAgIHRoaXMudHJpZ2dlcih0aGlzLnN0YXRlKTtcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9hZE1hbnkoKSB7XG4gICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuaW5kZXhMb2FkZWQpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmdUbyhSb2JvdEFjdGlvbnMubG9hZE1hbnkpO1xuICAgICAgUm9ib3RBY3Rpb25zLmxvYWRNYW55LnByb21pc2UoQXhpb3MuZ2V0KCcvYXBpL3JvYm90cy8nKSk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRNYW55RmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55LCB0aGlzLmxvYWRNYW55KTtcbiAgfSxcblxuICBsb2FkTWFueUNvbXBsZXRlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlDb21wbGV0ZWRcIiwgcmVzKTtcbiAgICBsZXQgbW9kZWxzID0gTGlzdChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZShPcmRlcmVkTWFwKFtmb3IgKG1vZGVsIG9mIG1vZGVscykgW21vZGVsLmlkLCBNYXAobW9kZWwpXV0pKTtcbiAgICB0aGlzLmluZGV4TG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkTWFueSwgdGhpcy5sb2FkTWFueSk7XG4gIH0sXG5cbiAgbG9hZE9uZShpZCkge1xuICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZT8hXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUpO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2U/IVxuICAgICAgQXhpb3MuZ2V0KGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuZmFpbGVkKHJlcywgaWQpKVxuICAgICAgICAudGhlbihyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuY29tcGxldGVkKHJlcywgaWQpKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZE9uZUZhaWxlZChyZXMsIGlkKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55RmFpbGVkXCIsIHJlcywgaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIFwiTm90IEZvdW5kXCIpKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkT25lLCB0aGlzLmxvYWRPbmUpO1xuICB9LFxuXG4gIGxvYWRPbmVDb21wbGV0ZWQocmVzLCBpZCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkT25lQ29tcGxldGVkXCIsIGlkKTtcbiAgICBsZXQgbW9kZWwgPSBNYXAocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE9uZSwgdGhpcy5sb2FkT25lKTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBSb2JvdEFjdGlvbnMuYWRkLnByb21pc2UoQXhpb3MucG9zdChgL2FwaS9yb2JvdHMvYCwgbW9kZWwudG9KUygpKSk7XG4gIH0sXG5cbiAgYWRkRmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5hZGRGYWlsZWRcIiwgcmVzKTtcbiAgfSxcblxuICBhZGRDb21wbGV0ZWQocmVzKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmFkZENvbXBsZXRlZFwiLCByZXMpO1xuICAgIGxldCBtb2RlbCA9IE1hcChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5nZXQoXCJpZFwiKSwgbW9kZWwpKTtcbiAgfSxcblxuICBlZGl0KG1vZGVsKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgbGV0IGlkID0gbW9kZWwuZ2V0KFwiaWRcIik7XG4gICAgbGV0IG9sZE1vZGVsID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG1vZGVsLnRvSlMoKSlcbiAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmVkaXQuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMuZWRpdC5jb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICBlZGl0RmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmVkaXRGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIGVkaXRDb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuZWRpdENvbXBsZXRlZFwiLCByZXMpO1xuICB9LFxuXG4gIHJlbW92ZShpZCkge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIGxldCBvbGRNb2RlbCA9IHRoaXMuc3RhdGUuZ2V0KGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGlkKSk7XG4gICAgQXhpb3MuZGVsZXRlKGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVDb21wbGV0ZWRcIiwgcmVzKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSb2JvdFN0b3JlO1xuIiwiLy8gUFJPWFkgUk9VVEVSIFRPIFNPTFZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBtYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICB0cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93LnJvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93LnJvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB8fCBmYWxzZTtcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBgdG9TdHJpbmdUYWdgIG9mIHZhbHVlcy5cbiAqIFNlZSB0aGUgW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZykgfHwgZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcblxuLy8gUlVMRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHZhciBtb2RlbCA9IHtcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFzc2VtYmx5RGF0ZTogSm9pLmRhdGUoKS5tYXgoXCJub3dcIikucmVxdWlyZWQoKSxcbiAgbWFudWZhY3R1cmVyOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbn07XG4iXX0=
