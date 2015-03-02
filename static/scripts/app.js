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

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/common/components/text-input":12,"frontend/robot/actions":13,"frontend/robot/stores":20,"immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":22,"react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":23}],15:[function(require,module,exports){
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

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/robot/actions":13,"frontend/robot/stores":20,"lodash.isobject":"lodash.isobject","lodash.isstring":22,"react":"react","react-document-title":"react-document-title","react-router":"react-router","reflux":"reflux"}],16:[function(require,module,exports){
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

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/common/components/text-input":12,"frontend/robot/actions":13,"frontend/robot/stores":20,"immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":22,"react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":23}],17:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImZyb250ZW5kL2FwcC9hcHAuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9hbGVydC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvYWxlcnQvc3RvcmVzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2JvZHkuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9zdG9yZXMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc3N0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvcm9ib3QvdmFsaWRhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0QyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWhDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVMsV0FBVyxFQUFFLFVBQVUsRUFBRTtBQUN6RCxNQUFJLENBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsU0FDeEIsQ0FBQyxVQUFTLENBQUMsRUFBRTtBQUNqQixjQUFVLENBQUMsWUFBVztBQUFFLFlBQU0sQ0FBQyxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUN4QyxDQUFDLENBQUM7Q0FDTixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHO0FBQ25DLFNBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztXQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUMsQ0FBQztDQUN4RixDQUFDOzs7QUFHRixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxX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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDckRBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7O0FBR2xCLElBQUksS0FBSyxXQUFMLEtBQUssR0FBRztBQUNqQixNQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtBQUM3QixjQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDOUMsY0FBWSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFDdEMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBTSElNUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaW5zcGVjdCA9IHJlcXVpcmUoXCJ1dGlsLWluc3BlY3RcIik7XG5yZXF1aXJlKFwib2JqZWN0LmFzc2lnblwiKS5zaGltKCk7XG5cblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB0aGlzXG4gICAgLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGU7IH0sIDEpO1xuICAgIH0pO1xufTtcblxud2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBpbnNwZWN0KHYpKSk7XG59O1xuXG4vLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlLCBIaXN0b3J5TG9jYXRpb259ID0gUmVhY3RSb3V0ZXI7XG5cbi8vIEluaXQgc3RvcmVzXG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5sZXQgQWxlcnRTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9zdG9yZXNcIik7XG5cbi8vIENvbW1vbiBjb21wb25lbnRzXG5sZXQgQm9keSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5XCIpO1xubGV0IEhvbWUgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvaG9tZVwiKTtcbmxldCBBYm91dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hYm91dFwiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5cbi8vIFJvYm90IGNvbXBvbmVudHNcbmxldCBSb2JvdFJvb3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9yb290XCIpO1xubGV0IFJvYm90SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleFwiKTtcbmxldCBSb2JvdERldGFpbCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbFwiKTtcbmxldCBSb2JvdEFkZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiKTtcbmxldCBSb2JvdEVkaXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0XCIpO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcm91dGVzID0gKFxuICA8Um91dGUgaGFuZGxlcj17Qm9keX0gcGF0aD1cIi9cIj5cbiAgICA8RGVmYXVsdFJvdXRlIG5hbWU9XCJob21lXCIgaGFuZGxlcj17SG9tZX0vPlxuICAgIDxSb3V0ZSBuYW1lPVwicm9ib3RcIiBwYXRoPVwiL3JvYm90cy9cIiBoYW5kbGVyPXtSb2JvdFJvb3R9PlxuICAgICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgICA8Um91dGUgbmFtZT1cInJvYm90LWFkZFwiIHBhdGg9XCJhZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1kZXRhaWxcIiBwYXRoPVwiOmlkXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZWRpdFwiIHBhdGg9XCI6aWQvZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDwvUm91dGU+XG4gICAgPFJvdXRlIG5hbWU9XCJhYm91dFwiIHBhdGg9XCIvYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pO1xuXG53aW5kb3cucm91dGVyID0gUmVhY3RSb3V0ZXIuY3JlYXRlKHtcbiAgcm91dGVzOiByb3V0ZXMsXG4gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbn0pO1xuXG53aW5kb3cucm91dGVyLnJ1bihmdW5jdGlvbihIYW5kbGVyLCBzdGF0ZSkge1xuICAvLyB5b3UgbWlnaHQgd2FudCB0byBwdXNoIHRoZSBzdGF0ZSBvZiB0aGUgcm91dGVyIHRvIGFcbiAgLy8gc3RvcmUgZm9yIHdoYXRldmVyIHJlYXNvblxuICAvLyBSb3V0ZXJBY3Rpb25zLnJvdXRlQ2hhbmdlKHtyb3V0ZXJTdGF0ZTogc3RhdGV9KTtcblxuICBSZWFjdC5yZW5kZXIoPEhhbmRsZXIvPiwgZG9jdW1lbnQuYm9keSk7XG59KTtcblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCB7TWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFsZXJ0QWN0aW9ucyA9IFJlZmx1eC5jcmVhdGVBY3Rpb25zKHtcbiAgXCJsb2FkTWFueVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcImFkZFwiOiB7fSxcbiAgXCJyZW1vdmVcIjoge30sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnRBY3Rpb25zO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtDU1NUcmFuc2l0aW9uR3JvdXB9ID0gcmVxdWlyZShcInJlYWN0L2FkZG9uc1wiKS5hZGRvbnM7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBBbGVydEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvYWN0aW9uc1wiKTtcbmxldCBBbGVydFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L3N0b3Jlc1wiKTtcbmxldCBBbGVydEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pdGVtXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSW5kZXggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlZmx1eC5jb25uZWN0KEFsZXJ0U3RvcmUsIFwibW9kZWxzXCIpXSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBBbGVydEFjdGlvbnMubG9hZE1hbnkoKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9ucyB0b3AtbGVmdFwiPlxuICAgICAgICA8Q1NTVHJhbnNpdGlvbkdyb3VwIHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiIGNvbXBvbmVudD1cImRpdlwiPlxuICAgICAgICAgIHt0aGlzLnN0YXRlLm1vZGVscy50b0FycmF5KCkubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgPC9DU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgY2xhc3NOYW1lcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgQWxlcnRBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBFeHBpcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGRlbGF5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIC8vb25FeHBpcmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jdGlvbixcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlbGF5OiA1MDAsXG4gICAgICAvL29uRXhwaXJlOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vIFJlc2V0IHRoZSB0aW1lciBpZiBjaGlsZHJlbiBhcmUgY2hhbmdlZFxuICAgIGlmIChuZXh0UHJvcHMuY2hpbGRyZW4gIT09IHRoaXMucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICAgIH1cbiAgfSxcblxuICBzdGFydFRpbWVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICAvLyBDbGVhciBleGlzdGluZyB0aW1lclxuICAgIGlmICh0aGlzLl90aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgYWZ0ZXIgYG1vZGVsLmRlbGF5YCBtc1xuICAgIGlmICh0aGlzLnByb3BzLmRlbGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uRXhwaXJlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLm9uRXhwaXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX3RpbWVyO1xuICAgICAgfSwgdGhpcy5wcm9wcy5kZWxheSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj47XG4gIH0sXG59KTtcblxubGV0IENsb3NlTGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMub25DbGljaygpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwiY2xvc2UgcHVsbC1yaWdodFwiIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+JnRpbWVzOzwvYT5cbiAgICApO1xuICB9XG59KTtcblxubGV0IEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgbGV0IGNsYXNzZXMgPSBjbGFzc05hbWVzKHtcbiAgICAgIFwiYWxlcnRcIjogdHJ1ZSxcbiAgICAgIFtcImFsZXJ0LVwiICsgbW9kZWwuY2F0ZWdvcnldOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgbGV0IHJlbW92ZUl0ZW0gPSBBbGVydEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpO1xuICAgIGxldCByZXN1bHQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bW9kZWwuY2xvc2FibGUgPyA8Q2xvc2VMaW5rIG9uQ2xpY2s9e3JlbW92ZUl0ZW19Lz4gOiBcIlwifVxuICAgICAgICB7bW9kZWwubWVzc2FnZX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICBpZiAobW9kZWwuZXhwaXJlKSB7XG4gICAgICByZXN1bHQgPSA8RXhwaXJlIG9uRXhwaXJlPXtyZW1vdmVJdGVtfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB7UmVjb3JkfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBbGVydCA9IFJlY29yZCh7XG4gIGlkOiB1bmRlZmluZWQsXG4gIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgY2F0ZWdvcnk6IHVuZGVmaW5lZCxcbiAgY2xvc2FibGU6IHRydWUsXG4gIGV4cGlyZTogNTAwMCxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBbGVydDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBVVUlEID0gcmVxdWlyZSgnbm9kZS11dWlkJyk7XG5sZXQge0xpc3QsIE1hcCwgT3JkZXJlZE1hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXI9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgQWxlcnRBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBbGVydFN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgbGlzdGVuYWJsZXM6IFtBbGVydEFjdGlvbnNdLFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gT3JkZXJlZE1hcCgpO1xuICB9LFxuXG4gIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGF0IG1peGluIGxldmVsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGluaXQoKSB7XG4gICAgdGhpcy5yZXNldFN0YXRlKCk7XG4gIH0sXG5cbiAgcmVzZXRTdGF0ZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkpO1xuICB9LFxuXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IEVycm9yKFwiYHN0YXRlYCBpcyByZXF1aXJlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgdGhpcy5zaGFyZVN0YXRlKCk7XG4gICAgfVxuICB9LFxuXG4gIHNoYXJlU3RhdGUoKSB7XG4gICAgdGhpcy50cmlnZ2VyKHRoaXMuc3RhdGUpO1xuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBub3JtYWxpemUobWVzc2FnZSwgY2F0ZWdvcnkpIHtcbiAgICBpZiAoaXNTdHJpbmcobW9kZWwpKSB7XG4gICAgICBtb2RlbCA9IHtcbiAgICAgICAgbWVzc2FnZTogbW9kZWwsXG4gICAgICAgIGNhdGVnb3J5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBtb2RlbCwge2lkOiBVVUlELnY0KCl9KTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBtb2RlbCA9IG1vZGVsLm1lcmdlKHtpZDogVVVJRC52NCgpfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5pZCwgbW9kZWwpKTtcbiAgfSxcblxuICByZW1vdmUoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCB8fCBpbmRleCA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgaW5kZXhgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGluZGV4KSk7XG4gICAgfVxuICB9LFxuXG4gIHBvcCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUucG9wKCkpO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnRTdG9yZTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWJvdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJBYm91dFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBpbmZvXCI+XG4gICAgICAgICAgPGgxPlNpbXBsZSBQYWdlIEV4YW1wbGU8L2gxPlxuICAgICAgICAgIDxwPlRoaXMgcGFnZSB3YXMgcmVuZGVyZWQgYnkgYSBKYXZhU2NyaXB0PC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFib3V0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgQWxlcnRJbmRleCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9jb21wb25lbnRzL2luZGV4XCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQm9keSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aGVhZGVyIGlkPVwicGFnZS1oZWFkZXJcIiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLWZpeGVkLXRvcCBuYXZiYXItZG93blwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIj5Sb2JvdHM8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJhYm91dFwiPkFib3V0PC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9oZWFkZXI+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIDxBbGVydEluZGV4Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBCb2R5O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBIb21lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUmVhY3QgU3RhcnRlclwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBob21lXCI+XG4gICAgICAgICAgPGgxPlJlYWN0IHN0YXJ0ZXIgYXBwPC9oMT5cbiAgICAgICAgICA8cD5Qcm9vZiBvZiBjb25jZXB0cywgQ1JVRCwgd2hhdGV2ZXIuLi48L3A+XG4gICAgICAgICAgPHA+UHJvdWRseSBidWlsZCBvbiBFUzYgd2l0aCB0aGUgaGVscCBvZiA8YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiB0cmFuc3BpbGVyLjwvcD5cbiAgICAgICAgICA8aDM+RnJvbnRlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlJlYWN0PC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5SZWFjdC1Sb3V0ZXI8L2E+PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPlJlYWN0LURvY3VtZW50LVRpdGxlPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5Ccm93c2VyaWZ5PC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5FeHByZXNzPC9hPiBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5Db21tb248L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+Sm9pPC9hPiBkYXRhIHZhbGlkYXRpb248L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhvbWU7XG5cbi8vc2VvVGl0bGU6IFwiSG9tZSBTRU8gdGl0bGVcIixcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTG9hZGluZyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBzaXplQ2xhc3MgPSB0aGlzLnByb3BzLnNpemUgPyAnIGxvYWRpbmctJyArIHRoaXMucHJvcHMuc2l6ZSA6ICcnO1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIkxvYWRpbmcuLi5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e1wibG9hZGluZ1wiICsgc2l6ZUNsYXNzfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3BpblwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRpbmc7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE5vdEZvdW5kID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTm90IEZvdW5kXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlXCI+XG4gICAgICAgICAgPGgxPlBhZ2Ugbm90IEZvdW5kPC9oMT5cbiAgICAgICAgICA8cD5Tb21ldGhpbmcgaXMgd3Jvbmc8L3A+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTm90Rm91bmQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaW1tdXRhYmxlTGVucyA9IHJlcXVpcmUoXCJwYXFtaW5kLmRhdGEtbGVuc1wiKS5pbW11dGFibGVMZW5zO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7QWxlcnQsIElucHV0LCBCdXR0b259ID0gcmVxdWlyZShcInJlYWN0LWJvb3RzdHJhcFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgaWQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZm9ybTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBrZXkgPSB0aGlzLnByb3BzLmlkO1xuICAgIGxldCBmb3JtID0gdGhpcy5wcm9wcy5mb3JtO1xuICAgIGxldCBsZW5zID0gaW1tdXRhYmxlTGVucyhrZXkpO1xuICAgIHJldHVybiAoXG4gICAgICAgIDxJbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgcmVmPXtrZXl9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXtsZW5zLmdldChmb3JtLnN0YXRlKX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3Ioa2V5KX1cbiAgICAgICAgICBic1N0eWxlPXtmb3JtLmlzVmFsaWQoa2V5KSA/IHVuZGVmaW5lZCA6IFwiZXJyb3JcIn1cbiAgICAgICAgICBoZWxwPXtmb3JtLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiIGNsYXNzTmFtZT1cImhlbHAtYmxvY2tcIj57bWVzc2FnZX08L3NwYW4+KX1cbiAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgLz5cbiAgICApO1xuICB9LFxuXG4gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24oa2V5KSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLnByb3BzLmZvcm07XG4gICAgbGV0IGxlbnMgPSBpbW11dGFibGVMZW5zKGtleSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgICAgZm9ybS5zZXRTdGF0ZShsZW5zLnNldChmb3JtLnN0YXRlLCBldmVudC50YXJnZXQudmFsdWUpKTtcbiAgICAgIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbiAgICB9LmJpbmQodGhpcyk7XG4gIH0sXG5cbiAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuICAgIGxldCBmb3JtID0gdGhpcy5wcm9wcy5mb3JtO1xuICAgIC8vY29uc29sZS5lY2hvKFwidmFsaWRhdGVEZWJvdW5jZWQoKVwiKTtcbiAgICBmb3JtLnZhbGlkYXRlKGtleSk7XG4gIH0sIDUwMCksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGV4dElucHV0O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUm91dGVyID0gcmVxdWlyZShcImZyb250ZW5kL3JvdXRlclwiKTtcbmxldCBBbGVydCA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9tb2RlbHNcIik7XG5sZXQgQWxlcnRBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb2JvdEFjdGlvbnMgPSBSZWZsdXguY3JlYXRlQWN0aW9ucyh7XG4gIFwibG9hZE1hbnlcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJsb2FkT25lXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiYWRkXCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwiZWRpdFwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcInJlbW92ZVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxufSk7XG5cblJvYm90QWN0aW9ucy5hZGQuY29tcGxldGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgLy8gV2UgYWxzbyBjYW4gcmVkaXJlY3QgdG8gYC97cmVzLmRhdGEuaWR9L2VkaXRgXG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiUm9ib3QgYWRkZWQhXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pKTtcbiAgUm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpOyAvLyBvciB1c2UgbGluayA9IHJvdXRlci5tYWtlUGF0aChcInJvYm90LWluZGV4XCIsIHBhcmFtcywgcXVlcnkpLCBjb25jYXQgYW5jaG9yLCB0aGlzLnRyYW5zaXRpb25UbyhsaW5rKVxufTtcblxuUm9ib3RBY3Rpb25zLmFkZC5mYWlsZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICBBbGVydEFjdGlvbnMuYWRkKEFsZXJ0KHttZXNzYWdlOiBcIkZhaWxlZCB0byBhZGQgUm9ib3QhXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KSk7XG59O1xuXG5Sb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiUm9ib3QgcmVtb3ZlZCFcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSkpO1xuICBSb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG59O1xuXG5Sb2JvdEFjdGlvbnMucmVtb3ZlLmZhaWxlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIEFsZXJ0QWN0aW9ucy5hZGQoQWxlcnQoe21lc3NhZ2U6IFwiRmFpbGVkIHRvIHJlbW92ZSBSb2JvdCFcIiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJvYm90QWN0aW9ucztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQgaXNTdHJpbmcgPSByZXF1aXJlKFwibG9kYXNoLmlzc3RyaW5nXCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge0FsZXJ0LCBJbnB1dCwgQnV0dG9ufSA9IHJlcXVpcmUoXCJyZWFjdC1ib290c3RyYXBcIik7XG5sZXQgVmFsaWRhdGlvbk1peGluID0gcmVxdWlyZShcInJlYWN0LXZhbGlkYXRpb24tbWl4aW5cIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xubGV0IFRleHRJbnB1dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0XCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWRkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtcbiAgICBWYWxpZGF0aW9uTWl4aW4sXG4gIF0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBWYWxpZGF0b3JzLm1vZGVsXG4gICAgfTtcbiAgfSxcblxuICB2YWxpZGF0b3JEYXRhKCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90QWRkLnZhbGlkYXRvckRhdGFcIiwgdGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB0aGlzLnN0YXRlLm1vZGVsLnRvSlMoKVxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogTWFwKHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBhc3NlbWJseURhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgbWFudWZhY3R1cmVyOiB1bmRlZmluZWQsXG4gICAgICB9KSxcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPkFkZCBSb2JvdDwvaDE+XG4gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICZuYnNwO1xuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH1cbiAgfSxcblxuICAvLyBEaXJ0eSBoYWNrcyB3aXRoIHNldFRpbWVvdXQgdW50aWwgdmFsaWQgY2FsbGJhY2sgYXJjaGl0ZWN0dXJlIChtaXhpbiA0LjAgYnJhbmNoKSAtLS0tLS0tLS0tLS0tLVxuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEFkZC5oYW5kbGVTdWJtaXRcIik7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgUm9ib3RBY3Rpb25zLmFkZCh0aGlzLnN0YXRlLm1vZGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfSxcblxuICAvL2hhbmRsZVJlc2V0KGV2ZW50KSB7XG4gIC8vICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvLyAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gIC8vICAgIGFsZXJ0KFwieHh4XCIpXG4gIC8vICB9LCAyMDApO1xuICAvL30sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWRkO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGlzT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc29iamVjdFwiKTtcbmxldCBpc1N0cmluZyA9IHJlcXVpcmUoXCJsb2Rhc2guaXNzdHJpbmdcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IExvYWRpbmcgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiKTtcbmxldCBOb3RGb3VuZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgUm9ib3RTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9zdG9yZXNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBEZXRhaWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFJlYWN0Um91dGVyLlN0YXRlLFxuICAgIFJlZmx1eC5jb25uZWN0RmlsdGVyKFJvYm90U3RvcmUsIFwibW9kZWxcIiwgZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICBsZXQgaWQgPSB0aGlzLmdldFBhcmFtcygpLmlkO1xuICAgICAgcmV0dXJuIG1vZGVscy5nZXQoaWQpO1xuICAgIH0pXG4gIF0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRPbmUodGhpcy5nZXRQYXJhbXMoKS5pZCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLmdldChcIm5hbWVcIil9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmdldChcImlkXCIpICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLmdldChcIm5hbWVcIil9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PjxkZD57bW9kZWwuZ2V0KFwiaWRcIil9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PjxkZD57bW9kZWwuZ2V0KFwiYXNzZW1ibHlEYXRlXCIpfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5NYW51ZmFjdHVyZXI8L2R0PjxkZD57bW9kZWwuZ2V0KFwibWFudWZhY3R1cmVyXCIpfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfVxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IERldGFpbDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQgaXNTdHJpbmcgPSByZXF1aXJlKFwibG9kYXNoLmlzc3RyaW5nXCIpO1xubGV0IHtNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5sZXQge0FsZXJ0LCBJbnB1dCwgQnV0dG9ufSA9IHJlcXVpcmUoXCJyZWFjdC1ib290c3RyYXBcIik7XG5sZXQgVmFsaWRhdGlvbk1peGluID0gcmVxdWlyZShcInJlYWN0LXZhbGlkYXRpb24tbWl4aW5cIik7XG5sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xubGV0IFRleHRJbnB1dCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0XCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRWRpdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbXG4gICAgUmVhY3RSb3V0ZXIuU3RhdGUsXG4gICAgVmFsaWRhdGlvbk1peGluLFxuICAgIFJlZmx1eC5jb25uZWN0RmlsdGVyKFJvYm90U3RvcmUsIFwibW9kZWxcIiwgZnVuY3Rpb24obW9kZWxzKSB7XG4gICAgICBsZXQgaWQgPSB0aGlzLmdldFBhcmFtcygpLmlkO1xuICAgICAgcmV0dXJuIG1vZGVscy5nZXQoaWQpO1xuICAgIH0pXG4gIF0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgUm9ib3RBY3Rpb25zLmxvYWRPbmUodGhpcy5nZXRQYXJhbXMoKS5pZCk7XG4gIH0sXG5cbiAgdmFsaWRhdG9yVHlwZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiBWYWxpZGF0b3JzLm1vZGVsXG4gICAgfTtcbiAgfSxcblxuICB2YWxpZGF0b3JEYXRhKCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90RWRpdC52YWxpZGF0b3JEYXRhXCIsIHRoaXMuc3RhdGUpO1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogdGhpcy5zdGF0ZS5tb2RlbC50b0pTKClcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHVuZGVmaW5lZFxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGlmIChpc09iamVjdCh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5nZXQoXCJuYW1lXCIpfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e1JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5nZXQoXCJpZFwiKSl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuZ2V0KFwiaWRcIikgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwuZ2V0KFwibmFtZVwiKX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGlydHkgaGFja3Mgd2l0aCBzZXRUaW1lb3V0IHVudGlsIHZhbGlkIGNhbGxiYWNrIGFyY2hpdGVjdHVyZSAobWl4aW4gNC4wIGJyYW5jaCkgLS0tLS0tLS0tLS0tLS1cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RFZGl0LmhhbmRsZVN1Ym1pdFwiKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICBSb2JvdEFjdGlvbnMuZWRpdCh0aGlzLnN0YXRlLm1vZGVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4gICAgICB9XG4gICAgfSwgNTAwKTtcbiAgfSxcblxuICAvL2hhbmRsZVJlc2V0KGV2ZW50KSB7XG4gIC8vICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAvLyAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgLy8gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gIC8vICAgIGFsZXJ0KFwieHh4XCIpXG4gIC8vICB9LCAyMDApO1xuICAvL30sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRWRpdDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmt9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xubGV0IFJvYm90SXRlbSA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbmRleCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbUmVmbHV4LmNvbm5lY3QoUm9ib3RTdG9yZSwgXCJtb2RlbHNcIildLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIFJvYm90QWN0aW9ucy5sb2FkTWFueSgpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSb2JvdHNcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5tb2RlbHMudG9BcnJheSgpLm1hcChtb2RlbCA9PiA8Um9ib3RJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0vPil9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJbmRleDtcblxuLypcbjxkaXYgY2xhc3NOYW1lPVwiYnV0dG9ucyBidG4tZ3JvdXBcIj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZXNldFwiPlJlc2V0IENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJyZW1vdmVcIj5SZW1vdmUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInNodWZmbGVcIj5TaHVmZmxlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJmZXRjaFwiPlJlZmV0Y2ggQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImFkZFwiPkFkZCBSYW5kb208L2J1dHRvbj5cbjwvZGl2PlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5nZXQoXCJpZFwiKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19Pnttb2RlbC5nZXQoXCJuYW1lXCIpfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuZ2V0KFwiaWRcIikgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmdldChcImlkXCIpfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge1JvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJvb3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFJvb3Q7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQge0xpc3QsIE1hcCwgT3JkZXJlZE1hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IEF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXI9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgUm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb2JvdFN0b3JlID0gUmVmbHV4LmNyZWF0ZVN0b3JlKHtcbiAgLy8gdGhpcyB3aWxsIHNldCB1cCBsaXN0ZW5lcnMgdG8gYWxsIHB1Ymxpc2hlcnMgaW4gVG9kb0FjdGlvbnMsIHVzaW5nIG9uS2V5bmFtZSAob3Iga2V5bmFtZSkgYXMgY2FsbGJhY2tzXG4gIGxpc3RlbmFibGVzOiBbUm9ib3RBY3Rpb25zXSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoKTtcbiAgfSxcblxuICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhdCBtaXhpbiBsZXZlbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBpbml0KCkge1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICB9LFxuXG4gIHJlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgfSxcblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBzdGF0ZWAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH1cbiAgfSxcblxuICBzaGFyZVN0YXRlKCkge1xuICAgIHRoaXMudHJpZ2dlcih0aGlzLnN0YXRlKTtcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbG9hZE1hbnkoKSB7XG4gICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuaW5kZXhMb2FkZWQpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BMaXN0ZW5pbmdUbyhSb2JvdEFjdGlvbnMubG9hZE1hbnkpO1xuICAgICAgUm9ib3RBY3Rpb25zLmxvYWRNYW55LnByb21pc2UoQXhpb3MuZ2V0KCcvYXBpL3JvYm90cy8nKSk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRNYW55RmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUZhaWxlZFwiLCByZXMpO1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55LCB0aGlzLmxvYWRNYW55KTtcbiAgfSxcblxuICBsb2FkTWFueUNvbXBsZXRlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlDb21wbGV0ZWRcIiwgcmVzKTtcbiAgICBsZXQgbW9kZWxzID0gTGlzdChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZShPcmRlcmVkTWFwKFtmb3IgKG1vZGVsIG9mIG1vZGVscykgW21vZGVsLmlkLCBNYXAobW9kZWwpXV0pKTtcbiAgICB0aGlzLmluZGV4TG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkTWFueSwgdGhpcy5sb2FkTWFueSk7XG4gIH0sXG5cbiAgbG9hZE9uZShpZCkge1xuICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZT8hXG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUpO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2U/IVxuICAgICAgQXhpb3MuZ2V0KGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuZmFpbGVkKHJlcywgaWQpKVxuICAgICAgICAudGhlbihyZXMgPT4gUm9ib3RBY3Rpb25zLmxvYWRPbmUuY29tcGxldGVkKHJlcywgaWQpKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZE9uZUZhaWxlZChyZXMsIGlkKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55RmFpbGVkXCIsIHJlcywgaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIFwiTm90IEZvdW5kXCIpKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkT25lLCB0aGlzLmxvYWRPbmUpO1xuICB9LFxuXG4gIGxvYWRPbmVDb21wbGV0ZWQocmVzLCBpZCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkT25lQ29tcGxldGVkXCIsIGlkKTtcbiAgICBsZXQgbW9kZWwgPSBNYXAocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE9uZSwgdGhpcy5sb2FkT25lKTtcbiAgfSxcblxuICBhZGQobW9kZWwpIHtcbiAgICBSb2JvdEFjdGlvbnMuYWRkLnByb21pc2UoQXhpb3MucG9zdChgL2FwaS9yb2JvdHMvYCwgbW9kZWwudG9KUygpKSk7XG4gIH0sXG5cbiAgYWRkRmFpbGVkKHJlcykge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5hZGRGYWlsZWRcIiwgcmVzKTtcbiAgfSxcblxuICBhZGRDb21wbGV0ZWQocmVzKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmFkZENvbXBsZXRlZFwiLCByZXMpO1xuICAgIGxldCBtb2RlbCA9IE1hcChyZXMuZGF0YSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChtb2RlbC5nZXQoXCJpZFwiKSwgbW9kZWwpKTtcbiAgfSxcblxuICBlZGl0KG1vZGVsKSB7XG4gICAgLy8gVE9ETyB1cGRhdGUgbG9jYWwgc3RvcmFnZT8hXG4gICAgbGV0IGlkID0gbW9kZWwuZ2V0KFwiaWRcIik7XG4gICAgbGV0IG9sZE1vZGVsID0gdGhpcy5zdGF0ZS5nZXQoaWQpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQoaWQsIG1vZGVsKSk7XG4gICAgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG1vZGVsLnRvSlMoKSlcbiAgICAgIC5jYXRjaChyZXMgPT4gUm9ib3RBY3Rpb25zLmVkaXQuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMuZWRpdC5jb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICBlZGl0RmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmVkaXRGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIGVkaXRDb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuZWRpdENvbXBsZXRlZFwiLCByZXMpO1xuICB9LFxuXG4gIHJlbW92ZShpZCkge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIGxldCBvbGRNb2RlbCA9IHRoaXMuc3RhdGUuZ2V0KGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuZGVsZXRlKGlkKSk7XG4gICAgQXhpb3MuZGVsZXRlKGAvYXBpL3JvYm90cy8ke2lkfWApXG4gICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5yZW1vdmUuZmFpbGVkKHJlcywgaWQsIG9sZE1vZGVsKSlcbiAgICAgIC5kb25lKHJlcyA9PiBSb2JvdEFjdGlvbnMucmVtb3ZlLmNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBvbGRNb2RlbCkpO1xuICB9LFxuXG4gIHJlbW92ZUNvbXBsZXRlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5yZW1vdmVDb21wbGV0ZWRcIiwgcmVzKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSb2JvdFN0b3JlO1xuIiwiLy8gUFJPWFkgUk9VVEVSIFRPIFNPTFZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBtYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHJldHVybiB3aW5kb3cucm91dGVyLm1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICB0cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICB3aW5kb3cucm91dGVyLnJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93LnJvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93LnJvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB8fCBmYWxzZTtcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBgdG9TdHJpbmdUYWdgIG9mIHZhbHVlcy5cbiAqIFNlZSB0aGUgW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IChpc09iamVjdExpa2UodmFsdWUpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ1RhZykgfHwgZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSm9pID0gcmVxdWlyZShcImpvaVwiKTtcblxuLy8gUlVMRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IHZhciBtb2RlbCA9IHtcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG4gIGFzc2VtYmx5RGF0ZTogSm9pLmRhdGUoKS5tYXgoXCJub3dcIikucmVxdWlyZWQoKSxcbiAgbWFudWZhY3R1cmVyOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbn07XG4iXX0=
