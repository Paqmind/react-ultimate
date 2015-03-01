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

},{"frontend/common/components/loading":10,"frontend/common/components/not-found":11,"frontend/common/components/text-input":12,"frontend/robot/actions":13,"frontend/robot/stores":20,"immutable":"immutable","lodash.isobject":"lodash.isobject","lodash.isstring":23,"react":"react","react-bootstrap":"react-bootstrap","react-document-title":"react-document-title","react-router":"react-router","react-validation-mixin":"react-validation-mixin","reflux":"reflux","shared/robot/validators":22}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9hcHAuanMiLCJhcHAvYWxlcnQvYWN0aW9ucy5qcyIsImFwcC9hbGVydC9jb21wb25lbnRzL2luZGV4LmpzIiwiYXBwL2FsZXJ0L2NvbXBvbmVudHMvaXRlbS5qcyIsImFwcC9hbGVydC9tb2RlbHMuanMiLCJhcHAvYWxlcnQvc3RvcmVzLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL2JvZHkuanMiLCJhcHAvY29tbW9uL2NvbXBvbmVudHMvaG9tZS5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nLmpzIiwiYXBwL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZC5qcyIsImFwcC9jb21tb24vY29tcG9uZW50cy90ZXh0LWlucHV0LmpzIiwiYXBwL3JvYm90L2FjdGlvbnMuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwiYXBwL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJhcHAvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwiYXBwL3JvYm90L2NvbXBvbmVudHMvcm9vdC5qcyIsImFwcC9yb2JvdC9zdG9yZXMuanMiLCJhcHAvcm91dGVyLmpzIiwicm9ib3QvdmFsaWRhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNzdHJpbmcvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdEMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGluc3BlY3QgPSByZXF1aXJlKFwidXRpbC1pbnNwZWN0XCIpO1xucmVxdWlyZShcIm9iamVjdC5hc3NpZ25cIikuc2hpbSgpO1xuXG5Qcm9taXNlLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgdGhpc1xuICAgIC50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIC5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlOyB9LCAxKTtcbiAgICB9KTtcbn07XG5cbndpbmRvdy5jb25zb2xlLmVjaG8gPSBmdW5jdGlvbiBsb2coKSB7XG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykubWFwKHYgPT4gaW5zcGVjdCh2KSkpO1xufTtcblxuLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7Um91dGUsIERlZmF1bHRSb3V0ZSwgTm90Rm91bmRSb3V0ZSwgSGlzdG9yeUxvY2F0aW9ufSA9IFJlYWN0Um91dGVyO1xuXG4vLyBJbml0IHN0b3Jlc1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xubGV0IEFsZXJ0U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvc3RvcmVzXCIpO1xuXG4vLyBDb21tb24gY29tcG9uZW50c1xubGV0IEJvZHkgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keVwiKTtcbmxldCBIb21lID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWVcIik7XG5sZXQgQWJvdXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXRcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xuXG4vLyBSb2JvdCBjb21wb25lbnRzXG5sZXQgUm9ib3RSb290ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvcm9vdFwiKTtcbmxldCBSb2JvdEluZGV4ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIik7XG5sZXQgUm9ib3REZXRhaWwgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIik7XG5sZXQgUm9ib3RBZGQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIik7XG5sZXQgUm9ib3RFZGl0ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiKTtcblxuLy8gUk9VVEVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJvdXRlcyA9IChcbiAgPFJvdXRlIGhhbmRsZXI9e0JvZHl9IHBhdGg9XCIvXCI+XG4gICAgPERlZmF1bHRSb3V0ZSBuYW1lPVwiaG9tZVwiIGhhbmRsZXI9e0hvbWV9Lz5cbiAgICA8Um91dGUgbmFtZT1cInJvYm90XCIgcGF0aD1cIi9yb2JvdHMvXCIgaGFuZGxlcj17Um9ib3RSb290fT5cbiAgICAgIDxEZWZhdWx0Um91dGUgbmFtZT1cInJvYm90LWluZGV4XCIgaGFuZGxlcj17Um9ib3RJbmRleH0vPlxuICAgICAgPFJvdXRlIG5hbWU9XCJyb2JvdC1hZGRcIiBwYXRoPVwiYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICAgIDxSb3V0ZSBuYW1lPVwicm9ib3QtZGV0YWlsXCIgcGF0aD1cIjppZFwiIGhhbmRsZXI9e1JvYm90RGV0YWlsfS8+XG4gICAgICA8Um91dGUgbmFtZT1cInJvYm90LWVkaXRcIiBwYXRoPVwiOmlkL2VkaXRcIiBoYW5kbGVyPXtSb2JvdEVkaXR9Lz5cbiAgICA8L1JvdXRlPlxuICAgIDxSb3V0ZSBuYW1lPVwiYWJvdXRcIiBwYXRoPVwiL2Fib3V0XCIgaGFuZGxlcj17QWJvdXR9Lz5cbiAgICA8Tm90Rm91bmRSb3V0ZSBoYW5kbGVyPXtOb3RGb3VuZH0vPlxuICA8L1JvdXRlPlxuKTtcblxud2luZG93LnJvdXRlciA9IFJlYWN0Um91dGVyLmNyZWF0ZSh7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93LnJvdXRlci5ydW4oZnVuY3Rpb24oSGFuZGxlciwgc3RhdGUpIHtcbiAgLy8geW91IG1pZ2h0IHdhbnQgdG8gcHVzaCB0aGUgc3RhdGUgb2YgdGhlIHJvdXRlciB0byBhXG4gIC8vIHN0b3JlIGZvciB3aGF0ZXZlciByZWFzb25cbiAgLy8gUm91dGVyQWN0aW9ucy5yb3V0ZUNoYW5nZSh7cm91dGVyU3RhdGU6IHN0YXRlfSk7XG5cbiAgUmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xufSk7XG5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQge01hcH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBbGVydEFjdGlvbnMgPSBSZWZsdXguY3JlYXRlQWN0aW9ucyh7XG4gIFwibG9hZE1hbnlcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJhZGRcIjoge30sXG4gIFwicmVtb3ZlXCI6IHt9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0QWN0aW9ucztcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7Q1NTVHJhbnNpdGlvbkdyb3VwfSA9IHJlcXVpcmUoXCJyZWFjdC9hZGRvbnNcIikuYWRkb25zO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgQWxlcnRBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2FjdGlvbnNcIik7XG5sZXQgQWxlcnRTdG9yZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9zdG9yZXNcIik7XG5sZXQgQWxlcnRJdGVtID0gcmVxdWlyZShcImZyb250ZW5kL2FsZXJ0L2NvbXBvbmVudHMvaXRlbVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEluZGV4ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtSZWZsdXguY29ubmVjdChBbGVydFN0b3JlLCBcIm1vZGVsc1wiKV0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgQWxlcnRBY3Rpb25zLmxvYWRNYW55KCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbnMgdG9wLWxlZnRcIj5cbiAgICAgICAgPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbiAgICAgICAgICB7dGhpcy5zdGF0ZS5tb2RlbHMudG9BcnJheSgpLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgIDwvQ1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGNsYXNzTmFtZXMgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGlua30gPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRXhwaXJlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBkZWxheTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAvL29uRXhwaXJlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY3Rpb24sXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWxheTogNTAwLFxuICAgICAgLy9vbkV4cGlyZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBSZXNldCB0aGUgdGltZXIgaWYgY2hpbGRyZW4gYXJlIGNoYW5nZWRcbiAgICBpZiAobmV4dFByb3BzLmNoaWxkcmVuICE9PSB0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRUaW1lcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgLy8gQ2xlYXIgZXhpc3RpbmcgdGltZXJcbiAgICBpZiAodGhpcy5fdGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFmdGVyIGBtb2RlbC5kZWxheWAgbXNcbiAgICBpZiAodGhpcy5wcm9wcy5kZWxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGlyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGlyZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgICAgIH0sIHRoaXMucHJvcHMuZGVsYXkpO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuICB9LFxufSk7XG5cbmxldCBDbG9zZUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImNsb3NlIHB1bGwtcmlnaHRcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PiZ0aW1lczs8L2E+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGxldCBjbGFzc2VzID0gY2xhc3NOYW1lcyh7XG4gICAgICBcImFsZXJ0XCI6IHRydWUsXG4gICAgICBbXCJhbGVydC1cIiArIG1vZGVsLmNhdGVnb3J5XTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGxldCByZW1vdmVJdGVtID0gQWxlcnRBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKTtcbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtyZW1vdmVJdGVtfS8+IDogXCJcIn1cbiAgICAgICAge21vZGVsLm1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgaWYgKG1vZGVsLmV4cGlyZSkge1xuICAgICAgcmVzdWx0ID0gPEV4cGlyZSBvbkV4cGlyZT17cmVtb3ZlSXRlbX0gZGVsYXk9e21vZGVsLmV4cGlyZX0+e3Jlc3VsdH08L0V4cGlyZT47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuXG5cbi8qXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG5cbiAgdGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy4kbm90ZSk7XG4gIHRoaXMuJG5vdGUuYWxlcnQoKTtcbn07XG5cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcbiAgZWxzZSBvbkNsb3NlLmNhbGwodGhpcyk7XG59O1xuXG4kLmZuLm5vdGlmeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKHRoaXMsIG9wdGlvbnMpO1xufTtcbiovXG5cbi8vIFRPRE8gY2hlY2sgdGhpcyBodHRwczovL2dpdGh1Yi5jb20vZ29vZHliYWcvYm9vdHN0cmFwLW5vdGlmeS90cmVlL21hc3Rlci9jc3Mvc3R5bGVzXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQge1JlY29yZH0gPSByZXF1aXJlKFwiaW1tdXRhYmxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWxlcnQgPSBSZWNvcmQoe1xuICBpZDogdW5kZWZpbmVkLFxuICBtZXNzYWdlOiB1bmRlZmluZWQsXG4gIGNhdGVnb3J5OiB1bmRlZmluZWQsXG4gIGNsb3NhYmxlOiB0cnVlLFxuICBleHBpcmU6IDUwMDAsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVVVJRCA9IHJlcXVpcmUoJ25vZGUtdXVpZCcpO1xubGV0IHtMaXN0LCBNYXAsIE9yZGVyZWRNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQWxlcnRTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG4gIGxpc3RlbmFibGVzOiBbQWxlcnRBY3Rpb25zXSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoKTtcbiAgfSxcblxuICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBhdCBtaXhpbiBsZXZlbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBpbml0KCkge1xuICAgIHRoaXMucmVzZXRTdGF0ZSgpO1xuICB9LFxuXG4gIHJlc2V0U3RhdGUoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldEluaXRpYWxTdGF0ZSgpKTtcbiAgfSxcblxuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBFcnJvcihcImBzdGF0ZWAgaXMgcmVxdWlyZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuc2hhcmVTdGF0ZSgpO1xuICAgIH1cbiAgfSxcblxuICBzaGFyZVN0YXRlKCkge1xuICAgIHRoaXMudHJpZ2dlcih0aGlzLnN0YXRlKTtcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbm9ybWFsaXplKG1lc3NhZ2UsIGNhdGVnb3J5KSB7XG4gICAgaWYgKGlzU3RyaW5nKG1vZGVsKSkge1xuICAgICAgbW9kZWwgPSB7XG4gICAgICAgIG1lc3NhZ2U6IG1vZGVsLFxuICAgICAgICBjYXRlZ29yeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbW9kZWwsIHtpZDogVVVJRC52NCgpfSk7XG4gIH0sXG5cbiAgYWRkKG1vZGVsKSB7XG4gICAgbW9kZWwgPSBtb2RlbC5tZXJnZSh7aWQ6IFVVSUQudjQoKX0pO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQobW9kZWwuaWQsIG1vZGVsKSk7XG4gIH0sXG5cbiAgcmVtb3ZlKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQgfHwgaW5kZXggPT09IG51bGwpIHtcbiAgICAgIHRocm93IEVycm9yKFwiYGluZGV4YCBpcyByZXF1aXJlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLmRlbGV0ZShpbmRleCkpO1xuICAgIH1cbiAgfSxcblxuICBwb3AoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnBvcCgpKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFsZXJ0U3RvcmU7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFib3V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBBYm91dDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IEFsZXJ0SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvY29tcG9uZW50cy9pbmRleFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlciBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3AgbmF2YmFyLWRvd25cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1wYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1iYXJzIGZhLWxnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgdG89XCJob21lXCI+PHNwYW4gY2xhc3NOYW1lPVwibGlnaHRcIj5SZWFjdDwvc3Bhbj5TdGFydGVyPC9MaW5rPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZSBuYXZiYXItcGFnZS1oZWFkZXIgbmF2YmFyLXJpZ2h0IGJyYWNrZXRzLWVmZmVjdFwiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJob21lXCI+SG9tZTwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cInJvYm90LWluZGV4XCI+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgIDxtYWluIGlkPVwicGFnZS1tYWluXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvbWFpbj5cblxuICAgICAgICA8QWxlcnRJbmRleC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQm9keTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSG9tZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJlYWN0IFN0YXJ0ZXJcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaG9tZVwiPlxuICAgICAgICAgIDxoMT5SZWFjdCBzdGFydGVyIGFwcDwvaDE+XG4gICAgICAgICAgPHA+UHJvb2Ygb2YgY29uY2VwdHMsIENSVUQsIHdoYXRldmVyLi4uPC9wPlxuICAgICAgICAgIDxwPlByb3VkbHkgYnVpbGQgb24gRVM2IHdpdGggdGhlIGhlbHAgb2YgPGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gdHJhbnNwaWxlci48L3A+XG4gICAgICAgICAgPGgzPkZyb250ZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5SZWFjdDwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+UmVhY3QtUm91dGVyPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5SZWFjdC1Eb2N1bWVudC1UaXRsZTwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+QnJvd3NlcmlmeTwvYT48L2xpPlxuICAgICAgICAgICAgPGxpPkluIHByb2R1Y3Rpb24gbW9kZSwgaXQgd2lsbCBzZXJ2ZSBtaW5maWVkLCB1bmlxdWVseSBuYW1lZCBmaWxlcyB3aXRoIHN1cGVyIGFncmVzc2l2ZSBjYWNoZSBoZWFkZXJzLiBUbyB0ZXN0OlxuICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgPGxpPmluIGRldl9jb25maWcuanNvbiBzZXQgPGNvZGU+aXNEZXY8L2NvZGU+IHRvIDxjb2RlPmZhbHNlPC9jb2RlPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPnJlc3RhcnQgdGhlIHNlcnZlcjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPnZpZXcgc291cmNlIGFuZCB5b3UnbGwgc2VlIG1pbmlmaWVkIGNzcyBhbmQganMgZmlsZXMgd2l0aCB1bmlxdWUgbmFtZXM8L2xpPlxuICAgICAgICAgICAgICAgIDxsaT5vcGVuIHRoZSBcIm5ldHdvcmtcIiB0YWIgaW4gY2hyb21lIGRldiB0b29scyAob3Igc29tZXRoaW5nIHNpbWlsYXIpLiBZb3UnbGwgYWxzbyB3YW50IHRvIG1ha2Ugc3VyZSB5b3UgaGF2ZW4ndCBkaXNhYmxlZCB5b3VyIGNhY2hlPC9saT5cbiAgICAgICAgICAgICAgICA8bGk+d2l0aG91dCBoaXR0aW5nIFwicmVmcmVzaFwiIGxvYWQgdGhlIGFwcCBhZ2FpbiAoc2VsZWN0aW5nIGN1cnJlbnQgVVJMIGluIHVybCBiYXIgYW5kIGhpdHRpbmcgXCJlbnRlclwiIHdvcmtzIGdyZWF0KTwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPnlvdSBzaG91bGQgbm93IHNlZSB0aGF0IHRoZSBKUyBhbmQgQ1NTIGZpbGVzIHdlcmUgYm90aCBzZXJ2ZWQgZnJvbSBjYWNoZSB3aXRob3V0IG1ha2luZyBhbnkgcmVxdWVzdCB0byB0aGUgc2VydmVyIGF0IGFsbDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+QmFja2VuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCI+RXhwcmVzczwvYT4gZnJhbWV3b3JrPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPk51bmp1Y2tzPC9hPiB0ZW1wbGF0ZSBlbmdpbmU8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkpvaTwvYT4gZGF0YSB2YWxpZGF0aW9uPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBIb21lO1xuXG4vL3Nlb1RpdGxlOiBcIkhvbWUgU0VPIHRpdGxlXCIsXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IExvYWRpbmcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImxvYWRpbmdcIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMb2FkaW5nO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlYWN0Um91dGVyID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IFJlYWN0Um91dGVyO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBOb3RGb3VuZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE5vdEZvdW5kO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGltbXV0YWJsZUxlbnMgPSByZXF1aXJlKFwicGFxbWluZC5kYXRhLWxlbnNcIikuaW1tdXRhYmxlTGVucztcbmxldCBkZWJvdW5jZSA9IHJlcXVpcmUoXCJsb2Rhc2guZGVib3VuY2VcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0FsZXJ0LCBJbnB1dCwgQnV0dG9ufSA9IHJlcXVpcmUoXCJyZWFjdC1ib290c3RyYXBcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGlkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGxhYmVsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZvcm06IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQga2V5ID0gdGhpcy5wcm9wcy5pZDtcbiAgICBsZXQgZm9ybSA9IHRoaXMucHJvcHMuZm9ybTtcbiAgICBsZXQgbGVucyA9IGltbXV0YWJsZUxlbnMoa2V5KTtcbiAgICByZXR1cm4gKFxuICAgICAgICA8SW5wdXQgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGtleT17a2V5fVxuICAgICAgICAgIHJlZj17a2V5fVxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17bGVucy5nZXQoZm9ybS5zdGF0ZSl9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKGtleSl9XG4gICAgICAgICAgYnNTdHlsZT17Zm9ybS5pc1ZhbGlkKGtleSkgPyB1bmRlZmluZWQgOiBcImVycm9yXCJ9XG4gICAgICAgICAgaGVscD17Zm9ybS5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIiBjbGFzc05hbWU9XCJoZWxwLWJsb2NrXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4gICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgIC8+XG4gICAgKTtcbiAgfSxcblxuICBoYW5kbGVDaGFuZ2VGb3I6IGZ1bmN0aW9uKGtleSkge1xuICAgIGxldCBmb3JtID0gdGhpcy5wcm9wcy5mb3JtO1xuICAgIGxldCBsZW5zID0gaW1tdXRhYmxlTGVucyhrZXkpO1xuICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIGZvcm0uc2V0U3RhdGUobGVucy5zZXQoZm9ybS5zdGF0ZSwgZXZlbnQudGFyZ2V0LnZhbHVlKSk7XG4gICAgICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4gICAgfS5iaW5kKHRoaXMpO1xuICB9LFxuXG4gIHZhbGlkYXRlRGVib3VuY2VkOiBkZWJvdW5jZShmdW5jdGlvbiB2YWxpZGF0ZURlYm91bmNlZChrZXkpIHtcbiAgICBsZXQgZm9ybSA9IHRoaXMucHJvcHMuZm9ybTtcbiAgICAvL2NvbnNvbGUuZWNobyhcInZhbGlkYXRlRGVib3VuY2VkKClcIik7XG4gICAgZm9ybS52YWxpZGF0ZShrZXkpO1xuICB9LCA1MDApLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRleHRJbnB1dDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb3V0ZXJcIik7XG5sZXQgQWxlcnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvYWxlcnQvbW9kZWxzXCIpO1xubGV0IEFsZXJ0QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9hbGVydC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUm9ib3RBY3Rpb25zID0gUmVmbHV4LmNyZWF0ZUFjdGlvbnMoe1xuICBcImxvYWRNYW55XCI6IHthc3luY1Jlc3VsdDogdHJ1ZX0sXG4gIFwibG9hZE9uZVwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcImFkZFwiOiB7YXN5bmNSZXN1bHQ6IHRydWV9LFxuICBcImVkaXRcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbiAgXCJyZW1vdmVcIjoge2FzeW5jUmVzdWx0OiB0cnVlfSxcbn0pO1xuXG5Sb2JvdEFjdGlvbnMuYWRkLmNvbXBsZXRlZC5wcmVFbWl0ID0gZnVuY3Rpb24ocmVzKSB7XG4gIC8vIFdlIGFsc28gY2FuIHJlZGlyZWN0IHRvIGAve3Jlcy5kYXRhLmlkfS9lZGl0YFxuICBBbGVydEFjdGlvbnMuYWRkKEFsZXJ0KHttZXNzYWdlOiBcIlJvYm90IGFkZGVkIVwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KSk7XG4gIFJvdXRlci50cmFuc2l0aW9uVG8oXCJyb2JvdC1pbmRleFwiKTsgLy8gb3IgdXNlIGxpbmsgPSByb3V0ZXIubWFrZVBhdGgoXCJyb2JvdC1pbmRleFwiLCBwYXJhbXMsIHF1ZXJ5KSwgY29uY2F0IGFuY2hvciwgdGhpcy50cmFuc2l0aW9uVG8obGluaylcbn07XG5cblJvYm90QWN0aW9ucy5hZGQuZmFpbGVkLnByZUVtaXQgPSBmdW5jdGlvbihyZXMpIHtcbiAgQWxlcnRBY3Rpb25zLmFkZChBbGVydCh7bWVzc2FnZTogXCJGYWlsZWQgdG8gYWRkIFJvYm90IVwiLCBjYXRlZ29yeTogXCJlcnJvclwifSkpO1xufTtcblxuUm9ib3RBY3Rpb25zLnJlbW92ZS5jb21wbGV0ZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICBBbGVydEFjdGlvbnMuYWRkKEFsZXJ0KHttZXNzYWdlOiBcIlJvYm90IHJlbW92ZWQhXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pKTtcbiAgUm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpO1xufTtcblxuUm9ib3RBY3Rpb25zLnJlbW92ZS5mYWlsZWQucHJlRW1pdCA9IGZ1bmN0aW9uKHJlcykge1xuICBBbGVydEFjdGlvbnMuYWRkKEFsZXJ0KHttZXNzYWdlOiBcIkZhaWxlZCB0byByZW1vdmUgUm9ib3QhXCIsIGNhdGVnb3J5OiBcImVycm9yXCJ9KSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSb2JvdEFjdGlvbnM7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IGlzU3RyaW5nID0gcmVxdWlyZShcImxvZGFzaC5pc3N0cmluZ1wiKTtcbmxldCB7TWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IHtBbGVydCwgSW5wdXQsIEJ1dHRvbn0gPSByZXF1aXJlKFwicmVhY3QtYm9vdHN0cmFwXCIpO1xubGV0IFZhbGlkYXRpb25NaXhpbiA9IHJlcXVpcmUoXCJyZWFjdC12YWxpZGF0aW9uLW1peGluXCIpO1xubGV0IFZhbGlkYXRvcnMgPSByZXF1aXJlKFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcbmxldCBUZXh0SW5wdXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvdGV4dC1pbnB1dFwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEFkZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbXG4gICAgVmFsaWRhdGlvbk1peGluLFxuICBdLFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogVmFsaWRhdG9ycy5tb2RlbFxuICAgIH07XG4gIH0sXG5cbiAgdmFsaWRhdG9yRGF0YSgpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEFkZC52YWxpZGF0b3JEYXRhXCIsIHRoaXMuc3RhdGUpO1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogdGhpcy5zdGF0ZS5tb2RlbC50b0pTKClcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IE1hcCh7XG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgYXNzZW1ibHlEYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuICAgICAgfSksXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgaWYgKGlzT2JqZWN0KHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiQWRkIFJvYm90XCJ9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgICAgPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIHJldHVybiA8Tm90Rm91bmQvPjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGlydHkgaGFja3Mgd2l0aCBzZXRUaW1lb3V0IHVudGlsIHZhbGlkIGNhbGxiYWNrIGFyY2hpdGVjdHVyZSAobWl4aW4gNC4wIGJyYW5jaCkgLS0tLS0tLS0tLS0tLS1cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgY29uc29sZS5lY2hvKFwiUm9ib3RBZGQuaGFuZGxlU3VibWl0XCIpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgIFJvYm90QWN0aW9ucy5hZGQodGhpcy5zdGF0ZS5tb2RlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG4gIH0sXG5cbiAgLy9oYW5kbGVSZXNldChldmVudCkge1xuICAvLyAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgLy8gIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIC8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAvLyAgICBhbGVydChcInh4eFwiKVxuICAvLyAgfSwgMjAwKTtcbiAgLy99LFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFkZDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpc09iamVjdCA9IHJlcXVpcmUoXCJsb2Rhc2guaXNvYmplY3RcIik7XG5sZXQgaXNTdHJpbmcgPSByZXF1aXJlKFwibG9kYXNoLmlzc3RyaW5nXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCBMb2FkaW5nID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5sZXQgTm90Rm91bmQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IFJvYm90U3RvcmUgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3Qvc3RvcmVzXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRGV0YWlsID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtcbiAgICBSZWFjdFJvdXRlci5TdGF0ZSxcbiAgICBSZWZsdXguY29ubmVjdEZpbHRlcihSb2JvdFN0b3JlLCBcIm1vZGVsXCIsIGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgbGV0IGlkID0gdGhpcy5nZXRQYXJhbXMoKS5pZDtcbiAgICAgIHJldHVybiBtb2RlbHMuZ2V0KGlkKTtcbiAgICB9KVxuICBdLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIFJvYm90QWN0aW9ucy5sb2FkT25lKHRoaXMuZ2V0UGFyYW1zKCkuaWQpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJEZXRhaWwgXCIgKyBtb2RlbC5nZXQoXCJuYW1lXCIpfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZWRpdFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19IGNsYXNzTmFtZT1cImJ0biBidG4tb3JhbmdlXCIgdGl0bGU9XCJFZGl0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17Um9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmdldChcImlkXCIpKX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5nZXQoXCJpZFwiKSArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5nZXQoXCJuYW1lXCIpfTwvaDE+XG4gICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5TZXJpYWwgTnVtYmVyPC9kdD48ZGQ+e21vZGVsLmdldChcImlkXCIpfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD48ZGQ+e21vZGVsLmdldChcImFzc2VtYmx5RGF0ZVwiKX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD48ZGQ+e21vZGVsLmdldChcIm1hbnVmYWN0dXJlclwiKX08L2RkPlxuICAgICAgICAgICAgICAgICAgPC9kbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aGlzLnN0YXRlLm1vZGVsKSkge1xuICAgICAgcmV0dXJuIDxOb3RGb3VuZC8+O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH1cbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBEZXRhaWw7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaXNPYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzb2JqZWN0XCIpO1xubGV0IGlzU3RyaW5nID0gcmVxdWlyZShcImxvZGFzaC5pc3N0cmluZ1wiKTtcbmxldCB7TWFwfSA9IHJlcXVpcmUoXCJpbW11dGFibGVcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVmbHV4ID0gcmVxdWlyZShcInJlZmx1eFwiKTtcbmxldCBSZWFjdFJvdXRlciA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQge0xpbmssIFJvdXRlSGFuZGxlcn0gPSBSZWFjdFJvdXRlcjtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xubGV0IHtBbGVydCwgSW5wdXQsIEJ1dHRvbn0gPSByZXF1aXJlKFwicmVhY3QtYm9vdHN0cmFwXCIpO1xubGV0IFZhbGlkYXRpb25NaXhpbiA9IHJlcXVpcmUoXCJyZWFjdC12YWxpZGF0aW9uLW1peGluXCIpO1xubGV0IFZhbGlkYXRvcnMgPSByZXF1aXJlKFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcbmxldCBUZXh0SW5wdXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvdGV4dC1pbnB1dFwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEVkaXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1xuICAgIFJlYWN0Um91dGVyLlN0YXRlLFxuICAgIFZhbGlkYXRpb25NaXhpbixcbiAgICBSZWZsdXguY29ubmVjdEZpbHRlcihSb2JvdFN0b3JlLCBcIm1vZGVsXCIsIGZ1bmN0aW9uKG1vZGVscykge1xuICAgICAgbGV0IGlkID0gdGhpcy5nZXRQYXJhbXMoKS5pZDtcbiAgICAgIHJldHVybiBtb2RlbHMuZ2V0KGlkKTtcbiAgICB9KVxuICBdLFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIFJvYm90QWN0aW9ucy5sb2FkT25lKHRoaXMuZ2V0UGFyYW1zKCkuaWQpO1xuICB9LFxuXG4gIHZhbGlkYXRvclR5cGVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlbDogVmFsaWRhdG9ycy5tb2RlbFxuICAgIH07XG4gIH0sXG5cbiAgdmFsaWRhdG9yRGF0YSgpIHtcbiAgICBjb25zb2xlLmVjaG8oXCJSb2JvdEVkaXQudmFsaWRhdG9yRGF0YVwiLCB0aGlzLnN0YXRlKTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZWw6IHRoaXMuc3RhdGUubW9kZWwudG9KUygpXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVsOiB1bmRlZmluZWRcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoaXNPYmplY3QodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFZGl0IFwiICsgbW9kZWwuZ2V0KFwibmFtZVwiKX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtSb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuZ2V0KFwiaWRcIikpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmdldChcImlkXCIpICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLmdldChcIm5hbWVcIil9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbiAgICAgICAgICAgICAgICAgICAgICA8VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgJm5ic3A7XG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuc3RhdGUubW9kZWwpKSB7XG4gICAgICByZXR1cm4gPE5vdEZvdW5kLz47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfVxuICB9LFxuXG4gIC8vIERpcnR5IGhhY2tzIHdpdGggc2V0VGltZW91dCB1bnRpbCB2YWxpZCBjYWxsYmFjayBhcmNoaXRlY3R1cmUgKG1peGluIDQuMCBicmFuY2gpIC0tLS0tLS0tLS0tLS0tXG4gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuICAgIGNvbnNvbGUuZWNobyhcIlJvYm90RWRpdC5oYW5kbGVTdWJtaXRcIik7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgUm9ib3RBY3Rpb25zLmVkaXQodGhpcy5zdGF0ZS5tb2RlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG4gIH0sXG5cbiAgLy9oYW5kbGVSZXNldChldmVudCkge1xuICAvLyAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgLy8gIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIC8vICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAvLyAgICBhbGVydChcInh4eFwiKVxuICAvLyAgfSwgMjAwKTtcbiAgLy99LFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEVkaXQ7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtMaW5rfSA9IFJlYWN0Um91dGVyO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBSb2JvdFN0b3JlID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L3N0b3Jlc1wiKTtcbmxldCBSb2JvdEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgSW5kZXggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW1JlZmx1eC5jb25uZWN0KFJvYm90U3RvcmUsIFwibW9kZWxzXCIpXSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBSb2JvdEFjdGlvbnMubG9hZE1hbnkoKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1hZGRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmVlblwiIHRpdGxlPVwiQWRkXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1wbHVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxoMT5Sb2JvdHM8L2gxPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUubW9kZWxzLnRvQXJyYXkoKS5tYXAobW9kZWwgPT4gPFJvYm90SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuZ2V0KFwiaWRcIil9Lz4pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBSb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGtleT17bW9kZWwuZ2V0KFwiaWRcIil9IGNsYXNzTmFtZT1cImNvbC1zbS02IGNvbC1tZC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIGtleT17bW9kZWwuZ2V0KFwiaWRcIil9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+PExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuZ2V0KFwiaWRcIil9fT57bW9kZWwuZ2V0KFwibmFtZVwiKX08L0xpbms+PC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHkgdGV4dC1jZW50ZXIgbm9wYWRkaW5nXCI+XG4gICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17J2h0dHA6Ly9yb2JvaGFzaC5vcmcvJyArIG1vZGVsLmdldChcImlkXCIpICsgJz9zaXplPTIwMHgyMDAnfSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leWVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZWRpdFwiIHBhcmFtcz17e2lkOiBtb2RlbC5nZXQoXCJpZFwiKX19IGNsYXNzTmFtZT1cImJ0biBidG4tb3JhbmdlXCIgdGl0bGU9XCJFZGl0XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17Um9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmdldChcImlkXCIpKX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IFJlZmx1eCA9IHJlcXVpcmUoXCJyZWZsdXhcIik7XG5sZXQgUmVhY3RSb3V0ZXIgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IHtSb3V0ZUhhbmRsZXJ9ID0gUmVhY3RSb3V0ZXI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSb290ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBSb290O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtMaXN0LCBNYXAsIE9yZGVyZWRNYXB9ID0gcmVxdWlyZShcImltbXV0YWJsZVwiKTtcbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbmxldCBSZWZsdXggPSByZXF1aXJlKFwicmVmbHV4XCIpO1xubGV0IFJlYWN0Um91dGVyPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xubGV0IFJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUm9ib3RTdG9yZSA9IFJlZmx1eC5jcmVhdGVTdG9yZSh7XG4gIC8vIHRoaXMgd2lsbCBzZXQgdXAgbGlzdGVuZXJzIHRvIGFsbCBwdWJsaXNoZXJzIGluIFRvZG9BY3Rpb25zLCB1c2luZyBvbktleW5hbWUgKG9yIGtleW5hbWUpIGFzIGNhbGxiYWNrc1xuICBsaXN0ZW5hYmxlczogW1JvYm90QWN0aW9uc10sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiBPcmRlcmVkTWFwKCk7XG4gIH0sXG5cbiAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgYXQgbWl4aW4gbGV2ZWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJlc2V0U3RhdGUoKTtcbiAgfSxcblxuICByZXNldFN0YXRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRJbml0aWFsU3RhdGUoKSk7XG4gIH0sXG5cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJgc3RhdGVgIGlzIHJlcXVpcmVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9XG4gIH0sXG5cbiAgc2hhcmVTdGF0ZSgpIHtcbiAgICB0aGlzLnRyaWdnZXIodGhpcy5zdGF0ZSk7XG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxvYWRNYW55KCkge1xuICAgIC8vIFRPRE8gY2hlY2sgbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLmluZGV4TG9hZGVkKSB7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nVG8oUm9ib3RBY3Rpb25zLmxvYWRNYW55KTtcbiAgICAgIFJvYm90QWN0aW9ucy5sb2FkTWFueS5wcm9taXNlKEF4aW9zLmdldCgnL2FwaS9yb2JvdHMvJykpO1xuICAgIH1cbiAgfSxcblxuICBsb2FkTWFueUZhaWxlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE1hbnlGYWlsZWRcIiwgcmVzKTtcbiAgICB0aGlzLnJlc2V0U3RhdGUoKTtcbiAgICB0aGlzLmxpc3RlblRvKFJvYm90QWN0aW9ucy5sb2FkTWFueSwgdGhpcy5sb2FkTWFueSk7XG4gIH0sXG5cbiAgbG9hZE1hbnlDb21wbGV0ZWQocmVzKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmxvYWRNYW55Q29tcGxldGVkXCIsIHJlcyk7XG4gICAgbGV0IG1vZGVscyA9IExpc3QocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUoT3JkZXJlZE1hcChbZm9yIChtb2RlbCBvZiBtb2RlbHMpIFttb2RlbC5pZCwgTWFwKG1vZGVsKV1dKSk7XG4gICAgdGhpcy5pbmRleExvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE1hbnksIHRoaXMubG9hZE1hbnkpO1xuICB9LFxuXG4gIGxvYWRPbmUoaWQpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGxvY2FsIHN0b3JhZ2U/IVxuICAgIHRoaXMuc3RvcExpc3RlbmluZ1RvKFJvYm90QWN0aW9ucy5sb2FkT25lKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXMoaWQpKSB7XG4gICAgICB0aGlzLnNoYXJlU3RhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETyBjaGVjayBsb2NhbCBzdG9yYWdlPyFcbiAgICAgIEF4aW9zLmdldChgL2FwaS9yb2JvdHMvJHtpZH1gKVxuICAgICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5sb2FkT25lLmZhaWxlZChyZXMsIGlkKSlcbiAgICAgICAgLnRoZW4ocmVzID0+IFJvYm90QWN0aW9ucy5sb2FkT25lLmNvbXBsZXRlZChyZXMsIGlkKSk7XG4gICAgfVxuICB9LFxuXG4gIGxvYWRPbmVGYWlsZWQocmVzLCBpZCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5sb2FkTWFueUZhaWxlZFwiLCByZXMsIGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBcIk5vdCBGb3VuZFwiKSk7XG4gICAgdGhpcy5saXN0ZW5UbyhSb2JvdEFjdGlvbnMubG9hZE9uZSwgdGhpcy5sb2FkT25lKTtcbiAgfSxcblxuICBsb2FkT25lQ29tcGxldGVkKHJlcywgaWQpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUubG9hZE9uZUNvbXBsZXRlZFwiLCBpZCk7XG4gICAgbGV0IG1vZGVsID0gTWFwKHJlcy5kYXRhKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBtb2RlbCkpO1xuICAgIHRoaXMubGlzdGVuVG8oUm9ib3RBY3Rpb25zLmxvYWRPbmUsIHRoaXMubG9hZE9uZSk7XG4gIH0sXG5cbiAgYWRkKG1vZGVsKSB7XG4gICAgUm9ib3RBY3Rpb25zLmFkZC5wcm9taXNlKEF4aW9zLnBvc3QoYC9hcGkvcm9ib3RzL2AsIG1vZGVsLnRvSlMoKSkpO1xuICB9LFxuXG4gIGFkZEZhaWxlZChyZXMpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUuYWRkRmFpbGVkXCIsIHJlcyk7XG4gIH0sXG5cbiAgYWRkQ29tcGxldGVkKHJlcykge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5hZGRDb21wbGV0ZWRcIiwgcmVzKTtcbiAgICBsZXQgbW9kZWwgPSBNYXAocmVzLmRhdGEpO1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZS5zZXQobW9kZWwuZ2V0KFwiaWRcIiksIG1vZGVsKSk7XG4gIH0sXG5cbiAgZWRpdChtb2RlbCkge1xuICAgIC8vIFRPRE8gdXBkYXRlIGxvY2FsIHN0b3JhZ2U/IVxuICAgIGxldCBpZCA9IG1vZGVsLmdldChcImlkXCIpO1xuICAgIGxldCBvbGRNb2RlbCA9IHRoaXMuc3RhdGUuZ2V0KGlkKTtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUuc2V0KGlkLCBtb2RlbCkpO1xuICAgIEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBtb2RlbC50b0pTKCkpXG4gICAgICAuY2F0Y2gocmVzID0+IFJvYm90QWN0aW9ucy5lZGl0LmZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkpXG4gICAgICAuZG9uZShyZXMgPT4gUm9ib3RBY3Rpb25zLmVkaXQuY29tcGxldGVkKHJlcywgaWQsIG9sZE1vZGVsKSk7XG4gIH0sXG5cbiAgZWRpdEZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkge1xuICAgIC8vY29uc29sZS5lY2hvKFwiUm9ib3RTdG9yZS5lZGl0RmFpbGVkXCIsIHJlcyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICBlZGl0Q29tcGxldGVkKHJlcywgaWQsIG9sZE1vZGVsKSB7XG4gICAgLy9jb25zb2xlLmVjaG8oXCJSb2JvdFN0b3JlLmVkaXRDb21wbGV0ZWRcIiwgcmVzKTtcbiAgfSxcblxuICByZW1vdmUoaWQpIHtcbiAgICAvLyBUT0RPIHVwZGF0ZSBsb2NhbCBzdG9yYWdlPyFcbiAgICBsZXQgb2xkTW9kZWwgPSB0aGlzLnN0YXRlLmdldChpZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLmRlbGV0ZShpZCkpO1xuICAgIEF4aW9zLmRlbGV0ZShgL2FwaS9yb2JvdHMvJHtpZH1gKVxuICAgICAgLmNhdGNoKHJlcyA9PiBSb2JvdEFjdGlvbnMucmVtb3ZlLmZhaWxlZChyZXMsIGlkLCBvbGRNb2RlbCkpXG4gICAgICAuZG9uZShyZXMgPT4gUm9ib3RBY3Rpb25zLnJlbW92ZS5jb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICByZW1vdmVGYWlsZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUucmVtb3ZlRmFpbGVkXCIsIHJlcyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlLnNldChpZCwgb2xkTW9kZWwpKTtcbiAgfSxcblxuICByZW1vdmVDb21wbGV0ZWQocmVzLCBpZCwgb2xkTW9kZWwpIHtcbiAgICAvL2NvbnNvbGUuZWNobyhcIlJvYm90U3RvcmUucmVtb3ZlQ29tcGxldGVkXCIsIHJlcyk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgUm9ib3RTdG9yZTtcbiIsIi8vIFBST1hZIFJPVVRFUiBUTyBTT0xWRSBDSVJDVUxBUiBERVBFTkRFTkNZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlUGF0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgbWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpIHtcbiAgICByZXR1cm4gd2luZG93LnJvdXRlci5tYWtlSHJlZih0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci50cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgd2luZG93LnJvdXRlci5yZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5cbi8vIFJVTEVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCB2YXIgbW9kZWwgPSB7XG4gIG5hbWU6IEpvaS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxuICBhc3NlbWJseURhdGU6IEpvaS5kYXRlKCkubWF4KFwibm93XCIpLnJlcXVpcmVkKCksXG4gIG1hbnVmYWN0dXJlcjogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXG59O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JykgfHwgZmFsc2U7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgYHRvU3RyaW5nVGFnYCBvZiB2YWx1ZXMuXG4gKiBTZWUgdGhlIFtFUyBzcGVjXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpIHx8IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIl19
