(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// IMPORTS =========================================================================================
"use strict";

var React = require("react");

var _require = require("react-router");

var createRouter = _require.create;
var HistoryLocation = _require.HistoryLocation;

require("shared/shims");

var _require2 = require("frontend/common/helpers");

var parseJsonApiQuery = _require2.parseJsonApiQuery;

var routes = require("frontend/routes");
var state = require("frontend/state");

// APP =============================================================================================
window.router = createRouter({
  routes: routes,
  location: HistoryLocation
});

window.router.run(function (Application, url) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  // SET BAOBAB URL DATA ---------------------------------------------------------------------------
  var handler = url.routes.slice(-1)[0].name;
  state.select("url", "handler").set(handler);

  var id = url.params.id;
  if (id) {
    state.select("url", "id").set(id);
  }

  var page = url.params.page && parseInt(url.params.page);
  if (page) {
    state.select("url", "page").set(page);
  }

  var _parseJsonApiQuery = parseJsonApiQuery(url.query);

  var filters = _parseJsonApiQuery.filters;
  var sorts = _parseJsonApiQuery.sorts;

  if (filters) {
    state.select("url", "filters").set(filters);
  }
  if (sorts) {
    state.select("url", "sorts").set(sorts);
  }

  state.commit();
  //------------------------------------------------------------------------------------------------

  var promises = url.routes.map(function (route) {
    return route.handler.original || {};
  }).map(function (original) {
    if (original.loadPage) {
      return original.loadPage(page, filters, sorts);
    } else if (original.loadModel) {
      return original.loadModel(id);
    }
  });

  Promise.all(promises).then(function () {
    React.render(React.createElement(Application, null), document.getElementById("main"));
  });
});

},{"frontend/common/helpers":24,"frontend/routes":40,"frontend/state":41,"react":"react","react-router":"react-router","shared/shims":42}],2:[function(require,module,exports){
'use strict';

module.exports = require('./dist-modules/decorators.js');

},{"./dist-modules/decorators.js":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.root = root;
exports.branch = branch;
/**
 * Baobab-React Decorators
 * ========================
 *
 * ES7 decorators sugar for higher order components.
 */

var _Root$Branch = require('./higher-order.js');

function root(tree) {
  if (typeof tree === 'function') {
    return _Root$Branch.root(tree);
  }return function (target) {
    return _Root$Branch.root(target, tree);
  };
}

function branch(specs) {
  if (typeof specs === 'function') {
    return _Root$Branch.branch(specs);
  }return function (target) {
    return _Root$Branch.branch(target, specs);
  };
}
},{"./higher-order.js":4}],4:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Root component
 */
exports.root = root;

/**
 * Branch component
 */
exports.branch = branch;
/**
 * Baobab-React Higher Order Component
 * ====================================
 *
 * ES6 higher order component to enchance one's component.
 */

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _type = require('./utils/type.js');

var _type2 = _interopRequireWildcard(_type);

var _PropTypes = require('./utils/prop-types.js');

var _PropTypes2 = _interopRequireWildcard(_PropTypes);

function root(Component, tree) {
  if (!_type2['default'].Baobab(tree)) throw Error('baobab-react:higher-order.root: given tree is not a Baobab.');

  var ComposedComponent = (function (_React$Component) {
    var _class = function ComposedComponent() {
      _classCallCheck(this, _class);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    };

    _inherits(_class, _React$Component);

    _createClass(_class, [{
      key: 'getChildContext',

      // Handling child context
      value: function getChildContext() {
        return {
          tree: tree
        };
      }
    }, {
      key: 'render',

      // Render shim
      value: function render() {
        return _React2['default'].createElement(Component, this.props);
      }
    }], [{
      key: 'original',
      value: Component,
      enumerable: true
    }, {
      key: 'childContextTypes',
      value: {
        tree: _PropTypes2['default'].baobab
      },
      enumerable: true
    }]);

    return _class;
  })(_React2['default'].Component);

  return ComposedComponent;
}

function branch(Component) {
  var specs = arguments[1] === undefined ? {} : arguments[1];

  if (!_type2['default'].Object(specs)) throw Error('baobab-react.higher-order: invalid specifications ' + '(should be an object with cursors and/or facets key).');

  var ComposedComponent = (function (_React$Component2) {
    var _class2 =

    // Building initial state
    function ComposedComponent(props, context) {
      _classCallCheck(this, _class2);

      _get(Object.getPrototypeOf(_class2.prototype), 'constructor', this).call(this, props, context);

      var facet = context.tree.createFacet(specs, this);

      if (facet) this.state = facet.get();

      this.facet = facet;
    };

    _inherits(_class2, _React$Component2);

    _createClass(_class2, [{
      key: 'getChildContext',

      // Child context
      value: function getChildContext() {
        return {
          cursors: this.facet.cursors
        };
      }
    }, {
      key: 'componentDidMount',

      // On component mount
      value: function componentDidMount() {
        if (!this.facet) {
          return;
        }var handler = (function () {
          this.setState(this.facet.get());
        }).bind(this);

        this.facet.on('update', handler);
      }
    }, {
      key: 'render',

      // Render shim
      value: function render() {
        return _React2['default'].createElement(Component, _extends({}, this.props, this.state));
      }
    }, {
      key: 'componentWillUnmount',

      // On component unmount
      value: function componentWillUnmount() {
        if (!this.facet) {
          return;
        } // Releasing facet
        this.facet.release();
        this.facet = null;
      }
    }], [{
      key: 'original',
      value: Component,
      enumerable: true
    }, {
      key: 'contextTypes',
      value: {
        tree: _PropTypes2['default'].baobab
      },
      enumerable: true
    }, {
      key: 'childContextTypes',
      value: {
        cursors: _PropTypes2['default'].cursors
      },
      enumerable: true
    }]);

    return _class2;
  })(_React2['default'].Component);

  return ComposedComponent;
}
},{"./utils/prop-types.js":5,"./utils/type.js":6,"react":"react"}],5:[function(require,module,exports){
/**
 * Baobab-React Custom Prop Types
 * ===============================
 *
 * PropTypes used to propagate context safely.
 */
'use strict';

var type = require('./type.js');

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

var PropTypes = {};

PropTypes.baobab = function (props, propName) {
  if (!type.Baobab(props[propName])) return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursors = function (props, propName) {
  var p = props[propName];

  var valid = type.Object(p) && Object.keys(p).every(function (k) {
    return type.Cursor(p[k]);
  });

  if (!valid) return new Error(errorMessage(propName, 'Baobab cursors'));
};

module.exports = PropTypes;
},{"./type.js":6}],6:[function(require,module,exports){
/**
 * Baobab-React Type Checking
 * ===========================
 *
 * Some helpers to perform runtime validations.
 */
'use strict';

var type = {};

type.Object = function (value) {
  return value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Function);
};

type.Baobab = function (value) {
  return value && typeof value.toString === 'function' && value.toString() === '[object Baobab]';
};

type.Cursor = function (value) {
  return value && typeof value.toString === 'function' && value.toString() === '[object Cursor]';
};

module.exports = type;
},{}],7:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alertAdd = require("./actions/alert-add");

var _alertAdd2 = _interopRequireWildcard(_alertAdd);

var _alertLoadPage = require("./actions/alert-load-page");

var _alertLoadPage2 = _interopRequireWildcard(_alertLoadPage);

var _alertLoadModel = require("./actions/alert-load-model");

var _alertLoadModel2 = _interopRequireWildcard(_alertLoadModel);

var _alertRemove = require("./actions/alert-remove");

var _alertRemove2 = _interopRequireWildcard(_alertRemove);

exports["default"] = {
  alert: {
    add: _alertAdd2["default"],
    loadPage: _alertLoadPage2["default"],
    loadModel: _alertLoadModel2["default"],
    remove: _alertRemove2["default"] } };
module.exports = exports["default"];

},{"./actions/alert-add":8,"./actions/alert-load-model":9,"./actions/alert-load-page":10,"./actions/alert-remove":11}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================

var _require = require("frontend/common/models");

var Alert = _require.Alert;

var state = require("frontend/state");
function add(model) {
  var newModel = Alert(model);
  var id = newModel.id;
  var apiURL = "/api/alerts/" + id;

  // Nonpersistent add
  state.select("alerts", "models", id).set(newModel);
}

module.exports = exports["default"];

},{"frontend/common/models":25,"frontend/state":41}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports.fetchModel = fetchModel;
exports["default"] = loadModel;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var state = require("frontend/state");
function fetchModel(id) {
  var apiURL = "/api/alerts/" + id;

  // Mock API request
  state.select("robots", "loading").set(false);
  return Promise.resolve(200); // HTTP response.status
}

function loadModel(id) {
  var model = state.select("alerts", "models").get(id);
  if (model) {
    return model;
  } else {
    return fetchModel(id);
  }
}

},{"axios":"axios","frontend/common/helpers":24,"frontend/state":41}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports.fetchPage = fetchPage;
exports["default"] = loadPage;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;
var formatJsonApiQuery = _require.formatJsonApiQuery;

var state = require("frontend/state");
function fetchPage(page, perpage, filters, sorts) {
  // Mock API request
  var apiURL = "api/alerts";
  var params = formatJsonApiQuery(page, perpage, filters, sorts);
  state.select("alerts").merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {} });
  return Promise.resolve(200); // HTTP response.status
}

function loadPage(page, filters, sorts) {
  var pagination = state.select("alerts", "pagination").get();
  var perpage = state.select("alerts", "perpage").get();
  var ids = pagination[page];
  if (!ids) {
    return fetchPage(page, perpage, filters, sorts);
  }
}

},{"axios":"axios","frontend/common/helpers":24,"frontend/state":41}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================
var state = require("frontend/state");
function remove(id) {
  var apiURL = "/api/alerts/" + id;

  // Non-persistent remove
  state.select("alerts", "models").unset(id);
}

module.exports = exports["default"];

},{"frontend/state":41}],12:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");

// HELPERS =========================================================================================
function getAllMethods(obj) {
  return Object.getOwnPropertyNames(obj).filter(function (key) {
    return typeof obj[key] == "function";
  });
}

function autoBind(obj) {
  getAllMethods(obj.constructor.prototype).forEach(function (mtd) {
    obj[mtd] = obj[mtd].bind(obj);
  });
}

var Component = (function (_React$Component) {
  function Component(props) {
    _classCallCheck(this, Component);

    _get(Object.getPrototypeOf(Component.prototype), "constructor", this).call(this, props);
    autoBind(this);
  }

  _inherits(Component, _React$Component);

  return Component;
})(React.Component);

exports["default"] = Component;
module.exports = exports["default"];

},{"react":"react"}],13:[function(require,module,exports){
"use strict";

module.exports.About = require("./components/about");
module.exports.Body = require("./components/body");
module.exports.Error = require("./components/error");
module.exports.Headroom = require("./components/headroom");
module.exports.Home = require("./components/home");
module.exports.Loading = require("./components/loading");
module.exports.NotFound = require("./components/not-found");
module.exports.Pagination = require("./components/pagination");

},{"./components/about":14,"./components/body":17,"./components/error":18,"./components/headroom":19,"./components/home":20,"./components/loading":21,"./components/not-found":22,"./components/pagination":23}],14:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var About = (function (_Component) {
  function About() {
    _classCallCheck(this, About);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(About, _Component);

  _createClass(About, [{
    key: "render",
    value: function render() {
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
  }]);

  return About;
})(Component);

exports["default"] = About;
module.exports = exports["default"];

},{"frontend/common/component":12,"react":"react","react-document-title":"react-document-title"}],15:[function(require,module,exports){
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
var NotFound = require("frontend/common/components/not-found");
var AlertItem = require("frontend/common/components/alert-item");
var state = require("frontend/state");

// COMPONENTS ======================================================================================
exports["default"] = React.createClass({
  displayName: "alert-index",

  mixins: [state.mixin],

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

// Can't run this crap for now TODO recheck after transition to Webpack
// 1) react/addons pulls whole new react clone in browserify
// 2) rc-css-transition-group contains uncompiled JSX syntax
// OMG what an idiots &_&

//<CSSTransitionGroup transitionName="fade" component="div">
//  {models.map(model => <AlertItem model={model} key={model.id}/>)}
//</CSSTransitionGroup>
module.exports = exports["default"];

},{"frontend/common/components/alert-item":16,"frontend/common/components/loading":21,"frontend/common/components/not-found":22,"frontend/common/helpers":24,"frontend/state":41,"react":"react"}],16:[function(require,module,exports){
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

var commonActions = require("frontend/common/actions");

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
      model.closable ? React.createElement(CloseLink, { onClick: commonActions.alert.remove.bind(this, model.id) }) : "",
      model.message
    );

    if (model.expire) {
      result = React.createElement(
        Expire,
        { onExpire: commonActions.alert.remove.bind(this, model.id), delay: model.expire },
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

},{"classnames":"classnames","frontend/common/actions":7,"react":"react","react-router":"react-router"}],17:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _require = require("baobab-react/decorators");

var root = _require.root;

var React = require("react");

var _require2 = require("react-router");

var Link = _require2.Link;
var RouteHandler = _require2.RouteHandler;

var Component = require("frontend/common/component");
var commonActions = require("frontend/common/actions");
var Headroom = require("frontend/common/components/headroom");
var AlertIndex = require("frontend/common/components/alert-index");
var state = require("frontend/state");

// EXPORTS =========================================================================================

var Body = (function (_Component) {
  function Body() {
    _classCallCheck(this, _Body);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Body, _Component);

  var _Body = Body;

  _createClass(_Body, [{
    key: "render",
    value: function render() {
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
                    { to: "robot-index", params: { page: 1 } },
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
        )
      );
    }
  }], [{
    key: "loadData",
    value: function loadData(params, query) {
      // Ignore params and query
      return commonActions.alert.loadPage();
    }
  }]);

  Body = root(state)(Body) || Body;
  return Body;
})(Component);

exports["default"] = Body;
module.exports = exports["default"];
/*<AlertIndex/>*/

},{"baobab-react/decorators":2,"frontend/common/actions":7,"frontend/common/component":12,"frontend/common/components/alert-index":15,"frontend/common/components/headroom":19,"frontend/state":41,"react":"react","react-router":"react-router"}],18:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Class = require("classnames");
var React = require("react");
var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var Error = (function (_Component) {
  function Error() {
    _classCallCheck(this, Error);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Error, _Component);

  _createClass(Error, [{
    key: "getDefaultProps",
    value: function getDefaultProps() {
      return {
        size: "md" };
    }
  }, {
    key: "render",
    value: function render() {
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
  }], [{
    key: "propTypes",
    value: {
      loadError: React.PropTypes.object.isRequired,
      size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]) },
    enumerable: true
  }]);

  return Error;
})(Component);

exports["default"] = Error;
module.exports = exports["default"];

},{"classnames":"classnames","frontend/common/component":12,"react":"react","react-document-title":"react-document-title"}],19:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var throttle = require("lodash.throttle");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var Headroom = (function (_Component) {
  function Headroom() {
    _classCallCheck(this, Headroom);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }

    this.state = {
      className: ""
    };
  }

  _inherits(Headroom, _Component);

  _createClass(Headroom, [{
    key: "state",
    value: undefined,
    enumerable: true
  }, {
    key: "hasScrolled",
    value: function hasScrolled() {
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
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // Init options
      this.deltaHeight = this.props.deltaHeight ? this.props.deltaHeight : 5;
      this.delay = this.props.delay ? this.props.delay : 250;
      this.lastScrollTop = 0;
      this.elementHeight = document.getElementById(this.props.id).offsetHeight;

      // Add event handler on scroll
      window.addEventListener("scroll", throttle(this.hasScrolled, this.delay), false);

      // Update component"s className
      this.setState({ className: this.props.headroomClassNames.visible });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("scroll", this.hasScrolled, false);
    }
  }, {
    key: "render",
    value: function render() {
      var component = this.props.component;
      var props = { id: this.props.id, className: this.props.className + " " + this.state.className };
      return React.createElement(component, props, this.props.children);
    }
  }], [{
    key: "propTypes",
    value: {
      component: React.PropTypes.string,
      headroomClassNames: React.PropTypes.object },
    enumerable: true
  }, {
    key: "defaultProps",
    value: {
      component: "div",
      headroomClassNames: {
        visible: "navbar-down",
        hidden: "navbar-up"
      } },
    enumerable: true
  }]);

  return Headroom;
})(Component);

exports["default"] = Headroom;
module.exports = exports["default"];

},{"frontend/common/component":12,"lodash.throttle":"lodash.throttle","react":"react"}],20:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var Home = (function (_Component) {
  function Home() {
    _classCallCheck(this, Home);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Home, _Component);

  _createClass(Home, [{
    key: "render",
    value: function render() {
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
  }]);

  return Home;
})(Component);

exports["default"] = Home;
module.exports = exports["default"];

},{"frontend/common/component":12,"react":"react","react-document-title":"react-document-title"}],21:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var Loading = (function (_Component) {
  function Loading() {
    _classCallCheck(this, Loading);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Loading, _Component);

  _createClass(Loading, [{
    key: "render",
    value: function render() {
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
  }]);

  return Loading;
})(Component);

exports["default"] = Loading;
module.exports = exports["default"];

},{"frontend/common/component":12,"react":"react","react-document-title":"react-document-title"}],22:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");
var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var NotFound = (function (_Component) {
  function NotFound() {
    _classCallCheck(this, NotFound);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(NotFound, _Component);

  _createClass(NotFound, [{
    key: "render",
    value: function render() {
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
  }]);

  return NotFound;
})(Component);

exports["default"] = NotFound;
module.exports = exports["default"];

},{"frontend/common/component":12,"react":"react","react-document-title":"react-document-title"}],23:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Class = require("classnames");
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var Component = require("frontend/common/component");

// EXPORTS =========================================================================================

var Pagination = (function (_Component) {
  function Pagination() {
    _classCallCheck(this, Pagination);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Pagination, _Component);

  _createClass(Pagination, [{
    key: "totalPages",
    value: function totalPages() {
      return Math.ceil(this.props.total / this.props.perpage);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var page = this.props.page;
      var totalPages = this.totalPages();
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
              Link,
              { to: this.props.endpoint,
                params: page == 1 ? { page: 1 } : { page: page - 1 },
                className: Class({ btn: true, disabled: page == 1 }),
                title: "To page " + (page == 1 ? 1 : page - 1) },
              React.createElement(
                "span",
                null,
                "«"
              )
            )
          ),
          Array.range(1, this.totalPages() + 1).map(function (p) {
            return React.createElement(
              "li",
              { key: p },
              React.createElement(
                Link,
                { to: _this.props.endpoint,
                  params: { page: p },
                  className: Class({ btn: true, disabled: p == page }),
                  title: "To page " + p },
                p
              )
            );
          }),
          React.createElement(
            "li",
            null,
            React.createElement(
              Link,
              { to: this.props.endpoint,
                params: page == totalPages ? { page: totalPages } : { page: page + 1 },
                className: Class({ btn: true, disabled: page == totalPages }),
                title: "To page " + (page == totalPages ? totalPages : page + 1) },
              React.createElement(
                "span",
                null,
                "»"
              )
            )
          )
        )
      );
    }
  }], [{
    key: "propTypes",
    value: {
      endpoint: React.PropTypes.string.isRequired,
      total: React.PropTypes.number.isRequired,
      page: React.PropTypes.number.isRequired,
      perpage: React.PropTypes.number.isRequired },
    enumerable: true
  }]);

  return Pagination;
})(Component);

exports["default"] = Pagination;
module.exports = exports["default"];
/*Total: {this.props.total}<br/>*/ /*Perpage: {this.props.perpage}<br/>*/ /*TotalPages: {this.totalPages()}<br/>*/

},{"classnames":"classnames","frontend/common/component":12,"react":"react","react-router":"react-router"}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// HELPERS =========================================================================================
exports.toObject = toObject;
exports.toArray = toArray;
exports.parseJsonApiQuery = parseJsonApiQuery;
exports.formatJsonApiQuery = formatJsonApiQuery;
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

function parseJsonApiQuery(query) {
  return {
    filters: query.filter,
    sorts: query.sort ? query.sort.split(",").map(function (v) {
      return v.replace(/^ /, "+");
    }) : undefined
  };
}

function formatJsonApiQuery(page, perpage, filters, sorts) {
  var pageObj = undefined,
      filterObj = undefined,
      sortObj = undefined;
  if (page && perpage) {
    pageObj = {
      "page[offset]": (page > 1 ? page - 1 : 0) * perpage,
      "page[limit]": perpage };
  }
  if (filters) {
    filterObj = Object.keys(filters).reduce(function (filterObj, key) {
      filterObj["filter[" + key + "]"] = filters[key];
      return filterObj;
    }, {});
  }
  if (sorts) {
    sortObj = {
      sort: sorts.join(",") };
  }
  return Object.assign({}, pageObj, filterObj, sortObj);
}

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],25:[function(require,module,exports){
"use strict";

module.exports.Alert = require("./models/alert");

},{"./models/alert":26}],26:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
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

},{}],28:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _add = require("./actions/add");

var _add2 = _interopRequireWildcard(_add);

var _edit = require("./actions/edit");

var _edit2 = _interopRequireWildcard(_edit);

var _loadPage = require("./actions/load-page");

var _loadPage2 = _interopRequireWildcard(_loadPage);

var _loadModel = require("./actions/load-model");

var _loadModel2 = _interopRequireWildcard(_loadModel);

var _remove = require("./actions/remove");

var _remove2 = _interopRequireWildcard(_remove);

exports["default"] = {
  add: _add2["default"], edit: _edit2["default"], loadPage: _loadPage2["default"], loadModel: _loadModel2["default"], remove: _remove2["default"]
};
module.exports = exports["default"];

},{"./actions/add":29,"./actions/edit":30,"./actions/load-model":31,"./actions/load-page":32,"./actions/remove":33}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================
var Axios = require("axios");

var router = require("frontend/common/router");
var commonActions = require("frontend/common/actions");
var Robot = require("frontend/robot/models");
var state = require("frontend/state");
function add(model) {
  var newModel = Robot(model);
  var id = newModel.id;
  var apiURL = "/api/robots/" + id;

  // Optimistic add
  state.select("robots", "loading").set(true);
  state.select("robots", "models", id).set(newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    state.select("robots").merge({ loading: false, loadError: undefined });
    commonActions.alert.add({ message: "Action `Robot.add` succeed", category: "success" });
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
      state.select("robots").merge({ loading: false, loadError: loadError });
      state.select("robots", "models").unset(id); // Cancel add
      commonActions.alert.add({ message: "Action `Robot.add` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  }).done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic add
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":27,"frontend/robot/models":39,"frontend/state":41}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = edit;
// IMPORTS =========================================================================================
var Axios = require("axios");

var router = require("frontend/common/router");
var commonActions = require("frontend/common/actions");
var Robot = require("frontend/robot/models");
var state = require("frontend/state");
function edit(model) {
  var newModel = Robot(model);
  var id = newModel.id;
  var oldModel = state.select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic edit
  state.select("robots", "loading").set(true);
  state.select("robots", "models", id).set(newModel);

  return Axios.put(apiURL, newModel).then(function (response) {
    state.select("robots").merge({
      loading: false,
      loadError: undefined });
    commonActions.alert.add({ message: "Action `Robot.edit` succeed", category: "success" });
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
      state.select("robots").merge({ loading: false, loadError: loadError });
      state.select("robots", "models", id).set(oldModel); // Cancel edit
      commonActions.alert.add({ message: "Action `Robot.edit` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  }).done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic edit
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":27,"frontend/robot/models":39,"frontend/state":41}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports.fetchModel = fetchModel;
exports["default"] = loadModel;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;

var commonActions = require("frontend/common/actions");
var state = require("frontend/state");
function fetchModel(id) {
  var apiURL = "/api/robots/" + id;

  state.select("robots", "loading").set(true);
  return Axios.get(apiURL).then(function (response) {
    var _response$data = response.data;
    var data = _response$data.data;
    var meta = _response$data.meta;

    var model = data;

    // BUG, NOT WORKING ==========================================================================
    // TRACK: https://github.com/Yomguithereal/baobab/issues/190
    //        https://github.com/Yomguithereal/baobab/issues/194
    //state.select("robots").merge({
    //  loading: false,
    //  loadError: undefined,
    //});
    //state.select("robots", "models", model.id).set(model);
    // ===========================================================================================
    // WORKAROUND:
    state.select("robots").apply(function (robots) {
      var models = Object.assign({}, robots.models);
      models[model.id] = model;
      return Object.assign({}, robots, {
        loading: false,
        loadError: undefined,
        models: models });
    });
    // ===========================================================================================

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
      state.select("robots").merge({ loading: false, loadError: loadError });
      commonActions.alert.add({ message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  }).done();
}

function loadModel(id) {
  var model = state.select("robots", "models").get(id);
  if (model) {
    return model;
  } else {
    return fetchModel(id);
  }
}

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":24,"frontend/state":41}],32:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports.fetchPage = fetchPage;
exports["default"] = loadPage;
// IMPORTS =========================================================================================
var Axios = require("axios");

var _require = require("frontend/common/helpers");

var toObject = _require.toObject;
var formatJsonApiQuery = _require.formatJsonApiQuery;

var commonActions = require("frontend/common/actions");
var state = require("frontend/state");
function fetchPage(page, perpage, filters, sorts) {
  var apiURL = "/api/robots/";
  var params = formatJsonApiQuery(page, perpage, filters, sorts);
  state.select("robots", "loading").set(true);
  return Axios.get(apiURL, { params: params }).then(function (response) {
    // Current state
    var models = state.select("robots", "models").get();
    var pagination = state.select("robots", "pagination").get();

    // New data
    var _response$data = response.data;
    var data = _response$data.data;
    var meta = _response$data.meta;

    var fetchedModels = toObject(data);

    // Update state
    state.select("robots").merge({
      total: meta.page && meta.page.total || Object.keys(models).length,
      models: Object.assign(models, fetchedModels),
      pagination: Object.assign(pagination, _defineProperty({}, page, Object.keys(fetchedModels))),
      loading: false,
      loadError: false
    });

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
      state.select("robots").merge({ loading: false, loadError: loadError });
      state.commit(); // God, this is required just about everwhere! :(
      commonActions.alert.add({ message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error" });
      return response.status;
    }
  }).done();
}

function loadPage(page, filters, sorts) {
  var pagination = state.select("robots", "pagination").get();
  var perpage = state.select("robots", "perpage").get();
  var ids = pagination[page];
  if (!ids) {
    console.debug("Robots: fetch page", page);
    return fetchPage(page, perpage, filters, sorts);
  }
}

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":24,"frontend/state":41}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================
var Axios = require("axios");

var router = require("frontend/common/router");
var commonActions = require("frontend/common/actions");
var state = require("frontend/state");
function remove(id) {
  var oldModel = state.select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic remove
  state.select("robots", "loading").set(true);
  state.select("robots", "models").unset(id);

  return Axios["delete"](apiURL).then(function (response) {
    state.select("robots").merge({
      loading: false,
      loadError: loadError });
    router.transitionTo("robot-index");
    commonActions.alert.add({ message: "Action `Robot.remove` succeed", category: "success" });
    return response.status;
  })["catch"](function (response) {
    if (response instanceof Error) {
      throw response;
    } else {
      var _loadError = {
        status: response.status,
        description: response.statusText,
        url: apiURL
      };
      state.select("robots").merge({ loading: false, loadError: _loadError });
      state.select("robots", "models", id).set(oldModel); // Cancel remove
      commonActions.alert.add({ message: "Action `Robot.remove` failed: " + _loadError.description, category: "error" });
      return response.status;
    }
  }).done();

  /* Async-Await style. Wait for proper IDE support
  // Optimistic remove
  ...
   let response = {data: []};
  try {
    response = await Axios.put(`/api/robots/${id}`, newModel);
  } catch (response) {
    ...
  } // else
    ...
  */
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":27,"frontend/state":41}],34:[function(require,module,exports){
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

var _require = require("react-router");

var Link = _require.Link;

var DocumentTitle = require("react-document-title");

//let Validators = require("shared/robot/validators");

var _require2 = require("frontend/common/components");

var Error = _require2.Error;
var Loading = _require2.Loading;
var NotFound = _require2.NotFound;

var robotActions = require("frontend/robot/actions");
var state = require("frontend/state");

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

  //mixins: [--ReactRouter.State--, state.mixin],

  //cursors() {
  //  return {
  //    robots: ["robots"],
  //  }
  //},

  render: function render() {
    return React.createElement(
      "div",
      null,
      "Add"
    );
    //let {models, loading, loadError} = this.state.cursors.robots;
    //return (
    //  <Form models={models} loading={loading} loadError={loadError}/>
    //);
  }
});

//let Form = React.createClass({
//  getInitialState() {
//    return {
//      model: {
//        name: undefined,
//        assemblyDate: undefined,
//        manufacturer: undefined,
//      },
//    }
//  },
//
//  //validatorTypes() {
//  //  return Validators.model;
//  //},
//
//  //validatorData() {
//  //  return this.state.model;
//  //},
//
//  validate: function (key) {
//    //let schema = result(this, "validatorTypes") || {};
//    //let data = result(this, "validatorData") || this.state;
//    //let nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
//    //  return isArray(b) ? b : undefined;
//    //});
//    //return new Promise((resolve, reject) => {
//    //  this.setState({
//    //    errors: nextErrors
//    //  }, () => resolve(this.isValid(key)));
//    //});
//  },
//
//  handleChangeFor: function (key) {
//    //return function handleChange(event) {
//    //  event.persist();
//    //  let model = this.state.model;
//    //  model[key] = event.currentTarget.value;
//    //  this.setState({model: model});
//    //  this.validateDebounced(key);
//    //}.bind(this);
//  },
//
//  validateDebounced: debounce(function validateDebounced(key) {
//    //return this.validate(key);
//  }, 500),
//
//  handleReset(event) {
//    event.preventDefault();
//    event.persist();
//    this.setState({
//      model: Object.assign({}, this.getInitialState().model),
//    });
//  },
//
//  handleSubmit(event) {
//    event.preventDefault();
//    event.persist();
//    this.validate().then(isValid => {
//      if (isValid) {
//        // TODO replace with React.findDOMNode at #0.13.0
//        robotActions.add({
//          name: this.refs.name.getDOMNode().value,
//          assemblyDate: this.refs.assemblyDate.getDOMNode().value,
//          manufacturer: this.refs.manufacturer.getDOMNode().value,
//        });
//      } else {
//        alert("Can't submit form with errors");
//      }
//    });
//  },
//
//  getValidationMessages: function (key) {
//    let errors = this.state.errors || {};
//    if (isEmpty(errors)) {
//      return [];
//    } else {
//      if (key === undefined) {
//        return flatten(Object.keys(errors).map(function (error) {
//          return errors[error] || [];
//        }));
//      } else {
//        return errors[key] || [];
//      }
//    }
//  },
//
//  isValid: function (key) {
//    return isEmpty(this.getValidationMessages(key));
//  },
//
//  render() {
//    let {models, loading, loadError} = this.props;
//    let model = this.state.model;
//
//    if (loading) {
//      return <Loading/>;
//    } else if (loadError) {
//      return <Error loadError={loadError}/>;
//    } else {
//      return (
//        <DocumentTitle title={"Add Robot"}>
//          <div>
//            <div id="page-actions">
//              <div className="container">
//                <div className="btn-group btn-group-sm pull-left">
//                  <Link to="robot-index" params={{page: 1}} className="btn btn-gray-light" title="Back to list">
//                    <span className="fa fa-arrow-left"></span>
//                    <span className="hidden-xs margin-left-sm">Back to list</span>
//                  </Link>
//                </div>
//              </div>
//            </div>
//            <section className="container margin-top-lg">
//              <div className="row">
//                <div className="col-xs-12 col-sm-9">
//                  <h1 className="nomargin-top">Add Robot</h1>
//                  <form onSubmit={this.handleSubmit}>
//                    <fieldset>
//                      <div className={Class({
//                        "form-group": true,
//                        "required": (this.validatorTypes().name._flags.presence == "required"),
//                        "error": !this.isValid("name"),
//                      })}>
//                        <label htmlFor="name">Name</label>
//                        <input type="text" onBlur={this.validate.bind(this, "name")} onChange={this.handleChangeFor("name")} className="form-control" id="name" ref="name" value={model.name}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("name"),
//                        })}>
//                          {this.getValidationMessages("name").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                        "required": (this.validatorTypes().assemblyDate._flags.presence == "required"),
//                        "error": !this.isValid("assemblyDate")
//                      })}>
//                        <label htmlFor="assemblyDate">Assembly Date</label>
//                        <input type="text" onBlur={this.validate.bind(this, "assemblyDate")} onChange={this.handleChangeFor("assemblyDate")} className="form-control" id="assemblyDate" ref="assemblyDate" value={model.assemblyDate}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("assemblyDate"),
//                        })}>
//                          {this.getValidationMessages("assemblyDate").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                        "required": (this.validatorTypes().manufacturer._flags.presence == "required"),
//                        "error": !this.isValid("manufacturer")
//                      })}>
//                        <label htmlFor="manufacturer">Manufacturer</label>
//                        <input type="text" onBlur={this.validate.bind(this, "manufacturer")} onChange={this.handleChangeFor("manufacturer")} className="form-control" id="manufacturer" ref="manufacturer" value={model.manufacturer}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("manufacturer"),
//                        })}>
//                          {this.getValidationMessages("manufacturer").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//                    </fieldset>
//                    <div className="btn-group">
//                      <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
//                      <button className="btn btn-primary" disabled={!this.isValid()} type="submit">Submit</button>
//                    </div>
//                  </form>
//                </div>
//              </div>
//            </section>
//          </div>
//        </DocumentTitle>
//      );
//    }
//  }
//});

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/
module.exports = exports["default"];

},{"classnames":"classnames","frontend/common/components":13,"frontend/robot/actions":28,"frontend/state":41,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],35:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _require = require("baobab-react/decorators");

var branch = _require.branch;

var React = require("react");

var _require2 = require("react-router");

var Link = _require2.Link;

var DocumentTitle = require("react-document-title");

var Component = require("frontend/common/component");

var _require3 = require("frontend/common/components");

var Error = _require3.Error;
var Loading = _require3.Loading;
var NotFound = _require3.NotFound;

var robotActions = require("frontend/robot/actions");
var state = require("frontend/state");

// COMPONENTS ======================================================================================

var RobotDetail = (function (_Component) {
  function RobotDetail() {
    _classCallCheck(this, _RobotDetail);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(RobotDetail, _Component);

  var _RobotDetail = RobotDetail;

  _createClass(_RobotDetail, [{
    key: "render",
    value: function render() {
      //console.log("this.props.robots", this.props.robots);
      var _props$robots = this.props.robots;
      var loading = _props$robots.loading;
      var loadError = _props$robots.loadError;

      var model = this.props.model;

      if (loading) {
        return React.createElement(Loading, null);
      } else if (loadError) {
        return React.createElement(Error, { loadError: loadError });
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
                    { to: "robot-index", params: { page: 1 }, className: "btn btn-gray-light", title: "Back to list" },
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
                    { className: "btn btn-red", title: "Remove", onClick: robotActions.remove.bind(this, model.id) },
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
    }
  }], [{
    key: "contextTypes",
    value: {
      router: React.PropTypes.func.isRequired },
    enumerable: true
  }, {
    key: "loadModel",
    value: robotActions.loadModel,
    enumerable: true
  }]);

  RobotDetail = branch({
    cursors: {
      robots: "robots" },
    facets: {
      model: "currentRobot" } })(RobotDetail) || RobotDetail;
  return RobotDetail;
})(Component);

exports["default"] = RobotDetail;
module.exports = exports["default"];

},{"baobab-react/decorators":2,"frontend/common/component":12,"frontend/common/components":13,"frontend/robot/actions":28,"frontend/state":41,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],36:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

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

var _require = require("react-router");

var Link = _require.Link;

var DocumentTitle = require("react-document-title");

//let Validators = require("shared/robot/validators");
var Component = require("frontend/common/component");

var _require2 = require("frontend/common/components");

var Error = _require2.Error;
var Loading = _require2.Loading;
var NotFound = _require2.NotFound;

var robotActions = require("frontend/robot/actions");
var state = require("frontend/state");

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

var RobotEdit = (function (_Component) {
  function RobotEdit() {
    _classCallCheck(this, RobotEdit);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(RobotEdit, _Component);

  _createClass(RobotEdit, [{
    key: "render",

    //mixins: [--ReactRouter.State--, state.mixin],

    //cursors() {
    //  return {
    //    robots: ["robots"],
    //    loadModel: ["robots", "models", this.getParams().id],
    //  }
    //},

    value: function render() {
      return React.createElement(
        "div",
        null,
        "Edit"
      );
      //let {models, loading, loadError} = this.state.cursors.robots;
      //let loadModel = this.state.cursors.loadModel;
      //return (
      //  <Form models={models} loading={loading} loadError={loadError} loadModel={loadModel}/>
      //);
    }
  }], [{
    key: "loadModel",
    value: robotActions.loadModel,
    enumerable: true
  }]);

  return RobotEdit;
})(Component);

exports["default"] = RobotEdit;
module.exports = exports["default"];

//let Form = React.createClass({
//  getInitialState() {
//    return {
//      model: Object.assign({}, this.props.loadModel),
//    }
//  },
//
//  componentWillReceiveProps(props) {
//    if (isEmpty(this.state.model)) {
//      this.setState({
//        model: Object.assign({}, props.loadModel),
//      })
//    }
//  },
//
//  validatorTypes() {
//    return {};
//    //return Validators.model;
//  },
//
//  validatorData() {
//    return {};
//  //  return this.state.model;
//  },
//
//  validate: function (key) {
//    //let schema = result(this, "validatorTypes") || {};
//    //let data = result(this, "validatorData") || this.state;
//    //let nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
//    //  return isArray(b) ? b : undefined;
//    //});
//    //return new Promise((resolve, reject) => {
//    //  this.setState({
//    //    errors: nextErrors
//    //  }, () => resolve(this.isValid(key)));
//    //});
//  },
//
//  handleChangeFor: function (key) {
//    return function handleChange(event) {
//      event.persist();
//      let model = this.state.model;
//      model[key] = event.currentTarget.value;
//      this.setState({model: model});
//    //  this.validateDebounced(key);
//    }.bind(this);
//  },
//
//  validateDebounced: debounce(function validateDebounced(key) {
//    return this.validate(key);
//  }, 500),
//
//  handleReset(event) {
//    event.preventDefault();
//    event.persist();
//    this.setState({
//      model: Object.assign({}, this.props.loadModel),
//    }, this.validate);
//  },
//
//  handleSubmit(event) {
//    event.preventDefault();
//    event.persist();
//    this.validate().then(isValid => {
//      if (isValid) {
//        // TODO replace with React.findDOMNode at #0.13.0
//        robotActions.edit({
//          id: this.state.model.id,
//          name: this.refs.name.getDOMNode().value,
//          assemblyDate: this.refs.assemblyDate.getDOMNode().value,
//          manufacturer: this.refs.manufacturer.getDOMNode().value,
//        });
//      } else {
//        alert("Can't submit form with errors");
//      }
//    });
//  },
//
//  getValidationMessages: function (key) {
//    let errors = this.state.errors || {};
//    if (isEmpty(errors)) {
//      return [];
//    } else {
//      if (key === undefined) {
//        return flatten(Object.keys(errors).map(function (error) {
//          return errors[error] || [];
//        }));
//      } else {
//        return errors[key] || [];
//      }
//    }
//  },
//
//  isValid: function (key) {
//    return true;
//    //return isEmpty(this.getValidationMessages(key));
//  },
//
//  render() {
//    let {models, loading, loadError, loadModel} = this.props;
//    let model = this.state.model;
//
//    if (loading) {
//      return <Loading/>;
//    } else if (loadError) {
//      return <Error loadError={loadError}/>;
//    } else {
//      return (
//        <DocumentTitle title={"Edit " + model.name}>
//          <div>
//            <div id="page-actions">
//              <div className="container">
//                <div className="btn-group btn-group-sm pull-left">
//                  <Link to="robot-index" params={{page: 1}} className="btn btn-gray-light" title="Back to list">
//                    <span className="fa fa-arrow-left"></span>
//                    <span className="hidden-xs margin-left-sm">Back to list</span>
//                  </Link>
//                </div>
//                <div className="btn-group btn-group-sm pull-right">
//                  <Link to="robot-detail" params={{id: model.id}} className="btn btn-blue" title="Detail">
//                    <span className="fa fa-eye"></span>
//                  </Link>
//                  <a className="btn btn-red" title="Remove" onClick={robotActions.remove.bind(this, model.id)}>
//                    <span className="fa fa-times"></span>
//                  </a>
//                </div>
//              </div>
//            </div>
//            <section className="container margin-top-lg">
//              <div className="row">
//                <div className="col-xs-12 col-sm-3">
//                  <div className="thumbnail thumbnail-robot">
//                    <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
//                  </div>
//                </div>
//                <div className="col-xs-12 col-sm-9">
//                  <h1 className="nomargin-top">{model.name}</h1>
//                  <form onSubmit={this.handleSubmit}>
//                    <fieldset>
//                      <div className={Class({
//                        "form-group": true,
//                        "required": false,
//                        "error": !this.isValid("name"),
//                      })}>
//                        <label htmlFor="name">Name</label>
//                        <input type="text" onBlur={this.validate.bind(this, "name")} onChange={this.handleChangeFor("name")} className="form-control" id="name" ref="name" value={model.name}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("name"),
//                        })}>
//                          {this.getValidationMessages("name").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                         "required": false,
//                         "error": !this.isValid("assemblyDate")
//                      })}>
//                        <label htmlFor="assemblyDate">Assembly Date</label>
//                        <input type="text" onBlur={this.validate.bind(this, "assemblyDate")} onChange={this.handleChangeFor("assemblyDate")} className="form-control" id="assemblyDate" ref="assemblyDate" value={model.assemblyDate}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("assemblyDate"),
//                        })}>
//                          {this.getValidationMessages("assemblyDate").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                        "required": false,
//                        "error": !this.isValid("manufacturer"),
//                      })}>
//                        <label htmlFor="manufacturer">Manufacturer</label>
//                        <input type="text" onBlur={this.validate.bind(this, "manufacturer")} onChange={this.handleChangeFor("manufacturer")} className="form-control" id="manufacturer" ref="manufacturer" value={model.manufacturer}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("manufacturer"),
//                        })}>
//                          {this.getValidationMessages("manufacturer").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//                    </fieldset>
//                    <div className="btn-group">
//                      <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
//                      <button className="btn btn-primary" disabled={!this.isValid()} type="submit">Submit</button>
//                    </div>
//                  </form>
//                </div>
//              </div>
//            </section>
//          </div>
//        </DocumentTitle>
//      );
//    }
//  }
//});

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/

//(this.validatorTypes().manufacturer._flags.presence == "required")
//(this.validatorTypes().name._flags.presence == "required"),
//(this.validatorTypes().assemblyDate._flags.presence == "required"),

},{"classnames":"classnames","frontend/common/component":12,"frontend/common/components":13,"frontend/robot/actions":28,"frontend/state":41,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],37:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _require = require("baobab-react/decorators");

var branch = _require.branch;

var React = require("react");

var _require2 = require("react-router");

var Link = _require2.Link;

var DocumentTitle = require("react-document-title");

var _require3 = require("frontend/common/helpers");

var toArray = _require3.toArray;

var Component = require("frontend/common/component");

var _require4 = require("frontend/common/components");

var Error = _require4.Error;
var Loading = _require4.Loading;
var NotFound = _require4.NotFound;
var Pagination = _require4.Pagination;

var robotActions = require("frontend/robot/actions");
var RobotItem = require("frontend/robot/components/item");
var state = require("frontend/state");

// COMPONENTS ======================================================================================

var RobotIndex = (function (_Component) {
  function RobotIndex() {
    _classCallCheck(this, _RobotIndex);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(RobotIndex, _Component);

  var _RobotIndex = RobotIndex;

  _createClass(_RobotIndex, [{
    key: "render",
    value: function render() {
      var page = this.props.url.page;
      var _props$robots = this.props.robots;
      var total = _props$robots.total;
      var loading = _props$robots.loading;
      var loadError = _props$robots.loadError;
      var perpage = _props$robots.perpage;

      var models = this.props.models;

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
                React.createElement(Pagination, { endpoint: "robot-index", total: total, page: page, perpage: perpage }),
                models.map(function (model) {
                  return React.createElement(RobotItem, { model: model, key: model.id });
                })
              )
            ),
            loading ? React.createElement(Loading, null) : ""
          )
        );
      }
    }
  }], [{
    key: "loadPage",
    value: robotActions.loadPage,
    enumerable: true
  }, {
    key: "contextTypes",
    value: {
      router: React.PropTypes.func.isRequired },
    enumerable: true
  }]);

  RobotIndex = branch({
    cursors: {
      url: "url",
      robots: "robots" },

    facets: {
      models: "currentRobots" }
  })(RobotIndex) || RobotIndex;
  return RobotIndex;
})(Component);

exports["default"] = RobotIndex;
module.exports = exports["default"];

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/

},{"baobab-react/decorators":2,"frontend/common/component":12,"frontend/common/components":13,"frontend/common/helpers":24,"frontend/robot/actions":28,"frontend/robot/components/item":38,"frontend/state":41,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],38:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");

var _require = require("react-router");

var Link = _require.Link;

var Component = require("frontend/common/component");
var robotActions = require("frontend/robot/actions");

// COMPONENTS ======================================================================================

var RobotItem = (function (_Component) {
  function RobotItem() {
    _classCallCheck(this, RobotItem);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(RobotItem, _Component);

  _createClass(RobotItem, [{
    key: "render",
    value: function render() {
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
                  { className: "btn btn-red", title: "Remove", onClick: robotActions.remove.bind(this, model.id) },
                  React.createElement("span", { className: "fa fa-times" })
                )
              )
            )
          )
        )
      );
    }
  }], [{
    key: "propTypes",
    value: {
      model: React.PropTypes.object },
    enumerable: true
  }]);

  return RobotItem;
})(Component);

exports["default"] = RobotItem;
module.exports = exports["default"];

},{"frontend/common/component":12,"frontend/robot/actions":28,"react":"react","react-router":"react-router"}],39:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var React = require("react");

var _require = require("react-router");

var Route = _require.Route;
var DefaultRoute = _require.DefaultRoute;
var NotFoundRoute = _require.NotFoundRoute;

// Components

var _require2 = require("frontend/common/components");

var Body = _require2.Body;
var Home = _require2.Home;
var About = _require2.About;
var NotFound = _require2.NotFound;

var RobotIndex = require("frontend/robot/components/index");
var RobotAdd = require("frontend/robot/components/add");
var RobotDetail = require("frontend/robot/components/detail");
var RobotEdit = require("frontend/robot/components/edit");

// ROUTES ==========================================================================================
exports["default"] = React.createElement(
  Route,
  { path: "/", handler: Body },
  React.createElement(DefaultRoute, { handler: Home, name: "home" }),
  React.createElement(Route, { path: "/about", name: "about", handler: About }),
  React.createElement(Route, { path: "/robots/page/:page", name: "robot-index", handler: RobotIndex }),
  React.createElement(Route, { path: "/robots/add", name: "robot-add", handler: RobotAdd }),
  React.createElement(Route, { path: "/robots/:id", name: "robot-detail", handler: RobotDetail }),
  React.createElement(Route, { path: "/robots/:id/edit", name: "robot-edit", handler: RobotEdit }),
  React.createElement(NotFoundRoute, { handler: NotFound })
);
module.exports = exports["default"];

},{"frontend/common/components":13,"frontend/robot/components/add":34,"frontend/robot/components/detail":35,"frontend/robot/components/edit":36,"frontend/robot/components/index":37,"react":"react","react-router":"react-router"}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================
var Baobab = require("baobab");

var _require = require("frontend/common/helpers");

var toArray = _require.toArray;

// STATE ===========================================================================================
exports["default"] = new Baobab({ // DATA
  url: {
    handler: undefined,
    id: undefined,
    page: undefined,
    filters: undefined,
    sorts: undefined },

  robots: {
    models: {},
    total: 0,
    loading: true,
    loadError: undefined,
    pagination: [], // in format [[A B C], [D E]...], e.g. offset <-> ids
    perpage: 5 },

  alerts: {
    models: {},
    total: 0,
    loading: true,
    loadError: undefined,
    pagination: [], // in format [[A B C], [D E]...], e.g. offset <-> ids
    perpage: 5 } }, { // OPTIONS
  facets: {
    currentRobot: {
      cursors: {
        url: ["url"],
        models: ["robots", "models"] },
      get: function get(data) {
        var url = data.url;
        var models = data.models;

        var model = undefined;
        if (url.id) {
          model = models[url.id];
        }
        return model;
      }
    },

    currentRobots: {
      cursors: {
        url: ["url"],
        models: ["robots", "models"],
        pagination: ["robots", "pagination"] },
      get: function get(data) {
        var url = data.url;
        var models = data.models;
        var pagination = data.pagination;

        models = toArray(models);

        if (url.page) {
          (function () {
            var ids = pagination[url.page];
            if (ids) {
              models = models.filter(function (model) {
                return ids.indexOf(model.id) != -1;
              });
            }
          })();
        }
        if (url.filters) {}
        if (url.sorts) {}
        return models;
      }
    }
  }
});
module.exports = exports["default"];

// TODO filters, sorts

// TODO client filters
// if server filters are required:
// reset pagination in filtering action

// TODO client-sorts
// if server sorts are required:
// reset pagination in sorting action

},{"baobab":"baobab","frontend/common/helpers":24}],42:[function(require,module,exports){
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

// Uncomment if use IoJS
// let process = process || undefined;
//if (process) {
// IoJS has `unhandledRejection` hook
//process.on("unhandledRejection", function (reason, p) {
//  throw Error(`UnhandledRejection: ${reason}`);
//});
//} else {
Promise.prototype.done = function done(resolve, reject) {
  this.then(resolve, reject)["catch"](function (e) {
    setTimeout(function () {
      throw e;
    }, 0);
  });
};
//}

// Workaround method as native browser string representation of Immutable is awful
var window = window || undefined;
if (window) {
  window.console.echo = function echo() {
    console.log.apply(console, Array.prototype.slice.call(arguments).map(function (v) {
      return Inspect(v);
    }));
  };
}

},{"babel/polyfill":"babel/polyfill","util-inspect":"util-inspect"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLXBhZ2UuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWJvdXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ib2R5LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Vycm9yLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hvbWUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMvYWxlcnQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWQtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLXBhZ2UuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9yZW1vdmUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L21vZGVscy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb3V0ZXMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvc3RhdGUuanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNpQixPQUFPLENBQUMsY0FBYyxDQUFDOztJQUF4RCxZQUFZLFlBQXBCLE1BQU07SUFBZ0IsZUFBZSxZQUFmLGVBQWU7O0FBRTFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7Z0JBQ0UsT0FBTyxDQUFDLHlCQUF5QixDQUFDOztJQUF2RCxpQkFBaUIsYUFBakIsaUJBQWlCOztBQUN0QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7O0FBR3RDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQzNCLFFBQU0sRUFBRSxNQUFNO0FBQ2QsVUFBUSxFQUFFLGVBQWU7Q0FDMUIsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsV0FBVyxFQUFFLEdBQUcsRUFBSzs7Ozs7O0FBTXRDLE1BQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O3dCQ3RCcUIscUJBQXFCOzs7OzZCQUNoQiwyQkFBMkI7Ozs7OEJBQzFCLDRCQUE0Qjs7OzsyQkFDL0Isd0JBQXdCOzs7O3FCQUVqQztBQUNiLE9BQUssRUFBRTtBQUNMLE9BQUcsdUJBQVU7QUFDYixZQUFRLDRCQUFlO0FBQ3ZCLGFBQVMsNkJBQWdCO0FBQ3pCLFVBQU0sMEJBQWEsRUFDcEIsRUFDRjs7Ozs7Ozs7Ozs7cUJDUHVCLEdBQUc7OztlQUpiLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQzs7SUFBMUMsS0FBSyxZQUFMLEtBQUs7O0FBQ1YsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHdkIsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFO0FBQ2pDLE1BQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixNQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQ3JCLE1BQUksTUFBTSxvQkFBa0IsRUFBRSxBQUFFLENBQUM7OztBQUdqQyxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3BEOzs7Ozs7Ozs7Ozs7UUNMZSxVQUFVLEdBQVYsVUFBVTtxQkFRRixTQUFTOztBQWRqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O2VBRVosT0FBTyxDQUFDLHlCQUF5QixDQUFDOztJQUE5QyxRQUFRLFlBQVIsUUFBUTs7QUFDYixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUcvQixTQUFTLFVBQVUsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsTUFBSSxNQUFNLG9CQUFrQixFQUFFLEFBQUUsQ0FBQzs7O0FBR2pDLE9BQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxTQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDN0I7O0FBRWMsU0FBUyxTQUFTLENBQUMsRUFBRSxFQUFFO0FBQ3BDLE1BQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyRCxNQUFJLEtBQUssRUFBRTtBQUNULFdBQU8sS0FBSyxDQUFDO0dBQ2QsTUFBTTtBQUNMLFdBQU8sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3ZCO0NBQ0Y7Ozs7Ozs7Ozs7UUNmZSxTQUFTLEdBQVQsU0FBUztxQkFhRCxRQUFROztBQW5CaEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUVRLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzs7SUFBbEUsUUFBUSxZQUFSLFFBQVE7SUFBRSxrQkFBa0IsWUFBbEIsa0JBQWtCOztBQUNqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUcvQixTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7O0FBRXZELE1BQUksTUFBTSxlQUFlLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0QsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDM0IsV0FBTyxFQUFFLEtBQUs7QUFDZCxhQUFTLEVBQUUsU0FBUztBQUNwQixTQUFLLEVBQUUsQ0FBQztBQUNSLFVBQU0sRUFBRSxFQUFFLEVBQ1gsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQzdCOztBQUVjLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3JELE1BQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVELE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3RELE1BQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixNQUFJLENBQUMsR0FBRyxFQUFFO0FBQ1IsV0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDakQ7Q0FDRjs7Ozs7Ozs7OztxQkN2QnVCLE1BQU07O0FBSDlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBR3ZCLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUNqQyxNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQzVDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1JELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7O0FBRzdCLFNBQVMsYUFBYSxDQUFDLEdBQUcsRUFBRTtBQUMxQixTQUFPLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxHQUFHO1dBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVTtHQUFBLENBQUMsQ0FBQztDQUNyRjs7QUFFRCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDckIsZUFBYSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQ3JDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNkLE9BQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FBQztDQUNOOztJQUVvQixTQUFTO0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixLQUFLLEVBQUU7MEJBREEsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLEtBQUssRUFBRTtBQUNiLFlBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNoQjs7WUFKa0IsU0FBUzs7U0FBVCxTQUFTO0dBQVMsS0FBSyxDQUFDLFNBQVM7O3FCQUFqQyxTQUFTOzs7Ozs7QUNmOUIsTUFBTSxDQUFDLE9BQU8sTUFBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hELE1BQU0sQ0FBQyxPQUFPLEtBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN0RCxNQUFNLENBQUMsT0FBTyxNQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDeEQsTUFBTSxDQUFDLE9BQU8sU0FBWSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzlELE1BQU0sQ0FBQyxPQUFPLEtBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN0RCxNQUFNLENBQUMsT0FBTyxRQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDNUQsTUFBTSxDQUFDLE9BQU8sU0FBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sQ0FBQyxPQUFPLFdBQWMsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDTmxFLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFcEQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Ozs7SUFHaEMsS0FBSztXQUFMLEtBQUs7MEJBQUwsS0FBSzs7Ozs7OztZQUFMLEtBQUs7O2VBQUwsS0FBSzs7V0FDbEIsa0JBQUc7QUFDUCxhQUNFO0FBQUMscUJBQWE7VUFBQyxLQUFLLEVBQUMsT0FBTztRQUMxQjs7WUFBUyxTQUFTLEVBQUMscUJBQXFCO1VBQ3RDOzs7O1dBQTRCO1VBQzVCOzs7O1dBQTZDO1NBQ3JDO09BQ0ksQ0FDaEI7S0FDSDs7O1NBVmtCLEtBQUs7R0FBUyxTQUFTOztxQkFBdkIsS0FBSzs7Ozs7Ozs7OztBQ04xQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7OztlQUdiLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzs7SUFBN0MsT0FBTyxZQUFQLE9BQU87O0FBQ1osSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFDL0QsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFDakUsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7OztxQkFHdkIsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQy9CLFFBQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRXJCLFNBQU8sRUFBRTtBQUNQLFVBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUNuQjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7Z0NBQzRCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07UUFBdkQsTUFBTSx5QkFBTixNQUFNO1FBQUUsT0FBTyx5QkFBUCxPQUFPO1FBQUUsU0FBUyx5QkFBVCxTQUFTOztBQUMvQixVQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV6QixRQUFJLFNBQVMsRUFBRTtBQUNiLGFBQU8sb0JBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxTQUFTLEFBQUMsR0FBRSxDQUFDO0tBQ3ZDLE1BQU07QUFDTCxhQUNFOztVQUFLLFNBQVMsRUFBQyx3QkFBd0I7UUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7aUJBQUksb0JBQUMsU0FBUyxJQUFDLEtBQUssRUFBRSxLQUFLLEFBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsQUFBQyxHQUFFO1NBQUEsQ0FBQztRQUM5RCxPQUFPLEdBQUcsb0JBQUMsT0FBTyxPQUFFLEdBQUcsRUFBRTtPQUN0QixDQUNOO0tBQ0g7R0FDRjtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaENGLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O2VBQ2hCLE9BQU8sQ0FBQyxjQUFjLENBQUM7O0lBQS9CLElBQUksWUFBSixJQUFJOztBQUVULElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7QUFHdkQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQzdCLFdBQVMsRUFBRTtBQUNULFNBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFFOUI7O0FBRUQsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsV0FBSyxFQUFFLEdBQUcsRUFFWCxDQUFDO0dBQ0g7O0FBRUQsbUJBQWlCLEVBQUEsNkJBQUc7QUFDbEIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COztBQUVELDJCQUF5QixFQUFBLG1DQUFDLFNBQVMsRUFBRTs7QUFFbkMsUUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQzlDLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjtHQUNGOztBQUVELFlBQVUsRUFBQSxzQkFBRzs7O0FBQ1gsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7OztBQUc3QixRQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzdCLGtCQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCOzs7QUFHRCxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUNsQyxVQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxZQUFNO0FBQzdCLFlBQUksTUFBSyxLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUNyQyxnQkFBSyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7QUFDRCxlQUFPLE1BQUssTUFBTSxDQUFDO09BQ3BCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QjtHQUNGOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFdBQU87OztNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtLQUFPLENBQUM7R0FDekMsRUFDRixDQUFDLENBQUM7O0FBRUgsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQ2hDLGFBQVcsRUFBQSxxQkFBQyxLQUFLLEVBQUU7QUFDakIsU0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDdEI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsV0FDRTs7UUFBRyxTQUFTLEVBQUMsa0JBQWtCLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQUFBQzs7S0FBWSxDQUMvRTtHQUNIO0NBQ0YsQ0FBQyxDQUFDOztBQUVILElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMzQixXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQzlCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDOztBQUU3QixRQUFJLE9BQU8sR0FBRyxVQUFVO0FBQ3RCLGFBQVMsSUFBSSxJQUNaLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFHLElBQUksRUFDakMsQ0FBQzs7QUFFSCxRQUFJLE1BQU0sR0FDUjs7aUJBQUssU0FBUyxFQUFFLE9BQU8sQUFBQyxJQUFLLElBQUksQ0FBQyxLQUFLO01BQ3BDLEtBQUssQ0FBQyxRQUFRLEdBQUcsb0JBQUMsU0FBUyxJQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQUFBQyxHQUFFLEdBQUcsRUFBRTtNQUM1RixLQUFLLENBQUMsT0FBTztLQUNWLEFBQ1AsQ0FBQzs7QUFFRixRQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDaEIsWUFBTSxHQUFHO0FBQUMsY0FBTTtVQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQUFBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxBQUFDO1FBQUUsTUFBTTtPQUFVLENBQUM7S0FDcEg7O0FBRUQsV0FBTyxNQUFNLENBQUM7R0FDZixFQUNGLENBQUMsQ0FBQzs7cUJBRVksSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQ2hHTixPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTFDLElBQUksWUFBSixJQUFJOztBQUNULElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Z0JBQ0YsT0FBTyxDQUFDLGNBQWMsQ0FBQzs7SUFBN0MsSUFBSSxhQUFKLElBQUk7SUFBRSxZQUFZLGFBQVosWUFBWTs7QUFFdkIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDckQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDOUQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFDbkUsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7SUFJakIsSUFBSTtXQUFKLElBQUk7Ozs7Ozs7O1lBQUosSUFBSTs7Y0FBSixJQUFJOzs7O1dBTWpCLGtCQUFHO0FBQ1AsVUFBSSxrQkFBa0IsR0FBRyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxDQUFDO0FBQ3ZFLGFBQ0U7OztRQUNHO0FBQUMsa0JBQVE7WUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLHVCQUF1QixFQUFDLGtCQUFrQixFQUFFLGtCQUFrQixBQUFDO1VBQ3RIOztjQUFLLFNBQVMsRUFBQyxXQUFXO1lBQ3hCOztnQkFBSyxTQUFTLEVBQUMsZUFBZTtjQUM1Qjs7a0JBQVEsU0FBUyxFQUFDLHlCQUF5QixFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsZUFBWSxVQUFVLEVBQUMsZUFBWSxxQkFBcUI7Z0JBQ2hIOztvQkFBTSxTQUFTLEVBQUMsU0FBUzs7aUJBQXlCO2dCQUNsRCw4QkFBTSxTQUFTLEVBQUMsa0JBQWtCLEdBQVE7ZUFDbkM7Y0FDVDtBQUFDLG9CQUFJO2tCQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsRUFBRSxFQUFDLE1BQU07Z0JBQUM7O29CQUFNLFNBQVMsRUFBQyxPQUFPOztpQkFBYTs7ZUFBYzthQUN2RjtZQUNOOztnQkFBSyxTQUFTLEVBQUMsMEVBQTBFO2NBQ3ZGOztrQkFBSSxTQUFTLEVBQUMsZ0JBQWdCO2dCQUM1Qjs7O2tCQUFJO0FBQUMsd0JBQUk7c0JBQUMsRUFBRSxFQUFDLE1BQU07O21CQUFZO2lCQUFLO2dCQUNwQzs7O2tCQUFJO0FBQUMsd0JBQUk7c0JBQUMsRUFBRSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFDLEFBQUM7O21CQUFjO2lCQUFLO2dCQUNoRTs7O2tCQUFJO0FBQUMsd0JBQUk7c0JBQUMsRUFBRSxFQUFDLE9BQU87O21CQUFhO2lCQUFLO2VBQ25DO2FBQ0Q7V0FDRjtTQUNHO1FBRVg7O1lBQU0sRUFBRSxFQUFDLFdBQVc7VUFDbEIsb0JBQUMsWUFBWSxPQUFFO1NBQ1Y7T0FHSCxDQUNOO0tBQ0g7OztXQW5DYyxrQkFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQUU3QixhQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDdkM7OztBQUprQixNQUFJLEdBRHhCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDUyxJQUFJLEtBQUosSUFBSTtTQUFKLElBQUk7R0FBUyxTQUFTOztxQkFBdEIsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1p6QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVwRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7OztJQUdoQyxLQUFLO1dBQUwsS0FBSzswQkFBTCxLQUFLOzs7Ozs7O1lBQUwsS0FBSzs7ZUFBTCxLQUFLOztXQU1ULDJCQUFHO0FBQ2hCLGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSSxFQUNYLENBQUE7S0FDRjs7O1dBRUssa0JBQUc7QUFDUCxhQUNFO0FBQUMscUJBQWE7VUFBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxBQUFDO1FBQ3JHOztZQUFLLFNBQVMsRUFBRSxLQUFLO0FBQ25CLDZCQUFlLEVBQUUsSUFBSTtBQUNyQix3QkFBVSxFQUFFLElBQUksSUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRyxJQUFJLEVBQ3ZCLEFBQUM7VUFDRCwyQkFBRyxTQUFTLEVBQUMsdUJBQXVCLEdBQUs7VUFDekMsMkJBQUcsU0FBUyxFQUFDLHVCQUF1QixHQUFLO1NBQ3JDO09BQ1EsQ0FDaEI7S0FDSDs7O1dBeEJrQjtBQUNqQixlQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUM1QyxVQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUN0RDs7OztTQUprQixLQUFLO0dBQVMsU0FBUzs7cUJBQXZCLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQMUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUUxQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7OztJQUdoQyxRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7Ozs7U0FjM0IsS0FBSyxHQUFHO0FBQ04sZUFBUyxFQUFFLEVBQUU7S0FDZDs7O1lBaEJrQixRQUFROztlQUFSLFFBQVE7Ozs7OztXQWtCaEIsdUJBQUc7QUFDWixVQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7OztBQUd4QyxVQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVztBQUFFLGVBQU87T0FBQTs7QUFJM0UsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN4RSxZQUFJLENBQUMsUUFBUSxDQUFDLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztPQUNsRSxNQUNJO0FBQ0gsWUFBSSxBQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO0FBQzdELGNBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1NBQ25FO09BQ0Y7QUFDRCxVQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztLQUNsQzs7O1dBRWdCLDZCQUFHOztBQUVsQixVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUN2RSxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN2RCxVQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7OztBQUd6RSxZQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O0FBR2pGLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO0tBQ25FOzs7V0FFbUIsZ0NBQUc7QUFDckIsWUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQy9EOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3JDLFVBQUksS0FBSyxHQUFHLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUMsQ0FBQztBQUM5RixhQUFPLEtBQUssQ0FBQyxhQUFhLENBQ3hCLFNBQVMsRUFDVCxLQUFLLEVBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ3BCLENBQUM7S0FDSDs7O1dBOURrQjtBQUNqQixlQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0FBQ2pDLHdCQUFrQixFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUMzQzs7OztXQUVxQjtBQUNwQixlQUFTLEVBQUUsS0FBSztBQUNoQix3QkFBa0IsRUFBRTtBQUNsQixlQUFPLEVBQUUsYUFBYTtBQUN0QixjQUFNLEVBQUUsV0FBVztPQUNwQixFQUNGOzs7O1NBWmtCLFFBQVE7R0FBUyxTQUFTOztxQkFBMUIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7OztBQ043QixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0IsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRXBELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOzs7O0lBR2hDLElBQUk7V0FBSixJQUFJOzBCQUFKLElBQUk7Ozs7Ozs7WUFBSixJQUFJOztlQUFKLElBQUk7O1dBQ2pCLGtCQUFHO0FBQ1AsYUFDRTtBQUFDLHFCQUFhO1VBQUMsS0FBSyxFQUFDLGVBQWU7UUFDbEM7O1lBQVMsU0FBUyxFQUFDLHFCQUFxQjtVQUN0Qzs7OztXQUEwQjtVQUMxQjs7OztXQUEyQztVQUMzQzs7OztZQUF5Qzs7Z0JBQUcsSUFBSSxFQUFDLHFCQUFxQjs7YUFBVTs7V0FBZ0I7VUFDaEc7Ozs7V0FBaUI7VUFDakI7OztZQUNFOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLGtDQUFrQzs7ZUFBVTs7YUFBb0I7WUFDNUU7OztjQUFJOztrQkFBRyxJQUFJLEVBQUMseUNBQXlDOztlQUFXOzthQUErQjtZQUMvRjs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyx1Q0FBdUM7O2VBQWlCOzthQUF3QjtZQUM1Rjs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyxpREFBaUQ7O2VBQXlCOzthQUFpQztZQUN2SDs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyxtQ0FBbUM7O2VBQW9COzthQUFtQztZQUN0Rzs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyx3QkFBd0I7O2VBQWU7O2NBQU87O2tCQUFHLElBQUksRUFBQyxzQ0FBc0M7O2VBQWE7O2FBQW9DO1lBQ3pKOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLGtCQUFrQjs7ZUFBVTs7YUFBOEI7V0FDbkU7VUFFTDs7OztXQUFnQjtVQUNoQjs7O1lBQ0U7OztjQUFJOztrQkFBRyxJQUFJLEVBQUMsdUJBQXVCOztlQUFZOzthQUErQjtZQUM5RTs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyxvQ0FBb0M7O2VBQWE7O2FBQXFCO1lBQ2xGOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLG1DQUFtQzs7ZUFBWTs7YUFBaUI7V0FDekU7VUFFTDs7OztXQUFlO1VBQ2Y7OztZQUNFOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLHFCQUFxQjs7ZUFBVTs7YUFBbUI7WUFDOUQ7OztjQUFJOztrQkFBRyxJQUFJLEVBQUMsb0JBQW9COztlQUFTOzthQUE0QjtZQUNyRTs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyxxQkFBcUI7O2VBQVc7O2FBQXFCO1lBQ2pFOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLHFDQUFxQzs7ZUFBVTs7YUFBK0I7WUFDMUY7OztjQUFJOztrQkFBRyxJQUFJLEVBQUMsMENBQTBDOztlQUFjOzthQUFzQztZQUMxRzs7O2NBQUk7O2tCQUFHLElBQUksRUFBQyxzQkFBc0I7O2VBQVc7O2FBQXFCO1lBQ2xFOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLG9DQUFvQzs7ZUFBVTs7YUFBMEI7V0FDakY7VUFFTDs7OztXQUFZO1VBQ1o7OztZQUNFOzs7Y0FBSTs7a0JBQUcsSUFBSSxFQUFDLHFCQUFxQjs7ZUFBUTs7YUFBNEI7V0FDbEU7U0FDRztPQUNJLENBQ2hCO0tBQ0g7OztTQTVDa0IsSUFBSTtHQUFTLFNBQVM7O3FCQUF0QixJQUFJOzs7Ozs7Ozs7Ozs7Ozs7O0FDTnpCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFcEQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7Ozs7SUFHaEMsT0FBTztXQUFQLE9BQU87MEJBQVAsT0FBTzs7Ozs7OztZQUFQLE9BQU87O2VBQVAsT0FBTzs7V0FDcEIsa0JBQUc7QUFDUCxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3JFLGFBQ0U7QUFBQyxxQkFBYTtVQUFDLEtBQUssRUFBQyxZQUFZO1FBQy9COztZQUFLLFNBQVMsRUFBRSxlQUFlLEdBQUcsU0FBUyxBQUFDO1VBQzFDLDJCQUFHLFNBQVMsRUFBQyxtQkFBbUIsR0FBSztTQUNqQztPQUNRLENBQ2hCO0tBQ0g7OztTQVZrQixPQUFPO0dBQVMsU0FBUzs7cUJBQXpCLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7QUNONUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVwRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7OztJQUdoQyxRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7Ozs7O1lBQVIsUUFBUTs7ZUFBUixRQUFROztXQUNyQixrQkFBRztBQUNQLGFBQ0U7QUFBQyxxQkFBYTtVQUFDLEtBQUssRUFBQyxXQUFXO1FBQzlCOztZQUFTLFNBQVMsRUFBQyxnQkFBZ0I7VUFDakM7Ozs7V0FBdUI7VUFDdkI7Ozs7V0FBeUI7U0FDakI7T0FDSSxDQUNoQjtLQUNIOzs7U0FWa0IsUUFBUTtHQUFTLFNBQVM7O3FCQUExQixRQUFROzs7Ozs7Ozs7Ozs7Ozs7O0FDTjdCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O2VBQ2hCLE9BQU8sQ0FBQyxjQUFjLENBQUM7O0lBQS9CLElBQUksWUFBSixJQUFJOztBQUVULElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOzs7O0lBR2hDLFVBQVU7V0FBVixVQUFVOzBCQUFWLFVBQVU7Ozs7Ozs7WUFBVixVQUFVOztlQUFWLFVBQVU7O1dBUW5CLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDekQ7OztXQUVLLGtCQUFHOzs7QUFDUCxVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUMzQixVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbkMsYUFDRTs7O1FBQ0U7O1lBQUksU0FBUyxFQUFDLFlBQVk7VUFDeEI7OztZQUNFO0FBQUMsa0JBQUk7Z0JBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDO0FBQzVCLHNCQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFDLEFBQUM7QUFDakQseUJBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFDLENBQUMsQUFBQztBQUNuRCxxQkFBSyxnQkFBYSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBLEFBQUc7Y0FDN0M7Ozs7ZUFBb0I7YUFDZjtXQUNKO1VBQ0osS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUM5QyxtQkFDRTs7Z0JBQUksR0FBRyxFQUFFLENBQUMsQUFBQztjQUNUO0FBQUMsb0JBQUk7a0JBQUMsRUFBRSxFQUFFLE1BQUssS0FBSyxDQUFDLFFBQVEsQUFBQztBQUM1Qix3QkFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxBQUFDO0FBQ2xCLDJCQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBQyxDQUFDLEFBQUM7QUFDbkQsdUJBQUssZUFBYSxDQUFDLEFBQUc7Z0JBQ3JCLENBQUM7ZUFDRzthQUNKLENBQ0w7V0FDSCxDQUFDO1VBQ0Y7OztZQUNFO0FBQUMsa0JBQUk7Z0JBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDO0FBQzVCLHNCQUFNLEVBQUUsSUFBSSxJQUFJLFVBQVUsR0FBRyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFDLEFBQUM7QUFDbkUseUJBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLElBQUksVUFBVSxFQUFDLENBQUMsQUFBQztBQUM1RCxxQkFBSyxnQkFBYSxJQUFJLElBQUksVUFBVSxHQUFHLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBLEFBQUc7Y0FDL0Q7Ozs7ZUFBb0I7YUFDZjtXQUNKO1NBQ0Y7T0FJRCxDQUNOO0tBQ0g7OztXQW5Ea0I7QUFDakIsY0FBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDM0MsV0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDeEMsVUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDdkMsYUFBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFDM0M7Ozs7U0FOa0IsVUFBVTtHQUFTLFNBQVM7O3FCQUE1QixVQUFVOzs7Ozs7Ozs7Ozs7UUNGZixRQUFRLEdBQVIsUUFBUTtRQVdSLE9BQU8sR0FBUCxPQUFPO1FBV1AsaUJBQWlCLEdBQWpCLGlCQUFpQjtRQU9qQixrQkFBa0IsR0FBbEIsa0JBQWtCOztBQWxDbEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRzdDLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUM5QixNQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNsQixXQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFLO0FBQ3BDLFlBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLGFBQU8sTUFBTSxDQUFDO0tBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLE1BQU07QUFDTCxVQUFNLEtBQUssQ0FBQyw4QkFBOEIsR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDO0dBQzVEO0NBQ0Y7O0FBRU0sU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQzlCLE1BQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sTUFBTSxDQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRzthQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FBQSxDQUFDLEVBQzNDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxFQUFFO0tBQUEsQ0FDaEIsQ0FBQztHQUNILE1BQU07QUFDTCxVQUFNLEtBQUssQ0FBQywrQkFBK0IsR0FBRyxPQUFPLE1BQU0sQ0FBQyxDQUFDO0dBQzlEO0NBQ0Y7O0FBRU0sU0FBUyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUU7QUFDdkMsU0FBTztBQUNMLFdBQU8sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNyQixTQUFLLEVBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0tBQUEsQ0FBQyxHQUFHLFNBQVMsQUFBQztHQUN2RixDQUFDO0NBQ0g7O0FBRU0sU0FBUyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7QUFDaEUsTUFBSSxPQUFPLFlBQUE7TUFBRSxTQUFTLFlBQUE7TUFBRSxPQUFPLFlBQUEsQ0FBQztBQUNoQyxNQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDbkIsV0FBTyxHQUFHO0FBQ1Isb0JBQWMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxPQUFPO0FBQ25ELG1CQUFhLEVBQUUsT0FBTyxFQUN2QixDQUFDO0dBQ0g7QUFDRCxNQUFJLE9BQU8sRUFBRTtBQUNYLGFBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUs7QUFDMUQsZUFBUyxhQUFXLEdBQUcsT0FBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQyxhQUFPLFNBQVMsQ0FBQztLQUNsQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1I7QUFDRCxNQUFJLEtBQUssRUFBRTtBQUNULFdBQU8sR0FBRztBQUNSLFlBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDeEIsQ0FBQztHQUNIO0FBQ0QsU0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ3ZEOzs7OztBQ3ZERCxNQUFNLENBQUMsT0FBTyxNQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7Ozs7cUJDSTVCLEtBQUs7O0FBSDdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUdqQixTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDbEMsTUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDakIsVUFBTSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztHQUMzQztBQUNELE1BQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2xCLFVBQU0sS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7R0FDNUM7QUFDRCxTQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDbkIsTUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDYixZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUM1QyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ1Y7Ozs7Ozs7Ozs7Ozs7OztBQ1hELElBQUksS0FBSyxHQUFHO0FBQ1YsVUFBUSxFQUFBLGtCQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFCLFdBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUNsRDs7QUFFRCxVQUFRLEVBQUEsa0JBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDMUIsV0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ2xEOztBQUVELGNBQVksRUFBQSxzQkFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUM5QixVQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQy9DOztBQUVELGFBQVcsRUFBQSxxQkFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUM3QixVQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzlDOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFVBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7R0FDeEI7O0FBRUQsS0FBRyxFQUFBLGFBQUMsTUFBTSxFQUFFO0FBQ1YsVUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDM0I7Q0FDRixDQUFDOztxQkFFYSxLQUFLOzs7Ozs7Ozs7Ozs7bUJDL0JKLGVBQWU7Ozs7b0JBQ2QsZ0JBQWdCOzs7O3dCQUNaLHFCQUFxQjs7Ozt5QkFDcEIsc0JBQXNCOzs7O3NCQUN6QixrQkFBa0I7Ozs7cUJBRXRCO0FBQ2IsS0FBRyxrQkFBQSxFQUFFLElBQUksbUJBQUEsRUFBRSxRQUFRLHVCQUFBLEVBQUUsU0FBUyx3QkFBQSxFQUFFLE1BQU0scUJBQUE7Q0FDdkM7Ozs7Ozs7Ozs7O3FCQ0N1QixHQUFHOztBQVIzQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQy9DLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzdDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBR3ZCLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRTtBQUNqQyxNQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsTUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUNyQixNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLE9BQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRW5ELFNBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoQixTQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDckUsaUJBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3RGLFdBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztHQUN4QixDQUFDLFNBQ0ksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNqQixRQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7QUFDN0IsWUFBTSxRQUFRLENBQUM7S0FDaEIsTUFBTTtBQUNMLFVBQUksU0FBUyxHQUFHO0FBQ2QsY0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLG1CQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVU7QUFDaEMsV0FBRyxFQUFFLE1BQU07T0FDWixDQUFDO0FBQ0YsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQzFELFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQyxtQkFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsNkJBQTZCLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUM3RyxhQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDeEI7R0FDRixDQUFDLENBQ0QsSUFBSSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Q0FjWDs7Ozs7Ozs7Ozs7O3FCQzVDdUIsSUFBSTs7QUFSNUIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUMvQyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN2RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM3QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUd2QixTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbEMsTUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLE1BQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDckIsTUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFELE1BQUksTUFBTSxvQkFBa0IsRUFBRSxBQUFFLENBQUM7OztBQUdqQyxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FDL0IsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2hCLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzNCLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLFNBQVMsRUFDckIsQ0FBQyxDQUFDO0FBQ0gsaUJBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFdBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztHQUN4QixDQUFDLFNBQ0ksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNqQixRQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7QUFDN0IsWUFBTSxRQUFRLENBQUM7S0FDaEIsTUFBTTtBQUNMLFVBQUksU0FBUyxHQUFHO0FBQ2QsY0FBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQ3ZCLG1CQUFXLEVBQUUsUUFBUSxDQUFDLFVBQVU7QUFDaEMsV0FBRyxFQUFFLE1BQU07T0FDWixDQUFDO0FBQ0YsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBVCxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQzFELFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsbUJBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsT0FBTyxFQUFFLDhCQUE4QixHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDOUcsYUFBTyxRQUFRLENBQUMsTUFBTSxDQUFBO0tBQ3ZCO0dBQ0YsQ0FBQyxDQUNELElBQUksRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0NBY1g7Ozs7Ozs7Ozs7OztRQ2pEZSxVQUFVLEdBQVYsVUFBVTtxQkFpREYsU0FBUzs7QUF4RGpDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7ZUFFWixPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTlDLFFBQVEsWUFBUixRQUFROztBQUNiLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRy9CLFNBQVMsVUFBVSxDQUFDLEVBQUUsRUFBRTtBQUM3QixNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOztBQUVqQyxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUNyQixJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7eUJBQ0csUUFBUSxDQUFDLElBQUk7UUFBM0IsSUFBSSxrQkFBSixJQUFJO1FBQUUsSUFBSSxrQkFBSixJQUFJOztBQUNmLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7O0FBWWpCLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3JDLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxZQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUN6QixhQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTtBQUMvQixlQUFPLEVBQUUsS0FBSztBQUNkLGlCQUFTLEVBQUUsU0FBUztBQUNwQixjQUFNLEVBQUUsTUFBTSxFQUNmLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7O0FBR0gsV0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDO0dBQ3hCLENBQUMsU0FDSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2pCLFFBQUksUUFBUSxZQUFZLEtBQUssRUFBRTtBQUM3QixZQUFNLFFBQVEsQ0FBQztLQUNoQixNQUFNO0FBQ0wsVUFBSSxTQUFTLEdBQUc7QUFDZCxjQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsbUJBQVcsRUFBRSxRQUFRLENBQUMsVUFBVTtBQUNoQyxXQUFHLEVBQUUsTUFBTTtPQUNaLENBQUM7QUFDRixXQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFULFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDMUQsbUJBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUMsT0FBTyxFQUFFLG9DQUFvQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDcEgsYUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDO0tBQ3hCO0dBQ0YsQ0FBQyxDQUNELElBQUksRUFBRSxDQUFDO0NBQ1g7O0FBRWMsU0FBUyxTQUFTLENBQUMsRUFBRSxFQUFFO0FBQ3BDLE1BQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyRCxNQUFJLEtBQUssRUFBRTtBQUNULFdBQU8sS0FBSyxDQUFDO0dBQ2QsTUFBTTtBQUNMLFdBQU8sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ3ZCO0NBQ0Y7Ozs7Ozs7Ozs7OztRQ3hEZSxTQUFTLEdBQVQsU0FBUztxQkEyQ0QsUUFBUTs7QUFsRGhDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7ZUFFUSxPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQWxFLFFBQVEsWUFBUixRQUFRO0lBQUUsa0JBQWtCLFlBQWxCLGtCQUFrQjs7QUFDakMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHL0IsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3ZELE1BQUksTUFBTSxpQkFBaUIsQ0FBQztBQUM1QixNQUFJLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvRCxPQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUMsQ0FBQyxDQUMvQixJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7O0FBRWhCLFFBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3BELFFBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7eUJBR3pDLFFBQVEsQ0FBQyxJQUFJO1FBQTNCLElBQUksa0JBQUosSUFBSTtRQUFFLElBQUksa0JBQUosSUFBSTs7QUFDZixRQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7OztBQUdsQyxTQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMzQixXQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU07QUFDakUsWUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztBQUM1QyxnQkFBVSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxzQkFBSSxJQUFJLEVBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUMzRSxhQUFPLEVBQUUsS0FBSztBQUNkLGVBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUMsQ0FBQzs7QUFFSCxXQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7R0FDeEIsQ0FBQyxTQUNJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDakIsUUFBSSxRQUFRLFlBQVksS0FBSyxFQUFFO0FBQzdCLFlBQU0sUUFBUSxDQUFDO0tBQ2hCLE1BQU07QUFDTCxVQUFJLFNBQVMsR0FBRztBQUNkLGNBQU0sRUFBRSxRQUFRLENBQUMsTUFBTTtBQUN2QixtQkFBVyxFQUFFLFFBQVEsQ0FBQyxVQUFVO0FBQ2hDLFdBQUcsRUFBRSxNQUFNO09BQ1osQ0FBQztBQUNGLFdBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUMxRCxXQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDZixtQkFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsbUNBQW1DLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNuSCxhQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDeEI7R0FDRixDQUFDLENBQ0QsSUFBSSxFQUFFLENBQUM7Q0FDWDs7QUFFYyxTQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNyRCxNQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1RCxNQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0RCxNQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFdBQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsV0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDakQ7Q0FDRjs7Ozs7Ozs7OztxQkNuRHVCLE1BQU07O0FBUDlCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDL0MsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHdkIsU0FBUyxNQUFNLENBQUMsRUFBRSxFQUFFO0FBQ2pDLE1BQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxRCxNQUFJLE1BQU0sb0JBQWtCLEVBQUUsQUFBRSxDQUFDOzs7QUFHakMsT0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLE9BQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFM0MsU0FBTyxLQUFLLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FDeEIsSUFBSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2hCLFNBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzNCLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLFNBQVMsRUFDckIsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuQyxpQkFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsK0JBQStCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDekYsV0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDO0dBQ3hCLENBQUMsU0FDSSxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2pCLFFBQUksUUFBUSxZQUFZLEtBQUssRUFBRTtBQUM3QixZQUFNLFFBQVEsQ0FBQztLQUNoQixNQUFNO0FBQ0wsVUFBSSxVQUFTLEdBQUc7QUFDZCxjQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsbUJBQVcsRUFBRSxRQUFRLENBQUMsVUFBVTtBQUNoQyxXQUFHLEVBQUUsTUFBTTtPQUNaLENBQUM7QUFDRixXQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFULFVBQVMsRUFBQyxDQUFDLENBQUM7QUFDMUQsV0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxtQkFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsZ0NBQWdDLEdBQUcsVUFBUyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUNoSCxhQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDeEI7R0FDRixDQUFDLENBQ0QsSUFBSSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Q0FjWDs7Ozs7Ozs7Ozs7QUN0REQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3RDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRWxDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7ZUFDaEIsT0FBTyxDQUFDLGNBQWMsQ0FBQzs7SUFBL0IsSUFBSSxZQUFKLElBQUk7O0FBQ1QsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Ozs7Z0JBR25CLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQzs7SUFBakUsS0FBSyxhQUFMLEtBQUs7SUFBRSxPQUFPLGFBQVAsT0FBTztJQUFFLFFBQVEsYUFBUixRQUFROztBQUM3QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7O0FBR3RDLFNBQVMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDeEMsTUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDbEIsU0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDbEQsUUFBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0IsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDdkUsTUFBTTtBQUNMLFVBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCO0FBQ0QsV0FBTyxJQUFJLENBQUM7R0FDYixFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBcUNjLEtBQUssQ0FBQyxXQUFXLENBQUM7Ozs7Ozs7Ozs7O0FBUy9CLFFBQU0sRUFBQSxrQkFBRztBQUNQLFdBQU87Ozs7S0FBYyxDQUFDOzs7OztHQUt2QjtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQ2xGYSxPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTVDLE1BQU0sWUFBTixNQUFNOztBQUNYLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Z0JBQ2hCLE9BQU8sQ0FBQyxjQUFjLENBQUM7O0lBQS9CLElBQUksYUFBSixJQUFJOztBQUNULElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVwRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7Z0JBQ3BCLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQzs7SUFBakUsS0FBSyxhQUFMLEtBQUs7SUFBRSxPQUFPLGFBQVAsT0FBTztJQUFFLFFBQVEsYUFBUixRQUFROztBQUM3QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7OztJQVdqQixXQUFXO1dBQVgsV0FBVzs7Ozs7Ozs7WUFBWCxXQUFXOztxQkFBWCxXQUFXOzs7O1dBT3hCLGtCQUFHOzswQkFFb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1VBQXZDLE9BQU8saUJBQVAsT0FBTztVQUFFLFNBQVMsaUJBQVQsU0FBUzs7QUFDdkIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7O0FBRTdCLFVBQUksT0FBTyxFQUFFO0FBQ1gsZUFBTyxvQkFBQyxPQUFPLE9BQUUsQ0FBQztPQUNuQixNQUFNLElBQUksU0FBUyxFQUFFO0FBQ3BCLGVBQU8sb0JBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxTQUFTLEFBQUMsR0FBRSxDQUFDO09BQ3ZDLE1BQU07QUFDTCxlQUNFO0FBQUMsdUJBQWE7WUFBQyxLQUFLLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLEFBQUM7VUFDM0M7OztZQUNFOztnQkFBSyxFQUFFLEVBQUMsY0FBYztjQUNwQjs7a0JBQUssU0FBUyxFQUFDLFdBQVc7Z0JBQ3hCOztvQkFBSyxTQUFTLEVBQUMsa0NBQWtDO2tCQUMvQztBQUFDLHdCQUFJO3NCQUFDLEVBQUUsRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLG9CQUFvQixFQUFDLEtBQUssRUFBQyxjQUFjO29CQUMzRiw4QkFBTSxTQUFTLEVBQUMsa0JBQWtCLEdBQVE7b0JBQzFDOzt3QkFBTSxTQUFTLEVBQUMsMEJBQTBCOztxQkFBb0I7bUJBQ3pEO2lCQUNIO2dCQUNOOztvQkFBSyxTQUFTLEVBQUMsbUNBQW1DO2tCQUNoRDtBQUFDLHdCQUFJO3NCQUFDLEVBQUUsRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQyxFQUFDLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUMsTUFBTTtvQkFDbkYsOEJBQU0sU0FBUyxFQUFDLFlBQVksR0FBUTttQkFDL0I7a0JBQ1A7O3NCQUFHLFNBQVMsRUFBQyxhQUFhLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQUFBQztvQkFDMUYsOEJBQU0sU0FBUyxFQUFDLGFBQWEsR0FBUTttQkFDbkM7aUJBQ0E7ZUFDRjthQUNGO1lBQ047O2dCQUFTLFNBQVMsRUFBQyx5QkFBeUI7Y0FDMUM7O2tCQUFLLFNBQVMsRUFBQyxLQUFLO2dCQUNsQjs7b0JBQUssU0FBUyxFQUFDLG9CQUFvQjtrQkFDakM7O3NCQUFLLFNBQVMsRUFBQywyQkFBMkI7b0JBQ3hDLDZCQUFLLEdBQUcsRUFBRSxzQkFBc0IsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLGVBQWUsQUFBQyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE9BQU8sR0FBRTttQkFDekY7aUJBQ0Y7Z0JBQ047O29CQUFLLFNBQVMsRUFBQyxvQkFBb0I7a0JBQ2pDOztzQkFBSSxTQUFTLEVBQUMsY0FBYztvQkFBRSxLQUFLLENBQUMsSUFBSTttQkFBTTtrQkFDOUM7OztvQkFDRTs7OztxQkFBc0I7b0JBQ3RCOzs7c0JBQUssS0FBSyxDQUFDLEVBQUU7cUJBQU07b0JBQ25COzs7O3FCQUFzQjtvQkFDdEI7OztzQkFBSyxLQUFLLENBQUMsWUFBWTtxQkFBTTtvQkFDN0I7Ozs7cUJBQXFCO29CQUNyQjs7O3NCQUFLLEtBQUssQ0FBQyxZQUFZO3FCQUFNO21CQUMxQjtpQkFDRDtlQUNGO2FBQ0U7V0FDTjtTQUNRLENBQ2hCO09BQ0g7S0FDRjs7O1dBN0RxQjtBQUNwQixZQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUN4Qzs7OztXQUVrQixZQUFZLENBQUMsU0FBUzs7OztBQUx0QixhQUFXLEdBUi9CLE1BQU0sQ0FBQztBQUNOLFdBQU8sRUFBRTtBQUNQLFlBQU0sRUFBRSxRQUFRLEVBQ2pCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sV0FBSyxFQUFFLGNBQWMsRUFDdEIsRUFDRixDQUFDLENBQ21CLFdBQVcsS0FBWCxXQUFXO1NBQVgsV0FBVztHQUFTLFNBQVM7O3FCQUE3QixXQUFXOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJoQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFbEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNoQixPQUFPLENBQUMsY0FBYyxDQUFDOztJQUEvQixJQUFJLFlBQUosSUFBSTs7QUFDVCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7O0FBR3BELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztnQkFDcEIsT0FBTyxDQUFDLDRCQUE0QixDQUFDOztJQUFqRSxLQUFLLGFBQUwsS0FBSztJQUFFLE9BQU8sYUFBUCxPQUFPO0lBQUUsUUFBUSxhQUFSLFFBQVE7O0FBQzdCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3JELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHdEMsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRTtBQUN4QyxNQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNsQixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUNsRCxRQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQixZQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUN2RSxNQUFNO0FBQ0wsVUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDdkI7QUFDRCxXQUFPLElBQUksQ0FBQztHQUNiLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQ29CLFNBQVM7V0FBVCxTQUFTOzBCQUFULFNBQVM7Ozs7Ozs7WUFBVCxTQUFTOztlQUFULFNBQVM7Ozs7Ozs7Ozs7OztXQVl0QixrQkFBRztBQUNQLGFBQU87Ozs7T0FBZSxDQUFDOzs7Ozs7S0FNeEI7OztXQWxCa0IsWUFBWSxDQUFDLFNBQVM7Ozs7U0FEdEIsU0FBUztHQUFTLFNBQVM7O3FCQUEzQixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VDbkVmLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzs7SUFBNUMsTUFBTSxZQUFOLE1BQU07O0FBQ1gsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztnQkFDaEIsT0FBTyxDQUFDLGNBQWMsQ0FBQzs7SUFBL0IsSUFBSSxhQUFKLElBQUk7O0FBQ1QsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7O2dCQUVwQyxPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTdDLE9BQU8sYUFBUCxPQUFPOztBQUNaLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztnQkFDUixPQUFPLENBQUMsNEJBQTRCLENBQUM7O0lBQTdFLEtBQUssYUFBTCxLQUFLO0lBQUUsT0FBTyxhQUFQLE9BQU87SUFBRSxRQUFRLGFBQVIsUUFBUTtJQUFFLFVBQVUsYUFBVixVQUFVOztBQUN6QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7OztJQWFqQixVQUFVO1dBQVYsVUFBVTs7Ozs7Ozs7WUFBVixVQUFVOztvQkFBVixVQUFVOzs7O1dBT3ZCLGtCQUFHO0FBQ1AsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOzBCQUNZLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtVQUF2RCxLQUFLLGlCQUFMLEtBQUs7VUFBRSxPQUFPLGlCQUFQLE9BQU87VUFBRSxTQUFTLGlCQUFULFNBQVM7VUFBRSxPQUFPLGlCQUFQLE9BQU87O0FBQ3ZDLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDOztBQUUvQixVQUFJLFNBQVMsRUFBRTtBQUNiLGVBQU8sb0JBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxTQUFTLEFBQUMsR0FBRSxDQUFDO09BQ3ZDLE1BQU07QUFDTCxlQUNFO0FBQUMsdUJBQWE7WUFBQyxLQUFLLEVBQUMsUUFBUTtVQUMzQjs7O1lBQ0U7O2dCQUFLLEVBQUUsRUFBQyxjQUFjO2NBQ3BCOztrQkFBSyxTQUFTLEVBQUMsV0FBVztnQkFDeEI7O29CQUFLLFNBQVMsRUFBQyxZQUFZO2tCQUN6QjtBQUFDLHdCQUFJO3NCQUFDLEVBQUUsRUFBQyxXQUFXLEVBQUMsU0FBUyxFQUFDLHNCQUFzQixFQUFDLEtBQUssRUFBQyxLQUFLO29CQUMvRCw4QkFBTSxTQUFTLEVBQUMsWUFBWSxHQUFRO21CQUMvQjtpQkFDSDtlQUNGO2FBQ0Y7WUFDTjs7Z0JBQVMsU0FBUyxFQUFDLFdBQVc7Y0FDNUI7Ozs7ZUFBZTtjQUNmOztrQkFBSyxTQUFTLEVBQUMsS0FBSztnQkFDbEIsb0JBQUMsVUFBVSxJQUFDLFFBQVEsRUFBQyxhQUFhLEVBQUMsS0FBSyxFQUFFLEtBQUssQUFBQyxFQUFDLElBQUksRUFBRSxJQUFJLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUU7Z0JBQy9FLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO3lCQUFJLG9CQUFDLFNBQVMsSUFBQyxLQUFLLEVBQUUsS0FBSyxBQUFDLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEFBQUMsR0FBRTtpQkFBQSxDQUFDO2VBQzNEO2FBQ0U7WUFDVCxPQUFPLEdBQUcsb0JBQUMsT0FBTyxPQUFFLEdBQUcsRUFBRTtXQUN0QjtTQUNRLENBQ2hCO09BQ0g7S0FDRjs7O1dBdENpQixZQUFZLENBQUMsUUFBUTs7OztXQUVqQjtBQUNwQixZQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUN4Qzs7OztBQUxrQixZQUFVLEdBVjlCLE1BQU0sQ0FBQztBQUNOLFdBQU8sRUFBRTtBQUNQLFNBQUcsRUFBRSxLQUFLO0FBQ1YsWUFBTSxFQUFFLFFBQVEsRUFDakI7O0FBRUQsVUFBTSxFQUFFO0FBQ04sWUFBTSxFQUFFLGVBQWUsRUFDeEI7R0FDRixDQUFDLENBQ21CLFVBQVUsS0FBVixVQUFVO1NBQVYsVUFBVTtHQUFTLFNBQVM7O3FCQUE1QixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNoQixPQUFPLENBQUMsY0FBYyxDQUFDOztJQUEvQixJQUFJLFlBQUosSUFBSTs7QUFFVCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNyRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7OztJQUdoQyxTQUFTO1dBQVQsU0FBUzswQkFBVCxTQUFTOzs7Ozs7O1lBQVQsU0FBUzs7ZUFBVCxTQUFTOztXQUt0QixrQkFBRztBQUNQLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzdCLGFBQ0U7O1VBQUssR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEFBQUMsRUFBQyxTQUFTLEVBQUMsbUJBQW1CO1FBQy9DOztZQUFLLFNBQVMsRUFBQyxxQkFBcUIsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsQUFBQztVQUNqRDs7Y0FBSyxTQUFTLEVBQUMsZUFBZTtZQUM1Qjs7Z0JBQUksU0FBUyxFQUFDLGFBQWE7Y0FBQztBQUFDLG9CQUFJO2tCQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQztnQkFBRSxLQUFLLENBQUMsSUFBSTtlQUFRO2FBQUs7V0FDaEc7VUFDTjs7Y0FBSyxTQUFTLEVBQUMsa0NBQWtDO1lBQy9DO0FBQUMsa0JBQUk7Z0JBQUMsRUFBRSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxBQUFDO2NBQzdDLDZCQUFLLEdBQUcsRUFBRSxzQkFBc0IsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLGVBQWUsQUFBQyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE9BQU8sR0FBRTthQUN4RjtXQUNIO1VBQ047O2NBQUssU0FBUyxFQUFDLGNBQWM7WUFDM0I7O2dCQUFLLFNBQVMsRUFBQyxVQUFVO2NBQ3ZCOztrQkFBSyxTQUFTLEVBQUMsbUNBQW1DO2dCQUNoRDtBQUFDLHNCQUFJO29CQUFDLEVBQUUsRUFBQyxjQUFjLEVBQUMsTUFBTSxFQUFFLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQUFBQyxFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsS0FBSyxFQUFDLFFBQVE7a0JBQ3JGLDhCQUFNLFNBQVMsRUFBQyxXQUFXLEdBQVE7aUJBQzlCO2dCQUNQO0FBQUMsc0JBQUk7b0JBQUMsRUFBRSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxBQUFDLEVBQUMsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBQyxNQUFNO2tCQUNuRiw4QkFBTSxTQUFTLEVBQUMsWUFBWSxHQUFRO2lCQUMvQjtnQkFDUDs7b0JBQUcsU0FBUyxFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxBQUFDO2tCQUMxRiw4QkFBTSxTQUFTLEVBQUMsYUFBYSxHQUFRO2lCQUNuQztlQUNBO2FBQ0Y7V0FDRjtTQUNGO09BQ0YsQ0FDTjtLQUNIOzs7V0FuQ2tCO0FBQ2pCLFdBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDOUI7Ozs7U0FIa0IsU0FBUztHQUFTLFNBQVM7O3FCQUEzQixTQUFTOzs7Ozs7Ozs7OztxQkNKTixLQUFLOztBQUg3QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFHakIsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2xDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNuQixNQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNiLFdBQU8sRUFBRSxTQUFTO0FBQ2xCLFlBQVEsRUFBRSxTQUFTO0FBQ25CLFlBQVEsRUFBRSxJQUFJO0FBQ2QsVUFBTSxFQUFFLElBQUksRUFDYixFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ1Y7Ozs7Ozs7Ozs7O0FDWEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUNjLE9BQU8sQ0FBQyxjQUFjLENBQUM7O0lBQTdELEtBQUssWUFBTCxLQUFLO0lBQUUsWUFBWSxZQUFaLFlBQVk7SUFBRSxhQUFhLFlBQWIsYUFBYTs7OztnQkFHSCxPQUFPLENBQUMsNEJBQTRCLENBQUM7O0lBQXBFLElBQUksYUFBSixJQUFJO0lBQUUsSUFBSSxhQUFKLElBQUk7SUFBRSxLQUFLLGFBQUwsS0FBSztJQUFFLFFBQVEsYUFBUixRQUFROztBQUVoQyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUM1RCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUN4RCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUM5RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7O3FCQUl4RDtBQUFDLE9BQUs7SUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLEFBQUM7RUFDNUIsb0JBQUMsWUFBWSxJQUFDLE9BQU8sRUFBRSxJQUFJLEFBQUMsRUFBQyxJQUFJLEVBQUMsTUFBTSxHQUFFO0VBQzFDLG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssQUFBQyxHQUFFO0VBQ25ELG9CQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsb0JBQW9CLEVBQUMsSUFBSSxFQUFDLGFBQWEsRUFBQyxPQUFPLEVBQUUsVUFBVSxBQUFDLEdBQUU7RUFDMUUsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsSUFBSSxFQUFDLFdBQVcsRUFBQyxPQUFPLEVBQUUsUUFBUSxBQUFDLEdBQUU7RUFDL0Qsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxhQUFhLEVBQUMsSUFBSSxFQUFDLGNBQWMsRUFBQyxPQUFPLEVBQUUsV0FBVyxBQUFDLEdBQUU7RUFDckUsb0JBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxrQkFBa0IsRUFBQyxJQUFJLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBRSxTQUFTLEFBQUMsR0FBRTtFQUN0RSxvQkFBQyxhQUFhLElBQUMsT0FBTyxFQUFFLFFBQVEsQUFBQyxHQUFFO0NBQzdCOzs7Ozs7Ozs7O0FDckJWLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7ZUFDZixPQUFPLENBQUMseUJBQXlCLENBQUM7O0lBQTdDLE9BQU8sWUFBUCxPQUFPOzs7cUJBR0csSUFBSSxNQUFNLENBQ3ZCO0FBQ0UsS0FBRyxFQUFFO0FBQ0gsV0FBTyxFQUFFLFNBQVM7QUFDbEIsTUFBRSxFQUFFLFNBQVM7QUFDYixRQUFJLEVBQUUsU0FBUztBQUNmLFdBQU8sRUFBRSxTQUFTO0FBQ2xCLFNBQUssRUFBRSxTQUFTLEVBQ2pCOztBQUVELFFBQU0sRUFBRTtBQUNOLFVBQU0sRUFBRSxFQUFFO0FBQ1YsU0FBSyxFQUFFLENBQUM7QUFDUixXQUFPLEVBQUUsSUFBSTtBQUNiLGFBQVMsRUFBRSxTQUFTO0FBQ3BCLGNBQVUsRUFBRSxFQUFFO0FBQ2QsV0FBTyxFQUFFLENBQUMsRUFDWDs7QUFFRCxRQUFNLEVBQUU7QUFDTixVQUFNLEVBQUUsRUFBRTtBQUNWLFNBQUssRUFBRSxDQUFDO0FBQ1IsV0FBTyxFQUFFLElBQUk7QUFDYixhQUFTLEVBQUUsU0FBUztBQUNwQixjQUFVLEVBQUUsRUFBRTtBQUNkLFdBQU8sRUFBRSxDQUFDLEVBQ1gsRUFDRixFQUNEO0FBQ0UsUUFBTSxFQUFFO0FBQ04sZ0JBQVksRUFBRTtBQUNaLGFBQU8sRUFBRTtBQUNQLFdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNaLGNBQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFDN0I7QUFDRCxTQUFHLEVBQUUsYUFBUyxJQUFJLEVBQUU7WUFDYixHQUFHLEdBQVksSUFBSSxDQUFuQixHQUFHO1lBQUUsTUFBTSxHQUFJLElBQUksQ0FBZCxNQUFNOztBQUNoQixZQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsWUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFO0FBQ1YsZUFBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDeEI7QUFDRCxlQUFPLEtBQUssQ0FBQztPQUNkO0tBQ0Y7O0FBRUQsaUJBQWEsRUFBRTtBQUNiLGFBQU8sRUFBRTtBQUNQLFdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNaLGNBQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7QUFDNUIsa0JBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFFckM7QUFDRCxTQUFHLEVBQUUsYUFBUyxJQUFJLEVBQUU7WUFDYixHQUFHLEdBQXdCLElBQUksQ0FBL0IsR0FBRztZQUFFLE1BQU0sR0FBZ0IsSUFBSSxDQUExQixNQUFNO1lBQUUsVUFBVSxHQUFJLElBQUksQ0FBbEIsVUFBVTs7QUFDNUIsY0FBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekIsWUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFOztBQUNaLGdCQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGdCQUFJLEdBQUcsRUFBRTtBQUNQLG9CQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEtBQUs7dUJBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2VBQUEsQ0FBQyxDQUFDO2FBQzlEOztTQUNGO0FBQ0QsWUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEVBSWhCO0FBQ0QsWUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBSWQ7QUFDRCxlQUFPLE1BQU0sQ0FBQztPQUNmO0tBQ0Y7R0FDRjtDQUNGLENBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakZELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFdEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7QUFJMUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFTLE1BQU0sRUFBRTtBQUMvQixTQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDekQsQ0FBQzs7O0FBR0YsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtBQUM3QyxNQUFJLElBQUksSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtBQUM1QyxPQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNuQjtBQUNELE9BQUssR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEIsTUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQUFBQyxDQUFDOztBQUV2QyxNQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7QUFDZixPQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osU0FBSyxHQUFHLENBQUMsQ0FBQztHQUNYLE1BQU07QUFDTCxPQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0dBQ2pCOzs7QUFHRCxNQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7TUFDVixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQSxJQUFLLElBQUksSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzVELE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNCLFNBQU8sRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFO0FBQ3ZCLFVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDdEIsU0FBSyxJQUFJLElBQUksQ0FBQztHQUNmO0FBQ0QsU0FBTyxNQUFNLENBQUM7Q0FDZixDQUFDOzs7O0FBSUYsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7V0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7R0FBQSxDQUFDLENBQUM7Q0FDaEUsQ0FBQzs7Ozs7Ozs7OztBQVVBLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDdEQsTUFBSSxDQUNELElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQ2hCLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDVixjQUFVLENBQUMsWUFBTTtBQUFFLFlBQU0sQ0FBQyxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNuQyxDQUFDLENBQUM7Q0FDTixDQUFDOzs7O0FBSUosSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sRUFBRTtBQUNWLFFBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxHQUFHO0FBQ3BDLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQztHQUN4RixDQUFDO0NBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtjcmVhdGU6IGNyZWF0ZVJvdXRlciwgSGlzdG9yeUxvY2F0aW9ufSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbnJlcXVpcmUoXCJzaGFyZWQvc2hpbXNcIik7XG5sZXQge3BhcnNlSnNvbkFwaVF1ZXJ5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCByb3V0ZXMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm91dGVzXCIpO1xubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG53aW5kb3cucm91dGVyID0gY3JlYXRlUm91dGVyKHtcbiAgcm91dGVzOiByb3V0ZXMsXG4gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbn0pO1xuXG53aW5kb3cucm91dGVyLnJ1bigoQXBwbGljYXRpb24sIHVybCkgPT4ge1xuICAvLyB5b3UgbWlnaHQgd2FudCB0byBwdXNoIHRoZSBzdGF0ZSBvZiB0aGUgcm91dGVyIHRvIGFcbiAgLy8gc3RvcmUgZm9yIHdoYXRldmVyIHJlYXNvblxuICAvLyBSb3V0ZXJBY3Rpb25zLnJvdXRlQ2hhbmdlKHtyb3V0ZXJTdGF0ZTogc3RhdGV9KTtcblxuICAvLyBTRVQgQkFPQkFCIFVSTCBEQVRBIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBsZXQgaGFuZGxlciA9IHVybC5yb3V0ZXMuc2xpY2UoLTEpWzBdLm5hbWU7XG4gIHN0YXRlLnNlbGVjdChcInVybFwiLCBcImhhbmRsZXJcIikuc2V0KGhhbmRsZXIpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHN0YXRlLnNlbGVjdChcInVybFwiLCBcImlkXCIpLnNldChpZCk7XG4gIH1cblxuICBsZXQgcGFnZSA9IHVybC5wYXJhbXMucGFnZSAmJiBwYXJzZUludCh1cmwucGFyYW1zLnBhZ2UpO1xuICBpZiAocGFnZSkge1xuICAgIHN0YXRlLnNlbGVjdChcInVybFwiLCBcInBhZ2VcIikuc2V0KHBhZ2UpO1xuICB9XG5cbiAgbGV0IHtmaWx0ZXJzLCBzb3J0c30gPSBwYXJzZUpzb25BcGlRdWVyeSh1cmwucXVlcnkpO1xuICBpZiAoZmlsdGVycykge1xuICAgIHN0YXRlLnNlbGVjdChcInVybFwiLCBcImZpbHRlcnNcIikuc2V0KGZpbHRlcnMpO1xuICB9XG4gIGlmIChzb3J0cykge1xuICAgIHN0YXRlLnNlbGVjdChcInVybFwiLCBcInNvcnRzXCIpLnNldChzb3J0cyk7XG4gIH1cblxuICBzdGF0ZS5jb21taXQoKTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBsZXQgcHJvbWlzZXMgPSB1cmwucm91dGVzXG4gICAgLm1hcChyb3V0ZSA9PiByb3V0ZS5oYW5kbGVyLm9yaWdpbmFsIHx8IHt9KVxuICAgIC5tYXAob3JpZ2luYWwgPT4ge1xuICAgICAgaWYgKG9yaWdpbmFsLmxvYWRQYWdlKSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbC5sb2FkUGFnZShwYWdlLCBmaWx0ZXJzLCBzb3J0cyk7XG4gICAgICB9IGVsc2UgaWYgKG9yaWdpbmFsLmxvYWRNb2RlbCkge1xuICAgICAgICByZXR1cm4gb3JpZ2luYWwubG9hZE1vZGVsKGlkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgUmVhY3QucmVuZGVyKDxBcHBsaWNhdGlvbi8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xuICB9KTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Rpc3QtbW9kdWxlcy9kZWNvcmF0b3JzLmpzJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5yb290ID0gcm9vdDtcbmV4cG9ydHMuYnJhbmNoID0gYnJhbmNoO1xuLyoqXG4gKiBCYW9iYWItUmVhY3QgRGVjb3JhdG9yc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogRVM3IGRlY29yYXRvcnMgc3VnYXIgZm9yIGhpZ2hlciBvcmRlciBjb21wb25lbnRzLlxuICovXG5cbnZhciBfUm9vdCRCcmFuY2ggPSByZXF1aXJlKCcuL2hpZ2hlci1vcmRlci5qcycpO1xuXG5mdW5jdGlvbiByb290KHRyZWUpIHtcbiAgaWYgKHR5cGVvZiB0cmVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5yb290KHRyZWUpO1xuICB9cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLnJvb3QodGFyZ2V0LCB0cmVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYnJhbmNoKHNwZWNzKSB7XG4gIGlmICh0eXBlb2Ygc3BlY3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLmJyYW5jaChzcGVjcyk7XG4gIH1yZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2guYnJhbmNoKHRhcmdldCwgc3BlY3MpO1xuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9O1xuXG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxudmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG4vKipcbiAqIFJvb3QgY29tcG9uZW50XG4gKi9cbmV4cG9ydHMucm9vdCA9IHJvb3Q7XG5cbi8qKlxuICogQnJhbmNoIGNvbXBvbmVudFxuICovXG5leHBvcnRzLmJyYW5jaCA9IGJyYW5jaDtcbi8qKlxuICogQmFvYmFiLVJlYWN0IEhpZ2hlciBPcmRlciBDb21wb25lbnRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEVTNiBoaWdoZXIgb3JkZXIgY29tcG9uZW50IHRvIGVuY2hhbmNlIG9uZSdzIGNvbXBvbmVudC5cbiAqL1xuXG52YXIgX1JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9SZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfUmVhY3QpO1xuXG52YXIgX3R5cGUgPSByZXF1aXJlKCcuL3V0aWxzL3R5cGUuanMnKTtcblxudmFyIF90eXBlMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF90eXBlKTtcblxudmFyIF9Qcm9wVHlwZXMgPSByZXF1aXJlKCcuL3V0aWxzL3Byb3AtdHlwZXMuanMnKTtcblxudmFyIF9Qcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX1Byb3BUeXBlcyk7XG5cbmZ1bmN0aW9uIHJvb3QoQ29tcG9uZW50LCB0cmVlKSB7XG4gIGlmICghX3R5cGUyWydkZWZhdWx0J10uQmFvYmFiKHRyZWUpKSB0aHJvdyBFcnJvcignYmFvYmFiLXJlYWN0OmhpZ2hlci1vcmRlci5yb290OiBnaXZlbiB0cmVlIGlzIG5vdCBhIEJhb2JhYi4nKTtcblxuICB2YXIgQ29tcG9zZWRDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICB2YXIgX2NsYXNzID0gZnVuY3Rpb24gQ29tcG9zZWRDb21wb25lbnQoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX2NsYXNzKTtcblxuICAgICAgaWYgKF9SZWFjdCRDb21wb25lbnQgIT0gbnVsbCkge1xuICAgICAgICBfUmVhY3QkQ29tcG9uZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9pbmhlcml0cyhfY2xhc3MsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgX2NyZWF0ZUNsYXNzKF9jbGFzcywgW3tcbiAgICAgIGtleTogJ2dldENoaWxkQ29udGV4dCcsXG5cbiAgICAgIC8vIEhhbmRsaW5nIGNoaWxkIGNvbnRleHRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHJlZTogdHJlZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3JlbmRlcicsXG5cbiAgICAgIC8vIFJlbmRlciBzaGltXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gX1JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCB0aGlzLnByb3BzKTtcbiAgICAgIH1cbiAgICB9XSwgW3tcbiAgICAgIGtleTogJ29yaWdpbmFsJyxcbiAgICAgIHZhbHVlOiBDb21wb25lbnQsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY2hpbGRDb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdHJlZTogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5iYW9iYWJcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIF9jbGFzcztcbiAgfSkoX1JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbiAgcmV0dXJuIENvbXBvc2VkQ29tcG9uZW50O1xufVxuXG5mdW5jdGlvbiBicmFuY2goQ29tcG9uZW50KSB7XG4gIHZhciBzcGVjcyA9IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgaWYgKCFfdHlwZTJbJ2RlZmF1bHQnXS5PYmplY3Qoc3BlY3MpKSB0aHJvdyBFcnJvcignYmFvYmFiLXJlYWN0LmhpZ2hlci1vcmRlcjogaW52YWxpZCBzcGVjaWZpY2F0aW9ucyAnICsgJyhzaG91bGQgYmUgYW4gb2JqZWN0IHdpdGggY3Vyc29ycyBhbmQvb3IgZmFjZXRzIGtleSkuJyk7XG5cbiAgdmFyIENvbXBvc2VkQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50Mikge1xuICAgIHZhciBfY2xhc3MyID1cblxuICAgIC8vIEJ1aWxkaW5nIGluaXRpYWwgc3RhdGVcbiAgICBmdW5jdGlvbiBDb21wb3NlZENvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzczIpO1xuXG4gICAgICBfZ2V0KE9iamVjdC5nZXRQcm90b3R5cGVPZihfY2xhc3MyLnByb3RvdHlwZSksICdjb25zdHJ1Y3RvcicsIHRoaXMpLmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuXG4gICAgICB2YXIgZmFjZXQgPSBjb250ZXh0LnRyZWUuY3JlYXRlRmFjZXQoc3BlY3MsIHRoaXMpO1xuXG4gICAgICBpZiAoZmFjZXQpIHRoaXMuc3RhdGUgPSBmYWNldC5nZXQoKTtcblxuICAgICAgdGhpcy5mYWNldCA9IGZhY2V0O1xuICAgIH07XG5cbiAgICBfaW5oZXJpdHMoX2NsYXNzMiwgX1JlYWN0JENvbXBvbmVudDIpO1xuXG4gICAgX2NyZWF0ZUNsYXNzKF9jbGFzczIsIFt7XG4gICAgICBrZXk6ICdnZXRDaGlsZENvbnRleHQnLFxuXG4gICAgICAvLyBDaGlsZCBjb250ZXh0XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGN1cnNvcnM6IHRoaXMuZmFjZXQuY3Vyc29yc1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcblxuICAgICAgLy8gT24gY29tcG9uZW50IG1vdW50XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfXZhciBoYW5kbGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZmFjZXQuZ2V0KCkpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZmFjZXQub24oJ3VwZGF0ZScsIGhhbmRsZXIpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3JlbmRlcicsXG5cbiAgICAgIC8vIFJlbmRlciBzaGltXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gX1JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LCBfZXh0ZW5kcyh7fSwgdGhpcy5wcm9wcywgdGhpcy5zdGF0ZSkpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxVbm1vdW50JyxcblxuICAgICAgLy8gT24gY29tcG9uZW50IHVubW91bnRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZhY2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIFJlbGVhc2luZyBmYWNldFxuICAgICAgICB0aGlzLmZhY2V0LnJlbGVhc2UoKTtcbiAgICAgICAgdGhpcy5mYWNldCA9IG51bGw7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6ICdvcmlnaW5hbCcsXG4gICAgICB2YWx1ZTogQ29tcG9uZW50LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbnRleHRUeXBlcycsXG4gICAgICB2YWx1ZToge1xuICAgICAgICB0cmVlOiBfUHJvcFR5cGVzMlsnZGVmYXVsdCddLmJhb2JhYlxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGlsZENvbnRleHRUeXBlcycsXG4gICAgICB2YWx1ZToge1xuICAgICAgICBjdXJzb3JzOiBfUHJvcFR5cGVzMlsnZGVmYXVsdCddLmN1cnNvcnNcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIF9jbGFzczI7XG4gIH0pKF9SZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG4gIHJldHVybiBDb21wb3NlZENvbXBvbmVudDtcbn0iLCIvKipcbiAqIEJhb2JhYi1SZWFjdCBDdXN0b20gUHJvcCBUeXBlc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFByb3BUeXBlcyB1c2VkIHRvIHByb3BhZ2F0ZSBjb250ZXh0IHNhZmVseS5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHJlcXVpcmUoJy4vdHlwZS5qcycpO1xuXG5mdW5jdGlvbiBlcnJvck1lc3NhZ2UocHJvcE5hbWUsIHdoYXQpIHtcbiAgcmV0dXJuICdwcm9wIHR5cGUgYCcgKyBwcm9wTmFtZSArICdgIGlzIGludmFsaWQ7IGl0IG11c3QgYmUgJyArIHdoYXQgKyAnLic7XG59XG5cbnZhciBQcm9wVHlwZXMgPSB7fTtcblxuUHJvcFR5cGVzLmJhb2JhYiA9IGZ1bmN0aW9uIChwcm9wcywgcHJvcE5hbWUpIHtcbiAgaWYgKCF0eXBlLkJhb2JhYihwcm9wc1twcm9wTmFtZV0pKSByZXR1cm4gbmV3IEVycm9yKGVycm9yTWVzc2FnZShwcm9wTmFtZSwgJ2EgQmFvYmFiIHRyZWUnKSk7XG59O1xuXG5Qcm9wVHlwZXMuY3Vyc29ycyA9IGZ1bmN0aW9uIChwcm9wcywgcHJvcE5hbWUpIHtcbiAgdmFyIHAgPSBwcm9wc1twcm9wTmFtZV07XG5cbiAgdmFyIHZhbGlkID0gdHlwZS5PYmplY3QocCkgJiYgT2JqZWN0LmtleXMocCkuZXZlcnkoZnVuY3Rpb24gKGspIHtcbiAgICByZXR1cm4gdHlwZS5DdXJzb3IocFtrXSk7XG4gIH0pO1xuXG4gIGlmICghdmFsaWQpIHJldHVybiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKHByb3BOYW1lLCAnQmFvYmFiIGN1cnNvcnMnKSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3BUeXBlczsiLCIvKipcbiAqIEJhb2JhYi1SZWFjdCBUeXBlIENoZWNraW5nXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBTb21lIGhlbHBlcnMgdG8gcGVyZm9ybSBydW50aW1lIHZhbGlkYXRpb25zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0ge307XG5cbnR5cGUuT2JqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xufTtcblxudHlwZS5CYW9iYWIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZS50b1N0cmluZygpID09PSAnW29iamVjdCBCYW9iYWJdJztcbn07XG5cbnR5cGUuQ3Vyc29yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQ3Vyc29yXSc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGU7IiwiaW1wb3J0IGFsZXJ0QWRkIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtYWRkXCI7XG5pbXBvcnQgYWxlcnRMb2FkUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtcGFnZVwiO1xuaW1wb3J0IGFsZXJ0TG9hZE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtbG9hZC1tb2RlbFwiO1xuaW1wb3J0IGFsZXJ0UmVtb3ZlIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtcmVtb3ZlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWxlcnQ6IHtcbiAgICBhZGQ6IGFsZXJ0QWRkLFxuICAgIGxvYWRQYWdlOiBhbGVydExvYWRQYWdlLFxuICAgIGxvYWRNb2RlbDogYWxlcnRMb2FkTW9kZWwsXG4gICAgcmVtb3ZlOiBhbGVydFJlbW92ZSxcbiAgfSxcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtBbGVydH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL21vZGVsc1wiKTtcbmxldCBzdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IEFsZXJ0KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbnBlcnNpc3RlbnQgYWRkXG4gIHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG5ld01vZGVsKTtcbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxubGV0IHt0b09iamVjdH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgc3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaE1vZGVsKGlkKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE1vY2sgQVBJIHJlcXVlc3RcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQoZmFsc2UpO1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDIwMCk7IC8vIEhUVFAgcmVzcG9uc2Uuc3RhdHVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbChpZCkge1xuICBsZXQgbW9kZWwgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikuZ2V0KGlkKTtcbiAgaWYgKG1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxubGV0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBzdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoUGFnZShwYWdlLCBwZXJwYWdlLCBmaWx0ZXJzLCBzb3J0cykge1xuICAvLyBNb2NrIEFQSSByZXF1ZXN0XG4gIGxldCBhcGlVUkwgPSBgYXBpL2FsZXJ0c2A7XG4gIGxldCBwYXJhbXMgPSBmb3JtYXRKc29uQXBpUXVlcnkocGFnZSwgcGVycGFnZSwgZmlsdGVycywgc29ydHMpO1xuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIikubWVyZ2Uoe1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgIHRvdGFsOiAwLFxuICAgIG1vZGVsczoge30sXG4gIH0pO1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDIwMCk7IC8vIEhUVFAgcmVzcG9uc2Uuc3RhdHVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRQYWdlKHBhZ2UsIGZpbHRlcnMsIHNvcnRzKSB7XG4gIGxldCBwYWdpbmF0aW9uID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwicGFnaW5hdGlvblwiKS5nZXQoKTtcbiAgbGV0IHBlcnBhZ2UgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJwZXJwYWdlXCIpLmdldCgpO1xuICBsZXQgaWRzID0gcGFnaW5hdGlvbltwYWdlXTtcbiAgaWYgKCFpZHMpIHtcbiAgICByZXR1cm4gZmV0Y2hQYWdlKHBhZ2UsIHBlcnBhZ2UsIGZpbHRlcnMsIHNvcnRzKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9uLXBlcnNpc3RlbnQgcmVtb3ZlXG4gIHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBnZXRBbGxNZXRob2RzKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5maWx0ZXIoa2V5ID0+IHR5cGVvZiBvYmpba2V5XSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuXG5mdW5jdGlvbiBhdXRvQmluZChvYmopIHtcbiAgZ2V0QWxsTWV0aG9kcyhvYmouY29uc3RydWN0b3IucHJvdG90eXBlKVxuICAgIC5mb3JFYWNoKG10ZCA9PiB7XG4gICAgICBvYmpbbXRkXSA9IG9ialttdGRdLmJpbmQob2JqKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b0JpbmQodGhpcyk7XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0c1tcIkFib3V0XCJdID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9hYm91dFwiKTtcbm1vZHVsZS5leHBvcnRzW1wiQm9keVwiXSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvYm9keVwiKTtcbm1vZHVsZS5leHBvcnRzW1wiRXJyb3JcIl0gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2Vycm9yXCIpO1xubW9kdWxlLmV4cG9ydHNbXCJIZWFkcm9vbVwiXSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaGVhZHJvb21cIik7XG5tb2R1bGUuZXhwb3J0c1tcIkhvbWVcIl0gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2hvbWVcIik7XG5tb2R1bGUuZXhwb3J0c1tcIkxvYWRpbmdcIl0gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIik7XG5tb2R1bGUuZXhwb3J0c1tcIk5vdEZvdW5kXCJdID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9ub3QtZm91bmRcIik7XG5tb2R1bGUuZXhwb3J0c1tcIlBhZ2luYXRpb25cIl0gPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb25cIik7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKFwicmMtY3NzLXRyYW5zaXRpb24tZ3JvdXBcIik7XG5cbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5sZXQgTG9hZGluZyA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCIpO1xubGV0IE5vdEZvdW5kID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiKTtcbmxldCBBbGVydEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaXRlbVwiKTtcbmxldCBzdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtzdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIGFsZXJ0czogW1wiYWxlcnRzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5hbGVydHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBDYW4ndCBydW4gdGhpcyBjcmFwIGZvciBub3cgVE9ETyByZWNoZWNrIGFmdGVyIHRyYW5zaXRpb24gdG8gV2VicGFja1xuLy8gMSkgcmVhY3QvYWRkb25zIHB1bGxzIHdob2xlIG5ldyByZWFjdCBjbG9uZSBpbiBicm93c2VyaWZ5XG4vLyAyKSByYy1jc3MtdHJhbnNpdGlvbi1ncm91cCBjb250YWlucyB1bmNvbXBpbGVkIEpTWCBzeW50YXhcbi8vIE9NRyB3aGF0IGFuIGlkaW90cyAmXyZcblxuLy88Q1NTVHJhbnNpdGlvbkdyb3VwIHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiIGNvbXBvbmVudD1cImRpdlwiPlxuLy8gIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbi8vPC9DU1NUcmFuc2l0aW9uR3JvdXA+XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgY2xhc3NOYW1lcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbmxldCBjb21tb25BY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRXhwaXJlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBkZWxheTogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICAvL29uRXhwaXJlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY3Rpb24sXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWxheTogNTAwLFxuICAgICAgLy9vbkV4cGlyZTogdW5kZWZpbmVkLFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAvLyBSZXNldCB0aGUgdGltZXIgaWYgY2hpbGRyZW4gYXJlIGNoYW5nZWRcbiAgICBpZiAobmV4dFByb3BzLmNoaWxkcmVuICE9PSB0aGlzLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgICB9XG4gIH0sXG5cbiAgc3RhcnRUaW1lcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgLy8gQ2xlYXIgZXhpc3RpbmcgdGltZXJcbiAgICBpZiAodGhpcy5fdGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGFmdGVyIGBtb2RlbC5kZWxheWAgbXNcbiAgICBpZiAodGhpcy5wcm9wcy5kZWxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5vbkV4cGlyZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vbkV4cGlyZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgICAgIH0sIHRoaXMucHJvcHMuZGVsYXkpO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+O1xuICB9LFxufSk7XG5cbmxldCBDbG9zZUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2soKTtcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxhIGNsYXNzTmFtZT1cImNsb3NlIHB1bGwtcmlnaHRcIiBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PiZ0aW1lczs8L2E+XG4gICAgKTtcbiAgfVxufSk7XG5cbmxldCBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGxldCBjbGFzc2VzID0gY2xhc3NOYW1lcyh7XG4gICAgICBcImFsZXJ0XCI6IHRydWUsXG4gICAgICBbXCJhbGVydC1cIiArIG1vZGVsLmNhdGVnb3J5XTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHQgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gey4uLnRoaXMucHJvcHN9PlxuICAgICAgICB7bW9kZWwuY2xvc2FibGUgPyA8Q2xvc2VMaW5rIG9uQ2xpY2s9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfS8+IDogXCJcIn1cbiAgICAgICAge21vZGVsLm1lc3NhZ2V9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuXG4gICAgaWYgKG1vZGVsLmV4cGlyZSkge1xuICAgICAgcmVzdWx0ID0gPEV4cGlyZSBvbkV4cGlyZT17Y29tbW9uQWN0aW9ucy5hbGVydC5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9IGRlbGF5PXttb2RlbC5leHBpcmV9PntyZXN1bHR9PC9FeHBpcmU+O1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgSXRlbTtcblxuXG4vKlxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuXG4gIHRoaXMuJGVsZW1lbnQuYXBwZW5kKHRoaXMuJG5vdGUpO1xuICB0aGlzLiRub3RlLmFsZXJ0KCk7XG59O1xuXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG4gIGVsc2Ugb25DbG9zZS5jYWxsKHRoaXMpO1xufTtcblxuJC5mbi5ub3RpZnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbih0aGlzLCBvcHRpb25zKTtcbn07XG4qL1xuXG4vLyBUT0RPIGNoZWNrIHRoaXMgaHR0cHM6Ly9naXRodWIuY29tL2dvb2R5YmFnL2Jvb3RzdHJhcC1ub3RpZnkvdHJlZS9tYXN0ZXIvY3NzL3N0eWxlc1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHtyb290fSA9IHJlcXVpcmUoXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiKTtcbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCB7TGluaywgUm91dGVIYW5kbGVyfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcbmxldCBjb21tb25BY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCIpO1xubGV0IEhlYWRyb29tID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCIpO1xubGV0IEFsZXJ0SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIik7XG5sZXQgc3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkByb290KHN0YXRlKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YShwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgLy8gSWdub3JlIHBhcmFtcyBhbmQgcXVlcnlcbiAgICByZXR1cm4gY29tbW9uQWN0aW9ucy5hbGVydC5sb2FkUGFnZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBoZWFkcm9vbUNsYXNzTmFtZXMgPSB7dmlzaWJsZTogXCJuYXZiYXItZG93blwiLCBoaWRkZW46IFwibmF2YmFyLXVwXCJ9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICAgPEhlYWRyb29tIGNvbXBvbmVudD1cImhlYWRlclwiIGlkPVwicGFnZS1oZWFkZXJcIiBjbGFzc05hbWU9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIiBoZWFkcm9vbUNsYXNzTmFtZXM9e2hlYWRyb29tQ2xhc3NOYW1lc30+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWhlYWRlclwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIm5hdmJhci10b2dnbGUgY29sbGFwc2VkXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBicmFja2V0cy1lZmZlY3RcIj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fT5Sb2JvdHM8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJhYm91dFwiPkFib3V0PC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9IZWFkcm9vbT5cblxuICAgICAgICA8bWFpbiBpZD1cInBhZ2UtbWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgey8qPEFsZXJ0SW5kZXgvPiovfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxubGV0IENvbXBvbmVudCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbG9hZEVycm9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFtcInhzXCIsIFwic21cIiwgXCJtZFwiLCBcImxnXCJdKSxcbiAgfVxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2l6ZTogXCJtZFwiLFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRXJyb3IgXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5zdGF0dXMgKyBcIjogXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5kZXNjcmlwdGlvbn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgXCJhbGVydC1hcy1pY29uXCI6IHRydWUsXG4gICAgICAgICAgXCJmYS1zdGFja1wiOiB0cnVlLFxuICAgICAgICAgIFt0aGlzLnByb3BzLnNpemVdOiB0cnVlXG4gICAgICAgIH0pfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3RhY2stMXhcIj48L2k+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtYmFuIGZhLXN0YWNrLTJ4XCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQgdGhyb3R0bGUgPSByZXF1aXJlKFwibG9kYXNoLnRocm90dGxlXCIpO1xuXG5sZXQgQ29tcG9uZW50ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRyb29tIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb21wb25lbnQ6IFwiZGl2XCIsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiB7XG4gICAgICB2aXNpYmxlOiBcIm5hdmJhci1kb3duXCIsXG4gICAgICBoaWRkZW46IFwibmF2YmFyLXVwXCJcbiAgICB9LFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgY2xhc3NOYW1lOiBcIlwiXG4gIH1cblxuICBoYXNTY3JvbGxlZCgpIHtcbiAgICBsZXQgdG9wUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAvLyBNYWtlIHN1cmUgdXNlcnMgc2Nyb2xsIG1vcmUgdGhhbiBkZWx0YVxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxhc3RTY3JvbGxUb3AgLSB0b3BQb3NpdGlvbikgPD0gdGhpcy5kZWx0YUhlaWdodCkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGhleSBzY3JvbGxlZCBkb3duIGFuZCBhcmUgcGFzdCB0aGUgbmF2YmFyLCBhZGQgY2xhc3MgYHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGVgLlxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHlvdSBuZXZlciBzZWUgd2hhdCBpcyBcImJlaGluZFwiIHRoZSBuYXZiYXIuXG4gICAgaWYgKHRvcFBvc2l0aW9uID4gdGhpcy5sYXN0U2Nyb2xsVG9wICYmIHRvcFBvc2l0aW9uID4gdGhpcy5lbGVtZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLmhpZGRlbn0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgodG9wUG9zaXRpb24gKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRvcFBvc2l0aW9uO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5wcm9wcy5jb21wb25lbnQ7XG4gICAgbGV0IHByb3BzID0ge2lkOiB0aGlzLnByb3BzLmlkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLnN0YXRlLmNsYXNzTmFtZX07XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBjb21wb25lbnQsXG4gICAgICBwcm9wcyxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYlwiPkJhb2JhYjwvYT4gSlMgZGF0YSB0cmVlIHdpdGggY3Vyc29yczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXJcIj5SZWFjdC1Sb3V0ZXI8L2E+IGRlY2xhcmF0aXZlIHJvdXRlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlYWN0LWRvY3VtZW50LXRpdGxlXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+IGRlY2xhcmF0aXZlIGRvY3VtZW50IHRpdGxlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL1wiPlJlYWN0LUJvb3RzdHJhcDwvYT4gQm9vdHN0cmFwIGNvbXBvbmVudHMgaW4gUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYnJvd3NlcmlmeS5vcmcvXCI+QnJvd3NlcmlmeTwvYT4gJmFtcDsgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay93YXRjaGlmeVwiPldhdGNoaWZ5PC9hPiBidW5kbGUgTlBNIG1vZHVsZXMgdG8gZnJvbnRlbmQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYm93ZXIuaW8vXCI+Qm93ZXI8L2E+IGZyb250ZW5kIHBhY2thZ2UgbWFuYWdlcjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9leHByZXNzanMuY29tL1wiPkV4cHJlc3M8L2E+IHdlYi1hcHAgYmFja2VuZCBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW96aWxsYS5naXRodWIuaW8vbnVuanVja3MvXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9lbGVpdGgvZW1haWxqc1wiPkVtYWlsSlM8L2E+IFNNVFAgY2xpZW50PC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IEpTIHRyYW5zcGlsZXI8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ3VscGpzLmNvbS9cIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9sb2Rhc2guY29tL1wiPkxvZGFzaDwvYT4gdXRpbGl0eSBsaWJyYXJ5PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcIj5BeGlvczwvYT4gcHJvbWlzZS1iYXNlZCBIVFRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9pbW11dGFibGUtanNcIj5JbW11dGFibGU8L2E+IHBlcnNpc3RlbnQgaW1tdXRhYmxlIGRhdGEgZm9yIEpTPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21vbWVudGpzLmNvbS9cIj5Nb21lbnQ8L2E+IGRhdGUtdGltZSBzdHVmZjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXJhay9GYWtlci5qcy9cIj5GYWtlcjwvYT4gZmFrZSBkYXRhIGdlbmVyYXRpb248L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+VkNTPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9naXQtc2NtLmNvbS9cIj5HaXQ8L2E+IHZlcnNpb24gY29udHJvbCBzeXN0ZW08L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IERvY3VtZW50VGl0bGUgPSByZXF1aXJlKFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIik7XG5cbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImFsZXJ0LWFzLWljb25cIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBSZWFjdCA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG5sZXQgQ29tcG9uZW50ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIik7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdEZvdW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgZW5kcG9pbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHBhZ2U6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBwZXJwYWdlOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMucGVycGFnZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHBhZ2UgPSB0aGlzLnByb3BzLnBhZ2U7XG4gICAgbGV0IHRvdGFsUGFnZXMgPSB0aGlzLnRvdGFsUGFnZXMoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8TGluayB0bz17dGhpcy5wcm9wcy5lbmRwb2ludH1cbiAgICAgICAgICAgICAgcGFyYW1zPXtwYWdlID09IDEgPyB7cGFnZTogMX0gOiB7cGFnZTogcGFnZSAtIDF9fVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIGRpc2FibGVkOiBwYWdlID09IDF9KX1cbiAgICAgICAgICAgICAgdGl0bGU9e2BUbyBwYWdlICR7cGFnZSA9PSAxID8gMSA6IHBhZ2UgLSAxfWB9PlxuICAgICAgICAgICAgICA8c3Bhbj4mbGFxdW87PC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge0FycmF5LnJhbmdlKDEsIHRoaXMudG90YWxQYWdlcygpICsgMSkubWFwKHAgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGtleT17cH0+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgICAgICAgICBwYXJhbXM9e3twYWdlOiBwfX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgZGlzYWJsZWQ6IHAgPT0gcGFnZX0pfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBwYWdlICR7cH1gfT5cbiAgICAgICAgICAgICAgICAgIHtwfVxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPExpbmsgdG89e3RoaXMucHJvcHMuZW5kcG9pbnR9XG4gICAgICAgICAgICAgIHBhcmFtcz17cGFnZSA9PSB0b3RhbFBhZ2VzID8ge3BhZ2U6IHRvdGFsUGFnZXN9IDoge3BhZ2U6IHBhZ2UgKyAxfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBkaXNhYmxlZDogcGFnZSA9PSB0b3RhbFBhZ2VzfSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gcGFnZSAke3BhZ2UgPT0gdG90YWxQYWdlcyA/IHRvdGFsUGFnZXMgOiBwYWdlICsgMX1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICB7LypUb3RhbDoge3RoaXMucHJvcHMudG90YWx9PGJyLz4qL31cbiAgICAgICAgey8qUGVycGFnZToge3RoaXMucHJvcHMucGVycGFnZX08YnIvPiovfVxuICAgICAgICB7LypUb3RhbFBhZ2VzOiB7dGhpcy50b3RhbFBhZ2VzKCl9PGJyLz4qL31cbiAgICAgIDwvbmF2PlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgc29ydEJ5ID0gcmVxdWlyZShcImxvZGFzaC5zb3J0YnlcIik7XG5sZXQgaXNBcnJheSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNhcnJheVwiKTtcbmxldCBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc3BsYWlub2JqZWN0XCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcbiAgaWYgKGlzQXJyYXkoYXJyYXkpKSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgob2JqZWN0LCBpdGVtKSA9PiB7XG4gICAgICBvYmplY3RbaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoXCJleHBlY3RlZCB0eXBlIGlzIEFycmF5LCBnZXQgXCIgKyB0eXBlb2YgYXJyYXkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iamVjdCkge1xuICBpZiAoaXNQbGFpbk9iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIHNvcnRCeShcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGtleSA9PiBvYmplY3Rba2V5XSksXG4gICAgICBpdGVtID0+IGl0ZW0uaWRcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKFwiZXhwZWN0ZWQgdHlwZSBpcyBPYmplY3QsIGdldCBcIiArIHR5cGVvZiBvYmplY3QpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSkge1xuICByZXR1cm4ge1xuICAgIGZpbHRlcnM6IHF1ZXJ5LmZpbHRlcixcbiAgICBzb3J0czogKHF1ZXJ5LnNvcnQgPyBxdWVyeS5zb3J0LnNwbGl0KFwiLFwiKS5tYXAodiA9PiB2LnJlcGxhY2UoL14gLywgXCIrXCIpKSA6IHVuZGVmaW5lZClcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEpzb25BcGlRdWVyeShwYWdlLCBwZXJwYWdlLCBmaWx0ZXJzLCBzb3J0cykge1xuICBsZXQgcGFnZU9iaiwgZmlsdGVyT2JqLCBzb3J0T2JqO1xuICBpZiAocGFnZSAmJiBwZXJwYWdlKSB7XG4gICAgcGFnZU9iaiA9IHtcbiAgICAgIFwicGFnZVtvZmZzZXRdXCI6IChwYWdlID4gMSA/IHBhZ2UgLSAxIDogMCkgKiBwZXJwYWdlLFxuICAgICAgXCJwYWdlW2xpbWl0XVwiOiBwZXJwYWdlLFxuICAgIH07XG4gIH1cbiAgaWYgKGZpbHRlcnMpIHtcbiAgICBmaWx0ZXJPYmogPSBPYmplY3Qua2V5cyhmaWx0ZXJzKS5yZWR1Y2UoKGZpbHRlck9iaiwga2V5KSA9PiB7XG4gICAgICBmaWx0ZXJPYmpbYGZpbHRlclske2tleX1dYF0gPSBmaWx0ZXJzW2tleV07XG4gICAgICByZXR1cm4gZmlsdGVyT2JqO1xuICAgIH0sIHt9KTtcbiAgfVxuICBpZiAoc29ydHMpIHtcbiAgICBzb3J0T2JqID0ge1xuICAgICAgXCJzb3J0XCI6IHNvcnRzLmpvaW4oXCIsXCIpLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBhZ2VPYmosIGZpbHRlck9iaiwgc29ydE9iaik7XG59IiwibW9kdWxlLmV4cG9ydHNbXCJBbGVydFwiXSA9IHJlcXVpcmUoXCIuL21vZGVscy9hbGVydFwiKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVVVJRCA9IHJlcXVpcmUoXCJub2RlLXV1aWRcIik7XG5cbi8vIE1PREVMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0KGRhdGEpIHtcbiAgaWYgKCFkYXRhLm1lc3NhZ2UpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLm1lc3NhZ2VgIGlzIHJlcXVpcmVkXCIpO1xuICB9XG4gIGlmICghZGF0YS5jYXRlZ29yeSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEuY2F0ZWdvcnlgIGlzIHJlcXVpcmVkXCIpO1xuICB9XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogZGF0YS5jYXRlZ29yeSA9PSBcImVycm9yXCIgPyAwIDogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gUFJPWFkgUk9VVEVSIFRPIFJFTU9WRSBDSVJDVUxBUiBERVBFTkRFTkNZID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVHVybnM6XG4vLyAgIGFwcCAocm91dGVyKSA8LSByb3V0ZXMgPC0gY29tcG9uZW50cyA8LSBhY3Rpb25zIDwtIGFwcCAocm91dGVyKVxuLy8gdG86XG4vLyAgIGFwcCAocm91dGVyKSA8LSByb3V0ZXMgPC0gY29tcG9uZW50cyA8LSBhY3Rpb25zIDwtIHByb3h5IChyb3V0ZXIpXG5sZXQgcHJveHkgPSB7XG4gIG1ha2VQYXRoKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5yb3V0ZXIubWFrZVBhdGgodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIG1ha2VIcmVmKHRvLCBwYXJhbXMsIHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5yb3V0ZXIubWFrZUhyZWYodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHdpbmRvdy5yb3V0ZXIudHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIHF1ZXJ5KTtcbiAgfSxcblxuICByZXBsYWNlV2l0aCh0bywgcGFyYW1zLCBxdWVyeSkge1xuICAgIHdpbmRvdy5yb3V0ZXIucmVwbGFjZVdpdGgodG8sIHBhcmFtcywgcXVlcnkpO1xuICB9LFxuXG4gIGdvQmFjaygpIHtcbiAgICB3aW5kb3cucm91dGVyLmdvQmFjaygpO1xuICB9LFxuXG4gIHJ1bihyZW5kZXIpIHtcbiAgICB3aW5kb3cucm91dGVyLnJ1bihyZW5kZXIpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcm94eTtcblxuXG4iLCJpbXBvcnQgYWRkIGZyb20gXCIuL2FjdGlvbnMvYWRkXCI7XG5pbXBvcnQgZWRpdCBmcm9tIFwiLi9hY3Rpb25zL2VkaXRcIjtcbmltcG9ydCBsb2FkUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtcGFnZVwiO1xuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtbW9kZWxcIjtcbmltcG9ydCByZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhZGQsIGVkaXQsIGxvYWRQYWdlLCBsb2FkTW9kZWwsIHJlbW92ZVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxubGV0IHJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCIpO1xubGV0IGNvbW1vbkFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIik7XG5sZXQgUm9ib3QgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCIpO1xubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWR9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yfSk7XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGFkZFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5cbmxldCByb3V0ZXIgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiKTtcbmxldCBjb21tb25BY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCIpO1xubGV0IFJvYm90ID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L21vZGVsc1wiKTtcbmxldCBzdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWRpdChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgb2xkTW9kZWwgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KGFwaVVSTCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQob2xkTW9kZWwpOyAvLyBDYW5jZWwgZWRpdFxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1c1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG5cbmxldCB7dG9PYmplY3R9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCIpO1xubGV0IGNvbW1vbkFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIik7XG5sZXQgc3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaE1vZGVsKGlkKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KGFwaVVSTClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL3N0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9zdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgbW9kZWwuaWQpLnNldChtb2RlbCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAvLyBXT1JLQVJPVU5EOlxuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLmFwcGx5KHJvYm90cyA9PiB7XG4gICAgICAgIGxldCBtb2RlbHMgPSBPYmplY3QuYXNzaWduKHt9LCByb2JvdHMubW9kZWxzKTtcbiAgICAgICAgbW9kZWxzW21vZGVsLmlkXSA9IG1vZGVsO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLCB7XG4gICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgbW9kZWxzOiBtb2RlbHMsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90OmZldGNoTW9kZWxgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbChpZCkge1xuICBsZXQgbW9kZWwgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikuZ2V0KGlkKTtcbiAgaWYgKG1vZGVsKSB7XG4gICAgcmV0dXJuIG1vZGVsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxubGV0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBjb21tb25BY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCIpO1xubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZnVuY3Rpb24gZmV0Y2hQYWdlKHBhZ2UsIHBlcnBhZ2UsIGZpbHRlcnMsIHNvcnRzKSB7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvYDtcbiAgbGV0IHBhcmFtcyA9IGZvcm1hdEpzb25BcGlRdWVyeShwYWdlLCBwZXJwYWdlLCBmaWx0ZXJzLCBzb3J0cyk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KGFwaVVSTCwge3BhcmFtc30pXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgLy8gQ3VycmVudCBzdGF0ZVxuICAgICAgbGV0IG1vZGVscyA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS5nZXQoKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwicGFnaW5hdGlvblwiKS5nZXQoKTtcblxuICAgICAgLy8gTmV3IGRhdGFcbiAgICAgIGxldCB7ZGF0YSwgbWV0YX0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgbGV0IGZldGNoZWRNb2RlbHMgPSB0b09iamVjdChkYXRhKVxuXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7XG4gICAgICAgIHRvdGFsOiBtZXRhLnBhZ2UgJiYgbWV0YS5wYWdlLnRvdGFsIHx8IE9iamVjdC5rZXlzKG1vZGVscykubGVuZ3RoLFxuICAgICAgICBtb2RlbHM6IE9iamVjdC5hc3NpZ24obW9kZWxzLCBmZXRjaGVkTW9kZWxzKSxcbiAgICAgICAgcGFnaW5hdGlvbjogT2JqZWN0LmFzc2lnbihwYWdpbmF0aW9uLCB7W3BhZ2VdOiBPYmplY3Qua2V5cyhmZXRjaGVkTW9kZWxzKX0pLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcndoZXJlISA6KFxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90OmZldGNoUGFnZWAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZFBhZ2UocGFnZSwgZmlsdGVycywgc29ydHMpIHtcbiAgbGV0IHBhZ2luYXRpb24gPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJwYWdpbmF0aW9uXCIpLmdldCgpO1xuICBsZXQgcGVycGFnZSA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcInBlcnBhZ2VcIikuZ2V0KCk7XG4gIGxldCBpZHMgPSBwYWdpbmF0aW9uW3BhZ2VdO1xuICBpZiAoIWlkcykge1xuICAgIGNvbnNvbGUuZGVidWcoXCJSb2JvdHM6IGZldGNoIHBhZ2VcIiwgcGFnZSk7XG4gICAgcmV0dXJuIGZldGNoUGFnZShwYWdlLCBwZXJwYWdlLCBmaWx0ZXJzLCBzb3J0cyk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBBeGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcblxubGV0IHJvdXRlciA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCIpO1xubGV0IGNvbW1vbkFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIik7XG5sZXQgc3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgb2xkTW9kZWwgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcblxuICByZXR1cm4gQXhpb3MuZGVsZXRlKGFwaVVSTClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiBsb2FkRXJyb3IsXG4gICAgICB9KTtcbiAgICAgIHJvdXRlci50cmFuc2l0aW9uVG8oXCJyb2JvdC1pbmRleFwiKTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QucmVtb3ZlYCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiBhcGlVUkxcbiAgICAgICAgfTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yfSk7XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG9sZE1vZGVsKTsgLy8gQ2FuY2VsIHJlbW92ZVxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCByZXN1bHQgPSByZXF1aXJlKFwibG9kYXNoLnJlc3VsdFwiKTtcbmxldCBpc0FycmF5ID0gcmVxdWlyZShcImxvZGFzaC5pc2FycmF5XCIpO1xubGV0IGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKFwibG9kYXNoLmlzcGxhaW5vYmplY3RcIik7XG5sZXQgaXNFbXB0eSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNlbXB0eVwiKTtcbmxldCBtZXJnZSA9IHJlcXVpcmUoXCJsb2Rhc2gubWVyZ2VcIik7XG5sZXQgZGVib3VuY2UgPSByZXF1aXJlKFwibG9kYXNoLmRlYm91bmNlXCIpO1xubGV0IGZsYXR0ZW4gPSByZXF1aXJlKFwibG9kYXNoLmZsYXR0ZW5cIik7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcbi8vbGV0IEpvaSA9IHJlcXVpcmUoXCJqb2lcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG4vL2xldCBWYWxpZGF0b3JzID0gcmVxdWlyZShcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCIpO1xubGV0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmR9ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCIpO1xubGV0IHJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIC8vbWl4aW5zOiBbLS1SZWFjdFJvdXRlci5TdGF0ZS0tLCBzdGF0ZS5taXhpbl0sXG5cbiAgLy9jdXJzb3JzKCkge1xuICAvLyAgcmV0dXJuIHtcbiAgLy8gICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gIC8vICB9XG4gIC8vfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+QWRkPC9kaXY+O1xuICAgIC8vbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfS8+XG4gICAgLy8pO1xuICB9XG59KTtcblxuLy9sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbi8vICBnZXRJbml0aWFsU3RhdGUoKSB7XG4vLyAgICByZXR1cm4ge1xuLy8gICAgICBtb2RlbDoge1xuLy8gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbi8vICAgICAgICBhc3NlbWJseURhdGU6IHVuZGVmaW5lZCxcbi8vICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbi8vICAgICAgfSxcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICAvL3ZhbGlkYXRvclR5cGVzKCkge1xuLy8gIC8vICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbi8vICAvL30sXG4vL1xuLy8gIC8vdmFsaWRhdG9yRGF0YSgpIHtcbi8vICAvLyAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgLy99LFxuLy9cbi8vICB2YWxpZGF0ZTogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9sZXQgc2NoZW1hID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yVHlwZXNcIikgfHwge307XG4vLyAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuLy8gICAgLy9sZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbiAoYSwgYikge1xuLy8gICAgLy8gIHJldHVybiBpc0FycmF5KGIpID8gYiA6IHVuZGVmaW5lZDtcbi8vICAgIC8vfSk7XG4vLyAgICAvL3JldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbi8vICAgIC8vICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4vLyAgICAvL30pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAvLyAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgLy8gIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4vLyAgICAvLyAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuLy8gICAgLy99LmJpbmQodGhpcyk7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuLy8gICAgLy9yZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldEluaXRpYWxTdGF0ZSgpLm1vZGVsKSxcbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuLy8gICAgICBpZiAoaXNWYWxpZCkge1xuLy8gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbi8vICAgICAgICByb2JvdEFjdGlvbnMuYWRkKHtcbi8vICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgIH0pO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuLy8gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuLy8gICAgICByZXR1cm4gW107XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuLy8gICAgICAgIH0pKTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICAgIH1cbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gaXNFbXB0eSh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpKTtcbi8vICB9LFxuLy9cbi8vICByZW5kZXIoKSB7XG4vLyAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMucHJvcHM7XG4vLyAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuLy9cbi8vICAgIGlmIChsb2FkaW5nKSB7XG4vLyAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuLy8gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbi8vICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIHJldHVybiAoXG4vLyAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiQWRkIFJvYm90XCJ9PlxuLy8gICAgICAgICAgPGRpdj5cbi8vICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuLy8gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+QWRkIFJvYm90PC9oMT5cbi8vICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbi8vICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9zZWN0aW9uPlxuLy8gICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuLy8gICAgICApO1xuLy8gICAgfVxuLy8gIH1cbi8vfSk7XG5cbi8qXG48VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQge2JyYW5jaH0gPSByZXF1aXJlKFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIik7XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcbmxldCBEb2N1bWVudFRpdGxlID0gcmVxdWlyZShcInJlYWN0LWRvY3VtZW50LXRpdGxlXCIpO1xuXG5sZXQgQ29tcG9uZW50ID0gcmVxdWlyZShcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIik7XG5sZXQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZH0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIik7XG5sZXQgcm9ib3RBY3Rpb25zID0gcmVxdWlyZShcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIik7XG5sZXQgc3RhdGUgPSByZXF1aXJlKFwiZnJvbnRlbmQvc3RhdGVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuICBmYWNldHM6IHtcbiAgICBtb2RlbDogXCJjdXJyZW50Um9ib3RcIixcbiAgfSxcbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdERldGFpbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGxvYWRNb2RlbCA9IHJvYm90QWN0aW9ucy5sb2FkTW9kZWw7XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vY29uc29sZS5sb2coXCJ0aGlzLnByb3BzLnJvYm90c1wiLCB0aGlzLnByb3BzLnJvYm90cyk7XG4gICAgbGV0IHtsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmlkfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5hc3NlbWJseURhdGV9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwubWFudWZhY3R1cmVyfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcmVzdWx0ID0gcmVxdWlyZShcImxvZGFzaC5yZXN1bHRcIik7XG5sZXQgaXNBcnJheSA9IHJlcXVpcmUoXCJsb2Rhc2guaXNhcnJheVwiKTtcbmxldCBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZShcImxvZGFzaC5pc3BsYWlub2JqZWN0XCIpO1xubGV0IGlzRW1wdHkgPSByZXF1aXJlKFwibG9kYXNoLmlzZW1wdHlcIik7XG5sZXQgbWVyZ2UgPSByZXF1aXJlKFwibG9kYXNoLm1lcmdlXCIpO1xubGV0IGRlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC5kZWJvdW5jZVwiKTtcbmxldCBmbGF0dGVuID0gcmVxdWlyZShcImxvZGFzaC5mbGF0dGVuXCIpO1xubGV0IENsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG4vL2xldCBKb2kgPSByZXF1aXJlKFwiam9pXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxuLy9sZXQgVmFsaWRhdG9ycyA9IHJlcXVpcmUoXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiKTtcbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcbmxldCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kfSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiKTtcbmxldCByb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBzdGF0ZSA9IHJlcXVpcmUoXCJmcm9udGVuZC9zdGF0ZVwiKTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuLy9mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuLy8gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbi8vICBkYXRhID0gZGF0YSB8fCB7fTtcbi8vICBsZXQgam9pT3B0aW9ucyA9IHtcbi8vICAgIGFib3J0RWFybHk6IGZhbHNlLFxuLy8gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuLy8gIH07XG4vLyAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4vLyAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbi8vICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4vLyAgICAgIGVycm9yc1xuLy8gICAgKTtcbi8vICB9IGVsc2Uge1xuLy8gICAgbGV0IHJlc3VsdCA9IHt9O1xuLy8gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgIHJldHVybiByZXN1bHQ7XG4vLyAgfVxuLy99XG5cbi8vZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuLy8gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbi8vICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuLy8gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVtb1tkZXRhaWwucGF0aF0pKSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RFZGl0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGxvYWRNb2RlbCA9IHJvYm90QWN0aW9ucy5sb2FkTW9kZWw7XG5cbiAgLy9taXhpbnM6IFstLVJlYWN0Um91dGVyLlN0YXRlLS0sIHN0YXRlLm1peGluXSxcblxuICAvL2N1cnNvcnMoKSB7XG4gIC8vICByZXR1cm4ge1xuICAvLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgLy8gICAgbG9hZE1vZGVsOiBbXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgdGhpcy5nZXRQYXJhbXMoKS5pZF0sXG4gIC8vICB9XG4gIC8vfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+RWRpdDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL2xldCBsb2FkTW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubG9hZE1vZGVsO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgIC8vKTtcbiAgfVxufVxuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuLy8gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLmxvYWRNb2RlbCksXG4vLyAgICAgIH0pXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgICAvL3JldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRvckRhdGEoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgICAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuLy8gICAgLy8gIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbi8vICAgIH0uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbi8vICAgICAgaWYgKGlzVmFsaWQpIHtcbi8vICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4vLyAgICAgICAgcm9ib3RBY3Rpb25zLmVkaXQoe1xuLy8gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4vLyAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBhc3NlbWJseURhdGU6IHRoaXMucmVmcy5hc3NlbWJseURhdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICB9KTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9LFxuLy9cbi8vICBnZXRWYWxpZGF0aW9uTWVzc2FnZXM6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbi8vICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHtcbi8vICAgICAgcmV0dXJuIFtdO1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24gKGVycm9yKSB7XG4vLyAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbi8vICAgICAgICB9KSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgaXNWYWxpZDogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIHRydWU7XG4vLyAgICAvL3JldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3IsIGxvYWRNb2RlbH0gPSB0aGlzLnByb3BzO1xuLy8gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vXG4vLyAgICBpZiAobG9hZGluZykge1xuLy8gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbi8vICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4vLyAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICByZXR1cm4gKFxuLy8gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbi8vICAgICAgICAgIDxkaXY+XG4vLyAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvYT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbi8vICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHticmFuY2h9ID0gcmVxdWlyZShcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCIpO1xubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtMaW5rfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5sZXQgRG9jdW1lbnRUaXRsZSA9IHJlcXVpcmUoXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiKTtcblxubGV0IHt0b0FycmF5fSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiKTtcbmxldCBDb21wb25lbnQgPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiKTtcbmxldCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kLCBQYWdpbmF0aW9ufSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiKTtcbmxldCByb2JvdEFjdGlvbnMgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiKTtcbmxldCBSb2JvdEl0ZW0gPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCIpO1xubGV0IHN0YXRlID0gcmVxdWlyZShcImZyb250ZW5kL3N0YXRlXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AYnJhbmNoKHtcbiAgY3Vyc29yczoge1xuICAgIHVybDogXCJ1cmxcIixcbiAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gIH0sXG5cbiAgZmFjZXRzOiB7XG4gICAgbW9kZWxzOiBcImN1cnJlbnRSb2JvdHNcIixcbiAgfVxufSlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90SW5kZXggZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgbG9hZFBhZ2UgPSByb2JvdEFjdGlvbnMubG9hZFBhZ2U7XG5cbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHBhZ2UgPSB0aGlzLnByb3BzLnVybC5wYWdlO1xuICAgIGxldCB7dG90YWwsIGxvYWRpbmcsIGxvYWRFcnJvciwgcGVycGFnZX0gPSB0aGlzLnByb3BzLnJvYm90cztcbiAgICBsZXQgbW9kZWxzID0gdGhpcy5wcm9wcy5tb2RlbHM7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aDE+Um9ib3RzPC9oMT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8UGFnaW5hdGlvbiBlbmRwb2ludD1cInJvYm90LWluZGV4XCIgdG90YWw9e3RvdGFsfSBwYWdlPXtwYWdlfSBwZXJwYWdlPXtwZXJwYWdlfS8+XG4gICAgICAgICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPFJvYm90SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgUmVhY3QgPSByZXF1aXJlKFwicmVhY3RcIik7XG5sZXQge0xpbmt9ID0gcmVxdWlyZShcInJlYWN0LXJvdXRlclwiKTtcblxubGV0IENvbXBvbmVudCA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCIpO1xubGV0IHJvYm90QWN0aW9ucyA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVVSUQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xubGV0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlfSA9IHJlcXVpcmUoXCJyZWFjdC1yb3V0ZXJcIik7XG5cbi8vIENvbXBvbmVudHNcbmxldCB7Qm9keSwgSG9tZSwgQWJvdXQsIE5vdEZvdW5kfSA9IHJlcXVpcmUoXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiKTtcblxubGV0IFJvYm90SW5kZXggPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleFwiKTtcbmxldCBSb2JvdEFkZCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiKTtcbmxldCBSb2JvdERldGFpbCA9IHJlcXVpcmUoXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbFwiKTtcbmxldCBSb2JvdEVkaXQgPSByZXF1aXJlKFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0XCIpO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCAoXG4gIDxSb3V0ZSBwYXRoPVwiL1wiIGhhbmRsZXI9e0JvZHl9PlxuICAgIDxEZWZhdWx0Um91dGUgaGFuZGxlcj17SG9tZX0gbmFtZT1cImhvbWVcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvYWJvdXRcIiBuYW1lPVwiYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9wYWdlLzpwYWdlXCIgbmFtZT1cInJvYm90LWluZGV4XCIgaGFuZGxlcj17Um9ib3RJbmRleH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9hZGRcIiBuYW1lPVwicm9ib3QtYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkXCIgbmFtZT1cInJvYm90LWRldGFpbFwiIGhhbmRsZXI9e1JvYm90RGV0YWlsfS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzLzppZC9lZGl0XCIgbmFtZT1cInJvYm90LWVkaXRcIiBoYW5kbGVyPXtSb2JvdEVkaXR9Lz5cbiAgICA8Tm90Rm91bmRSb3V0ZSBoYW5kbGVyPXtOb3RGb3VuZH0vPlxuICA8L1JvdXRlPlxuKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQmFvYmFiID0gcmVxdWlyZShcImJhb2JhYlwiKTtcbmxldCB7dG9BcnJheX0gPSByZXF1aXJlKFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIik7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoXG4gIHsgLy8gREFUQVxuICAgIHVybDoge1xuICAgICAgaGFuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgIHBhZ2U6IHVuZGVmaW5lZCxcbiAgICAgIGZpbHRlcnM6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRzOiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIHJvYm90czoge1xuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgcGFnaW5hdGlvbjogW10sIC8vIGluIGZvcm1hdCBbW0EgQiBDXSwgW0QgRV0uLi5dLCBlLmcuIG9mZnNldCA8LT4gaWRzXG4gICAgICBwZXJwYWdlOiA1LFxuICAgIH0sXG5cbiAgICBhbGVydHM6IHtcbiAgICAgIG1vZGVsczoge30sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgIHBhZ2luYXRpb246IFtdLCAvLyBpbiBmb3JtYXQgW1tBIEIgQ10sIFtEIEVdLi4uXSwgZS5nLiBvZmZzZXQgPC0+IGlkc1xuICAgICAgcGVycGFnZTogNSxcbiAgICB9LFxuICB9LFxuICB7IC8vIE9QVElPTlNcbiAgICBmYWNldHM6IHtcbiAgICAgIGN1cnJlbnRSb2JvdDoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgdXJsOiBbXCJ1cmxcIl0sXG4gICAgICAgICAgbW9kZWxzOiBbXCJyb2JvdHNcIiwgXCJtb2RlbHNcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGxldCB7dXJsLCBtb2RlbHN9ID0gZGF0YTtcbiAgICAgICAgICBsZXQgbW9kZWw7XG4gICAgICAgICAgaWYgKHVybC5pZCkge1xuICAgICAgICAgICAgbW9kZWwgPSBtb2RlbHNbdXJsLmlkXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjdXJyZW50Um9ib3RzOiB7XG4gICAgICAgIGN1cnNvcnM6IHtcbiAgICAgICAgICB1cmw6IFtcInVybFwiXSxcbiAgICAgICAgICBtb2RlbHM6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiXSxcbiAgICAgICAgICBwYWdpbmF0aW9uOiBbXCJyb2JvdHNcIiwgXCJwYWdpbmF0aW9uXCJdLFxuICAgICAgICAgIC8vIFRPRE8gZmlsdGVycywgc29ydHNcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgbGV0IHt1cmwsIG1vZGVscywgcGFnaW5hdGlvbn0gPSBkYXRhO1xuICAgICAgICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgICAgICAgIGlmICh1cmwucGFnZSkge1xuICAgICAgICAgICAgbGV0IGlkcyA9IHBhZ2luYXRpb25bdXJsLnBhZ2VdO1xuICAgICAgICAgICAgaWYgKGlkcykge1xuICAgICAgICAgICAgICBtb2RlbHMgPSBtb2RlbHMuZmlsdGVyKG1vZGVsID0+IGlkcy5pbmRleE9mKG1vZGVsLmlkKSAhPSAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cmwuZmlsdGVycykge1xuICAgICAgICAgICAgLy8gVE9ETyBjbGllbnQgZmlsdGVyc1xuICAgICAgICAgICAgLy8gaWYgc2VydmVyIGZpbHRlcnMgYXJlIHJlcXVpcmVkOlxuICAgICAgICAgICAgLy8gcmVzZXQgcGFnaW5hdGlvbiBpbiBmaWx0ZXJpbmcgYWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1cmwuc29ydHMpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gY2xpZW50LXNvcnRzXG4gICAgICAgICAgICAvLyBpZiBzZXJ2ZXIgc29ydHMgYXJlIHJlcXVpcmVkOlxuICAgICAgICAgICAgLy8gcmVzZXQgcGFnaW5hdGlvbiBpbiBzb3J0aW5nIGFjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbW9kZWxzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEluc3BlY3QgPSByZXF1aXJlKFwidXRpbC1pbnNwZWN0XCIpO1xuXG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhvdyBpdCdzIGV2ZXIgbWlzc2VkPyFcblJlZ0V4cC5lc2NhcGUgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbn07XG5cbi8vIChjKSBMb2Rhc2guIFN1cGVyIHJlcXVpcmVkIG1ldGhvZCwgYm9yZWQgdG8gaW1wb3J0IHRoaXNcbkFycmF5LnJhbmdlID0gZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICBpZiAoc3RlcCAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgIGVuZCA9IHN0ZXAgPSBudWxsO1xuICB9XG4gIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogKCtzdGVwIHx8IDApO1xuXG4gIGlmIChlbmQgPT0gbnVsbCkge1xuICAgIGVuZCA9IHN0YXJ0O1xuICAgIHN0YXJ0ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlbmQgPSArZW5kIHx8IDA7XG4gIH1cbiAgLy8gVXNlIGBBcnJheShsZW5ndGgpYCBzbyBlbmdpbmVzIGxpa2UgQ2hha3JhIGFuZCBWOCBhdm9pZCBzbG93ZXIgbW9kZXMuXG4gIC8vIFNlZSBodHRwczovL3lvdXR1LmJlL1hBcUlwR1U4WlprI3Q9MTdtMjVzIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChlbmQgLSBzdGFydCkgLyAoc3RlcCB8fCAxKSksIDApLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBzdGFydDtcbiAgICBzdGFydCArPSBzdGVwO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyBSZXF1aXJlZCBmb3IgcGFnaW5hdGlvblxuLy8gYEFycmF5LmNodW5rZWQoWzEsIDIsIDMsIDQsIDVdLCAyKWAgPT4gW1sxLCAyXSwgWzMsIDRdLCBbNV1dXG5BcnJheS5jaHVua2VkID0gZnVuY3Rpb24gY2h1bmtlZChhcnJheSwgbikge1xuICBsZXQgbCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyBuKTtcbiAgcmV0dXJuIEFycmF5LnJhbmdlKGwpLm1hcCgoeCwgaSkgPT4gYXJyYXkuc2xpY2UoaSpuLCBpKm4gKyBuKSk7XG59O1xuXG4vLyBVbmNvbW1lbnQgaWYgdXNlIElvSlNcbi8vIGxldCBwcm9jZXNzID0gcHJvY2VzcyB8fCB1bmRlZmluZWQ7XG4vL2lmIChwcm9jZXNzKSB7XG4gIC8vIElvSlMgaGFzIGB1bmhhbmRsZWRSZWplY3Rpb25gIGhvb2tcbiAgLy9wcm9jZXNzLm9uKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIGZ1bmN0aW9uIChyZWFzb24sIHApIHtcbiAgLy8gIHRocm93IEVycm9yKGBVbmhhbmRsZWRSZWplY3Rpb246ICR7cmVhc29ufWApO1xuICAvL30pO1xuLy99IGVsc2Uge1xuICBQcm9taXNlLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gZG9uZShyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzXG4gICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aHJvdyBlOyB9LCAwKTtcbiAgICAgIH0pO1xuICB9O1xuLy99XG5cbi8vIFdvcmthcm91bmQgbWV0aG9kIGFzIG5hdGl2ZSBicm93c2VyIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBJbW11dGFibGUgaXMgYXdmdWxcbmxldCB3aW5kb3cgPSB3aW5kb3cgfHwgdW5kZWZpbmVkO1xuaWYgKHdpbmRvdykge1xuICB3aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gZWNobygpIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IEluc3BlY3QodikpKTtcbiAgfTtcbn0iXX0=
