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

},{"babel/polyfill":"babel/polyfill","frontend/common/helpers":28,"frontend/common/state":32,"frontend/routes":55,"react":"react","react-router":"react-router","shared/shims":57}],2:[function(require,module,exports){
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
  var url = "/api/alerts/" + id;

  // Nonpersistent add
  _state2["default"].select("alerts", "models", id).set(newModel);
}

module.exports = exports["default"];

},{"frontend/common/models":29,"frontend/common/state":32}],9:[function(require,module,exports){
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

},{"axios":"axios","frontend/common/state":32}],10:[function(require,module,exports){
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

},{"axios":"axios","frontend/common/state":32}],11:[function(require,module,exports){
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

},{"./alert-fetch-index":9,"axios":"axios","frontend/common/helpers":28,"frontend/common/state":32}],12:[function(require,module,exports){
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

},{"./alert-fetch-model":10,"axios":"axios","frontend/common/state":32}],13:[function(require,module,exports){
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
  var url = "/api/alerts/" + id;

  // Non-persistent remove
  _state2["default"].select("alerts", "models").unset(id);
}

module.exports = exports["default"];

},{"frontend/common/state":32}],14:[function(require,module,exports){
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

var _Headroom = require("./components/headroom");

var _Headroom2 = _interopRequireWildcard(_Headroom);

var _Home = require("./components/home");

var _Home2 = _interopRequireWildcard(_Home);

var _Error = require("./components/error");

var _Error2 = _interopRequireWildcard(_Error);

var _NotFound = require("./components/not-found");

var _NotFound2 = _interopRequireWildcard(_NotFound);

var _Loading = require("./components/loading");

var _Loading2 = _interopRequireWildcard(_Loading);

var _InternalPagination = require("./components/pagination-internal");

var _InternalPagination2 = _interopRequireWildcard(_InternalPagination);

var _ExternalPagination = require("./components/pagination-external");

var _ExternalPagination2 = _interopRequireWildcard(_ExternalPagination);

var _Link = require("./components/link");

var _Link2 = _interopRequireWildcard(_Link);

exports["default"] = {
  About: _About2["default"], Body: _Body2["default"], Headroom: _Headroom2["default"], Home: _Home2["default"],
  Error: _Error2["default"], NotFound: _NotFound2["default"], Loading: _Loading2["default"],
  InternalPagination: _InternalPagination2["default"], ExternalPagination: _ExternalPagination2["default"],
  Link: _Link2["default"] };
module.exports = exports["default"];

},{"./components/about":16,"./components/body":19,"./components/error":20,"./components/headroom":21,"./components/home":22,"./components/link":23,"./components/loading":24,"./components/not-found":25,"./components/pagination-external":26,"./components/pagination-internal":27}],16:[function(require,module,exports){
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

},{"frontend/common/components/alert-item":18,"frontend/common/components/loading":24,"frontend/common/components/not-found":25,"frontend/common/helpers":28,"frontend/common/state":32,"react":"react"}],18:[function(require,module,exports){
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

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireWildcard(_commonActions);

var _Link = require("frontend/common/components");

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

},{"classnames":"classnames","frontend/common/actions":7,"frontend/common/components":15,"react":"react"}],19:[function(require,module,exports){
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

},{"baobab-react/decorators":2,"frontend/common/actions":7,"frontend/common/component":14,"frontend/common/components/alert-index":17,"frontend/common/components/headroom":21,"frontend/common/state":32,"react":"react","react-router":"react-router"}],20:[function(require,module,exports){
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
  }, {
    key: "defaultProps",
    value: {
      size: "md" },
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

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _ReactRouter = require("react-router");

var _ReactRouter2 = _interopRequireWildcard(_ReactRouter);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

// COMPONENTS ======================================================================================

var Link = (function (_Component) {
  function Link() {
    _classCallCheck(this, Link);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Link, _Component);

  _createClass(Link, [{
    key: "render",
    value: function render() {
      var cursor = _state2["default"].select("url");
      var params = cursor.get("params");
      var query = cursor.get("query");

      var props = Object.assign({}, this.props);
      if (props.withParams) {
        props.withParams = props.withParams === true ? {} : props.withParams;
        props.params = _merge2["default"]({}, params, props.withParams);
        delete props.withParams;
      }
      if (props.withQuery) {
        props.withQuery = props.withQuery === true ? {} : props.withQuery;
        props.query = _merge2["default"]({}, query, props.withQuery);
        delete props.withQuery;
      }

      return _React2["default"].createElement(
        _ReactRouter2["default"].Link,
        props,
        this.props.children
      );
    }
  }]);

  return Link;
})(_Component3["default"]);

exports["default"] = Link;
module.exports = exports["default"];

},{"frontend/common/component":14,"frontend/common/state":32,"lodash.merge":"lodash.merge","react":"react","react-router":"react-router"}],24:[function(require,module,exports){
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

},{"frontend/common/component":14,"react":"react","react-document-title":"react-document-title"}],26:[function(require,module,exports){
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

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Link = require("./link");

var _Link2 = _interopRequireWildcard(_Link);

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

      if (this.totalPages() > 1) {
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
                _Link2["default"],
                { to: endpoint,
                  withParams: true,
                  withQuery: { page: { offset: prevOffset } },
                  className: _Class2["default"]({ disabled: currOffset == minOffset }),
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
                  _Link2["default"],
                  { to: endpoint,
                    withParams: true,
                    withQuery: { page: { offset: offset } },
                    className: _Class2["default"]({ disabled: offset == currOffset }),
                    title: "To offset " + offset },
                  offset
                )
              );
            }),
            _React2["default"].createElement(
              "li",
              null,
              _React2["default"].createElement(
                _Link2["default"],
                { to: endpoint,
                  withParams: true,
                  withQuery: { page: { offset: nextOffset } },
                  className: _Class2["default"]({ disabled: currOffset == maxOffset }),
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
      } else {
        return _React2["default"].createElement("nav", null);
      }
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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"frontend/common/helpers":28,"lodash.range":"lodash.range","react":"react"}],27:[function(require,module,exports){
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

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Link = require("./link");

var _Link2 = _interopRequireWildcard(_Link);

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

      if (this.totalPages() > 1) {
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
      } else {
        return _React2["default"].createElement("nav", null);
      }
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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"frontend/common/helpers":28,"lodash.range":"lodash.range","react":"react"}],28:[function(require,module,exports){
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

},{"lodash.isarray":"lodash.isarray","lodash.isplainobject":"lodash.isplainobject","lodash.sortby":"lodash.sortby"}],29:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Alert = require("./models/alert");

var _Alert2 = _interopRequireWildcard(_Alert);

exports["default"] = { Alert: _Alert2["default"] };
module.exports = exports["default"];

},{"./models/alert":30}],30:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],31:[function(require,module,exports){
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

},{"frontend/common/state":32}],32:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _Baobab = require("baobab");

var _Baobab2 = _interopRequireWildcard(_Baobab);

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

},{"baobab":"baobab"}],33:[function(require,module,exports){
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

var _setId = require("./actions/set-id");

var _setId2 = _interopRequireWildcard(_setId);

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

},{"./actions/add":34,"./actions/edit":35,"./actions/establish-index":36,"./actions/establish-model":37,"./actions/establish-page":38,"./actions/fetch-index":39,"./actions/fetch-model":40,"./actions/load-index":41,"./actions/load-model":42,"./actions/remove":43,"./actions/set-filters":44,"./actions/set-id":45,"./actions/set-limit":46,"./actions/set-offset":47,"./actions/set-sorts":48}],34:[function(require,module,exports){
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
  var url = "/api/robots/" + id;

  // Optimistic add
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models", id).set(newModel);

  return _Axios2["default"].put(url, newModel).then(function (response) {
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
        url: url
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":31,"frontend/common/state":32,"frontend/robot/models":54}],35:[function(require,module,exports){
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
  var url = "/api/robots/" + id;

  // Optimistic edit
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models", id).set(newModel);

  return _Axios2["default"].put(url, newModel).then(function (response) {
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
        url: url
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":31,"frontend/common/state":32,"frontend/robot/models":54}],36:[function(require,module,exports){
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

var _setFilters = require("./set-filters");

var _setFilters2 = _interopRequireWildcard(_setFilters);

var _setSorts = require("./set-sorts");

var _setSorts2 = _interopRequireWildcard(_setSorts);

var _setOffset = require("./set-offset");

var _setOffset2 = _interopRequireWildcard(_setOffset);

var _setLimit = require("./set-limit");

var _setLimit2 = _interopRequireWildcard(_setLimit);

function establishIndex() {
  console.debug("establishIndex");

  var cursor = _state2["default"].select("url");

  //setFilters(cursor.get("filters"));
  _setSorts2["default"](cursor.get("sorts"));
  _setOffset2["default"](cursor.get("offset"));
  //setLimit(cursor.get("limit"));

  _loadIndex2["default"]();
}

module.exports = exports["default"];

},{"./load-index":41,"./set-filters":44,"./set-limit":46,"./set-offset":47,"./set-sorts":48,"frontend/common/helpers":28,"frontend/common/router":31,"frontend/common/state":32}],37:[function(require,module,exports){
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

},{"./load-model":42,"frontend/common/helpers":28,"frontend/common/router":31,"frontend/common/state":32}],38:[function(require,module,exports){
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

},{"./load-index":41,"frontend/common/helpers":28,"frontend/common/router":31,"frontend/common/state":32}],39:[function(require,module,exports){
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
    var models = cursor.get("models");
    var pagination = cursor.get("pagination");

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
        url: url
      };
      cursor.merge({ loading: false, loadError: loadError });
      _state2["default"].commit(); // God, this is required just about everywhere! :(
      _commonActions2["default"].alert.add({ message: "Action `Robot:fetchPage` failed: " + loadError.description, category: "error" });

      return response.status;
    }
  }).done();
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":28,"frontend/common/state":32}],40:[function(require,module,exports){
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
        url: url
      };
      cursor.merge({ loading: false, loadError: loadError });
      _state2["default"].commit(); // God, this is required just about everywhere! :(
      _commonActions2["default"].alert.add({ message: "Action `Robot:fetchModel` failed: " + loadError.description, category: "error" });

      return response.status;
    }
  }).done();
}

module.exports = exports["default"];

},{"axios":"axios","frontend/common/actions":7,"frontend/common/helpers":28,"frontend/common/state":32}],41:[function(require,module,exports){
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

},{"./fetch-index":39,"axios":"axios","frontend/common/helpers":28,"frontend/common/state":32}],42:[function(require,module,exports){
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

},{"./fetch-model":40,"axios":"axios","frontend/common/state":32}],43:[function(require,module,exports){
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
  var url = "/api/robots/" + id;

  // Optimistic remove
  _state2["default"].select("robots", "loading").set(true);
  _state2["default"].select("robots", "models").unset(id);

  return _Axios2["default"]["delete"](url).then(function (response) {
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
        url: url
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":31,"frontend/common/state":32}],44:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setFilters;
// IMPORTS =========================================================================================

var _isEqual = require("lodash.isequal");

var _isEqual2 = _interopRequireWildcard(_isEqual);

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

function setFilters() {
  var filters = arguments[0] === undefined ? _state$ROBOT.ROBOT.FILTERS : arguments[0];

  console.debug("setFilters(" + JSON.stringify(filters));

  var cursor = _state$ROBOT2["default"].select("robots");
  if (!_isEqual2["default"](filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    // TODO reevaluate pagination
    cursor.set("pagination", {});
    _state$ROBOT2["default"].commit();
  }
}

// FILTER
//if (filters) {
//  Object.keys(filters).each(key => {
//    models = models.filter(model => model[key] === filters[key]);
//  });
//}

module.exports = exports["default"];

},{"frontend/common/state":32,"lodash.isequal":"lodash.isequal"}],45:[function(require,module,exports){
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

function setOffset(id) {
  console.debug("setId(" + id + ")");

  var cursor = _state2["default"].select("robots");
  if (id != cursor.get("id")) {
    cursor.set("id", id);
    _state2["default"].commit();
  }
}

module.exports = exports["default"];

},{"frontend/common/state":32}],46:[function(require,module,exports){
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

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireWildcard(_sortBy);

var _chunked = require("shared/common/helpers");

var _formatJsonApiQuery = require("frontend/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

function setLimit() {
  var limit = arguments[0] === undefined ? _state$ROBOT.ROBOT.LIMIT : arguments[0];

  console.debug("setLimit(" + limit + ")");

  var cursor = _state$ROBOT2["default"].select("robots");
  if (limit != cursor.get("limit")) {
    var pagination = recalculatePaginationWithLimit(cursor.get("pagination"), limit);
    cursor.set("limit", limit);
    cursor.set("pagination", pagination);
    if (!pagination[cursor.get("offset")]) {
      var offset = firstLesserOffset(pagination, cursor.get("offset"));
      var query = _formatJsonApiQuery.formatJsonApiQuery({ offset: offset });
      _router2["default"].transitionTo(undefined, undefined, query);
    }
    _state$ROBOT2["default"].commit();
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
  if (Object.keys(pagination).length) {
    var maxOffset = Math.max.apply(Math, Object.keys(pagination));
    var _length = maxOffset + pagination[maxOffset].length;
    var offsets = _sortBy2["default"](Object.keys(pagination).map(function (v) {
      return parseInt(v);
    }));
    var flatValues = offsets.reduce(function (memo, offset) {
      pagination[offset].forEach(function (id, i) {
        memo[offset + i] = id;
      });
      return memo;
    }, Array(_length));
    return _chunked.chunked(flatValues, newLimit).reduce(function (obj, ids, i) {
      ids = _filter2["default"](ids);
      if (ids.length) {
        obj[i * newLimit] = ids;
      }
      return obj;
    }, {});
  } else {
    return {};
  }
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

},{"frontend/common/helpers":28,"frontend/common/router":31,"frontend/common/state":32,"lodash.filter":"lodash.filter","lodash.sortby":"lodash.sortby","shared/common/helpers":56}],47:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setOffset;
// IMPORTS =========================================================================================

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

function setOffset() {
  var offset = arguments[0] === undefined ? _state$ROBOT.ROBOT.OFFSET : arguments[0];

  console.debug("setOffset(" + offset + ")");

  var cursor = _state$ROBOT2["default"].select("robots");
  if (offset != cursor.get("offset")) {
    cursor.set("offset", offset);
    _state$ROBOT2["default"].commit();
  }
}

module.exports = exports["default"];

},{"frontend/common/state":32}],48:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setSorts;
// IMPORTS =========================================================================================

var _isEqual = require("lodash.isequal");

var _isEqual2 = _interopRequireWildcard(_isEqual);

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

function setSorts() {
  var sorts = arguments[0] === undefined ? _state$ROBOT.ROBOT.SORTS : arguments[0];

  console.debug("setSorts(" + JSON.stringify(sorts) + ")");

  var cursor = _state$ROBOT2["default"].select("robots");

  if (!_isEqual2["default"](sorts, cursor.get("sorts"))) {
    cursor.set("sorts", sorts);
    // TODO reevaluate pagination
    cursor.set("pagination", {});
    _state$ROBOT2["default"].commit();
  }
}

// SORT
//if (sorts) {
//  models = sortByOrder(models, ...lodashifySorts(sorts));
//}

module.exports = exports["default"];

},{"frontend/common/state":32,"lodash.isequal":"lodash.isequal"}],49:[function(require,module,exports){
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

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

//import Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

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

},{"classnames":"classnames","frontend/common/components":15,"frontend/common/state":32,"frontend/robot/actions":33,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title"}],50:[function(require,module,exports){
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

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

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
        return _React2["default"].createElement(_Error$Loading$NotFound$Link.Loading, null);
      } else if (loadError) {
        return _React2["default"].createElement(_Error$Loading$NotFound$Link.Error, { loadError: loadError });
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
                    _Error$Loading$NotFound$Link.Link,
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
                    _Error$Loading$NotFound$Link.Link,
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

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":32,"frontend/robot/actions":33,"react":"react","react-document-title":"react-document-title"}],51:[function(require,module,exports){
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

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

//let Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

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

},{"classnames":"classnames","frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":32,"frontend/robot/actions":33,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.isarray":"lodash.isarray","lodash.isempty":"lodash.isempty","lodash.isplainobject":"lodash.isplainobject","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title"}],52:[function(require,module,exports){
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

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireWildcard(_DocumentTitle);

var _toArray = require("frontend/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireWildcard(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link = require("frontend/common/components");

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
    key: "setLimit",
    value: function setLimit(limit) {
      _robotActions2["default"].setLimit(limit);
      _robotActions2["default"].loadIndex();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _props$robots = this.props.robots;
      var total = _props$robots.total;
      var loading = _props$robots.loading;
      var loadError = _props$robots.loadError;
      var offset = _props$robots.offset;
      var limit = _props$robots.limit;

      var models = this.props.currentRobots;

      if (loadError) {
        return _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Error, { loadError: loadError });
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
                      _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
                      {
                        to: "robot-index",
                        withQuery: { sort: "+name" },
                        className: "btn btn-sm btn-secondary" },
                      "SortBy +name"
                    ),
                    _React2["default"].createElement(
                      _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
                      {
                        to: "robot-index",
                        withQuery: { sort: "-name" },
                        className: "btn btn-sm btn-secondary" },
                      "SortBy -name"
                    )
                  ),
                  _React2["default"].createElement(
                    "div",
                    { className: "btn-group" },
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _this.setLimit(3);
                        } },
                      "Perpage 3"
                    ),
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _this.setLimit(5);
                        } },
                      "Perpage 5"
                    ),
                    _React2["default"].createElement(
                      "button",
                      { type: "button",
                        className: "btn btn-sm btn-secondary",
                        onClick: function () {
                          return _this.setLimit(10);
                        } },
                      "Perpage 10"
                    )
                  ),
                  _React2["default"].createElement(
                    _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
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
              _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.ExternalPagination, { endpoint: "robot-index", total: total, offset: offset, limit: limit }),
              _React2["default"].createElement(
                "div",
                { className: "row" },
                models.map(function (model) {
                  return _React2["default"].createElement(_RobotItem2["default"], { model: model, key: model.id });
                })
              ),
              _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.InternalPagination, { onClick: function (offset) {
                  return _robotActions2["default"].setOffset(offset);
                }, total: total, offset: offset, limit: limit })
            ),
            loading ? _React2["default"].createElement(_Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Loading, null) : ""
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

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/helpers":28,"frontend/common/state":32,"frontend/robot/actions":33,"frontend/robot/components/item":53,"react":"react","react-document-title":"react-document-title"}],53:[function(require,module,exports){
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

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Link = require("frontend/common/components");

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

},{"frontend/common/component":14,"frontend/common/components":15,"frontend/robot/actions":33,"react":"react"}],54:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],55:[function(require,module,exports){
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

},{"frontend/common/components":15,"frontend/robot/components/add":49,"frontend/robot/components/detail":50,"frontend/robot/components/edit":51,"frontend/robot/components/index":52,"react":"react","react-router":"react-router"}],56:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// HELPERS =========================================================================================
/**
 * Split array into chunks with predefined chunk length. Useful for pagination.
 * Example:
 *   chunked([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
 * @pure
 * @param array {Array} - array to be chunked
 * @param n {number} - length of chunk
 * @returns {Array} - chunked array
 */
exports.chunked = chunked;

/**
 * Converts sorting array in "short" format to sorting array in "lodash" (lodash.sortByOrder) format.
 * Example:
 *   lodashifySorts(["+name", "-age"]) == [["name", "age"], [true, false]]
 * @pure
 * @param sorts {Array<string>} - array in "short" format
 * @returns {Array<Array<string>>} - array in "lodash" format
 */
exports.lodashifySorts = lodashifySorts;
exports.mergeDeep = mergeDeep;
// IMPORTS =========================================================================================

var _isArray = require("lodash.isarray");

var _isArray2 = _interopRequireWildcard(_isArray);

var _range = require("lodash.range");

var _range2 = _interopRequireWildcard(_range);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

function chunked(array, n) {
  var l = Math.ceil(array.length / n);
  return _range2["default"](l).map(function (x, i) {
    return array.slice(i * n, i * n + n);
  });
}

function lodashifySorts(sorts) {
  return [sorts.map(function (v) {
    return v.slice(1);
  }), sorts.map(function (v) {
    return v[0] == "+";
  })];
}

function mergeDeep(object, other) {
  return _merge2["default"]({}, object, other, function (a, b) {
    if (_isArray2["default"](a)) {
      return a.concat(b);
    }
  });
}

},{"lodash.isarray":"lodash.isarray","lodash.merge":"lodash.merge","lodash.range":"lodash.range"}],57:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xpbmsuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1leHRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9wYWdpbmF0aW9uLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL21vZGVscy9hbGVydC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1wYWdlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9mZXRjaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWZpbHRlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtaWQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtbGltaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtb2Zmc2V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LXNvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNDTyxnQkFBZ0I7O1FBQ2hCLGNBQWM7O3FCQUVILE9BQU87Ozs7NENBQzZCLGNBQWM7O2tDQUVwQyx5QkFBeUI7O3FCQUN2Qyx1QkFBdUI7Ozs7c0JBQ3RCLGlCQUFpQjs7Ozs7QUFHcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyw4QkFQVCxNQUFNLENBT2dCO0FBQzVCLFFBQU0scUJBQVE7QUFDZCxVQUFRLGdDQVRzQixlQUFlLEFBU3BCO0NBQzFCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUs7Ozs7O0FBS3ZDLFNBQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUc1QixNQUFJLFNBQVMsR0FBRyxtQkFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEMsTUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0MsV0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEMsV0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFdBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEMsTUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDdkIsTUFBSSxFQUFFLEVBQUU7QUFDTixhQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUN6Qjs7MkJBRXFDLG9CQTdCaEMsaUJBQWlCLENBNkJpQyxHQUFHLENBQUMsS0FBSyxDQUFDOztNQUE3RCxPQUFPLHNCQUFQLE9BQU87TUFBRSxLQUFLLHNCQUFMLEtBQUs7TUFBRSxNQUFNLHNCQUFOLE1BQU07TUFBRSxLQUFLLHNCQUFMLEtBQUs7O0FBQ2xDLFdBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsTUFBSSxPQUFPLEVBQUU7QUFDWCxhQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNuQztBQUNELE1BQUksS0FBSyxFQUFFO0FBQ1QsYUFBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0I7QUFDRCxNQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLGFBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ2pDO0FBQ0QsTUFBSSxLQUFLLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUN4QixhQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMvQjs7QUFFRCxxQkFBTSxNQUFNLEVBQUUsQ0FBQzs7O0FBR2YsTUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FDdEIsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUU7R0FBQSxDQUFDLENBQzFDLEdBQUcsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNmLFFBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNyQixjQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDckI7R0FDRixDQUFDLENBQUM7O0FBRUwsU0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMvQix1QkFBTSxNQUFNLENBQUMsaUNBQUMsV0FBVyxPQUFFLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQy9ELENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7O0FDakVIO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ3BDLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLHFCQUFRLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFDO0dBQ3hGLENBQUM7Q0FDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgXCJiYWJlbC9wb2x5ZmlsbFwiO1xuaW1wb3J0IFwic2hhcmVkL3NoaW1zXCI7XG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7Y3JlYXRlIGFzIGNyZWF0ZVJvdXRlciwgSGlzdG9yeUxvY2F0aW9ufSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbmltcG9ydCB7cGFyc2VKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXMgZnJvbSBcImZyb250ZW5kL3JvdXRlc1wiO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG53aW5kb3cuX3JvdXRlciA9IGNyZWF0ZVJvdXRlcih7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93Ll9yb3V0ZXIucnVuKChBcHBsaWNhdGlvbiwgdXJsKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIGNvbnNvbGUuZGVidWcoXCJyb3V0ZXIucnVuXCIpO1xuXG4gIC8vIFNFVCBCQU9CQUIgVVJMIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCBoYW5kbGVyID0gdXJsLnJvdXRlcy5zbGljZSgtMSlbMF0ubmFtZTtcbiAgdXJsQ3Vyc29yLnNldChcImhhbmRsZXJcIiwgaGFuZGxlcik7XG4gIHVybEN1cnNvci5zZXQoXCJwYXJhbXNcIiwgdXJsLnBhcmFtcyk7XG4gIHVybEN1cnNvci5zZXQoXCJxdWVyeVwiLCB1cmwucXVlcnkpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gIH1cblxuICBsZXQge2ZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0fSA9IHBhcnNlSnNvbkFwaVF1ZXJ5KHVybC5xdWVyeSk7XG4gIHVybEN1cnNvci5zZXQoXCJyb3V0ZVwiLCB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lKTtcbiAgaWYgKGZpbHRlcnMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCBmaWx0ZXJzKTtcbiAgfVxuICBpZiAoc29ydHMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwic29ydHNcIiwgc29ydHMpO1xuICB9XG4gIGlmIChvZmZzZXQgfHwgb2Zmc2V0ID09PSAwKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcIm9mZnNldFwiLCBvZmZzZXQpO1xuICB9XG4gIGlmIChsaW1pdCB8fCBsaW1pdCA9PT0gMCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJsaW1pdFwiLCBsaW1pdCk7XG4gIH1cblxuICBzdGF0ZS5jb21taXQoKTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBsZXQgcHJvbWlzZXMgPSB1cmwucm91dGVzXG4gICAgLm1hcChyb3V0ZSA9PiByb3V0ZS5oYW5kbGVyLm9yaWdpbmFsIHx8IHt9KVxuICAgIC5tYXAob3JpZ2luYWwgPT4ge1xuICAgICAgaWYgKG9yaWdpbmFsLmxvYWREYXRhKSB7XG4gICAgICAgIG9yaWdpbmFsLmxvYWREYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgIFJlYWN0LnJlbmRlcig8QXBwbGljYXRpb24vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcbiAgfSk7XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJvb3QgPSByb290O1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBEZWNvcmF0b3JzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzcgZGVjb3JhdG9ycyBzdWdhciBmb3IgaGlnaGVyIG9yZGVyIGNvbXBvbmVudHMuXG4gKi9cblxudmFyIF9Sb290JEJyYW5jaCA9IHJlcXVpcmUoJy4vaGlnaGVyLW9yZGVyLmpzJyk7XG5cbmZ1bmN0aW9uIHJvb3QodHJlZSkge1xuICBpZiAodHlwZW9mIHRyZWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLnJvb3QodHJlZSk7XG4gIH1yZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0YXJnZXQsIHRyZWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBicmFuY2goc3BlY3MpIHtcbiAgaWYgKHR5cGVvZiBzcGVjcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2guYnJhbmNoKHNwZWNzKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2godGFyZ2V0LCBzcGVjcyk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH07XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogUm9vdCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5yb290ID0gcm9vdDtcblxuLyoqXG4gKiBCcmFuY2ggY29tcG9uZW50XG4gKi9cbmV4cG9ydHMuYnJhbmNoID0gYnJhbmNoO1xuLyoqXG4gKiBCYW9iYWItUmVhY3QgSGlnaGVyIE9yZGVyIENvbXBvbmVudFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogRVM2IGhpZ2hlciBvcmRlciBjb21wb25lbnQgdG8gZW5jaGFuY2Ugb25lJ3MgY29tcG9uZW50LlxuICovXG5cbnZhciBfUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX1JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9SZWFjdCk7XG5cbnZhciBfdHlwZSA9IHJlcXVpcmUoJy4vdXRpbHMvdHlwZS5qcycpO1xuXG52YXIgX3R5cGUyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3R5cGUpO1xuXG52YXIgX1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vdXRpbHMvcHJvcC10eXBlcy5qcycpO1xuXG52YXIgX1Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfUHJvcFR5cGVzKTtcblxuZnVuY3Rpb24gcm9vdChDb21wb25lbnQsIHRyZWUpIHtcbiAgaWYgKCFfdHlwZTJbJ2RlZmF1bHQnXS5CYW9iYWIodHJlZSkpIHRocm93IEVycm9yKCdiYW9iYWItcmVhY3Q6aGlnaGVyLW9yZGVyLnJvb3Q6IGdpdmVuIHRyZWUgaXMgbm90IGEgQmFvYmFiLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIHZhciBfY2xhc3MgPSBmdW5jdGlvbiBDb21wb3NlZENvbXBvbmVudCgpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MpO1xuXG4gICAgICBpZiAoX1JlYWN0JENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgIF9SZWFjdCRDb21wb25lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzcywgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBfY3JlYXRlQ2xhc3MoX2NsYXNzLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gSGFuZGxpbmcgY2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0cmVlOiB0cmVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncmVuZGVyJyxcblxuICAgICAgLy8gUmVuZGVyIHNoaW1cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBfUmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChDb21wb25lbnQsIHRoaXMucHJvcHMpO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGlsZENvbnRleHRUeXBlcycsXG4gICAgICB2YWx1ZToge1xuICAgICAgICB0cmVlOiBfUHJvcFR5cGVzMlsnZGVmYXVsdCddLmJhb2JhYlxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XSk7XG5cbiAgICByZXR1cm4gX2NsYXNzO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGJyYW5jaChDb21wb25lbnQpIHtcbiAgdmFyIHNwZWNzID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLk9iamVjdChzcGVjcykpIHRocm93IEVycm9yKCdiYW9iYWItcmVhY3QuaGlnaGVyLW9yZGVyOiBpbnZhbGlkIHNwZWNpZmljYXRpb25zICcgKyAnKHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCBjdXJzb3JzIGFuZC9vciBmYWNldHMga2V5KS4nKTtcblxuICB2YXIgQ29tcG9zZWRDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQyKSB7XG4gICAgdmFyIF9jbGFzczIgPVxuXG4gICAgLy8gQnVpbGRpbmcgaW5pdGlhbCBzdGF0ZVxuICAgIGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX2NsYXNzMik7XG5cbiAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKF9jbGFzczIucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcywgY29udGV4dCk7XG5cbiAgICAgIHZhciBmYWNldCA9IGNvbnRleHQudHJlZS5jcmVhdGVGYWNldChzcGVjcywgW3Byb3BzLCBjb250ZXh0XSk7XG5cbiAgICAgIGlmIChmYWNldCkgdGhpcy5zdGF0ZSA9IGZhY2V0LmdldCgpO1xuXG4gICAgICB0aGlzLmZhY2V0ID0gZmFjZXQ7XG4gICAgfTtcblxuICAgIF9pbmhlcml0cyhfY2xhc3MyLCBfUmVhY3QkQ29tcG9uZW50Mik7XG5cbiAgICBfY3JlYXRlQ2xhc3MoX2NsYXNzMiwgW3tcbiAgICAgIGtleTogJ2dldENoaWxkQ29udGV4dCcsXG5cbiAgICAgIC8vIENoaWxkIGNvbnRleHRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY3Vyc29yczogdGhpcy5mYWNldC5jdXJzb3JzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuXG4gICAgICAvLyBPbiBjb21wb25lbnQgbW91bnRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZhY2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9dmFyIGhhbmRsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5mYWNldC5nZXQoKSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5mYWNldC5vbigndXBkYXRlJywgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncmVuZGVyJyxcblxuICAgICAgLy8gUmVuZGVyIHNoaW1cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBfUmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB0aGlzLnN0YXRlKSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuXG4gICAgICAvLyBPbiBjb21wb25lbnQgdW5tb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gUmVsZWFzaW5nIGZhY2V0XG4gICAgICAgIHRoaXMuZmFjZXQucmVsZWFzZSgpO1xuICAgICAgICB0aGlzLmZhY2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcblxuICAgICAgLy8gT24gbmV3IHByb3BzXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH10aGlzLmZhY2V0LnJlZnJlc2goW3Byb3BzLCB0aGlzLmNvbnRleHRdKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgIH1cbiAgICB9XSwgW3tcbiAgICAgIGtleTogJ29yaWdpbmFsJyxcbiAgICAgIHZhbHVlOiBDb21wb25lbnQsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIGN1cnNvcnM6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uY3Vyc29yc1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XSk7XG5cbiAgICByZXR1cm4gX2NsYXNzMjtcbiAgfSkoX1JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbiAgcmV0dXJuIENvbXBvc2VkQ29tcG9uZW50O1xufSIsIi8qKlxuICogQmFvYmFiLVJlYWN0IEN1c3RvbSBQcm9wIFR5cGVzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogUHJvcFR5cGVzIHVzZWQgdG8gcHJvcGFnYXRlIGNvbnRleHQgc2FmZWx5LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSgnLi90eXBlLmpzJyk7XG5cbmZ1bmN0aW9uIGVycm9yTWVzc2FnZShwcm9wTmFtZSwgd2hhdCkge1xuICByZXR1cm4gJ3Byb3AgdHlwZSBgJyArIHByb3BOYW1lICsgJ2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSAnICsgd2hhdCArICcuJztcbn1cblxudmFyIFByb3BUeXBlcyA9IHt9O1xuXG5Qcm9wVHlwZXMuYmFvYmFiID0gZnVuY3Rpb24gKHByb3BzLCBwcm9wTmFtZSkge1xuICBpZiAoIXR5cGUuQmFvYmFiKHByb3BzW3Byb3BOYW1lXSkpIHJldHVybiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKHByb3BOYW1lLCAnYSBCYW9iYWIgdHJlZScpKTtcbn07XG5cblByb3BUeXBlcy5jdXJzb3JzID0gZnVuY3Rpb24gKHByb3BzLCBwcm9wTmFtZSkge1xuICB2YXIgcCA9IHByb3BzW3Byb3BOYW1lXTtcblxuICB2YXIgdmFsaWQgPSB0eXBlLk9iamVjdChwKSAmJiBPYmplY3Qua2V5cyhwKS5ldmVyeShmdW5jdGlvbiAoaykge1xuICAgIHJldHVybiB0eXBlLkN1cnNvcihwW2tdKTtcbiAgfSk7XG5cbiAgaWYgKCF2YWxpZCkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdCYW9iYWIgY3Vyc29ycycpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvcFR5cGVzOyIsIi8qKlxuICogQmFvYmFiLVJlYWN0IFR5cGUgQ2hlY2tpbmdcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFNvbWUgaGVscGVycyB0byBwZXJmb3JtIHJ1bnRpbWUgdmFsaWRhdGlvbnMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSB7fTtcblxudHlwZS5PYmplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbik7XG59O1xuXG50eXBlLkJhb2JhYiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEJhb2JhYl0nO1xufTtcblxudHlwZS5DdXJzb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZS50b1N0cmluZygpID09PSAnW29iamVjdCBDdXJzb3JdJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZTsiLCJpbXBvcnQgYWxlcnRGZXRjaE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWxcIjtcbmltcG9ydCBhbGVydEZldGNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1pbmRleFwiO1xuXG5pbXBvcnQgYWxlcnRMb2FkTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsXCI7XG5pbXBvcnQgYWxlcnRMb2FkSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1sb2FkLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydEFkZCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWFkZFwiO1xuaW1wb3J0IGFsZXJ0UmVtb3ZlIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtcmVtb3ZlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWxlcnQ6IHtcbiAgICBmZXRjaE1vZGVsOiBhbGVydEZldGNoTW9kZWwsXG4gICAgZmV0Y2hJbmRleDogYWxlcnRGZXRjaEluZGV4LFxuICAgIGxvYWRNb2RlbDogYWxlcnRMb2FkTW9kZWwsXG4gICAgbG9hZEluZGV4OiBhbGVydExvYWRJbmRleCxcbiAgICBhZGQ6IGFsZXJ0QWRkLFxuICAgIHJlbW92ZTogYWxlcnRSZW1vdmUsXG4gIH0sXG59OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0FsZXJ0fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gQWxlcnQobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IHVybCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9ucGVyc2lzdGVudCBhZGRcbiAgc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJmZXRjaEluZGV4XCIpO1xuXG4gIGxldCB1cmwgPSBgYXBpL2FsZXJ0c2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeShmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG5cbiAgY3Vyc29yLm1lcmdlKHtcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICB0b3RhbDogMCxcbiAgICBtb2RlbHM6IHt9LFxuICB9KTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDIwMCk7IC8vIEhUVFAgcmVzcG9uc2Uuc3RhdHVzXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaE1vZGVsKGlkKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJmZXRjaE1vZGVsOlwiLCBpZCk7XG5cbiAgbGV0IHVybCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG5cbiAgY3Vyc29yLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCB7dG9PYmplY3QsIGZvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vYWxlcnQtZmV0Y2gtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZEluZGV4KCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZEluZGV4XCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBmaWx0ZXJzID0gY3Vyc29yLmdldChcImZpbHRlcnNcIik7XG4gIGxldCBzb3J0cyA9IGN1cnNvci5nZXQoXCJzb3J0c1wiKTtcbiAgbGV0IG9mZnNldCA9IGN1cnNvci5nZXQoXCJvZmZzZXRcIik7XG4gIGxldCBsaW1pdCA9IGN1cnNvci5nZXQoXCJsaW1pdFwiKTtcbiAgbGV0IHBhZ2luYXRpb24gPSBjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICBpZiAoIWlkcykge1xuICAgIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hNb2RlbCBmcm9tIFwiLi9hbGVydC1mZXRjaC1tb2RlbFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTW9kZWwoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkTW9kZWxcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IG1vZGVscyA9IGN1cnNvci5nZXQoXCJtb2RlbHNcIik7XG4gIGxldCBpZCA9IGN1cnNvci5nZXQoXCJpZFwiKTtcblxuICBsZXQgbW9kZWwgPSBtb2RlbHNbaWRdO1xuICBpZiAoIW1vZGVsKSB7XG4gICAgZmV0Y2hNb2RlbChpZCk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IHVybCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9uLXBlcnNpc3RlbnQgcmVtb3ZlXG4gIHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBnZXRBbGxNZXRob2RzKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5maWx0ZXIoa2V5ID0+IHR5cGVvZiBvYmpba2V5XSA9PSBcImZ1bmN0aW9uXCIpO1xufVxuXG5mdW5jdGlvbiBhdXRvQmluZChvYmopIHtcbiAgZ2V0QWxsTWV0aG9kcyhvYmouY29uc3RydWN0b3IucHJvdG90eXBlKVxuICAgIC5mb3JFYWNoKG10ZCA9PiB7XG4gICAgICBvYmpbbXRkXSA9IG9ialttdGRdLmJpbmQob2JqKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgYXV0b0JpbmQodGhpcyk7XG4gIH1cbn0iLCJpbXBvcnQgQWJvdXQgZnJvbSBcIi4vY29tcG9uZW50cy9hYm91dFwiO1xuaW1wb3J0IEJvZHkgZnJvbSBcIi4vY29tcG9uZW50cy9ib2R5XCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkcm9vbVwiO1xuaW1wb3J0IEhvbWUgZnJvbSBcIi4vY29tcG9uZW50cy9ob21lXCI7XG5cbmltcG9ydCBFcnJvciBmcm9tIFwiLi9jb21wb25lbnRzL2Vycm9yXCI7XG5pbXBvcnQgTm90Rm91bmQgZnJvbSBcIi4vY29tcG9uZW50cy9ub3QtZm91bmRcIjtcbmltcG9ydCBMb2FkaW5nIGZyb20gXCIuL2NvbXBvbmVudHMvbG9hZGluZ1wiO1xuXG5pbXBvcnQgSW50ZXJuYWxQYWdpbmF0aW9uIGZyb20gXCIuL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1pbnRlcm5hbFwiO1xuaW1wb3J0IEV4dGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24tZXh0ZXJuYWxcIjtcbmltcG9ydCBMaW5rIGZyb20gXCIuL2NvbXBvbmVudHMvbGlua1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEFib3V0LCBCb2R5LCBIZWFkcm9vbSwgSG9tZSxcbiAgRXJyb3IsIE5vdEZvdW5kLCBMb2FkaW5nLFxuICBJbnRlcm5hbFBhZ2luYXRpb24sIEV4dGVybmFsUGFnaW5hdGlvbixcbiAgTGluayxcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYm91dCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJBYm91dFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBpbmZvXCI+XG4gICAgICAgICAgPGgxPlNpbXBsZSBQYWdlIEV4YW1wbGU8L2gxPlxuICAgICAgICAgIDxwPlRoaXMgcGFnZSB3YXMgcmVuZGVyZWQgYnkgYSBKYXZhU2NyaXB0PC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbi8vbGV0IENTU1RyYW5zaXRpb25Hcm91cCBmcm9tIFwicmMtY3NzLXRyYW5zaXRpb24tZ3JvdXBcIjtcblxuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZ1wiO1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmRcIjtcbmltcG9ydCBBbGVydEl0ZW0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW1cIjtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBtaXhpbnM6IFtzdGF0ZS5taXhpbl0sXG5cbiAgY3Vyc29yczoge1xuICAgIGFsZXJ0czogW1wiYWxlcnRzXCJdLFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5hbGVydHM7XG4gICAgbW9kZWxzID0gdG9BcnJheShtb2RlbHMpO1xuXG4gICAgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3RpZmljYXRpb25zIHRvcC1sZWZ0XCI+XG4gICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBDYW4ndCBydW4gdGhpcyBjcmFwIGZvciBub3cgVE9ETyByZWNoZWNrIGFmdGVyIHRyYW5zaXRpb24gdG8gV2VicGFja1xuLy8gMSkgcmVhY3QvYWRkb25zIHB1bGxzIHdob2xlIG5ldyByZWFjdCBjbG9uZSBpbiBicm93c2VyaWZ5XG4vLyAyKSByYy1jc3MtdHJhbnNpdGlvbi1ncm91cCBjb250YWlucyB1bmNvbXBpbGVkIEpTWCBzeW50YXhcbi8vIE9NRyB3aGF0IGFuIGlkaW90cyAmXyZcblxuLy88Q1NTVHJhbnNpdGlvbkdyb3VwIHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiIGNvbXBvbmVudD1cImRpdlwiPlxuLy8gIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbi8vPC9DU1NUcmFuc2l0aW9uR3JvdXA+XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBFeHBpcmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGRlbGF5OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIC8vb25FeHBpcmU6IFJlYWN0LlByb3BUeXBlcy5mdW5jdGlvbixcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlbGF5OiA1MDAsXG4gICAgICAvL29uRXhwaXJlOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIC8vIFJlc2V0IHRoZSB0aW1lciBpZiBjaGlsZHJlbiBhcmUgY2hhbmdlZFxuICAgIGlmIChuZXh0UHJvcHMuY2hpbGRyZW4gIT09IHRoaXMucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICAgIH1cbiAgfSxcblxuICBzdGFydFRpbWVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICAvLyBDbGVhciBleGlzdGluZyB0aW1lclxuICAgIGlmICh0aGlzLl90aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH1cblxuICAgIC8vIEhpZGUgYWZ0ZXIgYG1vZGVsLmRlbGF5YCBtc1xuICAgIGlmICh0aGlzLnByb3BzLmRlbGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLm9uRXhwaXJlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLm9uRXhwaXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX3RpbWVyO1xuICAgICAgfSwgdGhpcy5wcm9wcy5kZWxheSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj47XG4gIH0sXG59KTtcblxubGV0IENsb3NlTGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucHJvcHMub25DbGljaygpO1xuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGEgY2xhc3NOYW1lPVwiY2xvc2UgcHVsbC1yaWdodFwiIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+JnRpbWVzOzwvYT5cbiAgICApO1xuICB9XG59KTtcblxubGV0IEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgbGV0IGNsYXNzZXMgPSBjbGFzc05hbWVzKHtcbiAgICAgIFwiYWxlcnRcIjogdHJ1ZSxcbiAgICAgIFtcImFsZXJ0LVwiICsgbW9kZWwuY2F0ZWdvcnldOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgbGV0IHJlc3VsdCA9IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc2VzfSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIHttb2RlbC5jbG9zYWJsZSA/IDxDbG9zZUxpbmsgb25DbGljaz17Y29tbW9uQWN0aW9ucy5hbGVydC5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9Lz4gOiBcIlwifVxuICAgICAgICB7bW9kZWwubWVzc2FnZX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG5cbiAgICBpZiAobW9kZWwuZXhwaXJlKSB7XG4gICAgICByZXN1bHQgPSA8RXhwaXJlIG9uRXhwaXJlPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0gZGVsYXk9e21vZGVsLmV4cGlyZX0+e3Jlc3VsdH08L0V4cGlyZT47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBJdGVtO1xuXG5cbi8qXG5Ob3RpZmljYXRpb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5mYWRlT3V0LmVuYWJsZWQpXG4gICAgdGhpcy4kbm90ZS5kZWxheSh0aGlzLm9wdGlvbnMuZmFkZU91dC5kZWxheSB8fCAzMDAwKS5mYWRlT3V0KCdzbG93JywgJC5wcm94eShvbkNsb3NlLCB0aGlzKSk7XG5cbiAgdGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy4kbm90ZSk7XG4gIHRoaXMuJG5vdGUuYWxlcnQoKTtcbn07XG5cbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcbiAgZWxzZSBvbkNsb3NlLmNhbGwodGhpcyk7XG59O1xuXG4kLmZuLm5vdGlmeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHJldHVybiBuZXcgTm90aWZpY2F0aW9uKHRoaXMsIG9wdGlvbnMpO1xufTtcbiovXG5cbi8vIFRPRE8gY2hlY2sgdGhpcyBodHRwczovL2dpdGh1Yi5jb20vZ29vZHliYWcvYm9vdHN0cmFwLW5vdGlmeS90cmVlL21hc3Rlci9jc3Mvc3R5bGVzXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge3Jvb3R9IGZyb20gXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rLCBSb3V0ZUhhbmRsZXJ9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IEhlYWRyb29tIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbVwiO1xuaW1wb3J0IEFsZXJ0SW5kZXggZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkByb290KHN0YXRlKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSBleHRlbmRzIENvbXBvbmVudCB7XG4gIC8vc3RhdGljIGxvYWRQYWdlKHBhcmFtcywgcXVlcnkpIHtcbiAgICAvLyBJZ25vcmUgcGFyYW1zIGFuZCBxdWVyeVxuICAgIC8vIGVzdGFibGlzaFBhZ2UocGFyYW1zLCBxdWVyeSk7XG4gICAgLy9yZXR1cm4gY29tbW9uQWN0aW9ucy5hbGVydC5sb2FkUGFnZSgpO1xuICAvL31cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGhlYWRyb29tQ2xhc3NOYW1lcyA9IHt2aXNpYmxlOiBcIm5hdmJhci1kb3duXCIsIGhpZGRlbjogXCJuYXZiYXItdXBcIn07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgICA8SGVhZHJvb20gY29tcG9uZW50PVwiaGVhZGVyXCIgaWQ9XCJwYWdlLWhlYWRlclwiIGNsYXNzTmFtZT1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiIGhlYWRyb29tQ2xhc3NOYW1lcz17aGVhZHJvb21DbGFzc05hbWVzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiLm5hdmJhci1wYWdlLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHlcIj5Ub2dnbGUgbmF2aWdhdGlvbjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1iYXJzIGZhLWxnXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgdG89XCJob21lXCI+PHNwYW4gY2xhc3NOYW1lPVwibGlnaHRcIj5SZWFjdDwvc3Bhbj5TdGFydGVyPC9MaW5rPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImNvbGxhcHNlIG5hdmJhci1jb2xsYXBzZSBuYXZiYXItcGFnZS1oZWFkZXIgbmF2YmFyLXJpZ2h0IGJyYWNrZXRzLWVmZmVjdFwiPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibmF2IG5hdmJhci1uYXZcIj5cbiAgICAgICAgICAgICAgICA8bGk+PExpbmsgdG89XCJob21lXCI+SG9tZTwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19PlJvYm90czwvTGluaz48L2xpPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImFib3V0XCI+QWJvdXQ8L0xpbms+PC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbmF2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0hlYWRyb29tPlxuXG4gICAgICAgIDxtYWluIGlkPVwicGFnZS1tYWluXCI+XG4gICAgICAgICAgPFJvdXRlSGFuZGxlci8+XG4gICAgICAgIDwvbWFpbj5cblxuICAgICAgICB7Lyo8QWxlcnRJbmRleC8+Ki99XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBsb2FkRXJyb3I6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMub25lT2YoW1wieHNcIiwgXCJzbVwiLCBcIm1kXCIsIFwibGdcIl0pLFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzaXplOiBcIm1kXCIsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVycm9yIFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3Iuc3RhdHVzICsgXCI6IFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3IuZGVzY3JpcHRpb259PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgIFwiYWxlcnQtYXMtaWNvblwiOiB0cnVlLFxuICAgICAgICAgIFwiZmEtc3RhY2tcIjogdHJ1ZSxcbiAgICAgICAgICBbdGhpcy5wcm9wcy5zaXplXTogdHJ1ZVxuICAgICAgICB9KX0+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXN0YWNrLTF4XCI+PC9pPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWJhbiBmYS1zdGFjay0yeFwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHRocm90dGxlIGZyb20gXCJsb2Rhc2gudGhyb3R0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkcm9vbSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY29tcG9uZW50OiBcImRpdlwiLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczoge1xuICAgICAgdmlzaWJsZTogXCJuYXZiYXItZG93blwiLFxuICAgICAgaGlkZGVuOiBcIm5hdmJhci11cFwiXG4gICAgfSxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNsYXNzTmFtZTogXCJcIlxuICB9XG5cbiAgaGFzU2Nyb2xsZWQoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIEluaXQgb3B0aW9uc1xuICAgIHRoaXMuZGVsdGFIZWlnaHQgPSB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0ID8gdGhpcy5wcm9wcy5kZWx0YUhlaWdodCA6IDU7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMucHJvcHMuZGVsYXkgPyB0aGlzLnByb3BzLmRlbGF5IDogMjUwO1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9wcy5pZCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhyb3R0bGUodGhpcy5oYXNTY3JvbGxlZCwgdGhpcy5kZWxheSksIGZhbHNlKTtcblxuICAgIC8vIFVwZGF0ZSBjb21wb25lbnRcInMgY2xhc3NOYW1lXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmhhc1Njcm9sbGVkLCBmYWxzZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUmVhY3QgU3RhcnRlclwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBob21lXCI+XG4gICAgICAgICAgPGgxPlJlYWN0IHN0YXJ0ZXIgYXBwPC9oMT5cbiAgICAgICAgICA8cD5Qcm9vZiBvZiBjb25jZXB0cywgQ1JVRCwgd2hhdGV2ZXIuLi48L3A+XG4gICAgICAgICAgPHA+UHJvdWRseSBidWlsZCBvbiBFUzYgd2l0aCB0aGUgaGVscCBvZiA8YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiB0cmFuc3BpbGVyLjwvcD5cbiAgICAgICAgICA8aDM+RnJvbnRlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9cIj5SZWFjdDwvYT4gZGVjbGFyYXRpdmUgVUk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWJcIj5CYW9iYWI8L2E+IEpTIGRhdGEgdHJlZSB3aXRoIGN1cnNvcnM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmFja3QvcmVhY3Qtcm91dGVyXCI+UmVhY3QtUm91dGVyPC9hPiBkZWNsYXJhdGl2ZSByb3V0ZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZ2FlYXJvbi9yZWFjdC1kb2N1bWVudC10aXRsZVwiPlJlYWN0LURvY3VtZW50LVRpdGxlPC9hPiBkZWNsYXJhdGl2ZSBkb2N1bWVudCB0aXRsZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9cIj5SZWFjdC1Cb290c3RyYXA8L2E+IEJvb3RzdHJhcCBjb21wb25lbnRzIGluIFJlYWN0PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jyb3dzZXJpZnkub3JnL1wiPkJyb3dzZXJpZnk8L2E+ICZhbXA7IDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svd2F0Y2hpZnlcIj5XYXRjaGlmeTwvYT4gYnVuZGxlIE5QTSBtb2R1bGVzIHRvIGZyb250ZW5kPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jvd2VyLmlvL1wiPkJvd2VyPC9hPiBmcm9udGVuZCBwYWNrYWdlIG1hbmFnZXI8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+QmFja2VuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZXhwcmVzc2pzLmNvbS9cIj5FeHByZXNzPC9hPiB3ZWItYXBwIGJhY2tlbmQgZnJhbWV3b3JrPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21vemlsbGEuZ2l0aHViLmlvL251bmp1Y2tzL1wiPk51bmp1Y2tzPC9hPiB0ZW1wbGF0ZSBlbmdpbmU8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZWxlaXRoL2VtYWlsanNcIj5FbWFpbEpTPC9hPiBTTVRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5Db21tb248L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiBKUyB0cmFuc3BpbGVyPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2d1bHBqcy5jb20vXCI+R3VscDwvYT4gc3RyZWFtaW5nIGJ1aWxkIHN5c3RlbTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vbG9kYXNoLmNvbS9cIj5Mb2Rhc2g8L2E+IHV0aWxpdHkgbGlicmFyeTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXCI+QXhpb3M8L2E+IHByb21pc2UtYmFzZWQgSFRUUCBjbGllbnQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW9tZW50anMuY29tL1wiPk1vbWVudDwvYT4gZGF0ZS10aW1lIHN0dWZmPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL21hcmFrL0Zha2VyLmpzL1wiPkZha2VyPC9hPiBmYWtlIGRhdGEgZ2VuZXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5WQ1M8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2dpdC1zY20uY29tL1wiPkdpdDwvYT4gdmVyc2lvbiBjb250cm9sIHN5c3RlbTwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0Um91dGVyIGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICAgIGxldCBwYXJhbXMgPSBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpO1xuICAgIGxldCBxdWVyeSA9IGN1cnNvci5nZXQoXCJxdWVyeVwiKTtcblxuICAgIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuICAgIGlmIChwcm9wcy53aXRoUGFyYW1zKSB7XG4gICAgICBwcm9wcy53aXRoUGFyYW1zID0gcHJvcHMud2l0aFBhcmFtcyA9PT0gdHJ1ZSA/IHt9IDogcHJvcHMud2l0aFBhcmFtcztcbiAgICAgIHByb3BzLnBhcmFtcyA9IG1lcmdlKHt9LCBwYXJhbXMsIHByb3BzLndpdGhQYXJhbXMpO1xuICAgICAgZGVsZXRlIHByb3BzLndpdGhQYXJhbXM7XG4gICAgfVxuICAgIGlmIChwcm9wcy53aXRoUXVlcnkpIHtcbiAgICAgIHByb3BzLndpdGhRdWVyeSA9IHByb3BzLndpdGhRdWVyeSA9PT0gdHJ1ZSA/IHt9IDogcHJvcHMud2l0aFF1ZXJ5O1xuICAgICAgcHJvcHMucXVlcnkgPSBtZXJnZSh7fSwgcXVlcnksIHByb3BzLndpdGhRdWVyeSk7XG4gICAgICBkZWxldGUgcHJvcHMud2l0aFF1ZXJ5O1xuICAgIH1cblxuICAgIHJldHVybiA8UmVhY3RSb3V0ZXIuTGluayB7Li4ucHJvcHN9PlxuICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgPC9SZWFjdFJvdXRlci5MaW5rPjtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmFuZ2UgZnJvbSBcImxvZGFzaC5yYW5nZVwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCBMaW5rIGZyb20gXCIuL2xpbmtcIjtcbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0ZXJuYWxQYWdpbmF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbmRwb2ludDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb2Zmc2V0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbGltaXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHRvdGFsUGFnZXMoKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnByb3BzLnRvdGFsIC8gdGhpcy5wcm9wcy5saW1pdCk7XG4gIH1cblxuICBtYXhPZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcygpICogdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHByZXZPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA8PSAwID8gMCA6IG9mZnNldCAtIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBuZXh0T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPj0gdGhpcy5tYXhPZmZzZXQoKSA/IHRoaXMubWF4T2Zmc2V0KCkgOiBvZmZzZXQgKyB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBlbmRwb2ludCA9IHRoaXMucHJvcHMuZW5kcG9pbnQ7XG4gICAgbGV0IGxpbWl0ID0gdGhpcy5wcm9wcy5saW1pdDtcbiAgICBsZXQgY3Vyck9mZnNldCA9IHRoaXMucHJvcHMub2Zmc2V0O1xuICAgIGxldCBwcmV2T2Zmc2V0ID0gdGhpcy5wcmV2T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbmV4dE9mZnNldCA9IHRoaXMubmV4dE9mZnNldCh0aGlzLnByb3BzLm9mZnNldCk7XG4gICAgbGV0IG1pbk9mZnNldCA9IDA7XG4gICAgbGV0IG1heE9mZnNldCA9IHRoaXMubWF4T2Zmc2V0KCk7XG5cbiAgICBpZiAodGhpcy50b3RhbFBhZ2VzKCkgPiAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IHByZXZPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtvZmZzZXR9PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3twYWdlOiB7b2Zmc2V0fX19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2Rpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IG5leHRPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8bmF2Lz47XG4gICAgfVxuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9saW5rXCI7XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9mZnNldDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxpbWl0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMubGltaXQpO1xuICB9XG5cbiAgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXMoKSAqIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBwcmV2T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPD0gMCA/IDAgOiBvZmZzZXQgLSB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgbmV4dE9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0ID49IHRoaXMubWF4T2Zmc2V0KCkgPyB0aGlzLm1heE9mZnNldCgpIDogb2Zmc2V0ICsgdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25DbGljaztcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcblxuICAgIGlmICh0aGlzLnRvdGFsUGFnZXMoKSA+IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKHByZXZPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAge3JhbmdlKDAsIG1heE9mZnNldCwgbGltaXQpLm1hcChvZmZzZXQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e29mZnNldH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG9mZnNldCl9XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5PXt7XCJwYWdlW29mZnNldF1cIjogb2Zmc2V0fX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBcImJ0bi1saW5rXCI6IHRydWUsIGRpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG5leHRPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmF2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxuYXYvPjtcbiAgICB9XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc29ydEJ5IGZyb20gXCJsb2Rhc2guc29ydGJ5XCI7XG5pbXBvcnQgaXNBcnJheSBmcm9tIFwibG9kYXNoLmlzYXJyYXlcIjtcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcbiAgaWYgKGlzQXJyYXkoYXJyYXkpKSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgob2JqZWN0LCBpdGVtKSA9PiB7XG4gICAgICBvYmplY3RbaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYGFycmF5IG11c3QgYmUgcGxhaW4gQXJyYXksIGdvdCAke2FycmF5fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iamVjdCkge1xuICBpZiAoaXNQbGFpbk9iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIHNvcnRCeShcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGtleSA9PiBvYmplY3Rba2V5XSksXG4gICAgICBpdGVtID0+IGl0ZW0uaWRcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGBvYmplY3QgbXVzdCBiZSBwbGFpbiBPYmplY3QsIGdvdCAke29iamVjdH1gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VKc29uQXBpUXVlcnkocXVlcnkpIHtcbiAgcmV0dXJuIHtcbiAgICBmaWx0ZXJzOiBxdWVyeS5maWx0ZXIsXG4gICAgc29ydHM6IHF1ZXJ5LnNvcnQgPyBxdWVyeS5zb3J0LnNwbGl0KFwiLFwiKS5tYXAodiA9PiB2LnJlcGxhY2UoL14gLywgXCIrXCIpKSA6IHVuZGVmaW5lZCxcbiAgICBvZmZzZXQ6IHF1ZXJ5LnBhZ2UgJiYgKHF1ZXJ5LnBhZ2Uub2Zmc2V0IHx8IHF1ZXJ5LnBhZ2Uub2Zmc2V0ID09IDApID8gcGFyc2VJbnQocXVlcnkucGFnZS5vZmZzZXQpIDogdW5kZWZpbmVkLFxuICAgIGxpbWl0OiBxdWVyeS5wYWdlICYmIChxdWVyeS5wYWdlLmxpbWl0IHx8IHF1ZXJ5LnBhZ2Uub2Zmc2V0ID09IDApID8gcGFyc2VJbnQocXVlcnkucGFnZS5saW1pdCkgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRKc29uQXBpUXVlcnkobW9kaWZpZXJzKSB7XG4gIGlmICghaXNQbGFpbk9iamVjdChtb2RpZmllcnMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBtb2RpZmllcnMgbXVzdCBiZSBwbGFpbiBPYmplY3QsIGdvdCAke21vZGlmaWVyc31gKTtcbiAgfVxuXG4gIGxldCBzb3J0T2JqID0ge307XG4gIGxldCBmaWx0ZXJPYmogPSB7fTtcbiAgbGV0IHBhZ2VPYmogPSB7fTtcblxuICBpZiAobW9kaWZpZXJzLmZpbHRlcnMpIHtcbiAgICBmaWx0ZXJPYmogPSBPYmplY3Qua2V5cyhtb2RpZmllcnMuZmlsdGVycykucmVkdWNlKChmaWx0ZXJPYmosIGtleSkgPT4ge1xuICAgICAgZmlsdGVyT2JqW2BmaWx0ZXJbJHtrZXl9XWBdID0gZmlsdGVyc1trZXldO1xuICAgICAgcmV0dXJuIGZpbHRlck9iajtcbiAgICB9LCBmaWx0ZXJPYmopO1xuICB9XG4gIGlmIChtb2RpZmllcnMuc29ydHMpIHtcbiAgICBzb3J0T2JqW1wic29ydFwiXSA9IG1vZGlmaWVycy5zb3J0cy5qb2luKFwiLFwiKTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLm9mZnNldCB8fCBtb2RpZmllcnMub2Zmc2V0ID09IDApIHtcbiAgICBwYWdlT2JqW1wicGFnZVtvZmZzZXRdXCJdID0gbW9kaWZpZXJzLm9mZnNldDtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmxpbWl0IHx8IG1vZGlmaWVycy5saW1pdCA9PSAwKSB7XG4gICAgcGFnZU9ialtcInBhZ2VbbGltaXRdXCJdID0gbW9kaWZpZXJzLmxpbWl0O1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHNvcnRPYmosIGZpbHRlck9iaiwgcGFnZU9iaik7XG59IiwiaW1wb3J0IEFsZXJ0IGZyb20gXCIuL21vZGVscy9hbGVydFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7QWxlcnR9OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBVVUlEIGZyb20gXCJub2RlLXV1aWRcIjtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICBpZiAoIWRhdGEubWVzc2FnZSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEubWVzc2FnZWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgaWYgKCFkYXRhLmNhdGVnb3J5KSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5jYXRlZ29yeWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgIGlkOiBVVUlELnY0KCksXG4gICAgY2xvc2FibGU6IHRydWUsXG4gICAgZXhwaXJlOiBkYXRhLmNhdGVnb3J5ID09IFwiZXJyb3JcIiA/IDAgOiA1MDAwLFxuICB9LCBkYXRhKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBQUk9YWSBST1VURVIgVE8gUkVNT1ZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUdXJuczpcbi8vICAgYXBwIChyb3V0ZXIpIDwtIHJvdXRlcyA8LSBjb21wb25lbnRzIDwtIGFjdGlvbnMgPC0gYXBwIChyb3V0ZXIpXG4vLyB0bzpcbi8vICAgYXBwIChyb3V0ZXIpIDwtIHJvdXRlcyA8LSBjb21wb25lbnRzIDwtIGFjdGlvbnMgPC0gcHJveHkgKHJvdXRlcilcbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQpIHtcbiAgICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICAgIHJldHVybiB3aW5kb3cuX3JvdXRlci5tYWtlUGF0aChcbiAgICAgIHJvdXRlIHx8IGN1cnNvci5nZXQoXCJyb3V0ZVwiKSxcbiAgICAgIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLFxuICAgICAgcXVlcnkgfHwgY3Vyc29yLmdldChcInF1ZXJ5XCIpXG4gICAgKTtcbiAgfSxcblxuICBtYWtlSHJlZihyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VIcmVmKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyhyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgd2luZG93Ll9yb3V0ZXIudHJhbnNpdGlvblRvKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci5yZXBsYWNlV2l0aChcbiAgICAgIHJvdXRlIHx8IGN1cnNvci5nZXQoXCJyb3V0ZVwiKSxcbiAgICAgIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLFxuICAgICAgcXVlcnkgfHwgY3Vyc29yLmdldChcInF1ZXJ5XCIpXG4gICAgKTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93Ll9yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5fcm91dGVyLnJ1bihyZW5kZXIpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcm94eTtcblxuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQmFvYmFiIGZyb20gXCJiYW9iYWJcIjtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IEVYQU1QTEUgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCwgLy8ge3B1Ymxpc2hlZDogdHJ1ZX0gfHwgdW5kZWZpbmVkXG4gIFNPUlRTOiB1bmRlZmluZWQsICAgLy8gW1wiK3B1Ymxpc2hlZEF0XCIsIFwiLWlkXCJdIHx8IHVuZGVmaW5lZFxuICBPRkZTRVQ6IDAsICAgICAgICAgIC8vIDAgfHwgLTFcbiAgTElNSVQ6IDIwLCAgICAgICAgICAvLyAxMCB8fCAyMCB8fCA1MCAuLi5cbn07XG5cbmV4cG9ydCBjb25zdCBST0JPVCA9IHtcbiAgRklMVEVSUzogdW5kZWZpbmVkLFxuICBTT1JUUzogW1wiK25hbWVcIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59O1xuXG5leHBvcnQgY29uc3QgQUxFUlQgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCxcbiAgU09SVFM6IFtcIitjcmVhdGVkT25cIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoXG4gIHsgLy8gREFUQVxuICAgIHVybDoge1xuICAgICAgaGFuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgcGFyYW1zOiB1bmRlZmluZWQsXG4gICAgICBxdWVyeTogdW5kZWZpbmVkLFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgIGZpbHRlcnM6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRzOiB1bmRlZmluZWQsXG4gICAgICBvZmZzZXQ6IHVuZGVmaW5lZCxcbiAgICAgIGxpbWl0OiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIHJvYm90czoge1xuICAgICAgLy8gREFUQVxuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnaW5hdGlvbjoge30sXG5cbiAgICAgIC8vIExPQUQgQVJURUZBQ1RTXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIElOREVYXG4gICAgICBmaWx0ZXJzOiBST0JPVC5GSUxURVJTLFxuICAgICAgc29ydHM6IFJPQk9ULlNPUlRTLFxuICAgICAgb2Zmc2V0OiBST0JPVC5PRkZTRVQsXG4gICAgICBsaW1pdDogUk9CT1QuTElNSVQsXG5cbiAgICAgIC8vIE1PREVMXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgIH0sXG5cbiAgICBhbGVydHM6IHtcbiAgICAgIC8vIERBVEFcbiAgICAgIG1vZGVsczoge30sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIHBhZ2luYXRpb246IHt9LFxuXG4gICAgICAvLyBMT0FEIEFSVEVGQUNUU1xuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuXG4gICAgICAvLyBJTkRFWFxuICAgICAgZmlsdGVyczogQUxFUlQuRklMVEVSUyxcbiAgICAgIHNvcnRzOiBBTEVSVC5TT1JUUyxcbiAgICAgIG9mZnNldDogQUxFUlQuT0ZGU0VULFxuICAgICAgbGltaXQ6IEFMRVJULkxJTUlULFxuXG4gICAgICAvLyBNT0RFTFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICB9LFxuICB7IC8vIE9QVElPTlNcbiAgICBmYWNldHM6IHtcbiAgICAgIGN1cnJlbnRSb2JvdDoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQge21vZGVscywgaWR9ID0gZGF0YS5yb2JvdHM7XG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWxzW2lkXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGN1cnJlbnRSb2JvdHM6IHtcbiAgICAgICAgY3Vyc29yczoge1xuICAgICAgICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IHttb2RlbHMsIHBhZ2luYXRpb24sIG9mZnNldH0gPSBkYXRhLnJvYm90cztcbiAgICAgICAgICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICAgICAgICAgIGlmIChpZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBpZHMubWFwKGlkID0+IG1vZGVsc1tpZF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4pO1xuXG4vKlxuQ2hhbmdlIGZpbHRlcnM6XG4gIC8vaWYgcGFnaW5hdGlvbi5sZW5ndGggPCB0b3RhbDpcbiAgLy8gIHB1cmdlIHBhZ2luYXRpb24hXG4gIGZldGNoIVxuICByZWRpcmVjdCB0byBvZmZzZXQgPSAwIVxuXG5DaGFuZ2Ugc29ydHM6XG4gIC8vaWYgcGFnaW5hdGlvbi5sZW5ndGggPCB0b3RhbDpcbiAgLy8gIHB1cmdlIHBhZ2luYXRpb24hXG4gIGZldGNoIVxuICByZWRpcmVjdCB0byBvZmZzZXQgPSAwIVxuXG5DaGFuZ2Ugb2Zmc2V0OlxuICAvL2lmIGNhbid0IGJlIGxvYWRlZDpcbiAgLy8gIGZldGNoIVxuICAvLyB1cGRhdGUgcGFnaW5hdGlvblxuICByZWRpcmVjdCB0byBuZXcgb2Zmc2V0IVxuXG5DaGFuZ2UgbGltaXQ6XG4gIHJlZGlyZWN0IHRvIG9mZnNldCA9IDAhIHx8IHJlYnVpbGQgcGFnaW5hdGlvbiBhbmQgaWYgY2FuJ3QgYmUgbG9hZGVkOiBmZXRjaFxuKi8iLCJpbXBvcnQgZmV0Y2hNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2ZldGNoLW1vZGVsXCI7XG5pbXBvcnQgZmV0Y2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2ZldGNoLWluZGV4XCI7XG5cbmltcG9ydCBsb2FkTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9sb2FkLW1vZGVsXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2FjdGlvbnMvbG9hZC1pbmRleFwiO1xuXG5pbXBvcnQgc2V0RmlsdGVycyBmcm9tIFwiLi9hY3Rpb25zL3NldC1maWx0ZXJzXCI7XG5pbXBvcnQgc2V0U29ydHMgZnJvbSBcIi4vYWN0aW9ucy9zZXQtc29ydHNcIjtcbmltcG9ydCBzZXRPZmZzZXQgZnJvbSBcIi4vYWN0aW9ucy9zZXQtb2Zmc2V0XCI7XG5pbXBvcnQgc2V0TGltaXQgZnJvbSBcIi4vYWN0aW9ucy9zZXQtbGltaXRcIjtcbmltcG9ydCBzZXRJZCBmcm9tIFwiLi9hY3Rpb25zL3NldC1pZFwiO1xuXG5pbXBvcnQgZXN0YWJsaXNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9lc3RhYmxpc2gtbW9kZWxcIjtcbmltcG9ydCBlc3RhYmxpc2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1pbmRleFwiO1xuaW1wb3J0IGVzdGFibGlzaFBhZ2UgZnJvbSBcIi4vYWN0aW9ucy9lc3RhYmxpc2gtcGFnZVwiO1xuXG5pbXBvcnQgYWRkIGZyb20gXCIuL2FjdGlvbnMvYWRkXCI7XG5pbXBvcnQgZWRpdCBmcm9tIFwiLi9hY3Rpb25zL2VkaXRcIjtcbmltcG9ydCByZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBmZXRjaE1vZGVsLCBmZXRjaEluZGV4LFxuICBsb2FkTW9kZWwsIGxvYWRJbmRleCxcbiAgc2V0RmlsdGVycywgc2V0U29ydHMsIHNldE9mZnNldCwgc2V0TGltaXQsXG4gIGVzdGFibGlzaE1vZGVsLCBlc3RhYmxpc2hJbmRleCwgZXN0YWJsaXNoUGFnZSxcbiAgYWRkLCBlZGl0LCByZW1vdmVcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcbmltcG9ydCBSb2JvdCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGFkZFxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQodXJsLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3I6IHVuZGVmaW5lZH0pO1xuICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTsgLy8gQ2FuY2VsIGFkZFxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90IGZyb20gXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWRpdChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBSb2JvdChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgb2xkTW9kZWwgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLmdldCgpO1xuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcblxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KHVybCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQob2xkTW9kZWwpOyAvLyBDYW5jZWwgZWRpdFxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmVkaXRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1c1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcblxuICAvKiBBc3luYy1Bd2FpdCBzdHlsZS4gV2FpdCBmb3IgcHJvcGVyIElERSBzdXBwb3J0XG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9sb2FkLWluZGV4XCI7XG5pbXBvcnQgc2V0RmlsdGVycyBmcm9tIFwiLi9zZXQtZmlsdGVyc1wiO1xuaW1wb3J0IHNldFNvcnRzIGZyb20gXCIuL3NldC1zb3J0c1wiO1xuaW1wb3J0IHNldE9mZnNldCBmcm9tIFwiLi9zZXQtb2Zmc2V0XCI7XG5pbXBvcnQgc2V0TGltaXQgZnJvbSBcIi4vc2V0LWxpbWl0XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVzdGFibGlzaEluZGV4KCkge1xuICBjb25zb2xlLmRlYnVnKFwiZXN0YWJsaXNoSW5kZXhcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcblxuICAvL3NldEZpbHRlcnMoY3Vyc29yLmdldChcImZpbHRlcnNcIikpO1xuICBzZXRTb3J0cyhjdXJzb3IuZ2V0KFwic29ydHNcIikpO1xuICBzZXRPZmZzZXQoY3Vyc29yLmdldChcIm9mZnNldFwiKSk7XG4gIC8vc2V0TGltaXQoY3Vyc29yLmdldChcImxpbWl0XCIpKTtcblxuICBsb2FkSW5kZXgoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9sb2FkLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVzdGFibGlzaE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwiZXN0YWJsaXNoTW9kZWxcIik7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IHVybElkID0gdXJsQ3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGlmICh1cmxJZCkge1xuICAgIHJvYm90c0N1cnNvci5zZXQoXCJpZFwiLCB1cmxJZCk7XG4gIH1cbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZE1vZGVsKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hQYWdlKHBhcmFtcywgcXVlcnkpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaFBhZ2U6XCIsIHBhcmFtcywgcXVlcnkpO1xuXG4gIC8vbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcblxuICAvLyBDSEFOR0UgU1RBVEVcbiAgLy8gPz8/XG4gIC8vc3RhdGUuY29tbWl0KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJmZXRjaEluZGV4XCIpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvYDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KHtmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdH0pO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybCwge3BhcmFtczogcXVlcnl9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIC8vIEN1cnJlbnQgc3RhdGVcbiAgICAgIGxldCBtb2RlbHMgPSBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpO1xuICAgICAgbGV0IHBhZ2luYXRpb24gPSBjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICAgICAgLy8gTmV3IGRhdGFcbiAgICAgIGxldCB7ZGF0YSwgbWV0YX0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgbGV0IGZldGNoZWRNb2RlbHMgPSB0b09iamVjdChkYXRhKTtcblxuICAgICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgICBjdXJzb3IubWVyZ2Uoe1xuICAgICAgICB0b3RhbDogbWV0YS5wYWdlICYmIG1ldGEucGFnZS50b3RhbCB8fCBPYmplY3Qua2V5cyhtb2RlbHMpLmxlbmd0aCxcbiAgICAgICAgbW9kZWxzOiBPYmplY3QuYXNzaWduKG1vZGVscywgZmV0Y2hlZE1vZGVscyksXG4gICAgICAgIHBhZ2luYXRpb246IE9iamVjdC5hc3NpZ24ocGFnaW5hdGlvbiwge1tvZmZzZXRdOiBPYmplY3Qua2V5cyhmZXRjaGVkTW9kZWxzKX0pLFxuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBzdGF0ZS5jb21taXQoKTtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgfTtcbiAgICAgICAgY3Vyc29yLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yfSk7XG4gICAgICAgIHN0YXRlLmNvbW1pdCgpOyAvLyBHb2QsIHRoaXMgaXMgcmVxdWlyZWQganVzdCBhYm91dCBldmVyeXdoZXJlISA6KFxuICAgICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90OmZldGNoUGFnZWAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoTW9kZWwoaWQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoTW9kZWw6XCIsIGlkKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzLyR7aWR9YDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IHtkYXRhLCBtZXRhfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBsZXQgbW9kZWwgPSBkYXRhO1xuXG4gICAgICAvLyBCVUcsIE5PVCBXT1JLSU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAvLyBUUkFDSzogaHR0cHM6Ly9naXRodWIuY29tL1lvbWd1aXRoZXJlYWwvYmFvYmFiL2lzc3Vlcy8xOTBcbiAgICAgIC8vICAgICAgICBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5NFxuICAgICAgLy9jdXJzb3IubWVyZ2Uoe1xuICAgICAgLy8gIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgLy8gIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgLy99KTtcbiAgICAgIC8vY3Vyc29yLnNlbGVjdChcIm1vZGVsc1wiKS5zZXQobW9kZWwuaWQsIG1vZGVsKTtcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFdPUktBUk9VTkQ6XG4gICAgICBjdXJzb3IuYXBwbHkocm9ib3RzID0+IHtcbiAgICAgICAgbGV0IG1vZGVscyA9IE9iamVjdC5hc3NpZ24oe30sIHJvYm90cy5tb2RlbHMpO1xuICAgICAgICBtb2RlbHNbbW9kZWwuaWRdID0gbW9kZWw7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByb2JvdHMsIHtcbiAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtb2RlbHM6IG1vZGVscyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHN0YXRlLmNvbW1pdCgpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9O1xuICAgICAgICBjdXJzb3IubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuY29tbWl0KCk7IC8vIEdvZCwgdGhpcyBpcyByZXF1aXJlZCBqdXN0IGFib3V0IGV2ZXJ5d2hlcmUhIDooXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3Q6ZmV0Y2hNb2RlbGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hJbmRleCBmcm9tIFwiLi9mZXRjaC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkSW5kZXhcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGZpbHRlcnMgPSBjdXJzb3IuZ2V0KFwiZmlsdGVyc1wiKTtcbiAgbGV0IHNvcnRzID0gY3Vyc29yLmdldChcInNvcnRzXCIpO1xuICBsZXQgb2Zmc2V0ID0gY3Vyc29yLmdldChcIm9mZnNldFwiKTtcbiAgbGV0IGxpbWl0ID0gY3Vyc29yLmdldChcImxpbWl0XCIpO1xuICBsZXQgcGFnaW5hdGlvbiA9IGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpO1xuXG4gIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gIGlmICghaWRzIHx8IGlkcy5sZW5ndGggPCBsaW1pdCkge1xuICAgIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hNb2RlbCBmcm9tIFwiLi9mZXRjaC1tb2RlbFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTW9kZWwoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkTW9kZWxcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IG1vZGVscyA9IGN1cnNvci5nZXQoXCJtb2RlbHNcIik7XG4gIGxldCBpZCA9IGN1cnNvci5nZXQoXCJpZFwiKTtcblxuICBsZXQgbW9kZWwgPSBtb2RlbHNbaWRdO1xuICBpZiAoIW1vZGVsKSB7XG4gICAgZmV0Y2hNb2RlbChpZCk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xuXG4gIHJldHVybiBBeGlvcy5kZWxldGUodXJsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IGxvYWRFcnJvcixcbiAgICAgIH0pO1xuICAgICAgcm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpO1xuICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQob2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QucmVtb3ZlYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGlzRXF1YWwgZnJvbSBcImxvZGFzaC5pc2VxdWFsXCI7XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRGaWx0ZXJzKGZpbHRlcnM9Uk9CT1QuRklMVEVSUykge1xuICBjb25zb2xlLmRlYnVnKGBzZXRGaWx0ZXJzKCR7SlNPTi5zdHJpbmdpZnkoZmlsdGVycyl9YCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKCFpc0VxdWFsKGZpbHRlcnMsIGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJmaWx0ZXJzXCIsIGZpbHRlcnMpO1xuICAgIC8vIFRPRE8gcmVldmFsdWF0ZSBwYWdpbmF0aW9uXG4gICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwge30pO1xuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59XG5cbi8vIEZJTFRFUlxuLy9pZiAoZmlsdGVycykge1xuLy8gIE9iamVjdC5rZXlzKGZpbHRlcnMpLmVhY2goa2V5ID0+IHtcbi8vICAgIG1vZGVscyA9IG1vZGVscy5maWx0ZXIobW9kZWwgPT4gbW9kZWxba2V5XSA9PT0gZmlsdGVyc1trZXldKTtcbi8vICB9KTtcbi8vfSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldE9mZnNldChpZCkge1xuICBjb25zb2xlLmRlYnVnKGBzZXRJZCgke2lkfSlgKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBpZiAoaWQgIT0gY3Vyc29yLmdldChcImlkXCIpKSB7XG4gICAgY3Vyc29yLnNldChcImlkXCIsIGlkKTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcbmltcG9ydCBzb3J0QnkgZnJvbSBcImxvZGFzaC5zb3J0YnlcIjtcblxuaW1wb3J0IHtjaHVua2VkfSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRMaW1pdChsaW1pdD1ST0JPVC5MSU1JVCkge1xuICBjb25zb2xlLmRlYnVnKFwic2V0TGltaXQoXCIgKyBsaW1pdCArIFwiKVwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBpZiAobGltaXQgIT0gY3Vyc29yLmdldChcImxpbWl0XCIpKSB7XG4gICAgbGV0IHBhZ2luYXRpb24gPSByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQoY3Vyc29yLmdldChcInBhZ2luYXRpb25cIiksIGxpbWl0KTtcbiAgICBjdXJzb3Iuc2V0KFwibGltaXRcIiwgbGltaXQpO1xuICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIGlmICghcGFnaW5hdGlvbltjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpXSkge1xuICAgICAgbGV0IG9mZnNldCA9IGZpcnN0TGVzc2VyT2Zmc2V0KHBhZ2luYXRpb24sIGN1cnNvci5nZXQoXCJvZmZzZXRcIikpO1xuICAgICAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KHtvZmZzZXR9KTtcbiAgICAgIHJvdXRlci50cmFuc2l0aW9uVG8odW5kZWZpbmVkLCB1bmRlZmluZWQsIHF1ZXJ5KTtcbiAgICB9XG4gICAgc3RhdGUuY29tbWl0KCk7XG4gIH1cbn1cblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgYHBhZ2luYXRpb25gIHdpdGggbmV3IGxpbWl0IChwZXJwYWdlKVxuICogU3VwcG9ydHMgaW52YWxpZCBkYXRhIGxpa2Ugb3ZlcmxhcHBpbmcgb2Zmc2V0c1xuICogQHB1cmVcbiAqIEBwYXJhbSBwYWdpbmF0aW9uIHtPYmplY3R9IC0gaW5wdXQgcGFnaW5hdGlvblxuICogQHBhcmFtIG5ld0xpbWl0IHtOdW1iZXJ9IC0gbmV3IGxpbWl0IChwZXJwYWdlKVxuICogQHJldHVybnMge09iamVjdH0gLSByZWNhbGN1bGF0ZWQgcGFnaW5hdGlvblxuICovXG5mdW5jdGlvbiByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQocGFnaW5hdGlvbiwgbmV3TGltaXQpIHtcbiAgaWYgKG5ld0xpbWl0IDw9MCApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG5ld0xpbWl0IG11c3QgYmUgPj0gMCwgZ290ICR7bmV3TGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGxldCBtYXhPZmZzZXQgPSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKSk7XG4gICAgbGV0IGxlbmd0aCA9IG1heE9mZnNldCArIHBhZ2luYXRpb25bbWF4T2Zmc2V0XS5sZW5ndGg7XG4gICAgbGV0IG9mZnNldHMgPSBzb3J0QnkoT2JqZWN0LmtleXMocGFnaW5hdGlvbikubWFwKHYgPT4gcGFyc2VJbnQodikpKTtcbiAgICBsZXQgZmxhdFZhbHVlcyA9IG9mZnNldHNcbiAgICAgIC5yZWR1Y2UoKG1lbW8sIG9mZnNldCkgPT4ge1xuICAgICAgICBwYWdpbmF0aW9uW29mZnNldF0uZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgICAgICBtZW1vW29mZnNldCArIGldID0gaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgIH0sIEFycmF5KGxlbmd0aCkpO1xuICAgIHJldHVybiBjaHVua2VkKGZsYXRWYWx1ZXMsIG5ld0xpbWl0KS5yZWR1Y2UoKG9iaiwgaWRzLCBpKSA9PiB7XG4gICAgICBpZHMgPSBmaWx0ZXIoaWRzKTtcbiAgICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICAgIG9ialtpICogbmV3TGltaXRdID0gaWRzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpcnN0TGVzc2VyT2Zmc2V0KHBhZ2luYXRpb24sIG9mZnNldCkge1xuICBsZXQgb2Zmc2V0cyA9IE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLm1hcCh2ID0+IHBhcnNlSW50KHYpKS5zb3J0KCkucmV2ZXJzZSgpO1xuICBmb3IgKGxldCBvIG9mIG9mZnNldHMpIHtcbiAgICBpZiAocGFyc2VJbnQobykgPCBvZmZzZXQpIHtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQob2Zmc2V0PVJPQk9ULk9GRlNFVCkge1xuICBjb25zb2xlLmRlYnVnKFwic2V0T2Zmc2V0KFwiICsgb2Zmc2V0ICsgXCIpXCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmIChvZmZzZXQgIT0gY3Vyc29yLmdldChcIm9mZnNldFwiKSkge1xuICAgIGN1cnNvci5zZXQoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBpc0VxdWFsIGZyb20gXCJsb2Rhc2guaXNlcXVhbFwiO1xuaW1wb3J0IHN0YXRlLCB7Uk9CT1R9IGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0U29ydHMoc29ydHM9Uk9CT1QuU09SVFMpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0U29ydHMoJHtKU09OLnN0cmluZ2lmeShzb3J0cyl9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG5cbiAgaWYgKCFpc0VxdWFsKHNvcnRzLCBjdXJzb3IuZ2V0KFwic29ydHNcIikpKSB7XG4gICAgY3Vyc29yLnNldChcInNvcnRzXCIsIHNvcnRzKTtcbiAgICAvLyBUT0RPIHJlZXZhbHVhdGUgcGFnaW5hdGlvblxuICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHt9KTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufVxuXG4vLyBTT1JUXG4vL2lmIChzb3J0cykge1xuLy8gIG1vZGVscyA9IHNvcnRCeU9yZGVyKG1vZGVscywgLi4ubG9kYXNoaWZ5U29ydHMoc29ydHMpKTtcbi8vfSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcImxvZGFzaC5pc3BsYWlub2JqZWN0XCI7XG5pbXBvcnQgaXNFbXB0eSBmcm9tIFwibG9kYXNoLmlzZW1wdHlcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9pbXBvcnQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lbW9bZGV0YWlsLnBhdGhdKSkge1xuLy8gICAgICAgIG1lbW9bZGV0YWlsLnBhdGhdID0gW107XG4vLyAgICAgIH1cbi8vICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4vLyAgICAgIHJldHVybiBtZW1vO1xuLy8gICAgfSwge30pO1xuLy8gIH0gZWxzZSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgfVxuLy99XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgLy9taXhpbnM6IFstLVJlYWN0Um91dGVyLlN0YXRlLS0sIHN0YXRlLm1peGluXSxcblxuICAvL2N1cnNvcnMoKSB7XG4gIC8vICByZXR1cm4ge1xuICAvLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgLy8gIH1cbiAgLy99LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5BZGQ8L2Rpdj47XG4gICAgLy9sZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgLy9yZXR1cm4gKFxuICAgIC8vICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGluZz17bG9hZGluZ30gbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz5cbiAgICAvLyk7XG4gIH1cbn0pO1xuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiB7XG4vLyAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuLy8gICAgICB9LFxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgLy8gIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIC8vfSxcbi8vXG4vLyAgLy92YWxpZGF0b3JEYXRhKCkge1xuLy8gIC8vICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAvL30sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL3JldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgIC8vICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgIC8vICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbi8vICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4vLyAgICAvL30uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICAvL3JldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4vLyAgICAgIGlmIChpc1ZhbGlkKSB7XG4vLyAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuLy8gICAgICAgIHJvYm90QWN0aW9ucy5hZGQoe1xuLy8gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgfSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4vLyAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fSBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L3NlY3Rpb24+XG4vLyAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4vLyAgICAgICk7XG4vLyAgICB9XG4vLyAgfVxuLy99KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7YnJhbmNofSBmcm9tIFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmQsIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AYnJhbmNoKHtcbiAgY3Vyc29yczoge1xuICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgfSxcbiAgZmFjZXRzOiB7XG4gICAgbW9kZWw6IFwiY3VycmVudFJvYm90XCIsXG4gIH0sXG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3REZXRhaWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgbG9hZERhdGEgPSByb2JvdEFjdGlvbnMuZXN0YWJsaXNoTW9kZWw7XG5cbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHtsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmlkfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5hc3NlbWJseURhdGV9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwubWFudWZhY3R1cmVyfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmVzdWx0IGZyb20gXCJsb2Rhc2gucmVzdWx0XCI7XG5pbXBvcnQgaXNBcnJheSBmcm9tIFwibG9kYXNoLmlzYXJyYXlcIjtcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiO1xuaW1wb3J0IGlzRW1wdHkgZnJvbSBcImxvZGFzaC5pc2VtcHR5XCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJsb2Rhc2guZGVib3VuY2VcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG4vL2ltcG9ydCBKb2kgZnJvbSBcImpvaVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbi8vbGV0IFZhbGlkYXRvcnMgZnJvbSBcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmQsIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqW2tleV0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1vW2RldGFpbC5wYXRoXSkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL2N1cnNvcnMoKSB7XG4vLyAgcmV0dXJuIHtcbi8vICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuLy8gICAgbG9hZE1vZGVsOiBbXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgdGhpcy5nZXRQYXJhbXMoKS5pZF0sXG4vLyAgfVxuLy99LFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RFZGl0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaE1vZGVsO1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5FZGl0PC9kaXY+O1xuICAgIC8vbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIC8vbGV0IGxvYWRNb2RlbCA9IHRoaXMuc3RhdGUuY3Vyc29ycy5sb2FkTW9kZWw7XG4gICAgLy9yZXR1cm4gKFxuICAgIC8vICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGluZz17bG9hZGluZ30gbG9hZEVycm9yPXtsb2FkRXJyb3J9IGxvYWRNb2RlbD17bG9hZE1vZGVsfS8+XG4gICAgLy8pO1xuICB9XG59XG5cbi8vbGV0IEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4vLyAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuLy8gICAgcmV0dXJuIHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4vLyAgICBpZiAoaXNFbXB0eSh0aGlzLnN0YXRlLm1vZGVsKSkge1xuLy8gICAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbi8vICAgICAgfSlcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0b3JUeXBlcygpIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICAgIC8vcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yRGF0YSgpIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICAvLyAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIC8vbGV0IHNjaGVtYSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvclR5cGVzXCIpIHx8IHt9O1xuLy8gICAgLy9sZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbi8vICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbi8vICAgIC8vICByZXR1cm4gaXNBcnJheShiKSA/IGIgOiB1bmRlZmluZWQ7XG4vLyAgICAvL30pO1xuLy8gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLy8gICAgLy8gIHRoaXMuc2V0U3RhdGUoe1xuLy8gICAgLy8gICAgZXJyb3JzOiBuZXh0RXJyb3JzXG4vLyAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuLy8gICAgLy99KTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVDaGFuZ2VGb3I6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gICAgICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4vLyAgICAvLyAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuLy8gICAgfS5iaW5kKHRoaXMpO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlRGVib3VuY2VkOiBkZWJvdW5jZShmdW5jdGlvbiB2YWxpZGF0ZURlYm91bmNlZChrZXkpIHtcbi8vICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbi8vICAgIH0sIHRoaXMudmFsaWRhdGUpO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuLy8gICAgICBpZiAoaXNWYWxpZCkge1xuLy8gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbi8vICAgICAgICByb2JvdEFjdGlvbnMuZWRpdCh7XG4vLyAgICAgICAgICBpZDogdGhpcy5zdGF0ZS5tb2RlbC5pZCxcbi8vICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgIH0pO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuLy8gICAgaWYgKGlzRW1wdHkoZXJyb3JzKSkge1xuLy8gICAgICByZXR1cm4gW107XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuLy8gICAgICAgIH0pKTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICAgIH1cbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gdHJ1ZTtcbi8vICAgIC8vcmV0dXJuIGlzRW1wdHkodGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KSk7XG4vLyAgfSxcbi8vXG4vLyAgcmVuZGVyKCkge1xuLy8gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvciwgbG9hZE1vZGVsfSA9IHRoaXMucHJvcHM7XG4vLyAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuLy9cbi8vICAgIGlmIChsb2FkaW5nKSB7XG4vLyAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuLy8gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbi8vICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIHJldHVybiAoXG4vLyAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRWRpdCBcIiArIG1vZGVsLm5hbWV9PlxuLy8gICAgICAgICAgPGRpdj5cbi8vICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9hPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tM1wiPlxuLy8gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbi8vICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuLy8gICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbi8vICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPnttb2RlbC5uYW1lfTwvaDE+XG4vLyAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4vLyAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9zZWN0aW9uPlxuLy8gICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuLy8gICAgICApO1xuLy8gICAgfVxuLy8gIH1cbi8vfSk7XG5cbi8qXG48VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiovXG5cbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIilcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5uYW1lLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8odGhpcy52YWxpZGF0b3JUeXBlcygpLmFzc2VtYmx5RGF0ZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSwiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2JyYW5jaH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgRXh0ZXJuYWxQYWdpbmF0aW9uLCBJbnRlcm5hbFBhZ2luYXRpb24sIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90SXRlbSBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuXG4gIGZhY2V0czoge1xuICAgIGN1cnJlbnRSb2JvdHM6IFwiY3VycmVudFJvYm90c1wiLFxuICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hJbmRleDtcblxuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHNldExpbWl0KGxpbWl0KSB7XG4gICAgcm9ib3RBY3Rpb25zLnNldExpbWl0KGxpbWl0KTtcbiAgICByb2JvdEFjdGlvbnMubG9hZEluZGV4KCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHt0b3RhbCwgbG9hZGluZywgbG9hZEVycm9yLCBvZmZzZXQsIGxpbWl0fSA9IHRoaXMucHJvcHMucm9ib3RzO1xuICAgIGxldCBtb2RlbHMgPSB0aGlzLnByb3BzLmN1cnJlbnRSb2JvdHM7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICAgICAgICAgIHRvPVwicm9ib3QtaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3NvcnQ6IFwiK25hbWVcIn19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgU29ydEJ5ICtuYW1lXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICB0bz1cInJvYm90LWluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3tzb3J0OiBcIi1uYW1lXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgIFNvcnRCeSAtbmFtZVxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDMpfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDUpfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDEwKX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSAxMFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1hZGRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmVlblwiIHRpdGxlPVwiQWRkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbFBhZ2luYXRpb24gZW5kcG9pbnQ9XCJyb2JvdC1pbmRleFwiIHRvdGFsPXt0b3RhbH0gb2Zmc2V0PXtvZmZzZXR9IGxpbWl0PXtsaW1pdH0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxJbnRlcm5hbFBhZ2luYXRpb24gb25DbGljaz17b2Zmc2V0ID0+IHJvYm90QWN0aW9ucy5zZXRPZmZzZXQob2Zmc2V0KX0gdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7Qm9keSwgSG9tZSwgQWJvdXQsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuaW1wb3J0IFJvYm90SW5kZXggZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIjtcbmltcG9ydCBSb2JvdEFkZCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIjtcbmltcG9ydCBSb2JvdERldGFpbCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIjtcbmltcG9ydCBSb2JvdEVkaXQgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCAoXG4gIDxSb3V0ZSBwYXRoPVwiL1wiIGhhbmRsZXI9e0JvZHl9PlxuICAgIDxEZWZhdWx0Um91dGUgaGFuZGxlcj17SG9tZX0gbmFtZT1cImhvbWVcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvYWJvdXRcIiBuYW1lPVwiYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0gbG9hZGVyPVwieHh4XCIvPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9cIiBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzL2FkZFwiIG5hbWU9XCJyb2JvdC1hZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy86aWRcIiBuYW1lPVwicm9ib3QtZGV0YWlsXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkL2VkaXRcIiBuYW1lPVwicm9ib3QtZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogU3BsaXQgYXJyYXkgaW50byBjaHVua3Mgd2l0aCBwcmVkZWZpbmVkIGNodW5rIGxlbmd0aC4gVXNlZnVsIGZvciBwYWdpbmF0aW9uLlxuICogRXhhbXBsZTpcbiAqICAgY2h1bmtlZChbMSwgMiwgMywgNCwgNV0sIDIpID09IFtbMSwgMl0sIFszLCA0XSwgWzVdXVxuICogQHB1cmVcbiAqIEBwYXJhbSBhcnJheSB7QXJyYXl9IC0gYXJyYXkgdG8gYmUgY2h1bmtlZFxuICogQHBhcmFtIG4ge251bWJlcn0gLSBsZW5ndGggb2YgY2h1bmtcbiAqIEByZXR1cm5zIHtBcnJheX0gLSBjaHVua2VkIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaHVua2VkKGFycmF5LCBuKSB7XG4gIGxldCBsID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIG4pO1xuICByZXR1cm4gcmFuZ2UobCkubWFwKCh4LCBpKSA9PiBhcnJheS5zbGljZShpKm4sIGkqbiArIG4pKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBzb3J0aW5nIGFycmF5IGluIFwic2hvcnRcIiBmb3JtYXQgdG8gc29ydGluZyBhcnJheSBpbiBcImxvZGFzaFwiIChsb2Rhc2guc29ydEJ5T3JkZXIpIGZvcm1hdC5cbiAqIEV4YW1wbGU6XG4gKiAgIGxvZGFzaGlmeVNvcnRzKFtcIituYW1lXCIsIFwiLWFnZVwiXSkgPT0gW1tcIm5hbWVcIiwgXCJhZ2VcIl0sIFt0cnVlLCBmYWxzZV1dXG4gKiBAcHVyZVxuICogQHBhcmFtIHNvcnRzIHtBcnJheTxzdHJpbmc+fSAtIGFycmF5IGluIFwic2hvcnRcIiBmb3JtYXRcbiAqIEByZXR1cm5zIHtBcnJheTxBcnJheTxzdHJpbmc+Pn0gLSBhcnJheSBpbiBcImxvZGFzaFwiIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9kYXNoaWZ5U29ydHMoc29ydHMpIHtcbiAgcmV0dXJuIFtcbiAgICBzb3J0cy5tYXAodiA9PiB2LnNsaWNlKDEpKSxcbiAgICBzb3J0cy5tYXAodiA9PiB2WzBdID09IFwiK1wiKSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVlcChvYmplY3QsIG90aGVyKSB7XG4gIHJldHVybiBtZXJnZSh7fSwgb2JqZWN0LCBvdGhlciwgKGEsIGIpID0+IHtcbiAgICBpZiAoaXNBcnJheShhKSkge1xuICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgSW5zcGVjdCBmcm9tIFwidXRpbC1pbnNwZWN0XCI7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhvdyBpdCdzIGV2ZXIgbWlzc2VkPyFcblJlZ0V4cC5lc2NhcGUgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbn07XG5cbi8vIFVuY29tbWVudCBpZiB1c2UgSW9KU1xuLy8gbGV0IHByb2Nlc3MgPSBwcm9jZXNzIHx8IHVuZGVmaW5lZDtcbi8vaWYgKHByb2Nlc3MpIHtcbiAgLy8gSW9KUyBoYXMgYHVuaGFuZGxlZFJlamVjdGlvbmAgaG9va1xuICAvL3Byb2Nlc3Mub24oXCJ1bmhhbmRsZWRSZWplY3Rpb25cIiwgZnVuY3Rpb24gKHJlYXNvbiwgcCkge1xuICAvLyAgdGhyb3cgRXJyb3IoYFVuaGFuZGxlZFJlamVjdGlvbjogJHtyZWFzb259YCk7XG4gIC8vfSk7XG4vL30gZWxzZSB7XG4gIFByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiBkb25lKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHRoaXNcbiAgICAgIC50aGVuKHJlc29sdmUsIHJlamVjdClcbiAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRocm93IGU7IH0sIDApO1xuICAgICAgfSk7XG4gIH07XG4vL31cblxuLy8gV29ya2Fyb3VuZCBtZXRob2QgYXMgbmF0aXZlIGJyb3dzZXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIEltbXV0YWJsZSBpcyBhd2Z1bFxubGV0IHdpbmRvdyA9IHdpbmRvdyB8fCB1bmRlZmluZWQ7XG5pZiAod2luZG93KSB7XG4gIHdpbmRvdy5jb25zb2xlLmVjaG8gPSBmdW5jdGlvbiBlY2hvKCkge1xuICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykubWFwKHYgPT4gSW5zcGVjdCh2KSkpO1xuICB9O1xufSJdfQ==
