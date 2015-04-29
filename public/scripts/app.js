(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

require("babel/polyfill");

require("shared/shims");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _createRouter$HistoryLocation = require("react-router");

var _parseJsonApiQuery2 = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _routes = require("frontend/routes");

var _routes2 = _interopRequireWildcard(_routes);

// APP =============================================================================================
window._router = _createRouter$HistoryLocation.create({
  routes: _routes2["default"],
  location: _createRouter$HistoryLocation.HistoryLocation
});

window._router.run(function (Application, url) {
  // you might want to push the state of the router to a
  // store for whatever reason
  // RouterActions.routeChange({routerState: state});

  console.debug("router.run");

  // SET BAOBAB URL DATA ---------------------------------------------------------------------------
  var urlCursor = _state2["default"].select("url");
  var handler = url.routes.slice(-1)[0].name;
  urlCursor.set("handler", handler);
  urlCursor.set("params", url.params);
  urlCursor.set("query", url.query);

  var id = url.params.id;
  if (id) {
    urlCursor.set("id", id);
  }

  var _parseJsonApiQuery = _parseJsonApiQuery2.parseJsonApiQuery(url.query);

  var filters = _parseJsonApiQuery.filters;
  var sorts = _parseJsonApiQuery.sorts;
  var offset = _parseJsonApiQuery.offset;
  var limit = _parseJsonApiQuery.limit;

  urlCursor.set("route", url.routes.slice(-1)[0].name);
  if (filters) {
    urlCursor.set("filters", filters);
  }
  if (sorts) {
    urlCursor.set("sorts", sorts);
  }
  if (offset || offset === 0) {
    urlCursor.set("offset", offset);
  }
  if (limit || limit === 0) {
    urlCursor.set("limit", limit);
  }

  _state2["default"].commit();
  //------------------------------------------------------------------------------------------------

  var promises = url.routes.map(function (route) {
    return route.handler.original || {};
  }).map(function (original) {
    if (original.loadData) {
      original.loadData();
    }
  });

  Promise.all(promises).then(function () {
    _React2["default"].render(_React2["default"].createElement(Application, null), document.getElementById("main"));
  });
});

},{"babel/polyfill":"babel/polyfill","frontend/common/helpers":27,"frontend/common/state":31,"frontend/routes":53,"react":"react","react-router":"react-router","shared/shims":58}],2:[function(require,module,exports){
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

      var facet = context.tree.createFacet(specs, [props, context]);

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
    }, {
      key: 'componentWillReceiveProps',

      // On new props
      value: function componentWillReceiveProps(props) {
        if (!this.facet) {
          return;
        }this.facet.refresh([props, this.context]);
        this.setState(this.facet.get());
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

var _alertFetchModel = require("./actions/alert-fetch-model");

var _alertFetchModel2 = _interopRequireWildcard(_alertFetchModel);

var _alertFetchIndex = require("./actions/alert-fetch-index");

var _alertFetchIndex2 = _interopRequireWildcard(_alertFetchIndex);

var _alertLoadModel = require("./actions/alert-load-model");

var _alertLoadModel2 = _interopRequireWildcard(_alertLoadModel);

var _alertLoadIndex = require("./actions/alert-load-index");

var _alertLoadIndex2 = _interopRequireWildcard(_alertLoadIndex);

var _alertAdd = require("./actions/alert-add");

var _alertAdd2 = _interopRequireWildcard(_alertAdd);

var _alertRemove = require("./actions/alert-remove");

var _alertRemove2 = _interopRequireWildcard(_alertRemove);

exports["default"] = {
  alert: {
    fetchModel: _alertFetchModel2["default"],
    fetchIndex: _alertFetchIndex2["default"],
    loadModel: _alertLoadModel2["default"],
    loadIndex: _alertLoadIndex2["default"],
    add: _alertAdd2["default"],
    remove: _alertRemove2["default"] } };
module.exports = exports["default"];

},{"./actions/alert-add":8,"./actions/alert-fetch-index":9,"./actions/alert-fetch-model":10,"./actions/alert-load-index":11,"./actions/alert-load-model":12,"./actions/alert-remove":13}],8:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Alert = require("frontend/common/models");

function add(model) {
  var newModel = _Alert.Alert(model);
  var id = newModel.id;
  var apiURL = "/api/alerts/" + id;

  // Nonpersistent add
  _state2["default"].select("alerts", "models", id).set(newModel);
}

module.exports = exports["default"];

},{"frontend/common/models":28,"frontend/common/state":31}],9:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex");

  var url = "api/alerts";
  var cursor = _state2["default"].select("alerts");
  var query = formatJsonApiQuery(filters, sorts, offset, limit);

  cursor.merge({
    loading: false,
    loadError: undefined,
    total: 0,
    models: {} });

  return Promise.resolve(200); // HTTP response.status
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/state":31}],10:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

function fetchModel(id) {
  console.debug("fetchModel:", id);

  var url = "/api/alerts/" + id;
  var cursor = _state2["default"].select("alerts");

  cursor.set("loading", false);

  return Promise.resolve(200); // HTTP response.status
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/state":31}],11:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _toObject$formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _fetchIndex = require("./alert-fetch-index");

var _fetchIndex2 = _interopRequireWildcard(_fetchIndex);

function loadIndex() {
  console.debug("loadIndex");

  var cursor = _state2["default"].select("alerts");
  var filters = cursor.get("filters");
  var sorts = cursor.get("sorts");
  var offset = cursor.get("offset");
  var limit = cursor.get("limit");
  var pagination = cursor.get("pagination");

  var ids = pagination[offset];
  if (!ids) {
    _fetchIndex2["default"](filters, sorts, offset, limit);
  }
}

module.exports = exports["default"];

},{"./alert-fetch-index":9,"axios":"axios","frontend/common/helpers":27,"frontend/common/state":31}],12:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _fetchModel = require("./alert-fetch-model");

var _fetchModel2 = _interopRequireWildcard(_fetchModel);

function loadModel() {
  console.debug("loadModel");

  var cursor = _state2["default"].select("alerts");
  var models = cursor.get("models");
  var id = cursor.get("id");

  var model = models[id];
  if (!model) {
    _fetchModel2["default"](id);
  }
}

module.exports = exports["default"];

},{"./alert-fetch-model":10,"axios":"axios","frontend/common/state":31}],13:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

function remove(id) {
  var apiURL = "/api/alerts/" + id;

  // Non-persistent remove
  _state2["default"].select("alerts", "models").unset(id);
}

module.exports = exports["default"];

},{"frontend/common/state":31}],14:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

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
})(_React2["default"].Component);

exports["default"] = Component;
module.exports = exports["default"];

},{"react":"react"}],15:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _About = require("./components/about");

var _About2 = _interopRequireWildcard(_About);

var _Body = require("./components/body");

var _Body2 = _interopRequireWildcard(_Body);

var _Error = require("./components/error");

var _Error2 = _interopRequireWildcard(_Error);

var _Headroom = require("./components/headroom");

var _Headroom2 = _interopRequireWildcard(_Headroom);

var _Home = require("./components/home");

var _Home2 = _interopRequireWildcard(_Home);

var _Loading = require("./components/loading");

var _Loading2 = _interopRequireWildcard(_Loading);

var _NotFound = require("./components/not-found");

var _NotFound2 = _interopRequireWildcard(_NotFound);

var _InternalPagination = require("./components/pagination-internal");

var _InternalPagination2 = _interopRequireWildcard(_InternalPagination);

var _ExternalPagination = require("./components/pagination-external");

var _ExternalPagination2 = _interopRequireWildcard(_ExternalPagination);

exports["default"] = {
  About: _About2["default"], Body: _Body2["default"], Error: _Error2["default"], Headroom: _Headroom2["default"], Home: _Home2["default"], Loading: _Loading2["default"], NotFound: _NotFound2["default"], InternalPagination: _InternalPagination2["default"], ExternalPagination: _ExternalPagination2["default"]
};
module.exports = exports["default"];

},{"./components/about":16,"./components/body":19,"./components/error":20,"./components/headroom":21,"./components/home":22,"./components/loading":23,"./components/not-found":24,"./components/pagination-external":25,"./components/pagination-internal":26}],16:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      return _React2["default"].createElement(
        _DocumentTitle2["default"],
        { title: "About" },
        _React2["default"].createElement(
          "section",
          { className: "container page info" },
          _React2["default"].createElement(
            "h1",
            null,
            "Simple Page Example"
          ),
          _React2["default"].createElement(
            "p",
            null,
            "This page was rendered by a JavaScript"
          )
        )
      );
    }
  }]);

  return About;
})(_Component3["default"]);

exports["default"] = About;
module.exports = exports["default"];

},{"frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],17:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

//let CSSTransitionGroup from "rc-css-transition-group";

var _toArray = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Loading = require("frontend/common/components/loading");

var _Loading2 = _interopRequireWildcard(_Loading);

var _NotFound = require("frontend/common/components/not-found");

var _NotFound2 = _interopRequireWildcard(_NotFound);

var _AlertItem = require("frontend/common/components/alert-item");

var _AlertItem2 = _interopRequireWildcard(_AlertItem);

// COMPONENTS ======================================================================================
exports["default"] = _React2["default"].createClass({
  displayName: "alert-index",

  mixins: [_state2["default"].mixin],

  cursors: {
    alerts: ["alerts"] },

  render: function render() {
    var _state$cursors$alerts = this.state.cursors.alerts;
    var models = _state$cursors$alerts.models;
    var loading = _state$cursors$alerts.loading;
    var loadError = _state$cursors$alerts.loadError;

    models = _toArray.toArray(models);

    if (loadError) {
      return _React2["default"].createElement(Error, { loadError: loadError });
    } else {
      return _React2["default"].createElement(
        "div",
        { className: "notifications top-left" },
        models.map(function (model) {
          return _React2["default"].createElement(_AlertItem2["default"], { model: model, key: model.id });
        }),
        loading ? _React2["default"].createElement(_Loading2["default"], null) : ""
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

},{"frontend/common/components/alert-item":18,"frontend/common/components/loading":23,"frontend/common/components/not-found":24,"frontend/common/helpers":27,"frontend/common/state":31,"react":"react"}],18:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _classNames2 = require("classnames");

var _classNames3 = _interopRequireWildcard(_classNames2);

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

// EXPORTS =========================================================================================
var Expire = _React2["default"].createClass({
  displayName: "Expire",

  propTypes: {
    delay: _React2["default"].PropTypes.number },

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
    return _React2["default"].createElement(
      "div",
      null,
      this.props.children
    );
  } });

var CloseLink = _React2["default"].createClass({
  displayName: "CloseLink",

  handleClick: function handleClick(event) {
    event.preventDefault();
    this.props.onClick();
  },

  render: function render() {
    return _React2["default"].createElement(
      "a",
      { className: "close pull-right", href: "#", onClick: this.handleClick },
      "×"
    );
  }
});

var Item = _React2["default"].createClass({
  displayName: "Item",

  propTypes: {
    model: _React2["default"].PropTypes.object },

  render: function render() {
    var model = this.props.model;

    var classes = _classNames3["default"](_defineProperty({
      alert: true }, "alert-" + model.category, true));

    var result = _React2["default"].createElement(
      "div",
      _extends({ className: classes }, this.props),
      model.closable ? _React2["default"].createElement(CloseLink, { onClick: _commonActions2["default"].alert.remove.bind(this, model.id) }) : "",
      model.message
    );

    if (model.expire) {
      result = _React2["default"].createElement(
        Expire,
        { onExpire: _commonActions2["default"].alert.remove.bind(this, model.id), delay: model.expire },
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

},{"classnames":"classnames","frontend/common/actions":7,"react":"react","react-router":"react-router"}],19:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _root = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link$RouteHandler = require("react-router");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

var _Headroom = require("frontend/common/components/headroom");

var _Headroom2 = _interopRequireWildcard(_Headroom);

var _AlertIndex = require("frontend/common/components/alert-index");

// EXPORTS =========================================================================================

var _AlertIndex2 = _interopRequireWildcard(_AlertIndex);

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

    //static loadPage(params, query) {
    // Ignore params and query
    // establishPage(params, query);
    //return commonActions.alert.loadPage();
    //}

    value: function render() {
      var headroomClassNames = { visible: "navbar-down", hidden: "navbar-up" };
      return _React2["default"].createElement(
        "div",
        null,
        _React2["default"].createElement(
          _Headroom2["default"],
          { component: "header", id: "page-header", className: "navbar navbar-default", headroomClassNames: headroomClassNames },
          _React2["default"].createElement(
            "div",
            { className: "container" },
            _React2["default"].createElement(
              "div",
              { className: "navbar-header" },
              _React2["default"].createElement(
                "button",
                { className: "navbar-toggle collapsed", type: "button", "data-toggle": "collapse", "data-target": ".navbar-page-header" },
                _React2["default"].createElement(
                  "span",
                  { className: "sr-only" },
                  "Toggle navigation"
                ),
                _React2["default"].createElement("span", { className: "fa fa-bars fa-lg" })
              ),
              _React2["default"].createElement(
                _Link$RouteHandler.Link,
                { className: "navbar-brand", to: "home" },
                _React2["default"].createElement(
                  "span",
                  { className: "light" },
                  "React"
                ),
                "Starter"
              )
            ),
            _React2["default"].createElement(
              "nav",
              { className: "collapse navbar-collapse navbar-page-header navbar-right brackets-effect" },
              _React2["default"].createElement(
                "ul",
                { className: "nav navbar-nav" },
                _React2["default"].createElement(
                  "li",
                  null,
                  _React2["default"].createElement(
                    _Link$RouteHandler.Link,
                    { to: "home" },
                    "Home"
                  )
                ),
                _React2["default"].createElement(
                  "li",
                  null,
                  _React2["default"].createElement(
                    _Link$RouteHandler.Link,
                    { to: "robot-index", params: { page: 1 } },
                    "Robots"
                  )
                ),
                _React2["default"].createElement(
                  "li",
                  null,
                  _React2["default"].createElement(
                    _Link$RouteHandler.Link,
                    { to: "about" },
                    "About"
                  )
                )
              )
            )
          )
        ),
        _React2["default"].createElement(
          "main",
          { id: "page-main" },
          _React2["default"].createElement(_Link$RouteHandler.RouteHandler, null)
        )
      );
    }
  }]);

  Body = _root.root(_state2["default"])(Body) || Body;
  return Body;
})(_Component3["default"]);

exports["default"] = Body;
module.exports = exports["default"];
/*<AlertIndex/>*/

},{"baobab-react/decorators":2,"frontend/common/actions":7,"frontend/common/component":14,"frontend/common/components/alert-index":17,"frontend/common/components/headroom":21,"frontend/common/state":31,"react":"react","react-router":"react-router"}],20:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _Class2 = require("classnames");

var _Class3 = _interopRequireWildcard(_Class2);

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      return _React2["default"].createElement(
        _DocumentTitle2["default"],
        { title: "Error " + this.props.loadError.status + ": " + this.props.loadError.description },
        _React2["default"].createElement(
          "div",
          { className: _Class3["default"](_defineProperty({
              "alert-as-icon": true,
              "fa-stack": true }, this.props.size, true)) },
          _React2["default"].createElement("i", { className: "fa fa-cog fa-stack-1x" }),
          _React2["default"].createElement("i", { className: "fa fa-ban fa-stack-2x" })
        )
      );
    }
  }], [{
    key: "propTypes",
    value: {
      loadError: _React2["default"].PropTypes.object.isRequired,
      size: _React2["default"].PropTypes.oneOf(["xs", "sm", "md", "lg"]) },
    enumerable: true
  }]);

  return Error;
})(_Component3["default"]);

exports["default"] = Error;
module.exports = exports["default"];

},{"classnames":"classnames","frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],21:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _throttle = require("lodash.throttle");

var _throttle2 = _interopRequireWildcard(_throttle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      window.addEventListener("scroll", _throttle2["default"](this.hasScrolled, this.delay), false);

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
      return _React2["default"].createElement(component, props, this.props.children);
    }
  }], [{
    key: "propTypes",
    value: {
      component: _React2["default"].PropTypes.string,
      headroomClassNames: _React2["default"].PropTypes.object },
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
})(_Component3["default"]);

exports["default"] = Headroom;
module.exports = exports["default"];

},{"frontend/common/component":14,"lodash.throttle":"lodash.throttle","react":"react"}],22:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      return _React2["default"].createElement(
        _DocumentTitle2["default"],
        { title: "React Starter" },
        _React2["default"].createElement(
          "section",
          { className: "container page home" },
          _React2["default"].createElement(
            "h1",
            null,
            "React starter app"
          ),
          _React2["default"].createElement(
            "p",
            null,
            "Proof of concepts, CRUD, whatever..."
          ),
          _React2["default"].createElement(
            "p",
            null,
            "Proudly build on ES6 with the help of ",
            _React2["default"].createElement(
              "a",
              { href: "https://babeljs.io/" },
              "Babel"
            ),
            " transpiler."
          ),
          _React2["default"].createElement(
            "h3",
            null,
            "Frontend"
          ),
          _React2["default"].createElement(
            "ul",
            null,
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://facebook.github.io/react/" },
                "React"
              ),
              " declarative UI"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/Yomguithereal/baobab" },
                "Baobab"
              ),
              " JS data tree with cursors"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/rackt/react-router" },
                "React-Router"
              ),
              " declarative routes"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/gaearon/react-document-title" },
                "React-Document-Title"
              ),
              " declarative document titles"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://react-bootstrap.github.io/" },
                "React-Bootstrap"
              ),
              " Bootstrap components in React"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://browserify.org/" },
                "Browserify"
              ),
              " & ",
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/substack/watchify" },
                "Watchify"
              ),
              " bundle NPM modules to frontend"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://bower.io/" },
                "Bower"
              ),
              " frontend package manager"
            )
          ),
          _React2["default"].createElement(
            "h3",
            null,
            "Backend"
          ),
          _React2["default"].createElement(
            "ul",
            null,
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://expressjs.com/" },
                "Express"
              ),
              " web-app backend framework"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://mozilla.github.io/nunjucks/" },
                "Nunjucks"
              ),
              " template engine"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/eleith/emailjs" },
                "EmailJS"
              ),
              " SMTP client"
            )
          ),
          _React2["default"].createElement(
            "h3",
            null,
            "Common"
          ),
          _React2["default"].createElement(
            "ul",
            null,
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://babeljs.io/" },
                "Babel"
              ),
              " JS transpiler"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://gulpjs.com/" },
                "Gulp"
              ),
              " streaming build system"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://lodash.com/" },
                "Lodash"
              ),
              " utility library"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/mzabriskie/axios" },
                "Axios"
              ),
              " promise-based HTTP client"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/facebook/immutable-js" },
                "Immutable"
              ),
              " persistent immutable data for JS"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "http://momentjs.com/" },
                "Moment"
              ),
              " date-time stuff"
            ),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                "a",
                { href: "https://github.com/marak/Faker.js/" },
                "Faker"
              ),
              " fake data generation"
            )
          ),
          _React2["default"].createElement(
            "h3",
            null,
            "VCS"
          ),
          _React2["default"].createElement(
            "ul",
            null,
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
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
})(_Component3["default"]);

exports["default"] = Home;
module.exports = exports["default"];

},{"frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],23:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      return _React2["default"].createElement(
        _DocumentTitle2["default"],
        { title: "Loading..." },
        _React2["default"].createElement(
          "div",
          { className: "alert-as-icon" + sizeClass },
          _React2["default"].createElement("i", { className: "fa fa-cog fa-spin" })
        )
      );
    }
  }]);

  return Loading;
})(_Component3["default"]);

exports["default"] = Loading;
module.exports = exports["default"];

},{"frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],24:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

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
      return _React2["default"].createElement(
        _DocumentTitle2["default"],
        { title: "Not Found" },
        _React2["default"].createElement(
          "section",
          { className: "container page" },
          _React2["default"].createElement(
            "h1",
            null,
            "Page not Found"
          ),
          _React2["default"].createElement(
            "p",
            null,
            "Something is wrong"
          )
        )
      );
    }
  }]);

  return NotFound;
})(_Component3["default"]);

exports["default"] = NotFound;
module.exports = exports["default"];

},{"frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],25:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireWildcard(_range);

var _Class = require("classnames");

var _Class2 = _interopRequireWildcard(_Class);

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _formatJsonApiQuery = require("frontend/common/helpers");

// EXPORTS =========================================================================================

var ExternalPagination = (function (_Component) {
  function ExternalPagination() {
    _classCallCheck(this, ExternalPagination);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(ExternalPagination, _Component);

  _createClass(ExternalPagination, [{
    key: "totalPages",
    value: function totalPages() {
      return Math.ceil(this.props.total / this.props.limit);
    }
  }, {
    key: "maxOffset",
    value: function maxOffset() {
      return this.totalPages() * this.props.limit;
    }
  }, {
    key: "prevOffset",
    value: function prevOffset(offset) {
      return offset <= 0 ? 0 : offset - this.props.limit;
    }
  }, {
    key: "nextOffset",
    value: function nextOffset(offset) {
      return offset >= this.maxOffset() ? this.maxOffset() : offset + this.props.limit;
    }
  }, {
    key: "render",
    value: function render() {
      var endpoint = this.props.endpoint;
      var limit = this.props.limit;
      var currOffset = this.props.offset;
      var prevOffset = this.prevOffset(this.props.offset);
      var nextOffset = this.nextOffset(this.props.offset);
      var minOffset = 0;
      var maxOffset = this.maxOffset();
      return _React2["default"].createElement(
        "nav",
        null,
        _React2["default"].createElement(
          "ul",
          { className: "pagination" },
          _React2["default"].createElement(
            "li",
            null,
            _React2["default"].createElement(
              _Link.Link,
              { to: endpoint,
                query: { "page[offset]": prevOffset },
                className: _Class2["default"]({ btn: true, disabled: currOffset == minOffset }),
                title: "To offset " + prevOffset },
              _React2["default"].createElement(
                "span",
                null,
                "«"
              )
            )
          ),
          _range2["default"](0, maxOffset, limit).map(function (offset) {
            return _React2["default"].createElement(
              "li",
              { key: offset },
              _React2["default"].createElement(
                _Link.Link,
                { to: endpoint,
                  query: { "page[offset]": offset },
                  className: _Class2["default"]({ btn: true, disabled: offset == currOffset }),
                  title: "To offset " + offset },
                offset
              )
            );
          }),
          _React2["default"].createElement(
            "li",
            null,
            _React2["default"].createElement(
              _Link.Link,
              { to: endpoint,
                query: { "page[offset]": nextOffset },
                className: _Class2["default"]({ btn: true, disabled: currOffset == maxOffset }),
                title: "To offset " + nextOffset },
              _React2["default"].createElement(
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
      endpoint: _React2["default"].PropTypes.string.isRequired,
      total: _React2["default"].PropTypes.number.isRequired,
      offset: _React2["default"].PropTypes.number.isRequired,
      limit: _React2["default"].PropTypes.number.isRequired },
    enumerable: true
  }]);

  return ExternalPagination;
})(_Component3["default"]);

exports["default"] = ExternalPagination;
module.exports = exports["default"];
/*Total: {this.props.total}<br/>*/ /*Perpage: {this.props.perpage}<br/>*/ /*TotalPages: {this.totalPages()}<br/>*/

},{"classnames":"classnames","frontend/common/component":14,"frontend/common/helpers":27,"lodash.range":"lodash.range","react":"react","react-router":"react-router"}],26:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireWildcard(_range);

var _Class = require("classnames");

var _Class2 = _interopRequireWildcard(_Class);

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _formatJsonApiQuery = require("frontend/common/helpers");

// EXPORTS =========================================================================================

var InternalPagination = (function (_Component) {
  function InternalPagination() {
    _classCallCheck(this, InternalPagination);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(InternalPagination, _Component);

  _createClass(InternalPagination, [{
    key: "totalPages",
    value: function totalPages() {
      return Math.ceil(this.props.total / this.props.limit);
    }
  }, {
    key: "maxOffset",
    value: function maxOffset() {
      return this.totalPages() * this.props.limit;
    }
  }, {
    key: "prevOffset",
    value: function prevOffset(offset) {
      return offset <= 0 ? 0 : offset - this.props.limit;
    }
  }, {
    key: "nextOffset",
    value: function nextOffset(offset) {
      return offset >= this.maxOffset() ? this.maxOffset() : offset + this.props.limit;
    }
  }, {
    key: "render",
    value: function render() {
      var onClick = this.props.onClick;
      var limit = this.props.limit;
      var currOffset = this.props.offset;
      var prevOffset = this.prevOffset(this.props.offset);
      var nextOffset = this.nextOffset(this.props.offset);
      var minOffset = 0;
      var maxOffset = this.maxOffset();
      return _React2["default"].createElement(
        "nav",
        null,
        _React2["default"].createElement(
          "ul",
          { className: "pagination" },
          _React2["default"].createElement(
            "li",
            null,
            _React2["default"].createElement(
              "button",
              { type: "button",
                onClick: function () {
                  return onClick(prevOffset);
                },
                className: _Class2["default"]({ btn: true, "btn-link": true, disabled: currOffset == minOffset }),
                title: "To offset " + prevOffset },
              _React2["default"].createElement(
                "span",
                null,
                "«"
              )
            )
          ),
          _range2["default"](0, maxOffset, limit).map(function (offset) {
            return _React2["default"].createElement(
              "li",
              { key: offset },
              _React2["default"].createElement(
                "button",
                { type: "button",
                  onClick: function () {
                    return onClick(offset);
                  },
                  query: { "page[offset]": offset },
                  className: _Class2["default"]({ btn: true, "btn-link": true, disabled: offset == currOffset }),
                  title: "To offset " + offset },
                offset
              )
            );
          }),
          _React2["default"].createElement(
            "li",
            null,
            _React2["default"].createElement(
              "button",
              { type: "button",
                onClick: function () {
                  return onClick(nextOffset);
                },
                className: _Class2["default"]({ btn: true, "btn-link": true, disabled: currOffset == maxOffset }),
                title: "To offset " + nextOffset },
              _React2["default"].createElement(
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
      onClick: _React2["default"].PropTypes.func.isRequired,
      total: _React2["default"].PropTypes.number.isRequired,
      offset: _React2["default"].PropTypes.number.isRequired,
      limit: _React2["default"].PropTypes.number.isRequired },
    enumerable: true
  }]);

  return InternalPagination;
})(_Component3["default"]);

exports["default"] = InternalPagination;
module.exports = exports["default"];
/*Total: {this.props.total}<br/>*/ /*Perpage: {this.props.perpage}<br/>*/ /*TotalPages: {this.totalPages()}<br/>*/

},{"classnames":"classnames","frontend/common/component":14,"frontend/common/helpers":27,"lodash.range":"lodash.range","react":"react","react-router":"react-router"}],27:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// HELPERS =========================================================================================
exports.toObject = toObject;
exports.toArray = toArray;
exports.parseJsonApiQuery = parseJsonApiQuery;
exports.formatJsonApiQuery = formatJsonApiQuery;
// IMPORTS =========================================================================================

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireWildcard(_sortBy);

var _isArray = require("lodash.isarray");

var _isArray2 = _interopRequireWildcard(_isArray);

var _isPlainObject = require("lodash.isplainobject");

var _isPlainObject2 = _interopRequireWildcard(_isPlainObject);

function toObject(array) {
  if (_isArray2["default"](array)) {
    return array.reduce(function (object, item) {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error("array must be plain Array, got " + array);
  }
}

function toArray(object) {
  if (_isPlainObject2["default"](object)) {
    return _sortBy2["default"](Object.keys(object).map(function (key) {
      return object[key];
    }), function (item) {
      return item.id;
    });
  } else {
    throw Error("object must be plain Object, got " + object);
  }
}

function parseJsonApiQuery(query) {
  return {
    filters: query.filter,
    sorts: query.sort ? query.sort.split(",").map(function (v) {
      return v.replace(/^ /, "+");
    }) : undefined,
    offset: query.page && (query.page.offset || query.page.offset == 0) ? parseInt(query.page.offset) : undefined,
    limit: query.page && (query.page.limit || query.page.offset == 0) ? parseInt(query.page.limit) : undefined };
}

function formatJsonApiQuery(modifiers) {
  if (!_isPlainObject2["default"](modifiers)) {
    throw new Error("modifiers must be plain Object, got " + modifiers);
  }

  var sortObj = {};
  var filterObj = {};
  var pageObj = {};

  if (modifiers.filters) {
    filterObj = Object.keys(modifiers.filters).reduce(function (filterObj, key) {
      filterObj["filter[" + key + "]"] = filters[key];
      return filterObj;
    }, filterObj);
  }
  if (modifiers.sorts) {
    sortObj.sort = modifiers.sorts.join(",");
  }
  if (modifiers.offset || modifiers.offset == 0) {
    pageObj["page[offset]"] = modifiers.offset;
  }
  if (modifiers.limit || modifiers.limit == 0) {
    pageObj["page[limit]"] = modifiers.limit;
  }

  return Object.assign({}, sortObj, filterObj, pageObj);
}

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],28:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Alert = require("./models/alert");

var _Alert2 = _interopRequireWildcard(_Alert);

exports["default"] = { Alert: _Alert2["default"] };
module.exports = exports["default"];

},{"./models/alert":29}],29:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
// IMPORTS =========================================================================================

var _UUID = require("node-uuid");

var _UUID2 = _interopRequireWildcard(_UUID);

function Alert(data) {
  if (!data.message) {
    throw Error("`data.message` is required");
  }
  if (!data.category) {
    throw Error("`data.category` is required");
  }
  return Object.assign({
    id: _UUID2["default"].v4(),
    closable: true,
    expire: data.category == "error" ? 0 : 5000 }, data);
}

module.exports = exports["default"];

},{"node-uuid":"node-uuid"}],30:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

// PROXY ROUTER TO REMOVE CIRCULAR DEPENDENCY ======================================================
// Turns:
//   app (router) <- routes <- components <- actions <- app (router)
// to:
//   app (router) <- routes <- components <- actions <- proxy (router)
var proxy = {
  makePath: function makePath() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];

    var cursor = _state2["default"].select("url");
    return window._router.makePath(route || cursor.get("route"), params || cursor.get("params"), query || cursor.get("query"));
  },

  makeHref: function makeHref() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];

    var cursor = _state2["default"].select("url");
    return window._router.makeHref(route || cursor.get("route"), params || cursor.get("params"), query || cursor.get("query"));
  },

  transitionTo: function transitionTo() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];

    var cursor = _state2["default"].select("url");
    window._router.transitionTo(route || cursor.get("route"), params || cursor.get("params"), query || cursor.get("query"));
  },

  replaceWith: function replaceWith() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];

    var cursor = _state2["default"].select("url");
    window._router.replaceWith(route || cursor.get("route"), params || cursor.get("params"), query || cursor.get("query"));
  },

  goBack: function goBack() {
    window._router.goBack();
  },

  run: function run(render) {
    window._router.run(render);
  }
};

exports["default"] = proxy;
module.exports = exports["default"];

},{"frontend/common/state":31}],31:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _take = require("lodash.take");

var _take2 = _interopRequireWildcard(_take);

var _sortByOrder = require("lodash.sortbyorder");

var _sortByOrder2 = _interopRequireWildcard(_sortByOrder);

var _Baobab = require("baobab");

var _Baobab2 = _interopRequireWildcard(_Baobab);

var _toArray = require("frontend/common/helpers");

// STATE ===========================================================================================
var EXAMPLE = {
  FILTERS: undefined, // {published: true} || undefined
  SORTS: undefined, // ["+publishedAt", "-id"] || undefined
  OFFSET: 0, // 0 || -1
  LIMIT: 20 };

exports.EXAMPLE = EXAMPLE;
var ROBOT = {
  FILTERS: undefined,
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 5 };

exports.ROBOT = ROBOT;
var ALERT = {
  FILTERS: undefined,
  SORTS: ["+createdOn"],
  OFFSET: 0,
  LIMIT: 5 };

exports.ALERT = ALERT;
exports["default"] = new _Baobab2["default"]({ // DATA
  url: {
    handler: undefined,
    params: undefined,
    query: undefined,
    id: undefined,
    filters: undefined,
    sorts: undefined,
    offset: undefined,
    limit: undefined },

  robots: {
    // DATA
    models: {},
    total: 0,
    pagination: {},

    // LOAD ARTEFACTS
    loading: true,
    loadError: undefined,

    // INDEX
    filters: ROBOT.FILTERS,
    sorts: ROBOT.SORTS,
    offset: ROBOT.OFFSET,
    limit: ROBOT.LIMIT,

    // MODEL
    id: undefined },

  alerts: {
    // DATA
    models: {},
    total: 0,
    pagination: {},

    // LOAD ARTEFACTS
    loading: true,
    loadError: undefined,

    // INDEX
    filters: ALERT.FILTERS,
    sorts: ALERT.SORTS,
    offset: ALERT.OFFSET,
    limit: ALERT.LIMIT,

    // MODEL
    id: undefined } }, { // OPTIONS
  facets: {
    currentRobot: {
      cursors: {
        robots: "robots" },

      get: function get(data) {
        var _data$robots = data.robots;
        var models = _data$robots.models;
        var id = _data$robots.id;

        if (id) {
          return models[id];
        } else {
          return undefined;
        }
      }
    },

    currentRobots: {
      cursors: {
        robots: "robots" },

      get: function get(data) {
        var _data$robots2 = data.robots;
        var models = _data$robots2.models;
        var pagination = _data$robots2.pagination;
        var offset = _data$robots2.offset;

        var ids = pagination[offset];
        if (ids) {
          return ids.map(function (id) {
            return models[id];
          });
        } else {
          return [];
        }
      }
    }
  }
});

/**
 * Converts sort table in **short** format to sort table in **lodash** format
 * @param sorts {Array<string>} - **short** sort table, e.g. ["+name", "-age"]
 * @returns {Array<Array<string>>} **lodash** sort table, e.g. [["name", "age"], [true, false]]
 */
function lodashifySorts(sorts) {
  return [sorts.map(function (v) {
    return v.slice(1);
  }), sorts.map(function (v) {
    return v[0] == "+";
  })];
}

/*
Change filters:
  //if pagination.length < total:
  //  purge pagination!
  fetch!
  redirect to offset = 0!

Change sorts:
  //if pagination.length < total:
  //  purge pagination!
  fetch!
  redirect to offset = 0!

Change offset:
  //if can't be loaded:
  //  fetch!
  // update pagination
  redirect to new offset!

Change limit:
  redirect to offset = 0! || rebuild pagination and if can't be loaded: fetch
*/
// 10 || 20 || 50 ...

},{"baobab":"baobab","frontend/common/helpers":27,"lodash.sortbyorder":"lodash.sortbyorder","lodash.take":54}],32:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchModel = require("./actions/fetch-model");

var _fetchModel2 = _interopRequireWildcard(_fetchModel);

var _fetchIndex = require("./actions/fetch-index");

var _fetchIndex2 = _interopRequireWildcard(_fetchIndex);

var _loadModel = require("./actions/load-model");

var _loadModel2 = _interopRequireWildcard(_loadModel);

var _loadIndex = require("./actions/load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

var _setFilters = require("./actions/set-filters");

var _setFilters2 = _interopRequireWildcard(_setFilters);

var _setSorts = require("./actions/set-sorts");

var _setSorts2 = _interopRequireWildcard(_setSorts);

var _setOffset = require("./actions/set-offset");

var _setOffset2 = _interopRequireWildcard(_setOffset);

var _setLimit = require("./actions/set-limit");

var _setLimit2 = _interopRequireWildcard(_setLimit);

var _establishModel = require("./actions/establish-model");

var _establishModel2 = _interopRequireWildcard(_establishModel);

var _establishIndex = require("./actions/establish-index");

var _establishIndex2 = _interopRequireWildcard(_establishIndex);

var _establishPage = require("./actions/establish-page");

var _establishPage2 = _interopRequireWildcard(_establishPage);

var _add = require("./actions/add");

var _add2 = _interopRequireWildcard(_add);

var _edit = require("./actions/edit");

var _edit2 = _interopRequireWildcard(_edit);

var _remove = require("./actions/remove");

var _remove2 = _interopRequireWildcard(_remove);

exports["default"] = {
  fetchModel: _fetchModel2["default"], fetchIndex: _fetchIndex2["default"],
  loadModel: _loadModel2["default"], loadIndex: _loadIndex2["default"],
  setFilters: _setFilters2["default"], setSorts: _setSorts2["default"], setOffset: _setOffset2["default"], setLimit: _setLimit2["default"],
  establishModel: _establishModel2["default"], establishIndex: _establishIndex2["default"], establishPage: _establishPage2["default"],
  add: _add2["default"], edit: _edit2["default"], remove: _remove2["default"]
};
module.exports = exports["default"];

},{"./actions/add":33,"./actions/edit":34,"./actions/establish-index":35,"./actions/establish-model":36,"./actions/establish-page":37,"./actions/fetch-index":38,"./actions/fetch-model":39,"./actions/load-index":40,"./actions/load-model":41,"./actions/remove":42,"./actions/set-filters":43,"./actions/set-limit":44,"./actions/set-offset":45,"./actions/set-sorts":46}],33:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

var _Robot = require("frontend/robot/models");

var _Robot2 = _interopRequireWildcard(_Robot);

function add(model) {
  var newModel = _Robot2["default"](model);
  var id = newModel.id;
  var apiURL = "/api/robots/" + id;

  // Optimistic add
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models", id).set(newModel);

  return _Axios2["default"].put(apiURL, newModel).then(function (response) {
    _state2["default"].select("robots").merge({ loading: false, loadError: undefined });
    _commonActions2["default"].alert.add({ message: "Action `Robot.add` succeed", category: "success" });
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
      _state2["default"].select("robots").merge({ loading: false, loadError: loadError });
      _state2["default"].select("robots", "models").unset(id); // Cancel add
      _commonActions2["default"].alert.add({ message: "Action `Robot.add` failed: " + loadError.description, category: "error" });
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31,"frontend/robot/models":52}],34:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = edit;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

var _Robot = require("frontend/robot/models");

var _Robot2 = _interopRequireWildcard(_Robot);

function edit(model) {
  var newModel = _Robot2["default"](model);
  var id = newModel.id;
  var oldModel = _state2["default"].select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic edit
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models", id).set(newModel);

  return _Axios2["default"].put(apiURL, newModel).then(function (response) {
    _state2["default"].select("robots").merge({
      loading: false,
      loadError: undefined });
    _commonActions2["default"].alert.add({ message: "Action `Robot.edit` succeed", category: "success" });
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
      _state2["default"].select("robots").merge({ loading: false, loadError: loadError });
      _state2["default"].select("robots", "models", id).set(oldModel); // Cancel edit
      _commonActions2["default"].alert.add({ message: "Action `Robot.edit` failed: " + loadError.description, category: "error" });
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31,"frontend/robot/models":52}],35:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishIndex;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function establishIndex() {
  console.debug("establishIndex");

  var urlCursor = _state2["default"].select("url");
  var robotsCursor = _state2["default"].select("robots");
  var urlFilters = urlCursor.get("filters");
  var urlSorts = urlCursor.get("sorts");
  var urlOffset = urlCursor.get("offset");
  var urlLimit = urlCursor.get("limit");

  if (urlFilters) {
    robotsCursor.set("filters", urlFilters);
  }
  if (urlSorts) {
    robotsCursor.set("sorts", urlSorts);
  }
  if (urlOffset || urlOffset === 0) {
    robotsCursor.set("offset", urlOffset);
  }
  if (urlLimit || urlLimit === 0) {
    robotsCursor.set("limit", urlLimit);
  }
  _state2["default"].commit();

  _loadIndex2["default"]();
}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/helpers":27,"frontend/common/router":30,"frontend/common/state":31}],36:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishModel;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _loadModel = require("./load-model");

var _loadModel2 = _interopRequireWildcard(_loadModel);

function establishModel() {
  console.debug("establishModel");

  var urlCursor = _state2["default"].select("url");
  var robotsCursor = _state2["default"].select("robots");
  var urlId = urlCursor.get("id");

  if (urlId) {
    robotsCursor.set("id", urlId);
  }
  _state2["default"].commit();

  _loadModel2["default"]();
}

module.exports = exports["default"];

},{"./load-model":41,"frontend/common/helpers":27,"frontend/common/router":30,"frontend/common/state":31}],37:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishPage;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function establishPage(params, query) {
  console.debug("establishPage:", params, query);

  //let robotsCursor = state.select("robots");

  // CHANGE STATE
  // ???
  //state.commit();
}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/helpers":27,"frontend/common/router":30,"frontend/common/state":31}],38:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: key == null || typeof Symbol == "undefined" || key.constructor !== Symbol, configurable: true, writable: true }); };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _toObject$formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

function fetchIndex(filters, sorts, offset, limit) {
  console.debug("fetchIndex");

  var url = "/api/robots/";
  var cursor = _state2["default"].select("robots");
  var query = _toObject$formatJsonApiQuery.formatJsonApiQuery({ filters: filters, sorts: sorts, offset: offset, limit: limit });

  cursor.set("loading", true);
  return _Axios2["default"].get(url, { params: query }).then(function (response) {
    // Current state
    var models = _state2["default"].select("robots", "models").get();
    var pagination = _state2["default"].select("robots", "pagination").get();

    // New data
    var _response$data = response.data;
    var data = _response$data.data;
    var meta = _response$data.meta;

    var fetchedModels = _toObject$formatJsonApiQuery.toObject(data);

    // Update state
    cursor.merge({
      total: meta.page && meta.page.total || Object.keys(models).length,
      models: Object.assign(models, fetchedModels),
      pagination: Object.assign(pagination, _defineProperty({}, offset, Object.keys(fetchedModels))),
      loading: false,
      loadError: false
    });
    _state2["default"].commit();

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
      cursor.merge({ loading: false, loadError: loadError });
      _state2["default"].commit(); // God, this is required just about everywhere! :(
      _commonActions2["default"].alert.add({ message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error" });

      return response.status;
    }
  }).done();
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":27,"frontend/common/state":31}],39:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _toObject = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

function fetchModel(id) {
  console.debug("fetchModel:", id);

  var url = "/api/robots/" + id;
  var cursor = _state2["default"].select("robots");

  cursor.set("loading", true);
  return _Axios2["default"].get(url).then(function (response) {
    var _response$data = response.data;
    var data = _response$data.data;
    var meta = _response$data.meta;

    var model = data;

    // BUG, NOT WORKING ==========================================================================
    // TRACK: https://github.com/Yomguithereal/baobab/issues/190
    //        https://github.com/Yomguithereal/baobab/issues/194
    //cursor.merge({
    //  loading: false,
    //  loadError: undefined,
    //});
    //cursor.select("models").set(model.id, model);
    // ===========================================================================================
    // WORKAROUND:
    cursor.apply(function (robots) {
      var models = Object.assign({}, robots.models);
      models[model.id] = model;
      return Object.assign({}, robots, {
        loading: false,
        loadError: undefined,
        models: models });
    });
    _state2["default"].commit();
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
      cursor.merge({ loading: false, loadError: loadError });
      _state2["default"].commit(); // God, this is required just about everywhere! :(
      _commonActions2["default"].alert.add({ message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error" });

      return response.status;
    }
  }).done();
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":27,"frontend/common/state":31}],40:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _toObject$formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _fetchIndex = require("./fetch-index");

var _fetchIndex2 = _interopRequireWildcard(_fetchIndex);

function loadIndex() {
  console.debug("loadIndex");

  var cursor = _state2["default"].select("robots");
  var filters = cursor.get("filters");
  var sorts = cursor.get("sorts");
  var offset = cursor.get("offset");
  var limit = cursor.get("limit");
  var pagination = cursor.get("pagination");

  var ids = pagination[offset];
  if (!ids || ids.length < limit) {
    _fetchIndex2["default"](filters, sorts, offset, limit);
  }
}

module.exports = exports["default"];

},{"./fetch-index":38,"axios":"axios","frontend/common/helpers":27,"frontend/common/state":31}],41:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _fetchModel = require("./fetch-model");

var _fetchModel2 = _interopRequireWildcard(_fetchModel);

function loadModel() {
  console.debug("loadModel");

  var cursor = _state2["default"].select("robots");
  var models = cursor.get("models");
  var id = cursor.get("id");

  var model = models[id];
  if (!model) {
    _fetchModel2["default"](id);
  }
}

module.exports = exports["default"];

},{"./fetch-model":39,"axios":"axios","frontend/common/state":31}],42:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireWildcard(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

function remove(id) {
  var oldModel = _state2["default"].select("robots", "models", id).get();
  var apiURL = "/api/robots/" + id;

  // Optimistic remove
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models").unset(id);

  return _Axios2["default"]["delete"](apiURL).then(function (response) {
    _state2["default"].select("robots").merge({
      loading: false,
      loadError: loadError });
    _router2["default"].transitionTo("robot-index");
    _commonActions2["default"].alert.add({ message: "Action `Robot.remove` succeed", category: "success" });
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
      _state2["default"].select("robots").merge({ loading: false, loadError: _loadError });
      _state2["default"].select("robots", "models", id).set(oldModel); // Cancel remove
      _commonActions2["default"].alert.add({ message: "Action `Robot.remove` failed: " + _loadError.description, category: "error" });
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31}],43:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setFilters;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function setFilters(filters) {
  console.debug("setFilters:", filters);

  var cursor = _state2["default"].select("robots");
  cursor.set("filters", filters);
  // TODO reevaluate pagination
  cursor.set("pagination", []);
  _state2["default"].commit();

  _loadIndex2["default"]();
}

// FILTER
//if (filters) {
//  Object.keys(filters).each(key => {
//    models = models.filter(model => model[key] === filters[key]);
//  });
//}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/state":31}],44:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setLimit;
// IMPORTS =========================================================================================

var _filter = require("lodash.filter");

var _filter2 = _interopRequireWildcard(_filter);

var _flatten = require("lodash.flatten");

var _flatten2 = _interopRequireWildcard(_flatten);

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireWildcard(_sortBy);

var _chunked = require("shared/common/helpers");

var _formatJsonApiQuery = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function setLimit(limit) {
  console.debug("setLimit:", limit);

  var urlCursor = _state2["default"].select("url");
  var currentUrlParams = urlCursor.get("params");
  var currentUrlQuery = urlCursor.get("query");

  var robotCursor = _state2["default"].select("robots");
  var currentOffset = robotCursor.get("offset");
  var currentLimit = robotCursor.get("limit");
  var currentPagination = robotCursor.get("pagination");

  if (limit != currentLimit) {
    var newLimit = limit;
    var newPagination = recalculatePaginationWithLimit(currentPagination, newLimit);

    robotCursor.set("limit", newLimit);
    robotCursor.set("pagination", newPagination);
    if (!newPagination[currentOffset]) {
      var newOffset = firstLesserOffset(newPagination, currentOffset);
      var newUrlQuery = _formatJsonApiQuery.formatJsonApiQuery({ offset: newOffset });
      _router2["default"].transitionTo(undefined, undefined, newUrlQuery);
    }
    _state2["default"].commit();

    _loadIndex2["default"]();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new limit (perpage)
 * Supports invalid data like overlapping offsets
 * @pure
 * @param pagination {Object} - input pagination
 * @param newLimit {Number} - new limit (perpage)
 * @returns {Object} - recalculated pagination
 */
function recalculatePaginationWithLimit(pagination, newLimit) {
  if (newLimit <= 0) {
    throw new Error("newLimit must be >= 0, got " + newLimit);
  }
  var maxOffset = Math.max.apply(Math, Object.keys(pagination));
  var length = maxOffset + pagination[maxOffset].length;
  var offsets = _sortBy2["default"](Object.keys(pagination).map(function (v) {
    return parseInt(v);
  }));
  var flatValues = offsets.reduce(function (memo, offset) {
    pagination[offset].forEach(function (id, i) {
      memo[offset + i] = id;
    });
    return memo;
  }, Array(length));
  return _chunked.chunked(flatValues, newLimit).reduce(function (obj, ids, i) {
    ids = _filter2["default"](ids);
    if (ids.length) {
      obj[i * newLimit] = ids;
    }
    return obj;
  }, {});
}

function firstLesserOffset(pagination, offset) {
  var offsets = Object.keys(pagination).map(function (v) {
    return parseInt(v);
  }).sort().reverse();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = offsets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var o = _step.value;

      if (parseInt(o) < offset) {
        return o;
      }
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

  return 0;
}
module.exports = exports["default"];

},{"./load-index":40,"frontend/common/helpers":27,"frontend/common/router":30,"frontend/common/state":31,"lodash.filter":"lodash.filter","lodash.flatten":"lodash.flatten","lodash.sortby":"lodash.sortby","shared/common/helpers":57}],45:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setOffset;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function setOffset(offset) {
  console.debug("setOffset:", offset);

  var cursor = _state2["default"].select("robots");
  var currentOffset = cursor.get("offset");

  if (offset != currentOffset) {
    var newOffset = offset;

    cursor.set("offset", newOffset);
    _state2["default"].commit();

    _loadIndex2["default"]();
  }
}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/state":31}],46:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setSorts;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireWildcard(_loadIndex);

function setSorts(sorts) {
  console.debug("setSorts:", sorts);

  var cursor = _state2["default"].select("robots");
  cursor.set("sorts", sorts);
  // TODO reevaluate pagination
  cursor.set("pagination", []);
  _state2["default"].commit();

  _loadIndex2["default"]();
}

// SORT
//if (sorts) {
//  models = sortByOrder(models, ...lodashifySorts(sorts));
//}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/state":31}],47:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _result = require("lodash.result");

var _result2 = _interopRequireWildcard(_result);

var _isArray = require("lodash.isarray");

var _isArray2 = _interopRequireWildcard(_isArray);

var _isPlainObject = require("lodash.isplainobject");

var _isPlainObject2 = _interopRequireWildcard(_isPlainObject);

var _isEmpty = require("lodash.isempty");

var _isEmpty2 = _interopRequireWildcard(_isEmpty);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

var _debounce = require("lodash.debounce");

var _debounce2 = _interopRequireWildcard(_debounce);

var _flatten = require("lodash.flatten");

var _flatten2 = _interopRequireWildcard(_flatten);

var _Class = require("classnames");

var _Class2 = _interopRequireWildcard(_Class);

//import Joi from "joi";

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

//import Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Error$Loading$NotFound = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireWildcard(_robotActions);

// HELPERS =========================================================================================
function flattenAndResetTo(obj, to, path) {
  path = path || "";
  return Object.keys(obj).reduce(function (memo, key) {
    if (_isPlainObject2["default"](obj[key])) {
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
exports["default"] = _React2["default"].createClass({
  displayName: "add",

  //mixins: [--ReactRouter.State--, state.mixin],

  //cursors() {
  //  return {
  //    robots: ["robots"],
  //  }
  //},

  render: function render() {
    return _React2["default"].createElement(
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

},{"classnames":"classnames","frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],48:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _branch = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

// COMPONENTS ======================================================================================

var _robotActions2 = _interopRequireWildcard(_robotActions);

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
      var _props$robots = this.props.robots;
      var loading = _props$robots.loading;
      var loadError = _props$robots.loadError;

      var model = this.props.model;

      if (loading) {
        return _React2["default"].createElement(_Error$Loading$NotFound.Loading, null);
      } else if (loadError) {
        return _React2["default"].createElement(_Error$Loading$NotFound.Error, { loadError: loadError });
      } else {
        return _React2["default"].createElement(
          _DocumentTitle2["default"],
          { title: "Detail " + model.name },
          _React2["default"].createElement(
            "div",
            null,
            _React2["default"].createElement(
              "div",
              { id: "page-actions" },
              _React2["default"].createElement(
                "div",
                { className: "container" },
                _React2["default"].createElement(
                  "div",
                  { className: "btn-group btn-group-sm pull-left" },
                  _React2["default"].createElement(
                    _Link.Link,
                    { to: "robot-index", params: { page: 1 }, className: "btn btn-gray-light", title: "Back to list" },
                    _React2["default"].createElement("span", { className: "fa fa-arrow-left" }),
                    _React2["default"].createElement(
                      "span",
                      { className: "hidden-xs margin-left-sm" },
                      "Back to list"
                    )
                  )
                ),
                _React2["default"].createElement(
                  "div",
                  { className: "btn-group btn-group-sm pull-right" },
                  _React2["default"].createElement(
                    _Link.Link,
                    { to: "robot-edit", params: { id: model.id }, className: "btn btn-orange", title: "Edit" },
                    _React2["default"].createElement("span", { className: "fa fa-edit" })
                  ),
                  _React2["default"].createElement(
                    "a",
                    { className: "btn btn-red", title: "Remove", onClick: _robotActions2["default"].remove.bind(this, model.id) },
                    _React2["default"].createElement("span", { className: "fa fa-times" })
                  )
                )
              )
            ),
            _React2["default"].createElement(
              "section",
              { className: "container margin-top-lg" },
              _React2["default"].createElement(
                "div",
                { className: "row" },
                _React2["default"].createElement(
                  "div",
                  { className: "col-xs-12 col-sm-3" },
                  _React2["default"].createElement(
                    "div",
                    { className: "thumbnail thumbnail-robot" },
                    _React2["default"].createElement("img", { src: "http://robohash.org/" + model.id + "?size=200x200", width: "200px", height: "200px" })
                  )
                ),
                _React2["default"].createElement(
                  "div",
                  { className: "col-xs-12 col-sm-9" },
                  _React2["default"].createElement(
                    "h1",
                    { className: "nomargin-top" },
                    model.name
                  ),
                  _React2["default"].createElement(
                    "dl",
                    null,
                    _React2["default"].createElement(
                      "dt",
                      null,
                      "Serial Number"
                    ),
                    _React2["default"].createElement(
                      "dd",
                      null,
                      model.id
                    ),
                    _React2["default"].createElement(
                      "dt",
                      null,
                      "Assembly Date"
                    ),
                    _React2["default"].createElement(
                      "dd",
                      null,
                      model.assemblyDate
                    ),
                    _React2["default"].createElement(
                      "dt",
                      null,
                      "Manufacturer"
                    ),
                    _React2["default"].createElement(
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
    key: "loadData",
    value: _robotActions2["default"].establishModel,
    enumerable: true
  }, {
    key: "contextTypes",
    value: {
      router: _React2["default"].PropTypes.func.isRequired },
    enumerable: true
  }]);

  RobotDetail = _branch.branch({
    cursors: {
      robots: "robots" },
    facets: {
      model: "currentRobot" } })(RobotDetail) || RobotDetail;
  return RobotDetail;
})(_Component3["default"]);

exports["default"] = RobotDetail;
module.exports = exports["default"];

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],49:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _result = require("lodash.result");

var _result2 = _interopRequireWildcard(_result);

var _isArray = require("lodash.isarray");

var _isArray2 = _interopRequireWildcard(_isArray);

var _isPlainObject = require("lodash.isplainobject");

var _isPlainObject2 = _interopRequireWildcard(_isPlainObject);

var _isEmpty = require("lodash.isempty");

var _isEmpty2 = _interopRequireWildcard(_isEmpty);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

var _debounce = require("lodash.debounce");

var _debounce2 = _interopRequireWildcard(_debounce);

var _flatten = require("lodash.flatten");

var _flatten2 = _interopRequireWildcard(_flatten);

var _Class = require("classnames");

var _Class2 = _interopRequireWildcard(_Class);

//import Joi from "joi";

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

//let Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireWildcard(_robotActions);

// HELPERS =========================================================================================
function flattenAndResetTo(obj, to, path) {
  path = path || "";
  return Object.keys(obj).reduce(function (memo, key) {
    if (_isPlainObject2["default"](obj[key])) {
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
//cursors() {
//  return {
//    robots: ["robots"],
//    loadModel: ["robots", "models", this.getParams().id],
//  }
//},

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
    value: function render() {
      return _React2["default"].createElement(
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
    key: "loadData",
    value: _robotActions2["default"].establishModel,
    enumerable: true
  }]);

  return RobotEdit;
})(_Component3["default"]);

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

},{"classnames":"classnames","frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title","react-router":"react-router"}],50:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _branch = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _toArray = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound$ExternalPagination$InternalPagination = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireWildcard(_robotActions);

var _RobotItem = require("frontend/robot/components/item");

// COMPONENTS ======================================================================================

var _RobotItem2 = _interopRequireWildcard(_RobotItem);

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
      var _props$robots = this.props.robots;
      var total = _props$robots.total;
      var loading = _props$robots.loading;
      var loadError = _props$robots.loadError;
      var offset = _props$robots.offset;
      var limit = _props$robots.limit;

      var models = this.props.currentRobots;

      if (loadError) {
        return _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination.Error, { loadError: loadError });
      } else {
        return _React2["default"].createElement(
          _DocumentTitle2["default"],
          { title: "Robots" },
          _React2["default"].createElement(
            "div",
            null,
            _React2["default"].createElement(
              "div",
              { id: "page-actions" },
              _React2["default"].createElement(
                "div",
                { className: "container" },
                _React2["default"].createElement(
                  "div",
                  { className: "pull-right" },
                  _React2["default"].createElement(
                    "div",
                    { className: "btn-group" },
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _robotActions2["default"].setLimit(3);
                        } },
                      "Perpage 3"
                    ),
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _robotActions2["default"].setLimit(5);
                        } },
                      "Perpage 5"
                    ),
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _robotActions2["default"].setLimit(10);
                        } },
                      "Perpage 10"
                    )
                  ),
                  _React2["default"].createElement(
                    _Link.Link,
                    { to: "robot-add", className: "btn btn-sm btn-green", title: "Add" },
                    _React2["default"].createElement("span", { className: "fa fa-plus" })
                  )
                )
              )
            ),
            _React2["default"].createElement(
              "section",
              { className: "container" },
              _React2["default"].createElement(
                "h1",
                null,
                "Robots"
              ),
              _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination.ExternalPagination, { endpoint: "robot-index", total: total, offset: offset, limit: limit }),
              _React2["default"].createElement(
                "div",
                { className: "row" },
                models.map(function (model) {
                  return _React2["default"].createElement(_RobotItem2["default"], { model: model, key: model.id });
                })
              ),
              _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination.InternalPagination, { onClick: function (offset) {
                  return _robotActions2["default"].setOffset(offset);
                }, total: total, offset: offset, limit: limit })
            ),
            loading ? _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination.Loading, null) : ""
          )
        );
      }
    }
  }], [{
    key: "loadData",
    value: _robotActions2["default"].establishIndex,
    enumerable: true
  }, {
    key: "contextTypes",
    value: {
      router: _React2["default"].PropTypes.func.isRequired },
    enumerable: true
  }]);

  RobotIndex = _branch.branch({
    cursors: {
      robots: "robots" },

    facets: {
      currentRobots: "currentRobots" }
  })(RobotIndex) || RobotIndex;
  return RobotIndex;
})(_Component3["default"]);

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

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/helpers":27,"frontend/common/state":31,"frontend/robot/actions":32,"frontend/robot/components/item":51,"react":"react","react-document-title":"react-document-title","react-router":"react-router"}],51:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Link = require("react-router");

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireWildcard(_robotActions);

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
      return _React2["default"].createElement(
        "div",
        { key: model.id, className: "col-sm-6 col-md-3" },
        _React2["default"].createElement(
          "div",
          { className: "panel panel-default", key: model.id },
          _React2["default"].createElement(
            "div",
            { className: "panel-heading" },
            _React2["default"].createElement(
              "h4",
              { className: "panel-title" },
              _React2["default"].createElement(
                _Link.Link,
                { to: "robot-detail", params: { id: model.id } },
                model.name
              )
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "panel-body text-center nopadding" },
            _React2["default"].createElement(
              _Link.Link,
              { to: "robot-detail", params: { id: model.id } },
              _React2["default"].createElement("img", { src: "http://robohash.org/" + model.id + "?size=200x200", width: "200px", height: "200px" })
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "panel-footer" },
            _React2["default"].createElement(
              "div",
              { className: "clearfix" },
              _React2["default"].createElement(
                "div",
                { className: "btn-group btn-group-sm pull-right" },
                _React2["default"].createElement(
                  _Link.Link,
                  { to: "robot-detail", params: { id: model.id }, className: "btn btn-blue", title: "Detail" },
                  _React2["default"].createElement("span", { className: "fa fa-eye" })
                ),
                _React2["default"].createElement(
                  _Link.Link,
                  { to: "robot-edit", params: { id: model.id }, className: "btn btn-orange", title: "Edit" },
                  _React2["default"].createElement("span", { className: "fa fa-edit" })
                ),
                _React2["default"].createElement(
                  "a",
                  { className: "btn btn-red", title: "Remove", onClick: _robotActions2["default"].remove.bind(this, model.id) },
                  _React2["default"].createElement("span", { className: "fa fa-times" })
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
      model: _React2["default"].PropTypes.object },
    enumerable: true
  }]);

  return RobotItem;
})(_Component3["default"]);

exports["default"] = RobotItem;
module.exports = exports["default"];

},{"frontend/common/component":14,"frontend/robot/actions":32,"react":"react","react-router":"react-router"}],52:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
// IMPORTS =========================================================================================

var _UUID = require("node-uuid");

var _UUID2 = _interopRequireWildcard(_UUID);

function Alert(data) {
  return Object.assign({
    id: _UUID2["default"].v4(),
    message: undefined,
    category: undefined,
    closable: true,
    expire: 5000 }, data);
}

module.exports = exports["default"];

},{"node-uuid":"node-uuid"}],53:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _Route$DefaultRoute$NotFoundRoute = require("react-router");

// Components

var _Body$Home$About$NotFound = require("frontend/common/components");

var _RobotIndex = require("frontend/robot/components/index");

var _RobotIndex2 = _interopRequireWildcard(_RobotIndex);

var _RobotAdd = require("frontend/robot/components/add");

var _RobotAdd2 = _interopRequireWildcard(_RobotAdd);

var _RobotDetail = require("frontend/robot/components/detail");

var _RobotDetail2 = _interopRequireWildcard(_RobotDetail);

var _RobotEdit = require("frontend/robot/components/edit");

var _RobotEdit2 = _interopRequireWildcard(_RobotEdit);

// ROUTES ==========================================================================================
exports["default"] = _React2["default"].createElement(
  _Route$DefaultRoute$NotFoundRoute.Route,
  { path: "/", handler: _Body$Home$About$NotFound.Body },
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.DefaultRoute, { handler: _Body$Home$About$NotFound.Home, name: "home" }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/about", name: "about", handler: _Body$Home$About$NotFound.About, loader: "xxx" }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/", name: "robot-index", handler: _RobotIndex2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/add", name: "robot-add", handler: _RobotAdd2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/:id", name: "robot-detail", handler: _RobotDetail2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/:id/edit", name: "robot-edit", handler: _RobotEdit2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.NotFoundRoute, { handler: _Body$Home$About$NotFound.NotFound })
);
module.exports = exports["default"];

},{"frontend/common/components":15,"frontend/robot/components/add":47,"frontend/robot/components/detail":48,"frontend/robot/components/edit":49,"frontend/robot/components/index":50,"react":"react","react-router":"react-router"}],54:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseSlice = require('lodash._baseslice'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  if (guard ? isIterateeCall(array, n, guard) : n == null) {
    n = 1;
  }
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;

},{"lodash._baseslice":55,"lodash._isiterateecall":56}],55:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],56:[function(require,module,exports){
/**
 * lodash 3.0.6 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * in Safari on iOS 8.1 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number') {
    var length = getLength(object),
        prereq = isLength(length) && isIndex(index, length);
  } else {
    prereq = type == 'string' && index in object;
  }
  if (prereq) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isIterateeCall;

},{}],57:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// HELPERS =========================================================================================
// `chunked([1, 2, 3, 4, 5], 2)` => [[1, 2], [3, 4], [5]]
exports.chunked = chunked;
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireWildcard(_range);

function chunked(array, n) {
  var l = Math.ceil(array.length / n);
  return _range2["default"](l).map(function (x, i) {
    return array.slice(i * n, i * n + n);
  });
}

},{"lodash.range":"lodash.range"}],58:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

var _Inspect = require("util-inspect");

var _Inspect2 = _interopRequireWildcard(_Inspect);

// SHIMS ===========================================================================================
// How it's ever missed?!
RegExp.escape = function (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
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
      return _Inspect2["default"](v);
    }));
  };
}

},{"util-inspect":"util-inspect"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmcuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3BhZ2luYXRpb24tZXh0ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMvYWxlcnQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vc3RhdGUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtcGFnZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2ZldGNoLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3NldC1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LW9mZnNldC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3NldC1zb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gudGFrZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gudGFrZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlc2xpY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnRha2Uvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNpdGVyYXRlZWNhbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL2NvbW1vbi9oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9zaGltcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztRQ0NPLGdCQUFnQjs7UUFDaEIsY0FBYzs7cUJBRUgsT0FBTzs7Ozs0Q0FDNkIsY0FBYzs7a0NBRXBDLHlCQUF5Qjs7cUJBQ3ZDLHVCQUF1Qjs7OztzQkFDdEIsaUJBQWlCOzs7OztBQUdwQyxNQUFNLENBQUMsT0FBTyxHQUFHLDhCQVBULE1BQU0sQ0FPZ0I7QUFDNUIsUUFBTSxxQkFBUTtBQUNkLFVBQVEsZ0NBVHNCLGVBQWUsQUFTcEI7Q0FDMUIsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsV0FBVyxFQUFFLEdBQUcsRUFBSzs7Ozs7QUFLdkMsU0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzs7O0FBRzVCLE1BQUksU0FBUyxHQUFHLG1CQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxNQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzQyxXQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxXQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFH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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OytCQ3RCNEIsNkJBQTZCOzs7OytCQUM3Qiw2QkFBNkI7Ozs7OEJBRTlCLDRCQUE0Qjs7Ozs4QkFDNUIsNEJB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QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7UUNySGdCLE9BQU8sR0FBUCxPQUFPOzs7cUJBSkwsY0FBYzs7OztBQUl6QixTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFPLG1CQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1dBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0NBQzFEOzs7Ozs7Ozs7dUJDUG1CLGNBQWM7Ozs7OztBQUlsQyxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVMsTUFBTSxFQUFFO0FBQy9CLFNBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztDQUN6RCxDQUFDOzs7Ozs7Ozs7O0FBVUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUN0RCxNQUFJLENBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsU0FDaEIsQ0FBQyxVQUFBLENBQUMsRUFBSTtBQUNWLGNBQVUsQ0FBQyxZQUFNO0FBQUUsWUFBTSxDQUFDLENBQUM7S0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ25DLENBQUMsQ0FBQztDQUNOLENBQUM7Ozs7QUFJSixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDO0FBQ2pDLElBQUksTUFBTSxFQUFFO0FBQ1YsUUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLEdBQUc7QUFDcEMsV0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUkscUJBQVEsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUM7R0FDeEYsQ0FBQztDQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBcImJhYmVsL3BvbHlmaWxsXCI7XG5pbXBvcnQgXCJzaGFyZWQvc2hpbXNcIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtjcmVhdGUgYXMgY3JlYXRlUm91dGVyLCBIaXN0b3J5TG9jYXRpb259IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IHtwYXJzZUpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlcyBmcm9tIFwiZnJvbnRlbmQvcm91dGVzXCI7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbndpbmRvdy5fcm91dGVyID0gY3JlYXRlUm91dGVyKHtcbiAgcm91dGVzOiByb3V0ZXMsXG4gIGxvY2F0aW9uOiBIaXN0b3J5TG9jYXRpb25cbn0pO1xuXG53aW5kb3cuX3JvdXRlci5ydW4oKEFwcGxpY2F0aW9uLCB1cmwpID0+IHtcbiAgLy8geW91IG1pZ2h0IHdhbnQgdG8gcHVzaCB0aGUgc3RhdGUgb2YgdGhlIHJvdXRlciB0byBhXG4gIC8vIHN0b3JlIGZvciB3aGF0ZXZlciByZWFzb25cbiAgLy8gUm91dGVyQWN0aW9ucy5yb3V0ZUNoYW5nZSh7cm91dGVyU3RhdGU6IHN0YXRlfSk7XG5cbiAgY29uc29sZS5kZWJ1ZyhcIlJvdXRlciBydW5cIik7XG5cbiAgLy8gU0VUIEJBT0JBQiBVUkwgREFUQSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IGhhbmRsZXIgPSB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lO1xuICB1cmxDdXJzb3Iuc2V0KFwiaGFuZGxlclwiLCBoYW5kbGVyKTtcbiAgdXJsQ3Vyc29yLnNldChcInBhcmFtc1wiLCB1cmwucGFyYW1zKTtcbiAgdXJsQ3Vyc29yLnNldChcInF1ZXJ5XCIsIHVybC5xdWVyeSk7XG5cbiAgbGV0IGlkID0gdXJsLnBhcmFtcy5pZDtcbiAgaWYgKGlkKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcImlkXCIsIGlkKTtcbiAgfVxuXG4gIGxldCB7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9ID0gcGFyc2VKc29uQXBpUXVlcnkodXJsLnF1ZXJ5KTtcbiAgdXJsQ3Vyc29yLnNldChcInJvdXRlXCIsIHVybC5yb3V0ZXMuc2xpY2UoLTEpWzBdLm5hbWUpO1xuICBpZiAoZmlsdGVycykge1xuICAgIHVybEN1cnNvci5zZXQoXCJmaWx0ZXJzXCIsIGZpbHRlcnMpO1xuICB9XG4gIGlmIChzb3J0cykge1xuICAgIHVybEN1cnNvci5zZXQoXCJzb3J0c1wiLCBzb3J0cyk7XG4gIH1cbiAgaWYgKG9mZnNldCB8fCBvZmZzZXQgPT09IDApIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwib2Zmc2V0XCIsIG9mZnNldCk7XG4gIH1cbiAgaWYgKGxpbWl0IHx8IGxpbWl0ID09PSAwKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcImxpbWl0XCIsIGxpbWl0KTtcbiAgfVxuXG4gIHN0YXRlLmNvbW1pdCgpO1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGxldCBwcm9taXNlcyA9IHVybC5yb3V0ZXNcbiAgICAubWFwKHJvdXRlID0+IHJvdXRlLmhhbmRsZXIub3JpZ2luYWwgfHwge30pXG4gICAgLm1hcChvcmlnaW5hbCA9PiB7XG4gICAgICBpZiAob3JpZ2luYWwubG9hZERhdGEpIHtcbiAgICAgICAgb3JpZ2luYWwubG9hZERhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgUmVhY3QucmVuZGVyKDxBcHBsaWNhdGlvbi8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xuICB9KTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0LW1vZHVsZXMvZGVjb3JhdG9ycy5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucm9vdCA9IHJvb3Q7XG5leHBvcnRzLmJyYW5jaCA9IGJyYW5jaDtcbi8qKlxuICogQmFvYmFiLVJlYWN0IERlY29yYXRvcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEVTNyBkZWNvcmF0b3JzIHN1Z2FyIGZvciBoaWdoZXIgb3JkZXIgY29tcG9uZW50cy5cbiAqL1xuXG52YXIgX1Jvb3QkQnJhbmNoID0gcmVxdWlyZSgnLi9oaWdoZXItb3JkZXIuanMnKTtcblxuZnVuY3Rpb24gcm9vdCh0cmVlKSB7XG4gIGlmICh0eXBlb2YgdHJlZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0cmVlKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5yb290KHRhcmdldCwgdHJlZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJyYW5jaChzcGVjcykge1xuICBpZiAodHlwZW9mIHNwZWNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2goc3BlY3MpO1xuICB9cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLmJyYW5jaCh0YXJnZXQsIHNwZWNzKTtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBSb290IGNvbXBvbmVudFxuICovXG5leHBvcnRzLnJvb3QgPSByb290O1xuXG4vKipcbiAqIEJyYW5jaCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBIaWdoZXIgT3JkZXIgQ29tcG9uZW50XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzYgaGlnaGVyIG9yZGVyIGNvbXBvbmVudCB0byBlbmNoYW5jZSBvbmUncyBjb21wb25lbnQuXG4gKi9cblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX1JlYWN0KTtcblxudmFyIF90eXBlID0gcmVxdWlyZSgnLi91dGlscy90eXBlLmpzJyk7XG5cbnZhciBfdHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdHlwZSk7XG5cbnZhciBfUHJvcFR5cGVzID0gcmVxdWlyZSgnLi91dGlscy9wcm9wLXR5cGVzLmpzJyk7XG5cbnZhciBfUHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9Qcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiByb290KENvbXBvbmVudCwgdHJlZSkge1xuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLkJhb2JhYih0cmVlKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdDpoaWdoZXItb3JkZXIucm9vdDogZ2l2ZW4gdHJlZSBpcyBub3QgYSBCYW9iYWIuJyk7XG5cbiAgdmFyIENvbXBvc2VkQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgdmFyIF9jbGFzcyA9IGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG5cbiAgICAgIGlmIChfUmVhY3QkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5oZXJpdHMoX2NsYXNzLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG4gICAgICBrZXk6ICdnZXRDaGlsZENvbnRleHQnLFxuXG4gICAgICAvLyBIYW5kbGluZyBjaGlsZCBjb250ZXh0XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgdGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6ICdvcmlnaW5hbCcsXG4gICAgICB2YWx1ZTogQ29tcG9uZW50LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3M7XG4gIH0pKF9SZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG4gIHJldHVybiBDb21wb3NlZENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYnJhbmNoKENvbXBvbmVudCkge1xuICB2YXIgc3BlY3MgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gIGlmICghX3R5cGUyWydkZWZhdWx0J10uT2JqZWN0KHNwZWNzKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdC5oaWdoZXItb3JkZXI6IGludmFsaWQgc3BlY2lmaWNhdGlvbnMgJyArICcoc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIGN1cnNvcnMgYW5kL29yIGZhY2V0cyBrZXkpLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudDIpIHtcbiAgICB2YXIgX2NsYXNzMiA9XG5cbiAgICAvLyBCdWlsZGluZyBpbml0aWFsIHN0YXRlXG4gICAgZnVuY3Rpb24gQ29tcG9zZWRDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MyKTtcblxuICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzMi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgdmFyIGZhY2V0ID0gY29udGV4dC50cmVlLmNyZWF0ZUZhY2V0KHNwZWNzLCBbcHJvcHMsIGNvbnRleHRdKTtcblxuICAgICAgaWYgKGZhY2V0KSB0aGlzLnN0YXRlID0gZmFjZXQuZ2V0KCk7XG5cbiAgICAgIHRoaXMuZmFjZXQgPSBmYWNldDtcbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzczIsIF9SZWFjdCRDb21wb25lbnQyKTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MyLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gQ2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjdXJzb3JzOiB0aGlzLmZhY2V0LmN1cnNvcnNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCBtb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH12YXIgaGFuZGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmZhY2V0Lm9uKCd1cGRhdGUnLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsVW5tb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCB1bm1vdW50XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBSZWxlYXNpbmcgZmFjZXRcbiAgICAgICAgdGhpcy5mYWNldC5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZmFjZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuXG4gICAgICAvLyBPbiBuZXcgcHJvcHNcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfXRoaXMuZmFjZXQucmVmcmVzaChbcHJvcHMsIHRoaXMuY29udGV4dF0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZmFjZXQuZ2V0KCkpO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdHJlZTogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5iYW9iYWJcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY2hpbGRDb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgY3Vyc29yczogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5jdXJzb3JzXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3MyO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgQ3VzdG9tIFByb3AgVHlwZXNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBQcm9wVHlwZXMgdXNlZCB0byBwcm9wYWdhdGUgY29udGV4dCBzYWZlbHkuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSByZXF1aXJlKCcuL3R5cGUuanMnKTtcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlKHByb3BOYW1lLCB3aGF0KSB7XG4gIHJldHVybiAncHJvcCB0eXBlIGAnICsgcHJvcE5hbWUgKyAnYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlICcgKyB3aGF0ICsgJy4nO1xufVxuXG52YXIgUHJvcFR5cGVzID0ge307XG5cblByb3BUeXBlcy5iYW9iYWIgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIGlmICghdHlwZS5CYW9iYWIocHJvcHNbcHJvcE5hbWVdKSkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdhIEJhb2JhYiB0cmVlJykpO1xufTtcblxuUHJvcFR5cGVzLmN1cnNvcnMgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIHZhciBwID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gIHZhciB2YWxpZCA9IHR5cGUuT2JqZWN0KHApICYmIE9iamVjdC5rZXlzKHApLmV2ZXJ5KGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIHR5cGUuQ3Vyc29yKHBba10pO1xuICB9KTtcblxuICBpZiAoIXZhbGlkKSByZXR1cm4gbmV3IEVycm9yKGVycm9yTWVzc2FnZShwcm9wTmFtZSwgJ0Jhb2JhYiBjdXJzb3JzJykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9wVHlwZXM7IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgVHlwZSBDaGVja2luZ1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogU29tZSBoZWxwZXJzIHRvIHBlcmZvcm0gcnVudGltZSB2YWxpZGF0aW9ucy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHt9O1xuXG50eXBlLk9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbn07XG5cbnR5cGUuQmFvYmFiID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQmFvYmFiXSc7XG59O1xuXG50eXBlLkN1cnNvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEN1cnNvcl0nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlOyIsImltcG9ydCBhbGVydEZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGFsZXJ0RmV0Y2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydExvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtbW9kZWxcIjtcbmltcG9ydCBhbGVydExvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtaW5kZXhcIjtcblxuaW1wb3J0IGFsZXJ0QWRkIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtYWRkXCI7XG5pbXBvcnQgYWxlcnRSZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbGVydDoge1xuICAgIGZldGNoTW9kZWw6IGFsZXJ0RmV0Y2hNb2RlbCxcbiAgICBmZXRjaEluZGV4OiBhbGVydEZldGNoSW5kZXgsXG4gICAgbG9hZE1vZGVsOiBhbGVydExvYWRNb2RlbCxcbiAgICBsb2FkSW5kZXg6IGFsZXJ0TG9hZEluZGV4LFxuICAgIGFkZDogYWxlcnRBZGQsXG4gICAgcmVtb3ZlOiBhbGVydFJlbW92ZSxcbiAgfSxcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCB7QWxlcnR9IGZyb20gXCJmcm9udGVuZC9jb21tb24vbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoSW5kZXhcIik7XG5cbiAgbGV0IHVybCA9IGBhcGkvYWxlcnRzYDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcblxuICBjdXJzb3IubWVyZ2Uoe1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgIHRvdGFsOiAwLFxuICAgIG1vZGVsczoge30sXG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoTW9kZWwoaWQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoTW9kZWw6XCIsIGlkKTtcblxuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgyMDApOyAvLyBIVFRQIHJlc3BvbnNlLnN0YXR1c1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hJbmRleCBmcm9tIFwiLi9hbGVydC1mZXRjaC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkSW5kZXhcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IGZpbHRlcnMgPSBjdXJzb3IuZ2V0KFwiZmlsdGVyc1wiKTtcbiAgbGV0IHNvcnRzID0gY3Vyc29yLmdldChcInNvcnRzXCIpO1xuICBsZXQgb2Zmc2V0ID0gY3Vyc29yLmdldChcIm9mZnNldFwiKTtcbiAgbGV0IGxpbWl0ID0gY3Vyc29yLmdldChcImxpbWl0XCIpO1xuICBsZXQgcGFnaW5hdGlvbiA9IGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpO1xuXG4gIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gIGlmICghaWRzKSB7XG4gICAgZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2FsZXJ0LWZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb24tcGVyc2lzdGVudCByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGdldEFsbE1ldGhvZHMob2JqKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZpbHRlcihrZXkgPT4gdHlwZW9mIG9ialtrZXldID09IFwiZnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIGF1dG9CaW5kKG9iaikge1xuICBnZXRBbGxNZXRob2RzKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpXG4gICAgLmZvckVhY2gobXRkID0+IHtcbiAgICAgIG9ialttdGRdID0gb2JqW210ZF0uYmluZChvYmopO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvQmluZCh0aGlzKTtcbiAgfVxufSIsImltcG9ydCBBYm91dCBmcm9tIFwiLi9jb21wb25lbnRzL2Fib3V0XCI7XG5pbXBvcnQgQm9keSBmcm9tIFwiLi9jb21wb25lbnRzL2JvZHlcIjtcbmltcG9ydCBFcnJvciBmcm9tIFwiLi9jb21wb25lbnRzL2Vycm9yXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkcm9vbVwiO1xuaW1wb3J0IEhvbWUgZnJvbSBcIi4vY29tcG9uZW50cy9ob21lXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIjtcbmltcG9ydCBOb3RGb3VuZCBmcm9tIFwiLi9jb21wb25lbnRzL25vdC1mb3VuZFwiO1xuaW1wb3J0IEludGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24taW50ZXJuYWxcIjtcbmltcG9ydCBFeHRlcm5hbFBhZ2luYXRpb24gZnJvbSBcIi4vY29tcG9uZW50cy9wYWdpbmF0aW9uLWV4dGVybmFsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQWJvdXQsIEJvZHksIEVycm9yLCBIZWFkcm9vbSwgSG9tZSwgTG9hZGluZywgTm90Rm91bmQsIEludGVybmFsUGFnaW5hdGlvbiwgRXh0ZXJuYWxQYWdpbmF0aW9uXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IExvYWRpbmcgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIjtcbmltcG9ydCBOb3RGb3VuZCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCI7XG5pbXBvcnQgQWxlcnRJdGVtIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hbGVydC1pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbc3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICBhbGVydHM6IFtcImFsZXJ0c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMuYWxlcnRzO1xuICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9ucyB0b3AtbGVmdFwiPlxuICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLy8gQ2FuJ3QgcnVuIHRoaXMgY3JhcCBmb3Igbm93IFRPRE8gcmVjaGVjayBhZnRlciB0cmFuc2l0aW9uIHRvIFdlYnBhY2tcbi8vIDEpIHJlYWN0L2FkZG9ucyBwdWxscyB3aG9sZSBuZXcgcmVhY3QgY2xvbmUgaW4gYnJvd3NlcmlmeVxuLy8gMikgcmMtY3NzLXRyYW5zaXRpb24tZ3JvdXAgY29udGFpbnMgdW5jb21waWxlZCBKU1ggc3ludGF4XG4vLyBPTUcgd2hhdCBhbiBpZGlvdHMgJl8mXG5cbi8vPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbi8vICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4vLzwvQ1NTVHJhbnNpdGlvbkdyb3VwPlxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7cm9vdH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmssIFJvdXRlSGFuZGxlcn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCI7XG5pbXBvcnQgQWxlcnRJbmRleCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQHJvb3Qoc3RhdGUpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLy9zdGF0aWMgbG9hZFBhZ2UocGFyYW1zLCBxdWVyeSkge1xuICAgIC8vIElnbm9yZSBwYXJhbXMgYW5kIHF1ZXJ5XG4gICAgLy8gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KTtcbiAgICAvL3JldHVybiBjb21tb25BY3Rpb25zLmFsZXJ0LmxvYWRQYWdlKCk7XG4gIC8vfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaGVhZHJvb21DbGFzc05hbWVzID0ge3Zpc2libGU6IFwibmF2YmFyLWRvd25cIiwgaGlkZGVuOiBcIm5hdmJhci11cFwifTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgIDxIZWFkcm9vbSBjb21wb25lbnQ9XCJoZWFkZXJcIiBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIHsvKjxBbGVydEluZGV4Lz4qL31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGxvYWRFcnJvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbXCJ4c1wiLCBcInNtXCIsIFwibWRcIiwgXCJsZ1wiXSksXG4gIH1cblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IFwibWRcIixcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVycm9yIFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3Iuc3RhdHVzICsgXCI6IFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3IuZGVzY3JpcHRpb259PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgIFwiYWxlcnQtYXMtaWNvblwiOiB0cnVlLFxuICAgICAgICAgIFwiZmEtc3RhY2tcIjogdHJ1ZSxcbiAgICAgICAgICBbdGhpcy5wcm9wcy5zaXplXTogdHJ1ZVxuICAgICAgICB9KX0+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXN0YWNrLTF4XCI+PC9pPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWJhbiBmYS1zdGFjay0yeFwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHRocm90dGxlIGZyb20gXCJsb2Rhc2gudGhyb3R0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkcm9vbSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY29tcG9uZW50OiBcImRpdlwiLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczoge1xuICAgICAgdmlzaWJsZTogXCJuYXZiYXItZG93blwiLFxuICAgICAgaGlkZGVuOiBcIm5hdmJhci11cFwiXG4gICAgfSxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNsYXNzTmFtZTogXCJcIlxuICB9XG5cbiAgaGFzU2Nyb2xsZWQoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIEluaXQgb3B0aW9uc1xuICAgIHRoaXMuZGVsdGFIZWlnaHQgPSB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0ID8gdGhpcy5wcm9wcy5kZWx0YUhlaWdodCA6IDU7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMucHJvcHMuZGVsYXkgPyB0aGlzLnByb3BzLmRlbGF5IDogMjUwO1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9wcy5pZCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhyb3R0bGUodGhpcy5oYXNTY3JvbGxlZCwgdGhpcy5kZWxheSksIGZhbHNlKTtcblxuICAgIC8vIFVwZGF0ZSBjb21wb25lbnRcInMgY2xhc3NOYW1lXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmhhc1Njcm9sbGVkLCBmYWxzZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUmVhY3QgU3RhcnRlclwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBob21lXCI+XG4gICAgICAgICAgPGgxPlJlYWN0IHN0YXJ0ZXIgYXBwPC9oMT5cbiAgICAgICAgICA8cD5Qcm9vZiBvZiBjb25jZXB0cywgQ1JVRCwgd2hhdGV2ZXIuLi48L3A+XG4gICAgICAgICAgPHA+UHJvdWRseSBidWlsZCBvbiBFUzYgd2l0aCB0aGUgaGVscCBvZiA8YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiB0cmFuc3BpbGVyLjwvcD5cbiAgICAgICAgICA8aDM+RnJvbnRlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9cIj5SZWFjdDwvYT4gZGVjbGFyYXRpdmUgVUk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWJcIj5CYW9iYWI8L2E+IEpTIGRhdGEgdHJlZSB3aXRoIGN1cnNvcnM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmFja3QvcmVhY3Qtcm91dGVyXCI+UmVhY3QtUm91dGVyPC9hPiBkZWNsYXJhdGl2ZSByb3V0ZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZ2FlYXJvbi9yZWFjdC1kb2N1bWVudC10aXRsZVwiPlJlYWN0LURvY3VtZW50LVRpdGxlPC9hPiBkZWNsYXJhdGl2ZSBkb2N1bWVudCB0aXRsZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9cIj5SZWFjdC1Cb290c3RyYXA8L2E+IEJvb3RzdHJhcCBjb21wb25lbnRzIGluIFJlYWN0PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jyb3dzZXJpZnkub3JnL1wiPkJyb3dzZXJpZnk8L2E+ICZhbXA7IDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svd2F0Y2hpZnlcIj5XYXRjaGlmeTwvYT4gYnVuZGxlIE5QTSBtb2R1bGVzIHRvIGZyb250ZW5kPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jvd2VyLmlvL1wiPkJvd2VyPC9hPiBmcm9udGVuZCBwYWNrYWdlIG1hbmFnZXI8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+QmFja2VuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZXhwcmVzc2pzLmNvbS9cIj5FeHByZXNzPC9hPiB3ZWItYXBwIGJhY2tlbmQgZnJhbWV3b3JrPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21vemlsbGEuZ2l0aHViLmlvL251bmp1Y2tzL1wiPk51bmp1Y2tzPC9hPiB0ZW1wbGF0ZSBlbmdpbmU8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZWxlaXRoL2VtYWlsanNcIj5FbWFpbEpTPC9hPiBTTVRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5Db21tb248L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiBKUyB0cmFuc3BpbGVyPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2d1bHBqcy5jb20vXCI+R3VscDwvYT4gc3RyZWFtaW5nIGJ1aWxkIHN5c3RlbTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vbG9kYXNoLmNvbS9cIj5Mb2Rhc2g8L2E+IHV0aWxpdHkgbGlicmFyeTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXCI+QXhpb3M8L2E+IHByb21pc2UtYmFzZWQgSFRUUCBjbGllbnQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svaW1tdXRhYmxlLWpzXCI+SW1tdXRhYmxlPC9hPiBwZXJzaXN0ZW50IGltbXV0YWJsZSBkYXRhIGZvciBKUzwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmFuZ2UgZnJvbSBcImxvZGFzaC5yYW5nZVwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlcm5hbFBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVuZHBvaW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdG90YWw6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvZmZzZXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsaW1pdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB9XG5cbiAgdG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMucHJvcHMudG90YWwgLyB0aGlzLnByb3BzLmxpbWl0KTtcbiAgfVxuXG4gIG1heE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzKCkgKiB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcHJldk9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0IDw9IDAgPyAwIDogb2Zmc2V0IC0gdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIG5leHRPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA+PSB0aGlzLm1heE9mZnNldCgpID8gdGhpcy5tYXhPZmZzZXQoKSA6IG9mZnNldCArIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGVuZHBvaW50ID0gdGhpcy5wcm9wcy5lbmRwb2ludDtcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8TGluayB0bz17ZW5kcG9pbnR9XG4gICAgICAgICAgICAgIHF1ZXJ5PXt7XCJwYWdlW29mZnNldF1cIjogcHJldk9mZnNldH19XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWluT2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7cHJldk9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxsaSBrZXk9e29mZnNldH0+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89e2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBvZmZzZXR9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBkaXNhYmxlZDogb2Zmc2V0ID09IGN1cnJPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7b2Zmc2V0fWB9PlxuICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBuZXh0T2Zmc2V0fX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtuZXh0T2Zmc2V0fWB9PlxuICAgICAgICAgICAgICA8c3Bhbj4mcmFxdW87PC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIHsvKlRvdGFsOiB7dGhpcy5wcm9wcy50b3RhbH08YnIvPiovfVxuICAgICAgICB7LypQZXJwYWdlOiB7dGhpcy5wcm9wcy5wZXJwYWdlfTxici8+Ki99XG4gICAgICAgIHsvKlRvdGFsUGFnZXM6IHt0aGlzLnRvdGFsUGFnZXMoKX08YnIvPiovfVxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9mZnNldDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxpbWl0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMubGltaXQpO1xuICB9XG5cbiAgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXMoKSAqIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBwcmV2T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPD0gMCA/IDAgOiBvZmZzZXQgLSB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgbmV4dE9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0ID49IHRoaXMubWF4T2Zmc2V0KCkgPyB0aGlzLm1heE9mZnNldCgpIDogb2Zmc2V0ICsgdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25DbGljaztcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKHByZXZPZmZzZXQpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWluT2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7cHJldk9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge3JhbmdlKDAsIG1heE9mZnNldCwgbGltaXQpLm1hcChvZmZzZXQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGtleT17b2Zmc2V0fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhvZmZzZXQpfVxuICAgICAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBvZmZzZXR9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBcImJ0bi1saW5rXCI6IHRydWUsIGRpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtvZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgICB7b2Zmc2V0fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG5leHRPZmZzZXQpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWF4T2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7bmV4dE9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIHsvKlRvdGFsOiB7dGhpcy5wcm9wcy50b3RhbH08YnIvPiovfVxuICAgICAgICB7LypQZXJwYWdlOiB7dGhpcy5wcm9wcy5wZXJwYWdlfTxici8+Ki99XG4gICAgICAgIHsvKlRvdGFsUGFnZXM6IHt0aGlzLnRvdGFsUGFnZXMoKX08YnIvPiovfVxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzb3J0QnkgZnJvbSBcImxvZGFzaC5zb3J0YnlcIjtcbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcImxvZGFzaC5pc3BsYWlub2JqZWN0XCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xuICBpZiAoaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihgYXJyYXkgbXVzdCBiZSBwbGFpbiBBcnJheSwgZ290ICR7YXJyYXl9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYG9iamVjdCBtdXN0IGJlIHBsYWluIE9iamVjdCwgZ290ICR7b2JqZWN0fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSkge1xuICByZXR1cm4ge1xuICAgIGZpbHRlcnM6IHF1ZXJ5LmZpbHRlcixcbiAgICBzb3J0czogcXVlcnkuc29ydCA/IHF1ZXJ5LnNvcnQuc3BsaXQoXCIsXCIpLm1hcCh2ID0+IHYucmVwbGFjZSgvXiAvLCBcIitcIikpIDogdW5kZWZpbmVkLFxuICAgIG9mZnNldDogcXVlcnkucGFnZSAmJiAocXVlcnkucGFnZS5vZmZzZXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLm9mZnNldCkgOiB1bmRlZmluZWQsXG4gICAgbGltaXQ6IHF1ZXJ5LnBhZ2UgJiYgKHF1ZXJ5LnBhZ2UubGltaXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLmxpbWl0KSA6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEpzb25BcGlRdWVyeShtb2RpZmllcnMpIHtcbiAgaWYgKCFpc1BsYWluT2JqZWN0KG1vZGlmaWVycykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG1vZGlmaWVycyBtdXN0IGJlIHBsYWluIE9iamVjdCwgZ290ICR7bW9kaWZpZXJzfWApO1xuICB9XG5cbiAgbGV0IHNvcnRPYmogPSB7fTtcbiAgbGV0IGZpbHRlck9iaiA9IHt9O1xuICBsZXQgcGFnZU9iaiA9IHt9O1xuXG4gIGlmIChtb2RpZmllcnMuZmlsdGVycykge1xuICAgIGZpbHRlck9iaiA9IE9iamVjdC5rZXlzKG1vZGlmaWVycy5maWx0ZXJzKS5yZWR1Y2UoKGZpbHRlck9iaiwga2V5KSA9PiB7XG4gICAgICBmaWx0ZXJPYmpbYGZpbHRlclske2tleX1dYF0gPSBmaWx0ZXJzW2tleV07XG4gICAgICByZXR1cm4gZmlsdGVyT2JqO1xuICAgIH0sIGZpbHRlck9iaik7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5zb3J0cykge1xuICAgIHNvcnRPYmpbXCJzb3J0XCJdID0gbW9kaWZpZXJzLnNvcnRzLmpvaW4oXCIsXCIpO1xuICB9XG4gIGlmIChtb2RpZmllcnMub2Zmc2V0IHx8IG1vZGlmaWVycy5vZmZzZXQgPT0gMCkge1xuICAgIHBhZ2VPYmpbXCJwYWdlW29mZnNldF1cIl0gPSBtb2RpZmllcnMub2Zmc2V0O1xuICB9XG4gIGlmIChtb2RpZmllcnMubGltaXQgfHwgbW9kaWZpZXJzLmxpbWl0ID09IDApIHtcbiAgICBwYWdlT2JqW1wicGFnZVtsaW1pdF1cIl0gPSBtb2RpZmllcnMubGltaXQ7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc29ydE9iaiwgZmlsdGVyT2JqLCBwYWdlT2JqKTtcbn0iLCJpbXBvcnQgQWxlcnQgZnJvbSBcIi4vbW9kZWxzL2FsZXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtBbGVydH07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IGRhdGEuY2F0ZWdvcnkgPT0gXCJlcnJvclwiID8gMCA6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIFBST1hZIFJPVVRFUiBUTyBSRU1PVkUgQ0lSQ1VMQVIgREVQRU5ERU5DWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR1cm5zOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBhcHAgKHJvdXRlcilcbi8vIHRvOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBwcm94eSAocm91dGVyKVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aChyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VQYXRoKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIG1ha2VIcmVmKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICByZXR1cm4gd2luZG93Ll9yb3V0ZXIubWFrZUhyZWYoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBwYXJhbXMgfHwgY3Vyc29yLmdldChcInBhcmFtc1wiKSxcbiAgICAgIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKVxuICAgICk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci50cmFuc2l0aW9uVG8oXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBwYXJhbXMgfHwgY3Vyc29yLmdldChcInBhcmFtc1wiKSxcbiAgICAgIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKVxuICAgICk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQpIHtcbiAgICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICAgIHdpbmRvdy5fcm91dGVyLnJlcGxhY2VXaXRoKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIGdvQmFjaygpIHtcbiAgICB3aW5kb3cuX3JvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93Ll9yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuXG5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB0YWtlIGZyb20gXCJsb2Rhc2gudGFrZVwiO1xuaW1wb3J0IHNvcnRCeU9yZGVyIGZyb20gXCJsb2Rhc2guc29ydGJ5b3JkZXJcIjtcbmltcG9ydCBCYW9iYWIgZnJvbSBcImJhb2JhYlwiO1xuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IEVYQU1QTEUgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCwgLy8ge3B1Ymxpc2hlZDogdHJ1ZX0gfHwgdW5kZWZpbmVkXG4gIFNPUlRTOiB1bmRlZmluZWQsICAgLy8gW1wiK3B1Ymxpc2hlZEF0XCIsIFwiLWlkXCJdIHx8IHVuZGVmaW5lZFxuICBPRkZTRVQ6IDAsICAgICAgICAgIC8vIDAgfHwgLTFcbiAgTElNSVQ6IDIwLCAgICAgICAgICAvLyAxMCB8fCAyMCB8fCA1MCAuLi5cbn07XG5cbmV4cG9ydCBjb25zdCBST0JPVCA9IHtcbiAgRklMVEVSUzogdW5kZWZpbmVkLFxuICBTT1JUUzogW1wiK25hbWVcIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59O1xuXG5leHBvcnQgY29uc3QgQUxFUlQgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCxcbiAgU09SVFM6IFtcIitjcmVhdGVkT25cIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoXG4gIHsgLy8gREFUQVxuICAgIHVybDoge1xuICAgICAgaGFuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgcGFyYW1zOiB1bmRlZmluZWQsXG4gICAgICBxdWVyeTogdW5kZWZpbmVkLFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgIGZpbHRlcnM6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRzOiB1bmRlZmluZWQsXG4gICAgICBvZmZzZXQ6IHVuZGVmaW5lZCxcbiAgICAgIGxpbWl0OiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIHJvYm90czoge1xuICAgICAgLy8gREFUQVxuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnaW5hdGlvbjoge30sXG5cbiAgICAgIC8vIExPQUQgQVJURUZBQ1RTXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIElOREVYXG4gICAgICBmaWx0ZXJzOiBST0JPVC5GSUxURVJTLFxuICAgICAgc29ydHM6IFJPQk9ULlNPUlRTLFxuICAgICAgb2Zmc2V0OiBST0JPVC5PRkZTRVQsXG4gICAgICBsaW1pdDogUk9CT1QuTElNSVQsXG5cbiAgICAgIC8vIE1PREVMXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgIH0sXG5cbiAgICBhbGVydHM6IHtcbiAgICAgIC8vIERBVEFcbiAgICAgIG1vZGVsczoge30sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIHBhZ2luYXRpb246IHt9LFxuXG4gICAgICAvLyBMT0FEIEFSVEVGQUNUU1xuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuXG4gICAgICAvLyBJTkRFWFxuICAgICAgZmlsdGVyczogQUxFUlQuRklMVEVSUyxcbiAgICAgIHNvcnRzOiBBTEVSVC5TT1JUUyxcbiAgICAgIG9mZnNldDogQUxFUlQuT0ZGU0VULFxuICAgICAgbGltaXQ6IEFMRVJULkxJTUlULFxuXG4gICAgICAvLyBNT0RFTFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICB9LFxuICB7IC8vIE9QVElPTlNcbiAgICBmYWNldHM6IHtcbiAgICAgIGN1cnJlbnRSb2JvdDoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQge21vZGVscywgaWR9ID0gZGF0YS5yb2JvdHM7XG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWxzW2lkXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGN1cnJlbnRSb2JvdHM6IHtcbiAgICAgICAgY3Vyc29yczoge1xuICAgICAgICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IHttb2RlbHMsIHBhZ2luYXRpb24sIG9mZnNldH0gPSBkYXRhLnJvYm90cztcbiAgICAgICAgICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICAgICAgICAgIGlmIChpZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBpZHMubWFwKGlkID0+IG1vZGVsc1tpZF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4pO1xuXG4vKipcbiAqIENvbnZlcnRzIHNvcnQgdGFibGUgaW4gKipzaG9ydCoqIGZvcm1hdCB0byBzb3J0IHRhYmxlIGluICoqbG9kYXNoKiogZm9ybWF0XG4gKiBAcGFyYW0gc29ydHMge0FycmF5PHN0cmluZz59IC0gKipzaG9ydCoqIHNvcnQgdGFibGUsIGUuZy4gW1wiK25hbWVcIiwgXCItYWdlXCJdXG4gKiBAcmV0dXJucyB7QXJyYXk8QXJyYXk8c3RyaW5nPj59ICoqbG9kYXNoKiogc29ydCB0YWJsZSwgZS5nLiBbW1wibmFtZVwiLCBcImFnZVwiXSwgW3RydWUsIGZhbHNlXV1cbiAqL1xuZnVuY3Rpb24gbG9kYXNoaWZ5U29ydHMoc29ydHMpIHtcbiAgcmV0dXJuIFtcbiAgICBzb3J0cy5tYXAodiA9PiB2LnNsaWNlKDEpKSxcbiAgICBzb3J0cy5tYXAodiA9PiB2WzBdID09IFwiK1wiKSxcbiAgXTtcbn1cblxuLypcbkNoYW5nZSBmaWx0ZXJzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIHNvcnRzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIG9mZnNldDpcbiAgLy9pZiBjYW4ndCBiZSBsb2FkZWQ6XG4gIC8vICBmZXRjaCFcbiAgLy8gdXBkYXRlIHBhZ2luYXRpb25cbiAgcmVkaXJlY3QgdG8gbmV3IG9mZnNldCFcblxuQ2hhbmdlIGxpbWl0OlxuICByZWRpcmVjdCB0byBvZmZzZXQgPSAwISB8fCByZWJ1aWxkIHBhZ2luYXRpb24gYW5kIGlmIGNhbid0IGJlIGxvYWRlZDogZmV0Y2hcbiovIiwiaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1pbmRleFwiO1xuXG5pbXBvcnQgbG9hZE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvbG9hZC1tb2RlbFwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtaW5kZXhcIjtcblxuaW1wb3J0IHNldEZpbHRlcnMgZnJvbSBcIi4vYWN0aW9ucy9zZXQtZmlsdGVyc1wiO1xuaW1wb3J0IHNldFNvcnRzIGZyb20gXCIuL2FjdGlvbnMvc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL2FjdGlvbnMvc2V0LW9mZnNldFwiO1xuaW1wb3J0IHNldExpbWl0IGZyb20gXCIuL2FjdGlvbnMvc2V0LWxpbWl0XCI7XG5cbmltcG9ydCBlc3RhYmxpc2hNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbFwiO1xuaW1wb3J0IGVzdGFibGlzaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLWluZGV4XCI7XG5pbXBvcnQgZXN0YWJsaXNoUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1wYWdlXCI7XG5cbmltcG9ydCBhZGQgZnJvbSBcIi4vYWN0aW9ucy9hZGRcIjtcbmltcG9ydCBlZGl0IGZyb20gXCIuL2FjdGlvbnMvZWRpdFwiO1xuaW1wb3J0IHJlbW92ZSBmcm9tIFwiLi9hY3Rpb25zL3JlbW92ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZldGNoTW9kZWwsIGZldGNoSW5kZXgsXG4gIGxvYWRNb2RlbCwgbG9hZEluZGV4LFxuICBzZXRGaWx0ZXJzLCBzZXRTb3J0cywgc2V0T2Zmc2V0LCBzZXRMaW1pdCxcbiAgZXN0YWJsaXNoTW9kZWwsIGVzdGFibGlzaEluZGV4LCBlc3RhYmxpc2hQYWdlLFxuICBhZGQsIGVkaXQsIHJlbW92ZVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90IGZyb20gXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dChhcGlVUkwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3QgZnJvbSBcImZyb250ZW5kL3JvYm90L21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQoYXBpVVJMLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzXG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hJbmRleFwiKTtcblxuICBsZXQgdXJsQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICBsZXQgcm9ib3RzQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgdXJsRmlsdGVycyA9IHVybEN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgdXJsU29ydHMgPSB1cmxDdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCB1cmxPZmZzZXQgPSB1cmxDdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgdXJsTGltaXQgPSB1cmxDdXJzb3IuZ2V0KFwibGltaXRcIik7XG5cbiAgaWYgKHVybEZpbHRlcnMpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCB1cmxGaWx0ZXJzKTtcbiAgfVxuICBpZiAodXJsU29ydHMpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwic29ydHNcIiwgdXJsU29ydHMpO1xuICB9XG4gIGlmICh1cmxPZmZzZXQgfHwgdXJsT2Zmc2V0ID09PSAwKSB7XG4gICAgcm9ib3RzQ3Vyc29yLnNldChcIm9mZnNldFwiLCB1cmxPZmZzZXQpO1xuICB9XG4gIGlmICh1cmxMaW1pdCB8fCB1cmxMaW1pdCA9PT0gMCkge1xuICAgIHJvYm90c0N1cnNvci5zZXQoXCJsaW1pdFwiLCB1cmxMaW1pdCk7XG4gIH1cbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZEluZGV4KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkTW9kZWwgZnJvbSBcIi4vbG9hZC1tb2RlbFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaE1vZGVsXCIpO1xuXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCByb2JvdHNDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCB1cmxJZCA9IHVybEN1cnNvci5nZXQoXCJpZFwiKTtcblxuICBpZiAodXJsSWQpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwiaWRcIiwgdXJsSWQpO1xuICB9XG4gIHN0YXRlLmNvbW1pdCgpO1xuXG4gIGxvYWRNb2RlbCgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hQYWdlOlwiLCBwYXJhbXMsIHF1ZXJ5KTtcblxuICAvL2xldCByb2JvdHNDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG5cbiAgLy8gQ0hBTkdFIFNUQVRFXG4gIC8vID8/P1xuICAvL3N0YXRlLmNvbW1pdCgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hJbmRleFwiKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzL2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9KTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAvLyBDdXJyZW50IHN0YXRlXG4gICAgICBsZXQgbW9kZWxzID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLmdldCgpO1xuICAgICAgbGV0IHBhZ2luYXRpb24gPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJwYWdpbmF0aW9uXCIpLmdldCgpO1xuXG4gICAgICAvLyBOZXcgZGF0YVxuICAgICAgbGV0IHtkYXRhLCBtZXRhfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBsZXQgZmV0Y2hlZE1vZGVscyA9IHRvT2JqZWN0KGRhdGEpO1xuXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIGN1cnNvci5tZXJnZSh7XG4gICAgICAgIHRvdGFsOiBtZXRhLnBhZ2UgJiYgbWV0YS5wYWdlLnRvdGFsIHx8IE9iamVjdC5rZXlzKG1vZGVscykubGVuZ3RoLFxuICAgICAgICBtb2RlbHM6IE9iamVjdC5hc3NpZ24obW9kZWxzLCBmZXRjaGVkTW9kZWxzKSxcbiAgICAgICAgcGFnaW5hdGlvbjogT2JqZWN0LmFzc2lnbihwYWdpbmF0aW9uLCB7W29mZnNldF06IE9iamVjdC5rZXlzKGZldGNoZWRNb2RlbHMpfSksXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLmNvbW1pdCgpO1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBjdXJzb3IubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuY29tbWl0KCk7IC8vIEdvZCwgdGhpcyBpcyByZXF1aXJlZCBqdXN0IGFib3V0IGV2ZXJ5d2hlcmUhIDooXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3Q6ZmV0Y2hQYWdlYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hNb2RlbChpZCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hNb2RlbDpcIiwgaWQpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL2N1cnNvci5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9jdXJzb3Iuc2VsZWN0KFwibW9kZWxzXCIpLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgLy8gV09SS0FST1VORDpcbiAgICAgIGN1cnNvci5hcHBseShyb2JvdHMgPT4ge1xuICAgICAgICBsZXQgbW9kZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLm1vZGVscyk7XG4gICAgICAgIG1vZGVsc1ttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJvYm90cywge1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgIG1vZGVsczogbW9kZWxzLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaE1vZGVsYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2ZldGNoLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRJbmRleCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgZmlsdGVycyA9IGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgc29ydHMgPSBjdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCBvZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgbGltaXQgPSBjdXJzb3IuZ2V0KFwibGltaXRcIik7XG4gIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgaWYgKCFpZHMgfHwgaWRzLmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2ZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZShhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogbG9hZEVycm9yLFxuICAgICAgfSk7XG4gICAgICByb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9sb2FkLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldEZpbHRlcnMoZmlsdGVycykge1xuICBjb25zb2xlLmRlYnVnKFwic2V0RmlsdGVyczpcIiwgZmlsdGVycyk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgY3Vyc29yLnNldChcImZpbHRlcnNcIiwgZmlsdGVycyk7XG4gIC8vIFRPRE8gcmVldmFsdWF0ZSBwYWdpbmF0aW9uXG4gIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIFtdKTtcbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZEluZGV4KCk7XG59XG5cbi8vIEZJTFRFUlxuLy9pZiAoZmlsdGVycykge1xuLy8gIE9iamVjdC5rZXlzKGZpbHRlcnMpLmVhY2goa2V5ID0+IHtcbi8vICAgIG1vZGVscyA9IG1vZGVscy5maWx0ZXIobW9kZWwgPT4gbW9kZWxba2V5XSA9PT0gZmlsdGVyc1trZXldKTtcbi8vICB9KTtcbi8vfSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IHNvcnRCeSBmcm9tIFwibG9kYXNoLnNvcnRieVwiO1xuXG5pbXBvcnQge2NodW5rZWR9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0TGltaXQobGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcInNldExpbWl0OlwiLCBsaW1pdCk7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IGN1cnJlbnRVcmxQYXJhbXMgPSB1cmxDdXJzb3IuZ2V0KFwicGFyYW1zXCIpO1xuICBsZXQgY3VycmVudFVybFF1ZXJ5ID0gdXJsQ3Vyc29yLmdldChcInF1ZXJ5XCIpO1xuXG4gIGxldCByb2JvdEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSByb2JvdEN1cnNvci5nZXQoXCJvZmZzZXRcIik7XG4gIGxldCBjdXJyZW50TGltaXQgPSByb2JvdEN1cnNvci5nZXQoXCJsaW1pdFwiKTtcbiAgbGV0IGN1cnJlbnRQYWdpbmF0aW9uID0gcm9ib3RDdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICBpZiAobGltaXQgIT0gY3VycmVudExpbWl0KSB7XG4gICAgbGV0IG5ld0xpbWl0ID0gbGltaXQ7XG4gICAgbGV0IG5ld1BhZ2luYXRpb24gPSByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQoY3VycmVudFBhZ2luYXRpb24sIG5ld0xpbWl0KTtcblxuICAgIHJvYm90Q3Vyc29yLnNldChcImxpbWl0XCIsIG5ld0xpbWl0KTtcbiAgICByb2JvdEN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIG5ld1BhZ2luYXRpb24pO1xuICAgIGlmICghbmV3UGFnaW5hdGlvbltjdXJyZW50T2Zmc2V0XSkge1xuICAgICAgbGV0IG5ld09mZnNldCA9IGZpcnN0TGVzc2VyT2Zmc2V0KG5ld1BhZ2luYXRpb24sIGN1cnJlbnRPZmZzZXQpO1xuICAgICAgbGV0IG5ld1VybFF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KHtvZmZzZXQ6IG5ld09mZnNldH0pO1xuICAgICAgcm91dGVyLnRyYW5zaXRpb25Ubyh1bmRlZmluZWQsIHVuZGVmaW5lZCwgbmV3VXJsUXVlcnkpO1xuICAgIH1cbiAgICBzdGF0ZS5jb21taXQoKTtcblxuICAgIGxvYWRJbmRleCgpO1xuICB9XG59XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogUmVjYWxjdWxhdGVzIGBwYWdpbmF0aW9uYCB3aXRoIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIFN1cHBvcnRzIGludmFsaWQgZGF0YSBsaWtlIG92ZXJsYXBwaW5nIG9mZnNldHNcbiAqIEBwdXJlXG4gKiBAcGFyYW0gcGFnaW5hdGlvbiB7T2JqZWN0fSAtIGlucHV0IHBhZ2luYXRpb25cbiAqIEBwYXJhbSBuZXdMaW1pdCB7TnVtYmVyfSAtIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aExpbWl0KHBhZ2luYXRpb24sIG5ld0xpbWl0KSB7XG4gIGlmIChuZXdMaW1pdCA8PTAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBuZXdMaW1pdCBtdXN0IGJlID49IDAsIGdvdCAke25ld0xpbWl0fWApO1xuICB9XG4gIGxldCBtYXhPZmZzZXQgPSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKSk7XG4gIGxldCBsZW5ndGggPSBtYXhPZmZzZXQgKyBwYWdpbmF0aW9uW21heE9mZnNldF0ubGVuZ3RoO1xuICBsZXQgb2Zmc2V0cyA9IHNvcnRCeShPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkpO1xuICBsZXQgZmxhdFZhbHVlcyA9IG9mZnNldHNcbiAgICAucmVkdWNlKChtZW1vLCBvZmZzZXQpID0+IHtcbiAgICAgIHBhZ2luYXRpb25bb2Zmc2V0XS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgICBtZW1vW29mZnNldCArIGldID0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sIEFycmF5KGxlbmd0aCkpO1xuICByZXR1cm4gY2h1bmtlZChmbGF0VmFsdWVzLCBuZXdMaW1pdCkucmVkdWNlKChvYmosIGlkcywgaSkgPT4ge1xuICAgIGlkcyA9IGZpbHRlcihpZHMpO1xuICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICBvYmpbaSAqIG5ld0xpbWl0XSA9IGlkcztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBvZmZzZXQpIHtcbiAgbGV0IG9mZnNldHMgPSBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkuc29ydCgpLnJldmVyc2UoKTtcbiAgZm9yIChsZXQgbyBvZiBvZmZzZXRzKSB7XG4gICAgaWYgKHBhcnNlSW50KG8pIDwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gbztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDA7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQob2Zmc2V0KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJzZXRPZmZzZXQ6XCIsIG9mZnNldCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuXG4gIGlmIChvZmZzZXQgIT0gY3VycmVudE9mZnNldCkge1xuICAgIGxldCBuZXdPZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICBjdXJzb3Iuc2V0KFwib2Zmc2V0XCIsIG5ld09mZnNldCk7XG4gICAgc3RhdGUuY29tbWl0KCk7XG5cbiAgICBsb2FkSW5kZXgoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0U29ydHMoc29ydHMpIHtcbiAgY29uc29sZS5kZWJ1ZyhcInNldFNvcnRzOlwiLCBzb3J0cyk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgY3Vyc29yLnNldChcInNvcnRzXCIsIHNvcnRzKTtcbiAgLy8gVE9ETyByZWV2YWx1YXRlIHBhZ2luYXRpb25cbiAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwgW10pO1xuICBzdGF0ZS5jb21taXQoKTtcblxuICBsb2FkSW5kZXgoKTtcbn1cblxuLy8gU09SVFxuLy9pZiAoc29ydHMpIHtcbi8vICBtb2RlbHMgPSBzb3J0QnlPcmRlcihtb2RlbHMsIC4uLmxvZGFzaGlmeVNvcnRzKHNvcnRzKSk7XG4vL30iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmVzdWx0IGZyb20gXCJsb2Rhc2gucmVzdWx0XCI7XG5pbXBvcnQgaXNBcnJheSBmcm9tIFwibG9kYXNoLmlzYXJyYXlcIjtcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiO1xuaW1wb3J0IGlzRW1wdHkgZnJvbSBcImxvZGFzaC5pc2VtcHR5XCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJsb2Rhc2guZGVib3VuY2VcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG4vL2ltcG9ydCBKb2kgZnJvbSBcImpvaVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9pbXBvcnQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lbW9bZGV0YWlsLnBhdGhdKSkge1xuLy8gICAgICAgIG1lbW9bZGV0YWlsLnBhdGhdID0gW107XG4vLyAgICAgIH1cbi8vICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4vLyAgICAgIHJldHVybiBtZW1vO1xuLy8gICAgfSwge30pO1xuLy8gIH0gZWxzZSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgfVxuLy99XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgLy9taXhpbnM6IFstLVJlYWN0Um91dGVyLlN0YXRlLS0sIHN0YXRlLm1peGluXSxcblxuICAvL2N1cnNvcnMoKSB7XG4gIC8vICByZXR1cm4ge1xuICAvLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgLy8gIH1cbiAgLy99LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5BZGQ8L2Rpdj47XG4gICAgLy9sZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgLy9yZXR1cm4gKFxuICAgIC8vICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGluZz17bG9hZGluZ30gbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz5cbiAgICAvLyk7XG4gIH1cbn0pO1xuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiB7XG4vLyAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuLy8gICAgICB9LFxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgLy8gIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIC8vfSxcbi8vXG4vLyAgLy92YWxpZGF0b3JEYXRhKCkge1xuLy8gIC8vICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAvL30sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL3JldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgIC8vICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgIC8vICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbi8vICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4vLyAgICAvL30uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICAvL3JldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4vLyAgICAgIGlmIChpc1ZhbGlkKSB7XG4vLyAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuLy8gICAgICAgIHJvYm90QWN0aW9ucy5hZGQoe1xuLy8gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgfSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4vLyAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fSBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L3NlY3Rpb24+XG4vLyAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4vLyAgICAgICk7XG4vLyAgICB9XG4vLyAgfVxuLy99KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7YnJhbmNofSBmcm9tIFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuICBmYWNldHM6IHtcbiAgICBtb2RlbDogXCJjdXJyZW50Um9ib3RcIixcbiAgfSxcbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdERldGFpbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hNb2RlbDtcblxuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge2xvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzLnJvYm90cztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJEZXRhaWwgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuaWR9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmFzc2VtYmx5RGF0ZX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5tYW51ZmFjdHVyZXJ9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcImxvZGFzaC5pc3BsYWlub2JqZWN0XCI7XG5pbXBvcnQgaXNFbXB0eSBmcm9tIFwibG9kYXNoLmlzZW1wdHlcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG4vL2xldCBWYWxpZGF0b3JzIGZyb20gXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuLy9mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuLy8gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbi8vICBkYXRhID0gZGF0YSB8fCB7fTtcbi8vICBsZXQgam9pT3B0aW9ucyA9IHtcbi8vICAgIGFib3J0RWFybHk6IGZhbHNlLFxuLy8gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuLy8gIH07XG4vLyAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4vLyAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbi8vICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4vLyAgICAgIGVycm9yc1xuLy8gICAgKTtcbi8vICB9IGVsc2Uge1xuLy8gICAgbGV0IHJlc3VsdCA9IHt9O1xuLy8gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgIHJldHVybiByZXN1bHQ7XG4vLyAgfVxuLy99XG5cbi8vZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuLy8gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbi8vICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuLy8gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVtb1tkZXRhaWwucGF0aF0pKSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9jdXJzb3JzKCkge1xuLy8gIHJldHVybiB7XG4vLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbi8vICAgIGxvYWRNb2RlbDogW1wicm9ib3RzXCIsIFwibW9kZWxzXCIsIHRoaXMuZ2V0UGFyYW1zKCkuaWRdLFxuLy8gIH1cbi8vfSxcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90RWRpdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hNb2RlbDtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+RWRpdDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL2xldCBsb2FkTW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubG9hZE1vZGVsO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgIC8vKTtcbiAgfVxufVxuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuLy8gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLmxvYWRNb2RlbCksXG4vLyAgICAgIH0pXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgICAvL3JldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRvckRhdGEoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgICAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuLy8gICAgLy8gIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbi8vICAgIH0uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbi8vICAgICAgaWYgKGlzVmFsaWQpIHtcbi8vICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4vLyAgICAgICAgcm9ib3RBY3Rpb25zLmVkaXQoe1xuLy8gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4vLyAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBhc3NlbWJseURhdGU6IHRoaXMucmVmcy5hc3NlbWJseURhdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICB9KTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9LFxuLy9cbi8vICBnZXRWYWxpZGF0aW9uTWVzc2FnZXM6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbi8vICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHtcbi8vICAgICAgcmV0dXJuIFtdO1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24gKGVycm9yKSB7XG4vLyAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbi8vICAgICAgICB9KSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgaXNWYWxpZDogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIHRydWU7XG4vLyAgICAvL3JldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3IsIGxvYWRNb2RlbH0gPSB0aGlzLnByb3BzO1xuLy8gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vXG4vLyAgICBpZiAobG9hZGluZykge1xuLy8gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbi8vICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4vLyAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICByZXR1cm4gKFxuLy8gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbi8vICAgICAgICAgIDxkaXY+XG4vLyAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvYT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbi8vICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHticmFuY2h9IGZyb20gXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgRXh0ZXJuYWxQYWdpbmF0aW9uLCBJbnRlcm5hbFBhZ2luYXRpb259IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90SXRlbSBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuXG4gIGZhY2V0czoge1xuICAgIGN1cnJlbnRSb2JvdHM6IFwiY3VycmVudFJvYm90c1wiLFxuICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hJbmRleDtcbiAgXG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7dG90YWwsIGxvYWRpbmcsIGxvYWRFcnJvciwgb2Zmc2V0LCBsaW1pdH0gPSB0aGlzLnByb3BzLnJvYm90cztcbiAgICBsZXQgbW9kZWxzID0gdGhpcy5wcm9wcy5jdXJyZW50Um9ib3RzO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSb2JvdHNcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJvYm90QWN0aW9ucy5zZXRMaW1pdCgzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSAzXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcm9ib3RBY3Rpb25zLnNldExpbWl0KDUpfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb2JvdEFjdGlvbnMuc2V0TGltaXQoMTApfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDEwXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aDE+Um9ib3RzPC9oMT5cbiAgICAgICAgICAgICAgPEV4dGVybmFsUGFnaW5hdGlvbiBlbmRwb2ludD1cInJvYm90LWluZGV4XCIgdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPFJvYm90SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPEludGVybmFsUGFnaW5hdGlvbiBvbkNsaWNrPXtvZmZzZXQgPT4gcm9ib3RBY3Rpb25zLnNldE9mZnNldChvZmZzZXQpfSB0b3RhbD17dG90YWx9IG9mZnNldD17b2Zmc2V0fSBsaW1pdD17bGltaXR9Lz5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7Qm9keSwgSG9tZSwgQWJvdXQsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuaW1wb3J0IFJvYm90SW5kZXggZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIjtcbmltcG9ydCBSb2JvdEFkZCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIjtcbmltcG9ydCBSb2JvdERldGFpbCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIjtcbmltcG9ydCBSb2JvdEVkaXQgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCAoXG4gIDxSb3V0ZSBwYXRoPVwiL1wiIGhhbmRsZXI9e0JvZHl9PlxuICAgIDxEZWZhdWx0Um91dGUgaGFuZGxlcj17SG9tZX0gbmFtZT1cImhvbWVcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvYWJvdXRcIiBuYW1lPVwiYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0gbG9hZGVyPVwieHh4XCIvPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9cIiBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzL2FkZFwiIG5hbWU9XCJyb2JvdC1hZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy86aWRcIiBuYW1lPVwicm9ib3QtZGV0YWlsXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkL2VkaXRcIiBuYW1lPVwicm9ib3QtZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pOyIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlc2xpY2UnKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJ2xvZGFzaC5faXNpdGVyYXRlZWNhbGwnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyB0YWtlbiBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEB0eXBlIEZ1bmN0aW9uXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHRha2UuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYSBjYWxsYmFjayBmb3IgZnVuY3Rpb25zIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMV1cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDUpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgMCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0YWtlKGFycmF5LCBuLCBndWFyZCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoZ3VhcmQgPyBpc0l0ZXJhdGVlQ2FsbChhcnJheSwgbiwgZ3VhcmQpIDogbiA9PSBudWxsKSB7XG4gICAgbiA9IDE7XG4gIH1cbiAgcmV0dXJuIGJhc2VTbGljZShhcnJheSwgMCwgbiA8IDAgPyAwIDogbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGFrZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4zIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc2xpY2VgIHdpdGhvdXQgYW4gaXRlcmF0ZWUgY2FsbCBndWFyZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBzdGFydCA9IHN0YXJ0ID09IG51bGwgPyAwIDogKCtzdGFydCB8fCAwKTtcbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IGxlbmd0aCkgPyBsZW5ndGggOiAoK2VuZCB8fCAwKTtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC42IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiBpbiBTYWZhcmkgb24gaU9TIDguMSBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicpIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKG9iamVjdCksXG4gICAgICAgIHByZXJlcSA9IGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChpbmRleCwgbGVuZ3RoKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVyZXEgPSB0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdDtcbiAgfVxuICBpZiAocHJlcmVxKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBbYFRvTGVuZ3RoYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIGBjaHVua2VkKFsxLCAyLCAzLCA0LCA1XSwgMilgID0+IFtbMSwgMl0sIFszLCA0XSwgWzVdXVxuZXhwb3J0IGZ1bmN0aW9uIGNodW5rZWQoYXJyYXksIG4pIHtcbiAgbGV0IGwgPSBNYXRoLmNlaWwoYXJyYXkubGVuZ3RoIC8gbik7XG4gIHJldHVybiByYW5nZShsKS5tYXAoKHgsIGkpID0+IGFycmF5LnNsaWNlKGkqbiwgaSpuICsgbikpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBJbnNwZWN0IGZyb20gXCJ1dGlsLWluc3BlY3RcIjtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSG93IGl0J3MgZXZlciBtaXNzZWQ/IVxuUmVnRXhwLmVzY2FwZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufTtcblxuLy8gVW5jb21tZW50IGlmIHVzZSBJb0pTXG4vLyBsZXQgcHJvY2VzcyA9IHByb2Nlc3MgfHwgdW5kZWZpbmVkO1xuLy9pZiAocHJvY2Vzcykge1xuICAvLyBJb0pTIGhhcyBgdW5oYW5kbGVkUmVqZWN0aW9uYCBob29rXG4gIC8vcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBmdW5jdGlvbiAocmVhc29uLCBwKSB7XG4gIC8vICB0aHJvdyBFcnJvcihgVW5oYW5kbGVkUmVqZWN0aW9uOiAke3JlYXNvbn1gKTtcbiAgLy99KTtcbi8vfSBlbHNlIHtcbiAgUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIGRvbmUocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpc1xuICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhyb3cgZTsgfSwgMCk7XG4gICAgICB9KTtcbiAgfTtcbi8vfVxuXG4vLyBXb3JrYXJvdW5kIG1ldGhvZCBhcyBuYXRpdmUgYnJvd3NlciBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgSW1tdXRhYmxlIGlzIGF3ZnVsXG5sZXQgd2luZG93ID0gd2luZG93IHx8IHVuZGVmaW5lZDtcbmlmICh3aW5kb3cpIHtcbiAgd2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGVjaG8oKSB7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBJbnNwZWN0KHYpKSk7XG4gIH07XG59Il19
