(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"frontend/alert/stores":6,"frontend/common/components/about":7,"frontend/common/components/body":8,"frontend/common/components/home":9,"frontend/common/components/not-found":11,"frontend/robot/components/add":14,"frontend/robot/components/detail":15,"frontend/robot/components/edit":16,"frontend/robot/components/index":17,"frontend/robot/components/root":19,"frontend/robot/stores":20,"object.assign":"object.assign","react":"react","react-router":"react-router","util-inspect":"util-inspect"}],2:[function(require,module,exports){
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

},{"immutable":"immutable","lodash.isobject":"lodash.isobject","reflux":"reflux"}],3:[function(require,module,exports){
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

},{"frontend/alert/actions":2,"frontend/alert/components/item":4,"frontend/alert/stores":6,"react":"react","react/addons":"react/addons","reflux":"reflux"}],4:[function(require,module,exports){
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

},{"classnames":"classnames","frontend/alert/actions":2,"react":"react","react-router":"react-router"}],5:[function(require,module,exports){
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

},{"immutable":"immutable"}],6:[function(require,module,exports){
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

},{"frontend/alert/actions":2,"immutable":"immutable","node-uuid":"node-uuid","react-router":"react-router","reflux":"reflux"}],7:[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],8:[function(require,module,exports){
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

},{"frontend/alert/components/index":3,"react":"react","react-router":"react-router","reflux":"reflux"}],9:[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],10:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
var Loading = React.createClass({
  displayName: "Loading",
  render: function render() {
    return React.createElement(
      DocumentTitle,
      { title: "Loading..." },
      React.createElement(
        "div",
        null,
        React.createElement(
          "section",
          { className: "container" },
          React.createElement("i", { className: "fa fa-cog fa-spin" })
        )
      )
    );
  }
});

module.exports = Loading;

},{"react":"react","react-document-title":"react-document-title"}],11:[function(require,module,exports){
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

},{"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],12:[function(require,module,exports){
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

  render: function () {
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

  handleChangeFor: function (key) {
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

},{"lodash.debounce":"lodash.debounce","paqmind.data-lens":"paqmind.data-lens","react":"react","react-bootstrap":"react-bootstrap"}],13:[function(require,module,exports){
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

},{"frontend/alert/actions":2,"frontend/alert/models":5,"frontend/router":21,"reflux":"reflux"}],14:[function(require,module,exports){
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
            { className: "container" },
            React.createElement("div", { className: "thumbnail pull-left margin-top nopadding" }),
            React.createElement(
              "h1",
              null,
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
                { className: "buttons" },
                React.createElement(
                  "button",
                  { className: "btn", type: "button", onClick: this.handleReset },
                  "Reset"
                ),
                React.createElement(
                  "button",
                  { className: "btn", type: "submit" },
                  "Submit"
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
        //this.setState({model: undefined}); // WTF with this ???
      } else {
        alert("Can't submit form with errors");
      }
    }, 500);
  } });

module.exports = Add;
/*TODO add "undefined" avatar */ /*<img src={"http://robohash.org/" + model.get("id") + "?size=200x200"} width="200px" height="200px"/>*/

//handleReset(event) {
//  event.preventDefault();
//  this.setState(this.getInitialState());
//  setTimeout(function() {
//    alert("xxx")
//  }, 200);
//},
// -----------------------------------------------------------------------------------------------

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/common/components/text-input":12,"frontend/robot/actions":13,"frontend/robot/stores":20,"immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":23,"react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":22}],15:[function(require,module,exports){
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
            { className: "container" },
            React.createElement(
              "div",
              { className: "thumbnail pull-left margin-top nopadding" },
              React.createElement("img", { src: "http://robohash.org/" + model.get("id") + "?size=200x200", width: "200px", height: "200px" })
            ),
            React.createElement(
              "h1",
              null,
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
      );
    } else if (isString(this.state.model)) {
      return React.createElement(NotFound, null);
    } else {
      return React.createElement(Loading, null);
    }
  } });

module.exports = Detail;

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/robot/actions":13,"frontend/robot/stores":20,"lodash.isobject":"lodash.isobject","lodash.isstring":23,"react":"react","react-document-title":"react-document-title","react-router":"react-router","reflux":"reflux"}],16:[function(require,module,exports){
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
            { className: "container" },
            React.createElement(
              "div",
              { className: "thumbnail pull-left margin-top nopadding" },
              React.createElement("img", { src: "http://robohash.org/" + model.get("id") + "?size=200x200", width: "200px", height: "200px" })
            ),
            React.createElement(
              "h1",
              null,
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
                { className: "buttons" },
                React.createElement(
                  "button",
                  { className: "btn", type: "button", onClick: this.handleReset },
                  "Reset"
                ),
                React.createElement(
                  "button",
                  { className: "btn", type: "submit" },
                  "Submit"
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

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/common/components/text-input":12,"frontend/robot/actions":13,"frontend/robot/stores":20,"immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":23,"react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":22}],17:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var React = require("react");
var Reflux = require("reflux");
var _require = require("react-router");

var Link = _require.Link;
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

},{"frontend/robot/actions":13,"frontend/robot/components/item":18,"frontend/robot/stores":20,"react":"react","react-document-title":"react-document-title","react-router":"react-router","reflux":"reflux"}],18:[function(require,module,exports){
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

},{"frontend/robot/actions":13,"react":"react","react-router":"react-router"}],19:[function(require,module,exports){
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

},{"react":"react","react-router":"react-router","reflux":"reflux"}],20:[function(require,module,exports){
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

      for (var _iterator = models[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
        var _model = _step.value;
        _OrderedMap.push([_model.id, Map(_model)]);
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

},{"axios":"axios","frontend/robot/actions":13,"immutable":"immutable","react-router":"react-router","reflux":"reflux"}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Joi = require("joi");

// RULES ===========================================================================================
var model = exports.model = {
  name: Joi.string().required(),
  assemblyDate: Joi.date().max("now").required(),
  manufacturer: Joi.string().required() };
exports.__esModule = true;

},{"joi":"joi"}],23:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9hcHAuanMiLCJhcHAvYWxlcnQvYWN0aW9ucy5qcyIsImFwcC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwiYXBwL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsImFwcC9hbGVydC9tb2RlbHMuanMiLCJhcHAvYWxlcnQvc3RvcmVzLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2JvZHkuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvaG9tZS5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0LmpzIiwiYXBwL3JvYm90L2FjdGlvbnMuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwiYXBwL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwiYXBwL3JvYm90L2NvbXBvbmVudHMvcm9vdC5qcyIsImFwcC9yb2JvdC9zdG9yZXMuanMiLCJhcHAvcm91dGVyLmpzIiwicm9ib3QvdmFsaWRhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNzdHJpbmcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztB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QUFLLENBQUMsQ0FBQzs7O0FBR2xCLElBQUksS0FBSyxXQUFMLEtBQUssR0FBRztBQUNqQixNQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtBQUM3QixjQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDOUMsY0FBWSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFDdEMsQ0FBQzs7OztBQ1JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbnNwZWN0ID0gcmVxdWlyZShcInV0aWwtaW5zcGVjdFwiKTtcbnJlcXVpcmUoXCJvYmplY3QuYXNzaWduXCIpLnNoaW0oKTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIHRoaXNcbiAgICAudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICAuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZTsgfSwgMSk7XG4gICAgfSk7XG59O1xuXG53aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gbG9nKCkge1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IGluc3BlY3QodikpKTtcbn07XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGUsIEhpc3RvcnlMb2NhdGlvbn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gSW5pdCBzdG9yZXNcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcbmxldCBBbGVydFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L3N0b3Jlc1wiKTtcblxuLy8gQ29tbW9uIGNvbXBvbmVudHNcbmxldCBCb2R5ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHlcIik7XG5sZXQgSG9tZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lXCIpO1xubGV0IEFib3V0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0XCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcblxuLy8gUm9ib3QgY29tcG9uZW50c1xubGV0IFJvYm90Um9vdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL3Jvb3RcIik7XG5sZXQgUm9ib3RJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCIpO1xubGV0IFJvYm90RGV0YWlsID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCIpO1xubGV0IFJvYm90QWRkID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCIpO1xubGV0IFJvYm90RWRpdCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIik7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByb3V0ZXMgPSAoXG4gIDxSb3V0ZSBoYW5kbGVyPXtCb2R5fSBwYXRoPVwiL1wiPlxuICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cImhvbWVcIiBoYW5kbGVyPXtIb21lfS8+XG4gICAgPFJvdXRlIG5hbWU9XCJyb2JvdFwiIHBhdGg9XCIvcm9ib3RzL1wiIGhhbmRsZXI9e1JvYm90Um9vdH0+XG4gICAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJyb2JvdC1pbmRleFwiIGhhbmRsZXI9e1JvYm90SW5kZXh9Lz5cbiAgICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtYWRkXCIgcGF0aD1cImFkZFwiIGhhbmRsZXI9e1JvYm90QWRkfS8+XG4gICAgICA8Um91dGUgbmFtZT1cInJvYm90LWRldGFpbFwiIHBhdGg9XCI6aWRcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1lZGl0XCIgcGF0aD1cIjppZC9lZGl0XCIgaGFuZGxlcj17Um9ib3RFZGl0fS8+XG4gICAgPC9Sb3V0ZT5cbiAgICA8Um91dGUgbmFtZT1cImFib3V0XCIgcGF0aD1cIi9hYm91dFwiIGhhbmRsZXI9e0Fib3V0fS8+XG4gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbiAgPC9Sb3V0ZT5cbik7XG5cbndpbmRvdy5yb3V0ZXIgPSBSZWFjdFJvdXRlci5jcmVhdGUoe1xuICByb3V0ZXM6IHJvdXRlcyxcbiAgbG9jYXRpb246IEhpc3RvcnlMb2NhdGlvblxufSk7XG5cbndpbmRvdy5yb3V0ZXIucnVuKGZ1bmN0aW9uKEhhbmRsZXIsIHN0YXRlKSB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIFJlYWN0LnJlbmRlcig8SGFuZGxlci8+LCBkb2N1bWVudC5ib2R5KTtcbn0pO1xuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWxlcnRBY3Rpb25zID0gUmVmbHV4LmNyZWF0ZUFjdGlvbnMoe1xuICBcImxvYWRNYW55XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiYWRkXCI6IHt9LFxuICBcInJlbW92ZVwiOiB7fSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydEFjdGlvbnM7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0NTU1RyYW5zaXRpb25Hcm91cH0gPSByZXF1aXJlKFwicmVhY3QvYWRkb25zXCIpLmFkZG9ucztcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xubGV0IEFsZXJ0U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvc3RvcmVzXCIpO1xubGV0IEFsZXJ0SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoQWxlcnRTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIEFsZXJ0QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgIDxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4gICAgICAgICAge3RoaXMuc3RhdGUubW9kZWxzLnRvQXJyYXkoKS5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICA8L0NTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjbGFzc05hbWVzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVtb3ZlSXRlbSA9IEFsZXJ0QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCk7XG4gICAgbGV0IHJlc3VsdCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttb2RlbC5jbG9zYWJsZSA/IDxDbG9zZUxpbmsgb25DbGljaz17cmVtb3ZlSXRlbX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e3JlbW92ZUl0ZW19IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtSZWNvcmR9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0ID0gUmVjb3JkKHtcbiAgaWQ6IHVuZGVmaW5lZCxcbiAgbWVzc2FnZTogdW5kZWZpbmVkLFxuICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICBjbG9zYWJsZTogdHJ1ZSxcbiAgZXhwaXJlOiA1MDAwLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKCdub2RlLXV1aWQnKTtcbmxldCB7TGlzdCwgTWFwLCBPcmRlcmVkTWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlcj0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0U3RvcmUgPSBSZWZsdXguY3JlYXRlU3RvcmUoe1xuICBsaXN0ZW5hYmxlczogW0FsZXJ0QWN0aW9uc10sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiBPcmRlcmVkTWFwKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgYXQgbWl4aW4gbGV2ZWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlc2V0U3RhdGUoKTtcbiAgfSxcblxuICByZXNldFN0YXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIH0sXG5cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgc3RhdGVgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2hhcmVTdGF0ZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIodGhpcy5zdGF0ZSk7XG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5vcm1hbGl6ZShtZXNzYWdlLCBjYXRlZ29yeSkge1xuICAgIGlmIChpc1N0cmluZyhtb2RlbCkpIHtcbiAgICAgIG1vZGVsID0ge1xuICAgICAgICBtZXNzYWdlOiBtb2RlbCxcbiAgICAgICAgY2F0ZWdvcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1vZGVsLCB7aWQ6IFVVSUQudjQoKX0pO1xuICB9LFxuXG4gIGFkZChtb2RlbCkge1xuICAgIG1vZGVsID0gbW9kZWwubWVyZ2Uoe2lkOiBVVUlELnY0KCl9KTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KG1vZGVsLmlkLCBtb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZShpbmRleCkge1xuICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkIHx8IGluZGV4ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBpbmRleGAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5kZWxldGUoaW5kZXgpKTtcbiAgICB9XG4gIH0sXG5cbiAgcG9wKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5wb3AoKSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydFN0b3JlO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBYm91dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkFib3V0XCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGluZm9cIj5cbiAgICAgICAgICA8aDE+U2ltcGxlIFBhZ2UgRXhhbXBsZTwvaDE+XG4gICAgICAgICAgPHA+VGhpcyBwYWdlIHdhcyByZW5kZXJlZCBieSBhIEphdmFTY3JpcHQ8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWJvdXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBBbGVydEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaW5kZXhcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIG5hdmJhci1kb3duXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiPlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgPEFsZXJ0SW5kZXgvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEJvZHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+UmVhY3Q8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlJlYWN0LVJvdXRlcjwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkJyb3dzZXJpZnk8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT5JbiBwcm9kdWN0aW9uIG1vZGUsIGl0IHdpbGwgc2VydmUgbWluZmllZCwgdW5pcXVlbHkgbmFtZWQgZmlsZXMgd2l0aCBzdXBlciBhZ3Jlc3NpdmUgY2FjaGUgaGVhZGVycy4gVG8gdGVzdDpcbiAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgIDxsaT5pbiBkZXZfY29uZmlnLmpzb24gc2V0IDxjb2RlPmlzRGV2PC9jb2RlPiB0byA8Y29kZT5mYWxzZTwvY29kZT48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5yZXN0YXJ0IHRoZSBzZXJ2ZXI8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT52aWV3IHNvdXJjZSBhbmQgeW91J2xsIHNlZSBtaW5pZmllZCBjc3MgYW5kIGpzIGZpbGVzIHdpdGggdW5pcXVlIG5hbWVzPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+b3BlbiB0aGUgXCJuZXR3b3JrXCIgdGFiIGluIGNocm9tZSBkZXYgdG9vbHMgKG9yIHNvbWV0aGluZyBzaW1pbGFyKS4gWW91J2xsIGFsc28gd2FudCB0byBtYWtlIHN1cmUgeW91IGhhdmVuJ3QgZGlzYWJsZWQgeW91ciBjYWNoZTwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPndpdGhvdXQgaGl0dGluZyBcInJlZnJlc2hcIiBsb2FkIHRoZSBhcHAgYWdhaW4gKHNlbGVjdGluZyBjdXJyZW50IFVSTCBpbiB1cmwgYmFyIGFuZCBoaXR0aW5nIFwiZW50ZXJcIiB3b3JrcyBncmVhdCk8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT55b3Ugc2hvdWxkIG5vdyBzZWUgdGhhdCB0aGUgSlMgYW5kIENTUyBmaWxlcyB3ZXJlIGJvdGggc2VydmVkIGZyb20gY2FjaGUgd2l0aG91dCBtYWtpbmcgYW55IHJlcXVlc3QgdG8gdGhlIHNlcnZlciBhdCBhbGw8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkV4cHJlc3M8L2E+IGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+R3VscDwvYT4gc3RyZWFtaW5nIGJ1aWxkIHN5c3RlbTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Kb2k8L2E+IGRhdGEgdmFsaWRhdGlvbjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5GYWtlcjwvYT4gZmFrZSBkYXRhIGdlbmVyYXRpb248L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+VkNTPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5HaXQ8L2E+IHZlcnNpb24gY29udHJvbCBzeXN0ZW08L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSG9tZTtcblxuLy9zZW9UaXRsZTogXCJIb21lIFNFTyB0aXRsZVwiLFxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBMb2FkaW5nID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTG9hZGluZztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTm90Rm91bmQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBOb3RGb3VuZDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbW11dGFibGVMZW5zID0gcmVxdWlyZShcInBhcW1pbmQuZGF0YS1sZW5zXCIpLmltbXV0YWJsZUxlbnM7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtBbGVydCwgSW5wdXQsIEJ1dHRvbn0gPSByZXF1aXJlKFwicmVhY3QtYm9vdHN0cmFwXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVGV4dElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBpZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBmb3JtOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGtleSA9IHRoaXMucHJvcHMuaWQ7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgbGV0IGxlbnMgPSBpbW11dGFibGVMZW5zKGtleSk7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPElucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBrZXk9e2tleX1cbiAgICAgICAgICByZWY9e2tleX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e2xlbnMuZ2V0KGZvcm0uc3RhdGUpfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihrZXkpfVxuICAgICAgICAgIGJzU3R5bGU9e2Zvcm0uaXNWYWxpZChrZXkpID8gdW5kZWZpbmVkIDogXCJlcnJvclwifVxuICAgICAgICAgIGhlbHA9e2Zvcm0uZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCIgY2xhc3NOYW1lPVwiaGVscC1ibG9ja1wiPnttZXNzYWdlfTwvc3Bhbj4pfVxuICAgICAgICAgIHsuLi50aGlzLnByb3BzfVxuICAgICAgICAvPlxuICAgICk7XG4gIH0sXG5cbiAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbihrZXkpIHtcbiAgICBsZXQgZm9ybSA9IHRoaXMucHJvcHMuZm9ybTtcbiAgICBsZXQgbGVucyA9IGltbXV0YWJsZUxlbnMoa2V5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgICBmb3JtLnNldFN0YXRlKGxlbnMuc2V0KGZvcm0uc3RhdGUsIGV2ZW50LnRhcmdldC52YWx1ZSkpO1xuICAgICAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuICAgIH0uYmluZCh0aGlzKTtcbiAgfSxcblxuICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgLy9jb25zb2xlLmVjaG8oXCJ2YWxpZGF0ZURlYm91bmNlZCgpXCIpO1xuICAgIGZvcm0udmFsaWRhdGUoa2V5KTtcbiAgfSwgNTAwKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUZXh0SW5wdXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVyXCIpO1xubGV0IEFsZXJ0ID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L21vZGVsc1wiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvYm90QWN0aW9ucyA9IFJlZmx1eC5jcmVhdGVBY3Rpb25zKHtcbiAgXCJsb2FkTWFueVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcImxvYWRPbmVcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJhZGRcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJlZGl0XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwicmVtb3ZlXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG59KTtcblxuUm9ib3RBY3Rpb25zLmFkZC5jb21wbGV0ZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICAvLyBXZSBhbHNvIGNhbiByZWRpcmVjdCB0byBgL3tyZXMuZGF0YS5pZH0vZWRpdGBcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJSb2JvdCBhZGRlZCFcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSkpO1xuICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7IC8vIG9yIHVzZSBsaW5rID0gcm91dGVyLm1ha2VQYXRoKFwicm9ib3QtaW5kZXhcIiwgcGFyYW1zLCBxdWVyeSksIGNvbmNhdCBhbmNob3IsIHRoaXMudHJhbnNpdGlvblRvKGxpbmspXG59O1xuXG5Sb2JvdEFjdGlvbnMuYWRkLmZhaWxlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiRmFpbGVkIHRvIGFkZCBSb2JvdCFcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pKTtcbn07XG5cblJvYm90QWN0aW9ucy5yZW1vdmUuY29tcGxldGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJSb2JvdCByZW1vdmVkIVwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KSk7XG4gIFJvdXRlci50cmFuc2l0aW9uVG8oXCJyb2JvdC1pbmRleFwiKTtcbn07XG5cblJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJGYWlsZWQgdG8gcmVtb3ZlIFJvYm90IVwiLCBjYXRlZ29yeTogXCJlcnJvclwifSkpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUm9ib3RBY3Rpb25zO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQge01hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0aW9uTWl4aW4gPSByZXF1aXJlKFwicmVhY3QtdmFsaWRhdGlvbi1taXhpblwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgVGV4dElucHV0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3RleHQtaW5wdXRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBZGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFZhbGlkYXRpb25NaXhpbixcbiAgXSxcblxuICB2YWxpZGF0b3JUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IFZhbGlkYXRvcnMubW9kZWxcbiAgICB9O1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RBZGQudmFsaWRhdG9yRGF0YVwiLCB0aGlzLnN0YXRlKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHRoaXMuc3RhdGUubW9kZWwudG9KUygpXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBNYXAoe1xuICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbiAgICAgIH0pLFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkFkZCBSb2JvdFwifT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgcHVsbC1sZWZ0IG1hcmdpbi10b3Agbm9wYWRkaW5nXCI+XG4gICAgICAgICAgICAgICAgey8qVE9ETyBhZGQgXCJ1bmRlZmluZWRcIiBhdmF0YXIgKi99XG4gICAgICAgICAgICAgICAgey8qPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmdldChcImlkXCIpICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz4qL31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMT5BZGQgUm9ib3Q8L2gxPlxuICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0blwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfVxuICB9LFxuXG4gIC8vIERpcnR5IGhhY2tzIHdpdGggc2V0VGltZW91dCB1bnRpbCB2YWxpZCBjYWxsYmFjayBhcmNoaXRlY3R1cmUgKG1peGluIDQuMCBicmFuY2gpIC0tLS0tLS0tLS0tLS0tXG4gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90QWRkLmhhbmRsZVN1Ym1pdFwiKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICBSb2JvdEFjdGlvbnMuYWRkKHRoaXMuc3RhdGUubW9kZWwpO1xuICAgICAgICAvL3RoaXMuc2V0U3RhdGUoe21vZGVsOiB1bmRlZmluZWR9KTsgLy8gV1RGIHdpdGggdGhpcyA/Pz9cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfSxcblxuICAvL2hhbmRsZVJlc2V0KGV2ZW50KSB7XG4gIC8vICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvLyAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gIC8vICAgIGFsZXJ0KFwieHh4XCIpXG4gIC8vICB9LCAyMDApO1xuICAvL30sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWRkO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBEZXRhaWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFJlYWN0Um91dGVyLlN0YXRlLFxuICAgIFJlZmx1eC5jb25uZWN0RmlsdGVyKFJvYm90U3RvcmUsIFwibW9kZWxcIiwgZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICBsZXQgaWQgPSB0aGlzLmdldFBhcmFtcygpLmlkO1xuICAgICAgcmV0dXJuIG1vZGVscy5nZXQoaWQpO1xuICAgIH0pXG4gIF0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRPbmUodGhpcy5nZXRQYXJhbXMoKS5pZCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLmdldChcIm5hbWVcIil9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgcHVsbC1sZWZ0IG1hcmdpbi10b3Agbm9wYWRkaW5nXCI+XG4gICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmdldChcImlkXCIpICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMT57bW9kZWwuZ2V0KFwibmFtZVwiKX08L2gxPlxuICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PjxkZD57bW9kZWwuZ2V0KFwiaWRcIil9PC9kZD5cbiAgICAgICAgICAgICAgICA8ZHQ+QXNzZW1ibHkgRGF0ZTwvZHQ+PGRkPnttb2RlbC5nZXQoXCJhc3NlbWJseURhdGVcIil9PC9kZD5cbiAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD48ZGQ+e21vZGVsLmdldChcIm1hbnVmYWN0dXJlclwiKX08L2RkPlxuICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRGV0YWlsO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQge01hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcbmxldCBWYWxpZGF0aW9uTWl4aW4gPSByZXF1aXJlKFwicmVhY3QtdmFsaWRhdGlvbi1taXhpblwiKTtcbmxldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgVGV4dElucHV0ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3RleHQtaW5wdXRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBFZGl0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtcbiAgICBSZWFjdFJvdXRlci5TdGF0ZSxcbiAgICBWYWxpZGF0aW9uTWl4aW4sXG4gICAgUmVmbHV4LmNvbm5lY3RGaWx0ZXIoUm9ib3RTdG9yZSwgXCJtb2RlbFwiLCBmdW5jdGlvbihtb2RlbHMpIHtcbiAgICAgIGxldCBpZCA9IHRoaXMuZ2V0UGFyYW1zKCkuaWQ7XG4gICAgICByZXR1cm4gbW9kZWxzLmdldChpZCk7XG4gICAgfSlcbiAgXSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBSb2JvdEFjdGlvbnMubG9hZE9uZSh0aGlzLmdldFBhcmFtcygpLmlkKTtcbiAgfSxcblxuICB2YWxpZGF0b3JUeXBlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IFZhbGlkYXRvcnMubW9kZWxcbiAgICB9O1xuICB9LFxuXG4gIHZhbGlkYXRvckRhdGEoKSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RFZGl0LnZhbGlkYXRvckRhdGFcIiwgdGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB0aGlzLnN0YXRlLm1vZGVsLnRvSlMoKVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogdW5kZWZpbmVkXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRWRpdCBcIiArIG1vZGVsLmdldChcIm5hbWVcIil9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leWVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17Um9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmdldChcImlkXCIpKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHB1bGwtbGVmdCBtYXJnaW4tdG9wIG5vcGFkZGluZ1wiPlxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5nZXQoXCJpZFwiKSArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aDE+e21vZGVsLmdldChcIm5hbWVcIil9PC9oMT5cbiAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG5cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH1cbiAgfSxcblxuICAvLyBEaXJ0eSBoYWNrcyB3aXRoIHNldFRpbWVvdXQgdW50aWwgdmFsaWQgY2FsbGJhY2sgYXJjaGl0ZWN0dXJlIChtaXhpbiA0LjAgYnJhbmNoKSAtLS0tLS0tLS0tLS0tLVxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEVkaXQuaGFuZGxlU3VibWl0XCIpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIFJvYm90QWN0aW9ucy5lZGl0KHRoaXMuc3RhdGUubW9kZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICB9LFxuXG4gIC8vaGFuZGxlUmVzZXQoZXZlbnQpIHtcbiAgLy8gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIC8vICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICAvLyAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgLy8gICAgYWxlcnQoXCJ4eHhcIilcbiAgLy8gIH0sIDIwMCk7XG4gIC8vfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xubGV0IFJvYm90SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoUm9ib3RTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIFJvYm90QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSb2JvdHNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5tb2RlbHMudG9BcnJheSgpLm1hcChtb2RlbCA9PiA8Um9ib3RJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0vPil9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcblxuLypcbjxkaXYgY2xhc3NOYW1lPVwiYnV0dG9ucyBidG4tZ3JvdXBcIj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZXNldFwiPlJlc2V0IENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZW1vdmVcIj5SZW1vdmUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInNodWZmbGVcIj5TaHVmZmxlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJmZXRjaFwiPlJlZmV0Y2ggQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImFkZFwiPkFkZCBSYW5kb208L2J1dHRvbj5cbjwvZGl2PlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19Pnttb2RlbC5nZXQoXCJuYW1lXCIpfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuZ2V0KFwiaWRcIikgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvb3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvb3Q7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQge0xpc3QsIE1hcCwgT3JkZXJlZE1hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXI9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb2JvdFN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgLy8gdGhpcyB3aWxsIHNldCB1cCBsaXN0ZW5lcnMgdG8gYWxsIHB1Ymxpc2hlcnMgaW4gVG9kb0FjdGlvbnMsIHVzaW5nIG9uS2V5bmFtZSAob3Iga2V5bmFtZSkgYXMgY2FsbGJhY2tzXG4gIGxpc3RlbmFibGVzOiBbUm9ib3RBY3Rpb25zXSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoKTtcbiAgfSxcblxuICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhdCBtaXhpbiBsZXZlbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBpbml0KCkge1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICB9LFxuXG4gIHJlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgfSxcblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBzdGF0ZWAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH1cbiAgfSxcblxuICBzaGFyZVN0YXRlKCkge1xuICAgIHRoaXMudHJpZ2dlcih0aGlzLnN0YXRlKTtcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9hZE1hbnkoKSB7XG4gICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuaW5kZXhMb2FkZWQpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmdUbyhSb2JvdEFjdGlvbnMubG9hZE1hbnkpO1xuICAgICAgUm9ib3RBY3Rpb25zLmxvYWRNYW55LnByb21pc2UoQXhpb3MuZ2V0KCcvYXBpL3JvYm90cy8nKSk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRNYW55RmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55LCB0aGlzLmxvYWRNYW55KTtcbiAgfSxcblxuICBsb2FkTWFueUNvbXBsZXRlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlDb21wbGV0ZWRcIiwgcmVzKTtcbiAgICBsZXQgbW9kZWxzID0gTGlzdChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZShPcmRlcmVkTWFwKFtmb3IgKG1vZGVsIG9mIG1vZGVscykgW21vZGVsLmlkLCBNYXAobW9kZWwpXV0pKTtcbiAgICB0aGlzLmluZGV4TG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkTWFueSwgdGhpcy5sb2FkTWFueSk7XG4gIH0sXG5cbiAgbG9hZE9uZShpZCkge1xuICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZT8hXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUpO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2U/IVxuICAgICAgQXhpb3MuZ2V0KGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuZmFpbGVkKHJlcywgaWQpKVxuICAgICAgICAudGhlbihyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuY29tcGxldGVkKHJlcywgaWQpKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZE9uZUZhaWxlZChyZXMsIGlkKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55RmFpbGVkXCIsIHJlcywgaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIFwiTm90IEZvdW5kXCIpKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkT25lLCB0aGlzLmxvYWRPbmUpO1xuICB9LFxuXG4gIGxvYWRPbmVDb21wbGV0ZWQocmVzLCBpZCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkT25lQ29tcGxldGVkXCIsIGlkKTtcbiAgICBsZXQgbW9kZWwgPSBNYXAocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE9uZSwgdGhpcy5sb2FkT25lKTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBSb2JvdEFjdGlvbnMuYWRkLnByb21pc2UoQXhpb3MucG9zdChgL2FwaS9yb2JvdHMvYCwgbW9kZWwudG9KUygpKSk7XG4gIH0sXG5cbiAgYWRkRmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5hZGRGYWlsZWRcIiwgcmVzKTtcbiAgfSxcblxuICBhZGRDb21wbGV0ZWQocmVzKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmFkZENvbXBsZXRlZFwiLCByZXMpO1xuICAgIGxldCBtb2RlbCA9IE1hcChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5nZXQoXCJpZFwiKSwgbW9kZWwpKTtcbiAgfSxcblxuICBlZGl0KG1vZGVsKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgbGV0IGlkID0gbW9kZWwuZ2V0KFwiaWRcIik7XG4gICAgbGV0IG9sZE1vZGVsID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG1vZGVsLnRvSlMoKSlcbiAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmVkaXQuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMuZWRpdC5jb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICBlZGl0RmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmVkaXRGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIGVkaXRDb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuZWRpdENvbXBsZXRlZFwiLCByZXMpO1xuICB9LFxuXG4gIHJlbW92ZShpZCkge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIGxldCBvbGRNb2RlbCA9IHRoaXMuc3RhdGUuZ2V0KGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGlkKSk7XG4gICAgQXhpb3MuZGVsZXRlKGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVDb21wbGV0ZWRcIiwgcmVzKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSb2JvdFN0b3JlO1xuIiwiLy8gUFJPWFkgUk9VVEVSIFRPIFNPTFZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBtYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICB0cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93LnJvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93LnJvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcblxuLy8gUlVMRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHZhciBtb2RlbCA9IHtcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFzc2VtYmx5RGF0ZTogSm9pLmRhdGUoKS5tYXgoXCJub3dcIikucmVxdWlyZWQoKSxcbiAgbWFudWZhY3R1cmVyOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbn07XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB8fCBmYWxzZTtcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBgdG9TdHJpbmdUYWdgIG9mIHZhbHVlcy5cbiAqIFNlZSB0aGUgW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZykgfHwgZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iXX0=
