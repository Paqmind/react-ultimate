(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

require("babel/polyfill");

require("shared/shims");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _createRouter$HistoryLocation = require("react-router");

var _parseJsonApiQuery2 = require("shared/common/helpers");

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

},{"babel/polyfill":"babel/polyfill","frontend/common/state":31,"frontend/routes":54,"react":"react","react-router":"react-router","shared/common/helpers":55,"shared/shims":56}],2:[function(require,module,exports){
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

var _toObject$formatJsonApiQuery = require("shared/common/helpers");

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

},{"./alert-fetch-index":9,"axios":"axios","frontend/common/state":31,"shared/common/helpers":55}],12:[function(require,module,exports){
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
  var url = "/api/alerts/" + id;

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

var _toArray = require("shared/common/helpers");

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

},{"frontend/common/components/alert-item":18,"frontend/common/components/loading":24,"frontend/common/components/not-found":25,"frontend/common/state":31,"react":"react","shared/common/helpers":55}],18:[function(require,module,exports){
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

},{"frontend/common/component":14,"frontend/common/state":31,"lodash.merge":"lodash.merge","react":"react","react-router":"react-router"}],24:[function(require,module,exports){
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

var _formatJsonApiQuery = require("shared/common/helpers");

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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"lodash.range":"lodash.range","react":"react","shared/common/helpers":55}],27:[function(require,module,exports){
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

var _formatJsonApiQuery = require("shared/common/helpers");

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireWildcard(_Component2);

var _Link = require("./link");

var _Link2 = _interopRequireWildcard(_Link);

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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"lodash.range":"lodash.range","react":"react","shared/common/helpers":55}],28:[function(require,module,exports){
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
  FILTERS: {},
  SORTS: ["+name"],
  OFFSET: 0,
  LIMIT: 5 };

exports.ROBOT = ROBOT;
var ALERT = {
  FILTERS: {},
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

},{"baobab":"baobab"}],32:[function(require,module,exports){
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

},{"./actions/add":33,"./actions/edit":34,"./actions/establish-index":35,"./actions/establish-model":36,"./actions/establish-page":37,"./actions/fetch-index":38,"./actions/fetch-model":39,"./actions/load-index":40,"./actions/load-model":41,"./actions/remove":42,"./actions/set-filters":43,"./actions/set-id":44,"./actions/set-limit":45,"./actions/set-offset":46,"./actions/set-sorts":47}],33:[function(require,module,exports){
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31,"frontend/robot/models":53}],34:[function(require,module,exports){
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31,"frontend/robot/models":53}],35:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishIndex;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("shared/common/helpers");

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

  _setFilters2["default"](cursor.get("filters"));
  _setSorts2["default"](cursor.get("sorts"));
  _setOffset2["default"](cursor.get("offset"));
  _setLimit2["default"](cursor.get("limit"));

  _loadIndex2["default"]();
}

module.exports = exports["default"];

},{"./load-index":40,"./set-filters":43,"./set-limit":45,"./set-offset":46,"./set-sorts":47,"frontend/common/router":30,"frontend/common/state":31,"shared/common/helpers":55}],36:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishModel;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("shared/common/helpers");

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

},{"./load-model":41,"frontend/common/router":30,"frontend/common/state":31,"shared/common/helpers":55}],37:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishPage;
// IMPORTS =========================================================================================

var _formatJsonApiQuery = require("shared/common/helpers");

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

},{"./load-index":40,"frontend/common/router":30,"frontend/common/state":31,"shared/common/helpers":55}],38:[function(require,module,exports){
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

var _toObject$formatJsonApiQuery = require("shared/common/helpers");

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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/state":31,"shared/common/helpers":55}],39:[function(require,module,exports){
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

var _toObject = require("shared/common/helpers");

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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/state":31,"shared/common/helpers":55}],40:[function(require,module,exports){
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

var _toObject$formatJsonApiQuery = require("shared/common/helpers");

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

},{"./fetch-index":38,"axios":"axios","frontend/common/state":31,"shared/common/helpers":55}],41:[function(require,module,exports){
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

},{"axios":"axios","frontend/common/actions":7,"frontend/common/router":30,"frontend/common/state":31}],43:[function(require,module,exports){
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

var _findWhere = require("lodash.findwhere");

var _findWhere2 = _interopRequireWildcard(_findWhere);

var _chunked$formatJsonApiQuery$flattenArrayGroup$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

function setFilters() {
  var filters = arguments[0] === undefined ? _state$ROBOT.ROBOT.FILTERS : arguments[0];

  console.debug("setFilters(" + JSON.stringify(filters) + ")");

  var cursor = _state$ROBOT2["default"].select("robots");
  if (!_isEqual2["default"](filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    var paginationLength = _chunked$formatJsonApiQuery$flattenArrayGroup$firstLesserOffset.flattenArrayGroup(cursor.get("pagination")).length;
    if (paginationLength && paginationLength >= cursor.get("total")) {
      // Full index loaded – can recalculate pagination
      console.log("Full index loaded, recalculating pagination...");
      var pagination = recalculatePaginationWithFilters(cursor.get("pagination"), filters, cursor.get("models"), cursor.get("limit"));
      if (!pagination[cursor.get("offset")]) {
        // Number of pages reduced - redirect to closest
        var offset = _chunked$formatJsonApiQuery$flattenArrayGroup$firstLesserOffset.firstLesserOffset(pagination, cursor.get("offset"));
        var query = _chunked$formatJsonApiQuery$flattenArrayGroup$firstLesserOffset.formatJsonApiQuery({ offset: offset });
        _router2["default"].transitionTo(undefined, undefined, query);
      }
      cursor.set("pagination", pagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    _state$ROBOT2["default"].commit();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new `filters`
 * May be applied only when `models.length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Object<string, Array>} - input pagination
 * @param filters {number} - new filters
 * @param models {Object<string, Object>} - obj of models
 * @param limit {number} - current limit
 * @returns {Object<string, Array>} - recalculated pagination
 */
function recalculatePaginationWithFilters(pagination, filters, models, limit) {
  if (!pagination instanceof Object) {
    throw new Error("pagination must be a basic Object, got " + pagination);
  }
  if (!filters instanceof Object) {
    throw new Error("filters must be a basic Object, got " + filters);
  }
  if (!models instanceof Object) {
    throw new Error("models must be a basic Object, got " + models);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error("limit must be a positive number, got " + limit);
  }
  if (Object.keys(pagination).length) {
    if (Object.keys(filters).length) {
      var unfilteredModels = Object.values(models);
      var filteredModels = _findWhere2["default"](unfilteredModels, filters);
      return _chunked$formatJsonApiQuery$flattenArrayGroup$firstLesserOffset.chunked(filteredModels.map(function (m) {
        return m.id;
      }), limit).reduce(function (obj, ids, i) {
        obj[i * limit] = ids;
        return obj;
      }, {});
    } else {
      return pagination;
    }
  } else {
    return {};
  }
}
module.exports = exports["default"];

},{"frontend/common/router":30,"frontend/common/state":31,"lodash.findwhere":"lodash.findwhere","lodash.isequal":"lodash.isequal","shared/common/helpers":55}],44:[function(require,module,exports){
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

},{"frontend/common/state":31}],45:[function(require,module,exports){
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

var _chunked$formatJsonApiQuery$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

function setLimit() {
  var limit = arguments[0] === undefined ? _state$ROBOT.ROBOT.LIMIT : arguments[0];

  console.debug("setLimit(" + limit + ")");

  var cursor = _state$ROBOT2["default"].select("robots");
  if (limit != cursor.get("limit")) {
    console.debug("Recalculating pagination...");
    cursor.set("limit", limit);
    var pagination = recalculatePaginationWithLimit(cursor.get("pagination"), limit);
    if (!pagination[cursor.get("offset")]) {
      // Number of pages reduced - redirect to closest
      var offset = _chunked$formatJsonApiQuery$firstLesserOffset.firstLesserOffset(pagination, cursor.get("offset"));
      var query = _chunked$formatJsonApiQuery$firstLesserOffset.formatJsonApiQuery({ offset: offset });
      _router2["default"].transitionTo(undefined, undefined, query);
    }
    cursor.set("pagination", pagination);
    _state$ROBOT2["default"].commit();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new limit (perpage)
 * May be applied when `models.length != total`, so
 * `pagination` can't be recreated from scrath.
 * * Supports invalid data like overlapping offsets
 * @pure
 * @param pagination {Object} - input pagination
 * @param limit {Number} - new limit (perpage)
 * @returns {Object} - recalculated pagination
 */
function recalculatePaginationWithLimit(pagination, limit) {
  if (!pagination instanceof Object) {
    throw new Error("pagination must be a basic Object, got " + pagination);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error("limit must be a positive number, got " + limit);
  }
  if (Object.keys(pagination).length) {
    var _ret = (function () {
      var maxOffset = Math.max.apply(Math, Object.keys(pagination));
      var length = maxOffset + pagination[maxOffset].length;
      var offsets = _sortBy2["default"](Object.keys(pagination).map(function (v) {
        return parseInt(v);
      }));
      var ids = offsets.reduce(function (memo, offset) {
        pagination[offset].forEach(function (id, i) {
          memo[offset + i] = id;
        });
        return memo;
      }, Array(length));
      // => [,,,,,1,2,3,4,5,,,,,]
      return {
        v: _chunked$formatJsonApiQuery$firstLesserOffset.chunked(ids, limit).reduce(function (obj, offsetIds, i) {
          offsetIds = _filter2["default"](offsetIds);
          if (ids.length) {
            obj[i * limit] = offsetIds;
          }
          return obj;
        }, {})
      }; // => {5: [1, 2, 3, 4, 5]}
    })();

    if (typeof _ret === "object") {
      return _ret.v;
    }
  } else {
    return {};
  }
}
module.exports = exports["default"];

},{"frontend/common/router":30,"frontend/common/state":31,"lodash.filter":"lodash.filter","lodash.sortby":"lodash.sortby","shared/common/helpers":55}],46:[function(require,module,exports){
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

},{"frontend/common/state":31}],47:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setSorts;
// IMPORTS =========================================================================================

var _isEqual = require("lodash.isequal");

var _isEqual2 = _interopRequireWildcard(_isEqual);

var _sortByOrder = require("lodash.sortbyorder");

var _sortByOrder2 = _interopRequireWildcard(_sortByOrder);

var _chunked$lodashifySorts$flattenArrayGroup$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

function setSorts() {
  var sorts = arguments[0] === undefined ? _state$ROBOT.ROBOT.SORTS : arguments[0];

  console.debug("setSorts(" + JSON.stringify(sorts) + ")");

  var cursor = _state$ROBOT2["default"].select("robots");
  if (!_isEqual2["default"](sorts, cursor.get("sorts"))) {
    cursor.set("sorts", sorts);
    var paginationLength = _chunked$lodashifySorts$flattenArrayGroup$firstLesserOffset.flattenArrayGroup(cursor.get("pagination")).length;
    if (paginationLength && paginationLength >= cursor.get("total")) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
      var pagination = recalculatePaginationWithSorts(cursor.get("pagination"), sorts, cursor.get("models"), cursor.get("limit"));
      cursor.set("pagination", pagination);
    } else {
      // Part of index loaded – can only reset
      cursor.set("pagination", {});
    }
    _state$ROBOT2["default"].commit();
  }
}

// HELPERS =========================================================================================
/**
 * Recalculates `pagination` with new `sorts`
 * May be applied only when `models.length == total`, so `models`
 * represent full set of ids and `pagination` can then be recreated from scrath.
 * @pure
 * @param pagination {Object<string, Array>} - input pagination
 * @param sorts {Array<string>} - new sorts
 * @param models {Object<string, Object>} - obj of models
 * @param limit {number} - current limit
 * @returns {Object<string, Array>} - recalculated pagination
 */
function recalculatePaginationWithSorts(pagination, sorts, models, limit) {
  if (!pagination instanceof Object) {
    throw new Error("pagination must be a basic Object, got " + pagination);
  }
  if (!sorts instanceof Array) {
    throw new Error("sorts must be a basic Array, got " + sorts);
  }
  if (!models instanceof Object) {
    throw new Error("models must be a basic Object, got " + models);
  }
  if (typeof limit != "number" || limit <= 0) {
    throw new Error("limit must be a positive number, got " + limit);
  }
  if (Object.keys(pagination).length) {
    if (sorts.length) {
      var unsortedModels = Object.values(models);
      var sortedModels = _sortByOrder2["default"].apply(undefined, [unsortedModels].concat(_toConsumableArray(_chunked$lodashifySorts$flattenArrayGroup$firstLesserOffset.lodashifySorts(sorts))));
      return _chunked$lodashifySorts$flattenArrayGroup$firstLesserOffset.chunked(sortedModels.map(function (m) {
        return m.id;
      }), limit).reduce(function (obj, ids, i) {
        obj[i * limit] = ids;
        return obj;
      }, {});
    } else {
      return pagination;
    }
  } else {
    return {};
  }
}
module.exports = exports["default"];

},{"frontend/common/state":31,"lodash.isequal":"lodash.isequal","lodash.sortbyorder":"lodash.sortbyorder","shared/common/helpers":55}],48:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _result = require("lodash.result");

var _result2 = _interopRequireWildcard(_result);

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
    if (obj[key] instanceof Array || !obj[key] instanceof Object) {
      memo[path + key] = to;
    } else {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key + "."));
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
//      if (!memo[detail.path] instanceof Array) {
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
//    //  return b instanceof Array ? b : undefined;
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
//    if (!Object.values(errors).length) {
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
//    return Object.values(this.getValidationMessages(key)).length == 0;
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

},{"classnames":"classnames","frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title"}],49:[function(require,module,exports){
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

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"react":"react","react-document-title":"react-document-title"}],50:[function(require,module,exports){
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
    if (obj[key] instanceof Array || !obj[key] instanceof Object) {
      memo[path + key] = to;
    } else {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key + "."));
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
//      if (!memo[detail.path] instanceof Array) {
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
//    if (!Object.values(this.state.model).length) {
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
//    //  return b instanceof Array ? b : undefined;
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
//    if (!Object.values(errors).length) {
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
//    //return Object.values(this.getValidationMessages(key).length == 0);
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

},{"classnames":"classnames","frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"lodash.debounce":"lodash.debounce","lodash.flatten":"lodash.flatten","lodash.merge":"lodash.merge","lodash.result":"lodash.result","react":"react","react-document-title":"react-document-title"}],51:[function(require,module,exports){
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

var _toArray = require("shared/common/helpers");

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

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/state":31,"frontend/robot/actions":32,"frontend/robot/components/item":52,"react":"react","react-document-title":"react-document-title","shared/common/helpers":55}],52:[function(require,module,exports){
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

},{"frontend/common/component":14,"frontend/common/components":15,"frontend/robot/actions":32,"react":"react"}],53:[function(require,module,exports){
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

},{"node-uuid":"node-uuid"}],54:[function(require,module,exports){
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

},{"frontend/common/components":15,"frontend/robot/components/add":48,"frontend/robot/components/detail":49,"frontend/robot/components/edit":50,"frontend/robot/components/index":51,"react":"react","react-router":"react-router"}],55:[function(require,module,exports){
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
exports.flattenArrayGroup = flattenArrayGroup;
exports.firstLesserOffset = firstLesserOffset;
exports.toObject = toObject;
exports.toArray = toArray;
exports.parseJsonApiQuery = parseJsonApiQuery;
exports.formatJsonApiQuery = formatJsonApiQuery;
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireWildcard(_range);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireWildcard(_sortBy);

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
    if (a instanceof Array) {
      return a.concat(b);
    }
  });
}

function flattenArrayGroup(object) {
  var sorter = arguments[1] === undefined ? function (v) {
    return v;
  } : arguments[1];

  return _sortBy2["default"](Object.keys(object), sorter).reduce(function (combinedArray, key) {
    return combinedArray.concat(object[key]);
  }, []);
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

function toObject(array) {
  if (array instanceof Array) {
    return array.reduce(function (object, item) {
      object[item.id] = item;
      return object;
    }, {});
  } else {
    throw Error("array must be plain Array, got " + array);
  }
}

function toArray(object) {
  if (object instanceof Object) {
    return _sortBy2["default"](Object.keys(object).map(function (key) {
      return object[key];
    }), function (item) {
      return item.id;
    });
  } else {
    throw Error("object must be a basic Object, got " + object);
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
  if (!modifiers instanceof Object) {
    throw new Error("modifiers must be a basic Object, got " + modifiers);
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

},{"lodash.merge":"lodash.merge","lodash.range":"lodash.range","lodash.sortby":"lodash.sortby"}],56:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xpbmsuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1leHRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9wYWdpbmF0aW9uLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL21vZGVscy9hbGVydC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1wYWdlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9mZXRjaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWZpbHRlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtaWQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtbGltaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtb2Zmc2V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LXNvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNDTyxnQkFBZ0I7O1FBQ2hCLGNBQWM7O3FCQUVILE9BQU87Ozs7NENBQzZCLGNBQWM7O2tDQUVwQyx1QkFBdUI7O3FCQUNyQyx1QkFBdUI7Ozs7c0JBQ3RCLGlCQUFpQjs7Ozs7QUFHcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyw4QkFQVCxNQUFNLENBT2dCO0FBQzVCLFFBQU0scUJBQVE7QUFDZCxVQUFRLGdDQVRzQixlQUFlLEFBU3BCO0NBQzFCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUs7Ozs7O0FBS3ZDLFNBQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUc1QixNQUFJLFNBQVMsR0FBRyxtQkFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEMsTUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0MsV0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEMsV0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFdBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEMsTUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDdkIsTUFBSSxFQUFFLEVBQUU7QUFDTixhQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUN6Qjs7MkJBRXFDLG9CQTdCaEMsaUJBQWlCLENBNkJpQyxHQUFHLENBQUMsS0FBSyxDQUFDOztNQUE3RCxPQUFPLHNCQUFQLE9BQU87TUFBRSxLQUFLLHNCQUFMLEtBQUs7TUFBRSxNQUFNLHNCQUFOLE1BQU07TUFBRSxLQUFLLHNCQUFMLEtBQUs7O0FBQ2xDLFdBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsTUFBSSxPQUFPLEVBQUU7QUFDWCxhQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNuQztBQUNELE1BQUksS0FBSyxFQUFFO0FBQ1QsYUFBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0I7QUFDRCxNQUFJLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLGFBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0dBQ2pDO0FBQ0QsTUFBSSxLQUFLLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUN4QixhQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMvQjs7QUFFRCxxQkFBTSxNQUFNLEVBQUUsQ0FBQzs7O0FBR2YsTUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FDdEIsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUU7R0FBQSxDQUFDLENBQzFDLEdBQUcsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNmLFFBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNyQixjQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDckI7R0FDRixDQUFDLENBQUM7O0FBRUwsU0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMvQix1QkFBTSxNQUFNLENBQUMsaUNBQUMsV0FBVyxPQUFFLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQy9ELENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7O0FDakVIO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2FBQUkscUJBQVEsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUM7R0FDeEYsQ0FBQztDQUNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBcImJhYmVsL3BvbHlmaWxsXCI7XG5pbXBvcnQgXCJzaGFyZWQvc2hpbXNcIjtcblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtjcmVhdGUgYXMgY3JlYXRlUm91dGVyLCBIaXN0b3J5TG9jYXRpb259IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IHtwYXJzZUpzb25BcGlRdWVyeX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXMgZnJvbSBcImZyb250ZW5kL3JvdXRlc1wiO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG53aW5kb3cuX3JvdXRlciA9IGNyZWF0ZVJvdXRlcih7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93Ll9yb3V0ZXIucnVuKChBcHBsaWNhdGlvbiwgdXJsKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIGNvbnNvbGUuZGVidWcoXCJyb3V0ZXIucnVuXCIpO1xuXG4gIC8vIFNFVCBCQU9CQUIgVVJMIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCBoYW5kbGVyID0gdXJsLnJvdXRlcy5zbGljZSgtMSlbMF0ubmFtZTtcbiAgdXJsQ3Vyc29yLnNldChcImhhbmRsZXJcIiwgaGFuZGxlcik7XG4gIHVybEN1cnNvci5zZXQoXCJwYXJhbXNcIiwgdXJsLnBhcmFtcyk7XG4gIHVybEN1cnNvci5zZXQoXCJxdWVyeVwiLCB1cmwucXVlcnkpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gIH1cblxuICBsZXQge2ZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0fSA9IHBhcnNlSnNvbkFwaVF1ZXJ5KHVybC5xdWVyeSk7XG4gIHVybEN1cnNvci5zZXQoXCJyb3V0ZVwiLCB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lKTtcbiAgaWYgKGZpbHRlcnMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCBmaWx0ZXJzKTtcbiAgfVxuICBpZiAoc29ydHMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwic29ydHNcIiwgc29ydHMpO1xuICB9XG4gIGlmIChvZmZzZXQgfHwgb2Zmc2V0ID09PSAwKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcIm9mZnNldFwiLCBvZmZzZXQpO1xuICB9XG4gIGlmIChsaW1pdCB8fCBsaW1pdCA9PT0gMCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJsaW1pdFwiLCBsaW1pdCk7XG4gIH1cblxuICBzdGF0ZS5jb21taXQoKTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBsZXQgcHJvbWlzZXMgPSB1cmwucm91dGVzXG4gICAgLm1hcChyb3V0ZSA9PiByb3V0ZS5oYW5kbGVyLm9yaWdpbmFsIHx8IHt9KVxuICAgIC5tYXAob3JpZ2luYWwgPT4ge1xuICAgICAgaWYgKG9yaWdpbmFsLmxvYWREYXRhKSB7XG4gICAgICAgIG9yaWdpbmFsLmxvYWREYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgIFJlYWN0LnJlbmRlcig8QXBwbGljYXRpb24vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcbiAgfSk7XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJvb3QgPSByb290O1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBEZWNvcmF0b3JzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzcgZGVjb3JhdG9ycyBzdWdhciBmb3IgaGlnaGVyIG9yZGVyIGNvbXBvbmVudHMuXG4gKi9cblxudmFyIF9Sb290JEJyYW5jaCA9IHJlcXVpcmUoJy4vaGlnaGVyLW9yZGVyLmpzJyk7XG5cbmZ1bmN0aW9uIHJvb3QodHJlZSkge1xuICBpZiAodHlwZW9mIHRyZWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLnJvb3QodHJlZSk7XG4gIH1yZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0YXJnZXQsIHRyZWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBicmFuY2goc3BlY3MpIHtcbiAgaWYgKHR5cGVvZiBzcGVjcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2guYnJhbmNoKHNwZWNzKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2godGFyZ2V0LCBzcGVjcyk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH07XG5cbnZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHsgcmV0dXJuIGRlc2MudmFsdWU7IH0gZWxzZSB7IHZhciBnZXR0ZXIgPSBkZXNjLmdldDsgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTsgfSB9O1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG52YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogUm9vdCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5yb290ID0gcm9vdDtcblxuLyoqXG4gKiBCcmFuY2ggY29tcG9uZW50XG4gKi9cbmV4cG9ydHMuYnJhbmNoID0gYnJhbmNoO1xuLyoqXG4gKiBCYW9iYWItUmVhY3QgSGlnaGVyIE9yZGVyIENvbXBvbmVudFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogRVM2IGhpZ2hlciBvcmRlciBjb21wb25lbnQgdG8gZW5jaGFuY2Ugb25lJ3MgY29tcG9uZW50LlxuICovXG5cbnZhciBfUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX1JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9SZWFjdCk7XG5cbnZhciBfdHlwZSA9IHJlcXVpcmUoJy4vdXRpbHMvdHlwZS5qcycpO1xuXG52YXIgX3R5cGUyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX3R5cGUpO1xuXG52YXIgX1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vdXRpbHMvcHJvcC10eXBlcy5qcycpO1xuXG52YXIgX1Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfUHJvcFR5cGVzKTtcblxuZnVuY3Rpb24gcm9vdChDb21wb25lbnQsIHRyZWUpIHtcbiAgaWYgKCFfdHlwZTJbJ2RlZmF1bHQnXS5CYW9iYWIodHJlZSkpIHRocm93IEVycm9yKCdiYW9iYWItcmVhY3Q6aGlnaGVyLW9yZGVyLnJvb3Q6IGdpdmVuIHRyZWUgaXMgbm90IGEgQmFvYmFiLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIHZhciBfY2xhc3MgPSBmdW5jdGlvbiBDb21wb3NlZENvbXBvbmVudCgpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MpO1xuXG4gICAgICBpZiAoX1JlYWN0JENvbXBvbmVudCAhPSBudWxsKSB7XG4gICAgICAgIF9SZWFjdCRDb21wb25lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzcywgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBfY3JlYXRlQ2xhc3MoX2NsYXNzLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gSGFuZGxpbmcgY2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0cmVlOiB0cmVlXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncmVuZGVyJyxcblxuICAgICAgLy8gUmVuZGVyIHNoaW1cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBfUmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChDb21wb25lbnQsIHRoaXMucHJvcHMpO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjaGlsZENvbnRleHRUeXBlcycsXG4gICAgICB2YWx1ZToge1xuICAgICAgICB0cmVlOiBfUHJvcFR5cGVzMlsnZGVmYXVsdCddLmJhb2JhYlxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XSk7XG5cbiAgICByZXR1cm4gX2NsYXNzO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59XG5cbmZ1bmN0aW9uIGJyYW5jaChDb21wb25lbnQpIHtcbiAgdmFyIHNwZWNzID0gYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcblxuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLk9iamVjdChzcGVjcykpIHRocm93IEVycm9yKCdiYW9iYWItcmVhY3QuaGlnaGVyLW9yZGVyOiBpbnZhbGlkIHNwZWNpZmljYXRpb25zICcgKyAnKHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCBjdXJzb3JzIGFuZC9vciBmYWNldHMga2V5KS4nKTtcblxuICB2YXIgQ29tcG9zZWRDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQyKSB7XG4gICAgdmFyIF9jbGFzczIgPVxuXG4gICAgLy8gQnVpbGRpbmcgaW5pdGlhbCBzdGF0ZVxuICAgIGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgX2NsYXNzMik7XG5cbiAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKF9jbGFzczIucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcywgY29udGV4dCk7XG5cbiAgICAgIHZhciBmYWNldCA9IGNvbnRleHQudHJlZS5jcmVhdGVGYWNldChzcGVjcywgW3Byb3BzLCBjb250ZXh0XSk7XG5cbiAgICAgIGlmIChmYWNldCkgdGhpcy5zdGF0ZSA9IGZhY2V0LmdldCgpO1xuXG4gICAgICB0aGlzLmZhY2V0ID0gZmFjZXQ7XG4gICAgfTtcblxuICAgIF9pbmhlcml0cyhfY2xhc3MyLCBfUmVhY3QkQ29tcG9uZW50Mik7XG5cbiAgICBfY3JlYXRlQ2xhc3MoX2NsYXNzMiwgW3tcbiAgICAgIGtleTogJ2dldENoaWxkQ29udGV4dCcsXG5cbiAgICAgIC8vIENoaWxkIGNvbnRleHRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY3Vyc29yczogdGhpcy5mYWNldC5jdXJzb3JzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuXG4gICAgICAvLyBPbiBjb21wb25lbnQgbW91bnRcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZhY2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9dmFyIGhhbmRsZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5mYWNldC5nZXQoKSk7XG4gICAgICAgIH0pLmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5mYWNldC5vbigndXBkYXRlJywgaGFuZGxlcik7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncmVuZGVyJyxcblxuICAgICAgLy8gUmVuZGVyIHNoaW1cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiBfUmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChDb21wb25lbnQsIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB0aGlzLnN0YXRlKSk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuXG4gICAgICAvLyBPbiBjb21wb25lbnQgdW5tb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gUmVsZWFzaW5nIGZhY2V0XG4gICAgICAgIHRoaXMuZmFjZXQucmVsZWFzZSgpO1xuICAgICAgICB0aGlzLmZhY2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcblxuICAgICAgLy8gT24gbmV3IHByb3BzXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH10aGlzLmZhY2V0LnJlZnJlc2goW3Byb3BzLCB0aGlzLmNvbnRleHRdKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgIH1cbiAgICB9XSwgW3tcbiAgICAgIGtleTogJ29yaWdpbmFsJyxcbiAgICAgIHZhbHVlOiBDb21wb25lbnQsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIGN1cnNvcnM6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uY3Vyc29yc1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9XSk7XG5cbiAgICByZXR1cm4gX2NsYXNzMjtcbiAgfSkoX1JlYWN0MlsnZGVmYXVsdCddLkNvbXBvbmVudCk7XG5cbiAgcmV0dXJuIENvbXBvc2VkQ29tcG9uZW50O1xufSIsIi8qKlxuICogQmFvYmFiLVJlYWN0IEN1c3RvbSBQcm9wIFR5cGVzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogUHJvcFR5cGVzIHVzZWQgdG8gcHJvcGFnYXRlIGNvbnRleHQgc2FmZWx5LlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB0eXBlID0gcmVxdWlyZSgnLi90eXBlLmpzJyk7XG5cbmZ1bmN0aW9uIGVycm9yTWVzc2FnZShwcm9wTmFtZSwgd2hhdCkge1xuICByZXR1cm4gJ3Byb3AgdHlwZSBgJyArIHByb3BOYW1lICsgJ2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSAnICsgd2hhdCArICcuJztcbn1cblxudmFyIFByb3BUeXBlcyA9IHt9O1xuXG5Qcm9wVHlwZXMuYmFvYmFiID0gZnVuY3Rpb24gKHByb3BzLCBwcm9wTmFtZSkge1xuICBpZiAoIXR5cGUuQmFvYmFiKHByb3BzW3Byb3BOYW1lXSkpIHJldHVybiBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKHByb3BOYW1lLCAnYSBCYW9iYWIgdHJlZScpKTtcbn07XG5cblByb3BUeXBlcy5jdXJzb3JzID0gZnVuY3Rpb24gKHByb3BzLCBwcm9wTmFtZSkge1xuICB2YXIgcCA9IHByb3BzW3Byb3BOYW1lXTtcblxuICB2YXIgdmFsaWQgPSB0eXBlLk9iamVjdChwKSAmJiBPYmplY3Qua2V5cyhwKS5ldmVyeShmdW5jdGlvbiAoaykge1xuICAgIHJldHVybiB0eXBlLkN1cnNvcihwW2tdKTtcbiAgfSk7XG5cbiAgaWYgKCF2YWxpZCkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdCYW9iYWIgY3Vyc29ycycpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvcFR5cGVzOyIsIi8qKlxuICogQmFvYmFiLVJlYWN0IFR5cGUgQ2hlY2tpbmdcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFNvbWUgaGVscGVycyB0byBwZXJmb3JtIHJ1bnRpbWUgdmFsaWRhdGlvbnMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSB7fTtcblxudHlwZS5PYmplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbik7XG59O1xuXG50eXBlLkJhb2JhYiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEJhb2JhYl0nO1xufTtcblxudHlwZS5DdXJzb3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWx1ZS50b1N0cmluZygpID09PSAnW29iamVjdCBDdXJzb3JdJztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZTsiLCJpbXBvcnQgYWxlcnRGZXRjaE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWxcIjtcbmltcG9ydCBhbGVydEZldGNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1pbmRleFwiO1xuXG5pbXBvcnQgYWxlcnRMb2FkTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsXCI7XG5pbXBvcnQgYWxlcnRMb2FkSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1sb2FkLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydEFkZCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWFkZFwiO1xuaW1wb3J0IGFsZXJ0UmVtb3ZlIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtcmVtb3ZlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWxlcnQ6IHtcbiAgICBmZXRjaE1vZGVsOiBhbGVydEZldGNoTW9kZWwsXG4gICAgZmV0Y2hJbmRleDogYWxlcnRGZXRjaEluZGV4LFxuICAgIGxvYWRNb2RlbDogYWxlcnRMb2FkTW9kZWwsXG4gICAgbG9hZEluZGV4OiBhbGVydExvYWRJbmRleCxcbiAgICBhZGQ6IGFsZXJ0QWRkLFxuICAgIHJlbW92ZTogYWxlcnRSZW1vdmUsXG4gIH0sXG59OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0FsZXJ0fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gQWxlcnQobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IHVybCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG5cbiAgLy8gTm9ucGVyc2lzdGVudCBhZGRcbiAgc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJmZXRjaEluZGV4XCIpO1xuXG4gIGxldCB1cmwgPSBgYXBpL2FsZXJ0c2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeShmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG5cbiAgY3Vyc29yLm1lcmdlKHtcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICB0b3RhbDogMCxcbiAgICBtb2RlbHM6IHt9LFxuICB9KTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKDIwMCk7IC8vIEhUVFAgcmVzcG9uc2Uuc3RhdHVzXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmZXRjaE1vZGVsKGlkKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJmZXRjaE1vZGVsOlwiLCBpZCk7XG5cbiAgbGV0IHVybCA9IGAvYXBpL2FsZXJ0cy8ke2lkfWA7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG5cbiAgY3Vyc29yLnNldChcImxvYWRpbmdcIiwgZmFsc2UpO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCB7dG9PYmplY3QsIGZvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRJbmRleCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpO1xuICBsZXQgZmlsdGVycyA9IGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgc29ydHMgPSBjdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCBvZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgbGltaXQgPSBjdXJzb3IuZ2V0KFwibGltaXRcIik7XG4gIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgaWYgKCFpZHMpIHtcbiAgICBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWxlcnQtZmV0Y2gtbW9kZWxcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZE1vZGVsXCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBtb2RlbHMgPSBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpO1xuICBsZXQgaWQgPSBjdXJzb3IuZ2V0KFwiaWRcIik7XG5cbiAgbGV0IG1vZGVsID0gbW9kZWxzW2lkXTtcbiAgaWYgKCFtb2RlbCkge1xuICAgIGZldGNoTW9kZWwoaWQpO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCB1cmwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbi1wZXJzaXN0ZW50IHJlbW92ZVxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZ2V0QWxsTWV0aG9kcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZmlsdGVyKGtleSA9PiB0eXBlb2Ygb2JqW2tleV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gYXV0b0JpbmQob2JqKSB7XG4gIGdldEFsbE1ldGhvZHMob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSlcbiAgICAuZm9yRWFjaChtdGQgPT4ge1xuICAgICAgb2JqW210ZF0gPSBvYmpbbXRkXS5iaW5kKG9iaik7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9CaW5kKHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IEFib3V0IGZyb20gXCIuL2NvbXBvbmVudHMvYWJvdXRcIjtcbmltcG9ydCBCb2R5IGZyb20gXCIuL2NvbXBvbmVudHMvYm9keVwiO1xuaW1wb3J0IEhlYWRyb29tIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZHJvb21cIjtcbmltcG9ydCBIb21lIGZyb20gXCIuL2NvbXBvbmVudHMvaG9tZVwiO1xuXG5pbXBvcnQgRXJyb3IgZnJvbSBcIi4vY29tcG9uZW50cy9lcnJvclwiO1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gXCIuL2NvbXBvbmVudHMvbm90LWZvdW5kXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIjtcblxuaW1wb3J0IEludGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24taW50ZXJuYWxcIjtcbmltcG9ydCBFeHRlcm5hbFBhZ2luYXRpb24gZnJvbSBcIi4vY29tcG9uZW50cy9wYWdpbmF0aW9uLWV4dGVybmFsXCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9jb21wb25lbnRzL2xpbmtcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBBYm91dCwgQm9keSwgSGVhZHJvb20sIEhvbWUsXG4gIEVycm9yLCBOb3RGb3VuZCwgTG9hZGluZyxcbiAgSW50ZXJuYWxQYWdpbmF0aW9uLCBFeHRlcm5hbFBhZ2luYXRpb24sXG4gIExpbmssXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBMb2FkaW5nIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCI7XG5pbXBvcnQgTm90Rm91bmQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiO1xuaW1wb3J0IEFsZXJ0SXRlbSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaXRlbVwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW3N0YXRlLm1peGluXSxcblxuICBjdXJzb3JzOiB7XG4gICAgYWxlcnRzOiBbXCJhbGVydHNcIl0sXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmFsZXJ0cztcbiAgICBtb2RlbHMgPSB0b0FycmF5KG1vZGVscyk7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbnMgdG9wLWxlZnRcIj5cbiAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAge2xvYWRpbmcgPyA8TG9hZGluZy8+IDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIENhbid0IHJ1biB0aGlzIGNyYXAgZm9yIG5vdyBUT0RPIHJlY2hlY2sgYWZ0ZXIgdHJhbnNpdGlvbiB0byBXZWJwYWNrXG4vLyAxKSByZWFjdC9hZGRvbnMgcHVsbHMgd2hvbGUgbmV3IHJlYWN0IGNsb25lIGluIGJyb3dzZXJpZnlcbi8vIDIpIHJjLWNzcy10cmFuc2l0aW9uLWdyb3VwIGNvbnRhaW5zIHVuY29tcGlsZWQgSlNYIHN5bnRheFxuLy8gT01HIHdoYXQgYW4gaWRpb3RzICZfJlxuXG4vLzxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4vLyAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuLy88L0NTU1RyYW5zaXRpb25Hcm91cD5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7cm9vdH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmssIFJvdXRlSGFuZGxlcn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCI7XG5pbXBvcnQgQWxlcnRJbmRleCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQHJvb3Qoc3RhdGUpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLy9zdGF0aWMgbG9hZFBhZ2UocGFyYW1zLCBxdWVyeSkge1xuICAgIC8vIElnbm9yZSBwYXJhbXMgYW5kIHF1ZXJ5XG4gICAgLy8gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KTtcbiAgICAvL3JldHVybiBjb21tb25BY3Rpb25zLmFsZXJ0LmxvYWRQYWdlKCk7XG4gIC8vfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaGVhZHJvb21DbGFzc05hbWVzID0ge3Zpc2libGU6IFwibmF2YmFyLWRvd25cIiwgaGlkZGVuOiBcIm5hdmJhci11cFwifTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgIDxIZWFkcm9vbSBjb21wb25lbnQ9XCJoZWFkZXJcIiBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIHsvKjxBbGVydEluZGV4Lz4qL31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGxvYWRFcnJvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbXCJ4c1wiLCBcInNtXCIsIFwibWRcIiwgXCJsZ1wiXSksXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNpemU6IFwibWRcIixcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRXJyb3IgXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5zdGF0dXMgKyBcIjogXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5kZXNjcmlwdGlvbn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgXCJhbGVydC1hcy1pY29uXCI6IHRydWUsXG4gICAgICAgICAgXCJmYS1zdGFja1wiOiB0cnVlLFxuICAgICAgICAgIFt0aGlzLnByb3BzLnNpemVdOiB0cnVlXG4gICAgICAgIH0pfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3RhY2stMXhcIj48L2k+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtYmFuIGZhLXN0YWNrLTJ4XCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSBcImxvZGFzaC50aHJvdHRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRyb29tIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb21wb25lbnQ6IFwiZGl2XCIsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiB7XG4gICAgICB2aXNpYmxlOiBcIm5hdmJhci1kb3duXCIsXG4gICAgICBoaWRkZW46IFwibmF2YmFyLXVwXCJcbiAgICB9LFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgY2xhc3NOYW1lOiBcIlwiXG4gIH1cblxuICBoYXNTY3JvbGxlZCgpIHtcbiAgICBsZXQgdG9wUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAvLyBNYWtlIHN1cmUgdXNlcnMgc2Nyb2xsIG1vcmUgdGhhbiBkZWx0YVxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxhc3RTY3JvbGxUb3AgLSB0b3BQb3NpdGlvbikgPD0gdGhpcy5kZWx0YUhlaWdodCkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGhleSBzY3JvbGxlZCBkb3duIGFuZCBhcmUgcGFzdCB0aGUgbmF2YmFyLCBhZGQgY2xhc3MgYHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGVgLlxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHlvdSBuZXZlciBzZWUgd2hhdCBpcyBcImJlaGluZFwiIHRoZSBuYXZiYXIuXG4gICAgaWYgKHRvcFBvc2l0aW9uID4gdGhpcy5sYXN0U2Nyb2xsVG9wICYmIHRvcFBvc2l0aW9uID4gdGhpcy5lbGVtZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLmhpZGRlbn0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgodG9wUG9zaXRpb24gKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRvcFBvc2l0aW9uO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5wcm9wcy5jb21wb25lbnQ7XG4gICAgbGV0IHByb3BzID0ge2lkOiB0aGlzLnByb3BzLmlkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLnN0YXRlLmNsYXNzTmFtZX07XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBjb21wb25lbnQsXG4gICAgICBwcm9wcyxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYlwiPkJhb2JhYjwvYT4gSlMgZGF0YSB0cmVlIHdpdGggY3Vyc29yczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXJcIj5SZWFjdC1Sb3V0ZXI8L2E+IGRlY2xhcmF0aXZlIHJvdXRlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlYWN0LWRvY3VtZW50LXRpdGxlXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+IGRlY2xhcmF0aXZlIGRvY3VtZW50IHRpdGxlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL1wiPlJlYWN0LUJvb3RzdHJhcDwvYT4gQm9vdHN0cmFwIGNvbXBvbmVudHMgaW4gUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYnJvd3NlcmlmeS5vcmcvXCI+QnJvd3NlcmlmeTwvYT4gJmFtcDsgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay93YXRjaGlmeVwiPldhdGNoaWZ5PC9hPiBidW5kbGUgTlBNIG1vZHVsZXMgdG8gZnJvbnRlbmQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYm93ZXIuaW8vXCI+Qm93ZXI8L2E+IGZyb250ZW5kIHBhY2thZ2UgbWFuYWdlcjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9leHByZXNzanMuY29tL1wiPkV4cHJlc3M8L2E+IHdlYi1hcHAgYmFja2VuZCBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW96aWxsYS5naXRodWIuaW8vbnVuanVja3MvXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9lbGVpdGgvZW1haWxqc1wiPkVtYWlsSlM8L2E+IFNNVFAgY2xpZW50PC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IEpTIHRyYW5zcGlsZXI8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ3VscGpzLmNvbS9cIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9sb2Rhc2guY29tL1wiPkxvZGFzaDwvYT4gdXRpbGl0eSBsaWJyYXJ5PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcIj5BeGlvczwvYT4gcHJvbWlzZS1iYXNlZCBIVFRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RSb3V0ZXIgZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgbGV0IHBhcmFtcyA9IGN1cnNvci5nZXQoXCJwYXJhbXNcIik7XG4gICAgbGV0IHF1ZXJ5ID0gY3Vyc29yLmdldChcInF1ZXJ5XCIpO1xuXG4gICAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG4gICAgaWYgKHByb3BzLndpdGhQYXJhbXMpIHtcbiAgICAgIHByb3BzLndpdGhQYXJhbXMgPSBwcm9wcy53aXRoUGFyYW1zID09PSB0cnVlID8ge30gOiBwcm9wcy53aXRoUGFyYW1zO1xuICAgICAgcHJvcHMucGFyYW1zID0gbWVyZ2Uoe30sIHBhcmFtcywgcHJvcHMud2l0aFBhcmFtcyk7XG4gICAgICBkZWxldGUgcHJvcHMud2l0aFBhcmFtcztcbiAgICB9XG4gICAgaWYgKHByb3BzLndpdGhRdWVyeSkge1xuICAgICAgcHJvcHMud2l0aFF1ZXJ5ID0gcHJvcHMud2l0aFF1ZXJ5ID09PSB0cnVlID8ge30gOiBwcm9wcy53aXRoUXVlcnk7XG4gICAgICBwcm9wcy5xdWVyeSA9IG1lcmdlKHt9LCBxdWVyeSwgcHJvcHMud2l0aFF1ZXJ5KTtcbiAgICAgIGRlbGV0ZSBwcm9wcy53aXRoUXVlcnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxSZWFjdFJvdXRlci5MaW5rIHsuLi5wcm9wc30+XG4gICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICA8L1JlYWN0Um91dGVyLkxpbms+O1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImFsZXJ0LWFzLWljb25cIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdEZvdW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IExpbmsgZnJvbSBcIi4vbGlua1wiO1xuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0ZXJuYWxQYWdpbmF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbmRwb2ludDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb2Zmc2V0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbGltaXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHRvdGFsUGFnZXMoKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnByb3BzLnRvdGFsIC8gdGhpcy5wcm9wcy5saW1pdCk7XG4gIH1cblxuICBtYXhPZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcygpICogdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHByZXZPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA8PSAwID8gMCA6IG9mZnNldCAtIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBuZXh0T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPj0gdGhpcy5tYXhPZmZzZXQoKSA/IHRoaXMubWF4T2Zmc2V0KCkgOiBvZmZzZXQgKyB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBlbmRwb2ludCA9IHRoaXMucHJvcHMuZW5kcG9pbnQ7XG4gICAgbGV0IGxpbWl0ID0gdGhpcy5wcm9wcy5saW1pdDtcbiAgICBsZXQgY3Vyck9mZnNldCA9IHRoaXMucHJvcHMub2Zmc2V0O1xuICAgIGxldCBwcmV2T2Zmc2V0ID0gdGhpcy5wcmV2T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbmV4dE9mZnNldCA9IHRoaXMubmV4dE9mZnNldCh0aGlzLnByb3BzLm9mZnNldCk7XG4gICAgbGV0IG1pbk9mZnNldCA9IDA7XG4gICAgbGV0IG1heE9mZnNldCA9IHRoaXMubWF4T2Zmc2V0KCk7XG5cbiAgICBpZiAodGhpcy50b3RhbFBhZ2VzKCkgPiAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IHByZXZPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtvZmZzZXR9PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3twYWdlOiB7b2Zmc2V0fX19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2Rpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IG5leHRPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8bmF2Lz47XG4gICAgfVxuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IExpbmsgZnJvbSBcIi4vbGlua1wiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcm5hbFBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG9uQ2xpY2s6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdG90YWw6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvZmZzZXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsaW1pdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB9XG5cbiAgdG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMucHJvcHMudG90YWwgLyB0aGlzLnByb3BzLmxpbWl0KTtcbiAgfVxuXG4gIG1heE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzKCkgKiB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcHJldk9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0IDw9IDAgPyAwIDogb2Zmc2V0IC0gdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIG5leHRPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA+PSB0aGlzLm1heE9mZnNldCgpID8gdGhpcy5tYXhPZmZzZXQoKSA6IG9mZnNldCArIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG9uQ2xpY2sgPSB0aGlzLnByb3BzLm9uQ2xpY2s7XG4gICAgbGV0IGxpbWl0ID0gdGhpcy5wcm9wcy5saW1pdDtcbiAgICBsZXQgY3Vyck9mZnNldCA9IHRoaXMucHJvcHMub2Zmc2V0O1xuICAgIGxldCBwcmV2T2Zmc2V0ID0gdGhpcy5wcmV2T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbmV4dE9mZnNldCA9IHRoaXMubmV4dE9mZnNldCh0aGlzLnByb3BzLm9mZnNldCk7XG4gICAgbGV0IG1pbk9mZnNldCA9IDA7XG4gICAgbGV0IG1heE9mZnNldCA9IHRoaXMubWF4T2Zmc2V0KCk7XG5cbiAgICBpZiAodGhpcy50b3RhbFBhZ2VzKCkgPiAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhwcmV2T2Zmc2V0KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWluT2Zmc2V0fSl9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtwcmV2T2Zmc2V0fWB9PlxuICAgICAgICAgICAgICAgIDxzcGFuPiZsYXF1bzs8L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtvZmZzZXR9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhvZmZzZXQpfVxuICAgICAgICAgICAgICAgICAgICBxdWVyeT17e1wicGFnZVtvZmZzZXRdXCI6IG9mZnNldH19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogb2Zmc2V0ID09IGN1cnJPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtvZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtvZmZzZXR9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhuZXh0T2Zmc2V0KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWF4T2Zmc2V0fSl9XG4gICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtuZXh0T2Zmc2V0fWB9PlxuICAgICAgICAgICAgICAgIDxzcGFuPiZyYXF1bzs8L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8bmF2Lz47XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEFsZXJ0IGZyb20gXCIuL21vZGVscy9hbGVydFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7QWxlcnR9OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBVVUlEIGZyb20gXCJub2RlLXV1aWRcIjtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICBpZiAoIWRhdGEubWVzc2FnZSkge1xuICAgIHRocm93IEVycm9yKFwiYGRhdGEubWVzc2FnZWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgaWYgKCFkYXRhLmNhdGVnb3J5KSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5jYXRlZ29yeWAgaXMgcmVxdWlyZWRcIik7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgIGlkOiBVVUlELnY0KCksXG4gICAgY2xvc2FibGU6IHRydWUsXG4gICAgZXhwaXJlOiBkYXRhLmNhdGVnb3J5ID09IFwiZXJyb3JcIiA/IDAgOiA1MDAwLFxuICB9LCBkYXRhKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBQUk9YWSBST1VURVIgVE8gUkVNT1ZFIENJUkNVTEFSIERFUEVOREVOQ1kgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUdXJuczpcbi8vICAgYXBwIChyb3V0ZXIpIDwtIHJvdXRlcyA8LSBjb21wb25lbnRzIDwtIGFjdGlvbnMgPC0gYXBwIChyb3V0ZXIpXG4vLyB0bzpcbi8vICAgYXBwIChyb3V0ZXIpIDwtIHJvdXRlcyA8LSBjb21wb25lbnRzIDwtIGFjdGlvbnMgPC0gcHJveHkgKHJvdXRlcilcbmxldCBwcm94eSA9IHtcbiAgbWFrZVBhdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQpIHtcbiAgICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICAgIHJldHVybiB3aW5kb3cuX3JvdXRlci5tYWtlUGF0aChcbiAgICAgIHJvdXRlIHx8IGN1cnNvci5nZXQoXCJyb3V0ZVwiKSxcbiAgICAgIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLFxuICAgICAgcXVlcnkgfHwgY3Vyc29yLmdldChcInF1ZXJ5XCIpXG4gICAgKTtcbiAgfSxcblxuICBtYWtlSHJlZihyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VIcmVmKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyhyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgd2luZG93Ll9yb3V0ZXIudHJhbnNpdGlvblRvKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIHJlcGxhY2VXaXRoKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci5yZXBsYWNlV2l0aChcbiAgICAgIHJvdXRlIHx8IGN1cnNvci5nZXQoXCJyb3V0ZVwiKSxcbiAgICAgIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLFxuICAgICAgcXVlcnkgfHwgY3Vyc29yLmdldChcInF1ZXJ5XCIpXG4gICAgKTtcbiAgfSxcblxuICBnb0JhY2soKSB7XG4gICAgd2luZG93Ll9yb3V0ZXIuZ29CYWNrKCk7XG4gIH0sXG5cbiAgcnVuKHJlbmRlcikge1xuICAgIHdpbmRvdy5fcm91dGVyLnJ1bihyZW5kZXIpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcm94eTtcblxuXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQmFvYmFiIGZyb20gXCJiYW9iYWJcIjtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IEVYQU1QTEUgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCwgLy8ge3B1Ymxpc2hlZDogdHJ1ZX0gfHwgdW5kZWZpbmVkXG4gIFNPUlRTOiB1bmRlZmluZWQsICAgLy8gW1wiK3B1Ymxpc2hlZEF0XCIsIFwiLWlkXCJdIHx8IHVuZGVmaW5lZFxuICBPRkZTRVQ6IDAsICAgICAgICAgIC8vIDAgfHwgLTFcbiAgTElNSVQ6IDIwLCAgICAgICAgICAvLyAxMCB8fCAyMCB8fCA1MCAuLi5cbn07XG5cbmV4cG9ydCBjb25zdCBST0JPVCA9IHtcbiAgRklMVEVSUzoge30sXG4gIFNPUlRTOiBbXCIrbmFtZVwiXSxcbiAgT0ZGU0VUOiAwLFxuICBMSU1JVDogNSxcbn07XG5cbmV4cG9ydCBjb25zdCBBTEVSVCA9IHtcbiAgRklMVEVSUzoge30sXG4gIFNPUlRTOiBbXCIrY3JlYXRlZE9uXCJdLFxuICBPRkZTRVQ6IDAsXG4gIExJTUlUOiA1LFxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQmFvYmFiKFxuICB7IC8vIERBVEFcbiAgICB1cmw6IHtcbiAgICAgIGhhbmRsZXI6IHVuZGVmaW5lZCxcbiAgICAgIHBhcmFtczogdW5kZWZpbmVkLFxuICAgICAgcXVlcnk6IHVuZGVmaW5lZCxcbiAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICBmaWx0ZXJzOiB1bmRlZmluZWQsXG4gICAgICBzb3J0czogdW5kZWZpbmVkLFxuICAgICAgb2Zmc2V0OiB1bmRlZmluZWQsXG4gICAgICBsaW1pdDogdW5kZWZpbmVkLFxuICAgIH0sXG5cbiAgICByb2JvdHM6IHtcbiAgICAgIC8vIERBVEFcbiAgICAgIG1vZGVsczoge30sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIHBhZ2luYXRpb246IHt9LFxuXG4gICAgICAvLyBMT0FEIEFSVEVGQUNUU1xuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuXG4gICAgICAvLyBJTkRFWFxuICAgICAgZmlsdGVyczogUk9CT1QuRklMVEVSUyxcbiAgICAgIHNvcnRzOiBST0JPVC5TT1JUUyxcbiAgICAgIG9mZnNldDogUk9CT1QuT0ZGU0VULFxuICAgICAgbGltaXQ6IFJPQk9ULkxJTUlULFxuXG4gICAgICAvLyBNT0RFTFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuXG4gICAgYWxlcnRzOiB7XG4gICAgICAvLyBEQVRBXG4gICAgICBtb2RlbHM6IHt9LFxuICAgICAgdG90YWw6IDAsXG4gICAgICBwYWdpbmF0aW9uOiB7fSxcblxuICAgICAgLy8gTE9BRCBBUlRFRkFDVFNcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcblxuICAgICAgLy8gSU5ERVhcbiAgICAgIGZpbHRlcnM6IEFMRVJULkZJTFRFUlMsXG4gICAgICBzb3J0czogQUxFUlQuU09SVFMsXG4gICAgICBvZmZzZXQ6IEFMRVJULk9GRlNFVCxcbiAgICAgIGxpbWl0OiBBTEVSVC5MSU1JVCxcblxuICAgICAgLy8gTU9ERUxcbiAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgfSxcbiAgeyAvLyBPUFRJT05TXG4gICAgZmFjZXRzOiB7XG4gICAgICBjdXJyZW50Um9ib3Q6IHtcbiAgICAgICAgY3Vyc29yczoge1xuICAgICAgICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IHttb2RlbHMsIGlkfSA9IGRhdGEucm9ib3RzO1xuICAgICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZGVsc1tpZF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjdXJyZW50Um9ib3RzOiB7XG4gICAgICAgIGN1cnNvcnM6IHtcbiAgICAgICAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCB7bW9kZWxzLCBwYWdpbmF0aW9uLCBvZmZzZXR9ID0gZGF0YS5yb2JvdHM7XG4gICAgICAgICAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgICAgICAgICBpZiAoaWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gaWRzLm1hcChpZCA9PiBtb2RlbHNbaWRdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuKTtcblxuLypcbkNoYW5nZSBmaWx0ZXJzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIHNvcnRzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIG9mZnNldDpcbiAgLy9pZiBjYW4ndCBiZSBsb2FkZWQ6XG4gIC8vICBmZXRjaCFcbiAgLy8gdXBkYXRlIHBhZ2luYXRpb25cbiAgcmVkaXJlY3QgdG8gbmV3IG9mZnNldCFcblxuQ2hhbmdlIGxpbWl0OlxuICByZWRpcmVjdCB0byBvZmZzZXQgPSAwISB8fCByZWJ1aWxkIHBhZ2luYXRpb24gYW5kIGlmIGNhbid0IGJlIGxvYWRlZDogZmV0Y2hcbiovIiwiaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1pbmRleFwiO1xuXG5pbXBvcnQgbG9hZE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvbG9hZC1tb2RlbFwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtaW5kZXhcIjtcblxuaW1wb3J0IHNldEZpbHRlcnMgZnJvbSBcIi4vYWN0aW9ucy9zZXQtZmlsdGVyc1wiO1xuaW1wb3J0IHNldFNvcnRzIGZyb20gXCIuL2FjdGlvbnMvc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL2FjdGlvbnMvc2V0LW9mZnNldFwiO1xuaW1wb3J0IHNldExpbWl0IGZyb20gXCIuL2FjdGlvbnMvc2V0LWxpbWl0XCI7XG5pbXBvcnQgc2V0SWQgZnJvbSBcIi4vYWN0aW9ucy9zZXQtaWRcIjtcblxuaW1wb3J0IGVzdGFibGlzaE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLW1vZGVsXCI7XG5pbXBvcnQgZXN0YWJsaXNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9lc3RhYmxpc2gtaW5kZXhcIjtcbmltcG9ydCBlc3RhYmxpc2hQYWdlIGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLXBhZ2VcIjtcblxuaW1wb3J0IGFkZCBmcm9tIFwiLi9hY3Rpb25zL2FkZFwiO1xuaW1wb3J0IGVkaXQgZnJvbSBcIi4vYWN0aW9ucy9lZGl0XCI7XG5pbXBvcnQgcmVtb3ZlIGZyb20gXCIuL2FjdGlvbnMvcmVtb3ZlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZmV0Y2hNb2RlbCwgZmV0Y2hJbmRleCxcbiAgbG9hZE1vZGVsLCBsb2FkSW5kZXgsXG4gIHNldEZpbHRlcnMsIHNldFNvcnRzLCBzZXRPZmZzZXQsIHNldExpbWl0LFxuICBlc3RhYmxpc2hNb2RlbCwgZXN0YWJsaXNoSW5kZXgsIGVzdGFibGlzaFBhZ2UsXG4gIGFkZCwgZWRpdCwgcmVtb3ZlXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3QgZnJvbSBcImZyb250ZW5kL3JvYm90L21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IHVybCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG5ld01vZGVsKTtcblxuICByZXR1cm4gQXhpb3MucHV0KHVybCwgbmV3TW9kZWwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yOiB1bmRlZmluZWR9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgfTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yfSk7XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7IC8vIENhbmNlbCBhZGRcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5hZGRgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGFkZFxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcbmltcG9ydCBSb2JvdCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVkaXQobW9kZWwpIHtcbiAgbGV0IG5ld01vZGVsID0gUm9ib3QobW9kZWwpO1xuICBsZXQgaWQgPSBuZXdNb2RlbC5pZDtcbiAgbGV0IG9sZE1vZGVsID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IHVybCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dCh1cmwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgIH0pO1xuICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBzdWNjZWVkXCIsIGNhdGVnb3J5OiBcInN1Y2Nlc3NcIn0pO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICB9KVxuICAgIC5jYXRjaChyZXNwb25zZSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsb2FkRXJyb3IgPSB7XG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgfTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtsb2FkaW5nOiBmYWxzZSwgbG9hZEVycm9yfSk7XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuc2V0KG9sZE1vZGVsKTsgLy8gQ2FuY2VsIGVkaXRcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5lZGl0YCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXNcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIGVkaXRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcbmltcG9ydCBzZXRGaWx0ZXJzIGZyb20gXCIuL3NldC1maWx0ZXJzXCI7XG5pbXBvcnQgc2V0U29ydHMgZnJvbSBcIi4vc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL3NldC1vZmZzZXRcIjtcbmltcG9ydCBzZXRMaW1pdCBmcm9tIFwiLi9zZXQtbGltaXRcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuXG4gIHNldEZpbHRlcnMoY3Vyc29yLmdldChcImZpbHRlcnNcIikpO1xuICBzZXRTb3J0cyhjdXJzb3IuZ2V0KFwic29ydHNcIikpO1xuICBzZXRPZmZzZXQoY3Vyc29yLmdldChcIm9mZnNldFwiKSk7XG4gIHNldExpbWl0KGN1cnNvci5nZXQoXCJsaW1pdFwiKSk7XG5cbiAgbG9hZEluZGV4KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZE1vZGVsIGZyb20gXCIuL2xvYWQtbW9kZWxcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoTW9kZWwoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hNb2RlbFwiKTtcblxuICBsZXQgdXJsQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICBsZXQgcm9ib3RzQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgdXJsSWQgPSB1cmxDdXJzb3IuZ2V0KFwiaWRcIik7XG5cbiAgaWYgKHVybElkKSB7XG4gICAgcm9ib3RzQ3Vyc29yLnNldChcImlkXCIsIHVybElkKTtcbiAgfVxuICBzdGF0ZS5jb21taXQoKTtcblxuICBsb2FkTW9kZWwoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hQYWdlKHBhcmFtcywgcXVlcnkpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaFBhZ2U6XCIsIHBhcmFtcywgcXVlcnkpO1xuXG4gIC8vbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcblxuICAvLyBDSEFOR0UgU1RBVEVcbiAgLy8gPz8/XG4gIC8vc3RhdGUuY29tbWl0KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hJbmRleFwiKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzL2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9KTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAvLyBDdXJyZW50IHN0YXRlXG4gICAgICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgICAgIC8vIE5ldyBkYXRhXG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBmZXRjaGVkTW9kZWxzID0gdG9PYmplY3QoZGF0YSk7XG5cbiAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgY3Vyc29yLm1lcmdlKHtcbiAgICAgICAgdG90YWw6IG1ldGEucGFnZSAmJiBtZXRhLnBhZ2UudG90YWwgfHwgT2JqZWN0LmtleXMobW9kZWxzKS5sZW5ndGgsXG4gICAgICAgIG1vZGVsczogT2JqZWN0LmFzc2lnbihtb2RlbHMsIGZldGNoZWRNb2RlbHMpLFxuICAgICAgICBwYWdpbmF0aW9uOiBPYmplY3QuYXNzaWduKHBhZ2luYXRpb24sIHtbb2Zmc2V0XTogT2JqZWN0LmtleXMoZmV0Y2hlZE1vZGVscyl9KSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaFBhZ2VgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCB7dG9PYmplY3R9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hNb2RlbChpZCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hNb2RlbDpcIiwgaWQpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL2N1cnNvci5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9jdXJzb3Iuc2VsZWN0KFwibW9kZWxzXCIpLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgLy8gV09SS0FST1VORDpcbiAgICAgIGN1cnNvci5hcHBseShyb2JvdHMgPT4ge1xuICAgICAgICBsZXQgbW9kZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLm1vZGVscyk7XG4gICAgICAgIG1vZGVsc1ttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJvYm90cywge1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgIG1vZGVsczogbW9kZWxzLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaE1vZGVsYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hJbmRleCBmcm9tIFwiLi9mZXRjaC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkSW5kZXhcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGZpbHRlcnMgPSBjdXJzb3IuZ2V0KFwiZmlsdGVyc1wiKTtcbiAgbGV0IHNvcnRzID0gY3Vyc29yLmdldChcInNvcnRzXCIpO1xuICBsZXQgb2Zmc2V0ID0gY3Vyc29yLmdldChcIm9mZnNldFwiKTtcbiAgbGV0IGxpbWl0ID0gY3Vyc29yLmdldChcImxpbWl0XCIpO1xuICBsZXQgcGFnaW5hdGlvbiA9IGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpO1xuXG4gIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gIGlmICghaWRzIHx8IGlkcy5sZW5ndGggPCBsaW1pdCkge1xuICAgIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hNb2RlbCBmcm9tIFwiLi9mZXRjaC1tb2RlbFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkTW9kZWwoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkTW9kZWxcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IG1vZGVscyA9IGN1cnNvci5nZXQoXCJtb2RlbHNcIik7XG4gIGxldCBpZCA9IGN1cnNvci5nZXQoXCJpZFwiKTtcblxuICBsZXQgbW9kZWwgPSBtb2RlbHNbaWRdO1xuICBpZiAoIW1vZGVsKSB7XG4gICAgZmV0Y2hNb2RlbChpZCk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgcmVtb3ZlXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xuXG4gIHJldHVybiBBeGlvcy5kZWxldGUodXJsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7XG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IGxvYWRFcnJvcixcbiAgICAgIH0pO1xuICAgICAgcm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIpO1xuICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIHN1Y2NlZWRcIiwgY2F0ZWdvcnk6IFwic3VjY2Vzc1wifSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9O1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQob2xkTW9kZWwpOyAvLyBDYW5jZWwgcmVtb3ZlXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QucmVtb3ZlYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGlzRXF1YWwgZnJvbSBcImxvZGFzaC5pc2VxdWFsXCI7XG5pbXBvcnQgZmluZFdoZXJlIGZyb20gXCJsb2Rhc2guZmluZHdoZXJlXCI7XG5cbmltcG9ydCB7Y2h1bmtlZCwgZm9ybWF0SnNvbkFwaVF1ZXJ5LCBmbGF0dGVuQXJyYXlHcm91cCwgZmlyc3RMZXNzZXJPZmZzZXR9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSwge1JPQk9UfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldEZpbHRlcnMoZmlsdGVycz1ST0JPVC5GSUxURVJTKSB7XG4gIGNvbnNvbGUuZGVidWcoYHNldEZpbHRlcnMoJHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKCFpc0VxdWFsKGZpbHRlcnMsIGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJmaWx0ZXJzXCIsIGZpbHRlcnMpO1xuICAgIGxldCBwYWdpbmF0aW9uTGVuZ3RoID0gZmxhdHRlbkFycmF5R3JvdXAoY3Vyc29yLmdldChcInBhZ2luYXRpb25cIikpLmxlbmd0aDtcbiAgICBpZiAocGFnaW5hdGlvbkxlbmd0aCAmJiBwYWdpbmF0aW9uTGVuZ3RoID49IGN1cnNvci5nZXQoXCJ0b3RhbFwiKSkge1xuICAgICAgLy8gRnVsbCBpbmRleCBsb2FkZWQg4oCTIGNhbiByZWNhbGN1bGF0ZSBwYWdpbmF0aW9uXG4gICAgICBjb25zb2xlLmxvZyhcIkZ1bGwgaW5kZXggbG9hZGVkLCByZWNhbGN1bGF0aW5nIHBhZ2luYXRpb24uLi5cIik7XG4gICAgICBsZXQgcGFnaW5hdGlvbiA9IHJlY2FsY3VsYXRlUGFnaW5hdGlvbldpdGhGaWx0ZXJzKFxuICAgICAgICBjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKSwgZmlsdGVycywgY3Vyc29yLmdldChcIm1vZGVsc1wiKSwgY3Vyc29yLmdldChcImxpbWl0XCIpXG4gICAgICApO1xuICAgICAgaWYgKCFwYWdpbmF0aW9uW2N1cnNvci5nZXQoXCJvZmZzZXRcIildKSB7XG4gICAgICAgIC8vIE51bWJlciBvZiBwYWdlcyByZWR1Y2VkIC0gcmVkaXJlY3QgdG8gY2xvc2VzdFxuICAgICAgICBsZXQgb2Zmc2V0ID0gZmlyc3RMZXNzZXJPZmZzZXQocGFnaW5hdGlvbiwgY3Vyc29yLmdldChcIm9mZnNldFwiKSk7XG4gICAgICAgIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7b2Zmc2V0fSk7XG4gICAgICAgIHJvdXRlci50cmFuc2l0aW9uVG8odW5kZWZpbmVkLCB1bmRlZmluZWQsIHF1ZXJ5KTtcbiAgICAgIH1cbiAgICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQYXJ0IG9mIGluZGV4IGxvYWRlZCDigJMgY2FuIG9ubHkgcmVzZXRcbiAgICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHt9KTtcbiAgICB9XG4gICAgc3RhdGUuY29tbWl0KCk7XG4gIH1cbn1cblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgYHBhZ2luYXRpb25gIHdpdGggbmV3IGBmaWx0ZXJzYFxuICogTWF5IGJlIGFwcGxpZWQgb25seSB3aGVuIGBtb2RlbHMubGVuZ3RoID09IHRvdGFsYCwgc28gYG1vZGVsc2BcbiAqIHJlcHJlc2VudCBmdWxsIHNldCBvZiBpZHMgYW5kIGBwYWdpbmF0aW9uYCBjYW4gdGhlbiBiZSByZWNyZWF0ZWQgZnJvbSBzY3JhdGguXG4gKiBAcHVyZVxuICogQHBhcmFtIHBhZ2luYXRpb24ge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSBpbnB1dCBwYWdpbmF0aW9uXG4gKiBAcGFyYW0gZmlsdGVycyB7bnVtYmVyfSAtIG5ldyBmaWx0ZXJzXG4gKiBAcGFyYW0gbW9kZWxzIHtPYmplY3Q8c3RyaW5nLCBPYmplY3Q+fSAtIG9iaiBvZiBtb2RlbHNcbiAqIEBwYXJhbSBsaW1pdCB7bnVtYmVyfSAtIGN1cnJlbnQgbGltaXRcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBBcnJheT59IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aEZpbHRlcnMocGFnaW5hdGlvbiwgZmlsdGVycywgbW9kZWxzLCBsaW1pdCkge1xuICBpZiAoIXBhZ2luYXRpb24gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHBhZ2luYXRpb24gbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7cGFnaW5hdGlvbn1gKTtcbiAgfVxuICBpZiAoIWZpbHRlcnMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGZpbHRlcnMgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7ZmlsdGVyc31gKTtcbiAgfVxuICBpZiAoIW1vZGVscyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbW9kZWxzIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke21vZGVsc31gKTtcbiAgfVxuICBpZiAodHlwZW9mIGxpbWl0ICE9IFwibnVtYmVyXCIgfHwgbGltaXQgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbGltaXQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciwgZ290ICR7bGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGlmIChPYmplY3Qua2V5cyhmaWx0ZXJzKS5sZW5ndGgpIHtcbiAgICAgIGxldCB1bmZpbHRlcmVkTW9kZWxzID0gT2JqZWN0LnZhbHVlcyhtb2RlbHMpO1xuICAgICAgbGV0IGZpbHRlcmVkTW9kZWxzID0gZmluZFdoZXJlKHVuZmlsdGVyZWRNb2RlbHMsIGZpbHRlcnMpO1xuICAgICAgcmV0dXJuIGNodW5rZWQoZmlsdGVyZWRNb2RlbHMubWFwKG0gPT4gbS5pZCksIGxpbWl0KS5yZWR1Y2UoKG9iaiwgaWRzLCBpKSA9PiB7XG4gICAgICAgIG9ialtpICogbGltaXRdID0gaWRzO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFnaW5hdGlvbjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQoaWQpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0SWQoJHtpZH0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKGlkICE9IGN1cnNvci5nZXQoXCJpZFwiKSkge1xuICAgIGN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gICAgc3RhdGUuY29tbWl0KCk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgZmlsdGVyIGZyb20gXCJsb2Rhc2guZmlsdGVyXCI7XG5pbXBvcnQgc29ydEJ5IGZyb20gXCJsb2Rhc2guc29ydGJ5XCI7XG5cbmltcG9ydCB7Y2h1bmtlZCwgZm9ybWF0SnNvbkFwaVF1ZXJ5LCBmaXJzdExlc3Nlck9mZnNldH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlLCB7Uk9CT1R9IGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0TGltaXQobGltaXQ9Uk9CT1QuTElNSVQpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0TGltaXQoJHtsaW1pdH0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKGxpbWl0ICE9IGN1cnNvci5nZXQoXCJsaW1pdFwiKSkge1xuICAgIGNvbnNvbGUuZGVidWcoXCJSZWNhbGN1bGF0aW5nIHBhZ2luYXRpb24uLi5cIik7XG4gICAgY3Vyc29yLnNldChcImxpbWl0XCIsIGxpbWl0KTtcbiAgICBsZXQgcGFnaW5hdGlvbiA9IHJlY2FsY3VsYXRlUGFnaW5hdGlvbldpdGhMaW1pdChcbiAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBsaW1pdFxuICAgICk7XG4gICAgaWYgKCFwYWdpbmF0aW9uW2N1cnNvci5nZXQoXCJvZmZzZXRcIildKSB7XG4gICAgICAvLyBOdW1iZXIgb2YgcGFnZXMgcmVkdWNlZCAtIHJlZGlyZWN0IHRvIGNsb3Nlc3RcbiAgICAgIGxldCBvZmZzZXQgPSBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgICAgIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7b2Zmc2V0fSk7XG4gICAgICByb3V0ZXIudHJhbnNpdGlvblRvKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBxdWVyeSk7XG4gICAgfVxuICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogUmVjYWxjdWxhdGVzIGBwYWdpbmF0aW9uYCB3aXRoIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIE1heSBiZSBhcHBsaWVkIHdoZW4gYG1vZGVscy5sZW5ndGggIT0gdG90YWxgLCBzb1xuICogYHBhZ2luYXRpb25gIGNhbid0IGJlIHJlY3JlYXRlZCBmcm9tIHNjcmF0aC5cbiAqICogU3VwcG9ydHMgaW52YWxpZCBkYXRhIGxpa2Ugb3ZlcmxhcHBpbmcgb2Zmc2V0c1xuICogQHB1cmVcbiAqIEBwYXJhbSBwYWdpbmF0aW9uIHtPYmplY3R9IC0gaW5wdXQgcGFnaW5hdGlvblxuICogQHBhcmFtIGxpbWl0IHtOdW1iZXJ9IC0gbmV3IGxpbWl0IChwZXJwYWdlKVxuICogQHJldHVybnMge09iamVjdH0gLSByZWNhbGN1bGF0ZWQgcGFnaW5hdGlvblxuICovXG5mdW5jdGlvbiByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQocGFnaW5hdGlvbiwgbGltaXQpIHtcbiAgaWYgKCFwYWdpbmF0aW9uIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBwYWdpbmF0aW9uIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke3BhZ2luYXRpb259YCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBsaW1pdCAhPSBcIm51bWJlclwiIHx8IGxpbWl0IDw9IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbWl0IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIsIGdvdCAke2xpbWl0fWApO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5sZW5ndGgpIHtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgT2JqZWN0LmtleXMocGFnaW5hdGlvbikpO1xuICAgIGxldCBsZW5ndGggPSBtYXhPZmZzZXQgKyBwYWdpbmF0aW9uW21heE9mZnNldF0ubGVuZ3RoO1xuICAgIGxldCBvZmZzZXRzID0gc29ydEJ5KE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLm1hcCh2ID0+IHBhcnNlSW50KHYpKSk7XG4gICAgbGV0IGlkcyA9IG9mZnNldHNcbiAgICAgIC5yZWR1Y2UoKG1lbW8sIG9mZnNldCkgPT4ge1xuICAgICAgICBwYWdpbmF0aW9uW29mZnNldF0uZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgICAgICBtZW1vW29mZnNldCArIGldID0gaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgIH0sIEFycmF5KGxlbmd0aCkpO1xuICAgIC8vID0+IFssLCwsLDEsMiwzLDQsNSwsLCwsXVxuICAgIHJldHVybiBjaHVua2VkKGlkcywgbGltaXQpLnJlZHVjZSgob2JqLCBvZmZzZXRJZHMsIGkpID0+IHtcbiAgICAgIG9mZnNldElkcyA9IGZpbHRlcihvZmZzZXRJZHMpO1xuICAgICAgaWYgKGlkcy5sZW5ndGgpIHtcbiAgICAgICAgb2JqW2kgKiBsaW1pdF0gPSBvZmZzZXRJZHM7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTsgLy8gPT4gezU6IFsxLCAyLCAzLCA0LCA1XX1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQob2Zmc2V0PVJPQk9ULk9GRlNFVCkge1xuICBjb25zb2xlLmRlYnVnKGBzZXRPZmZzZXQoJHtvZmZzZXR9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmIChvZmZzZXQgIT0gY3Vyc29yLmdldChcIm9mZnNldFwiKSkge1xuICAgIGN1cnNvci5zZXQoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBpc0VxdWFsIGZyb20gXCJsb2Rhc2guaXNlcXVhbFwiO1xuaW1wb3J0IHNvcnRCeU9yZGVyIGZyb20gXCJsb2Rhc2guc29ydGJ5b3JkZXJcIjtcbmltcG9ydCB7Y2h1bmtlZCwgbG9kYXNoaWZ5U29ydHMsIGZsYXR0ZW5BcnJheUdyb3VwLCBmaXJzdExlc3Nlck9mZnNldH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlLCB7Uk9CT1R9IGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0U29ydHMoc29ydHM9Uk9CT1QuU09SVFMpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0U29ydHMoJHtKU09OLnN0cmluZ2lmeShzb3J0cyl9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmICghaXNFcXVhbChzb3J0cywgY3Vyc29yLmdldChcInNvcnRzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJzb3J0c1wiLCBzb3J0cyk7XG4gICAgbGV0IHBhZ2luYXRpb25MZW5ndGggPSBmbGF0dGVuQXJyYXlHcm91cChjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKSkubGVuZ3RoO1xuICAgIGlmIChwYWdpbmF0aW9uTGVuZ3RoICYmIHBhZ2luYXRpb25MZW5ndGggPj0gY3Vyc29yLmdldChcInRvdGFsXCIpKSB7XG4gICAgICAvLyBGdWxsIGluZGV4IGxvYWRlZCDigJMgY2FuIHJlY2FsY3VsYXRlIHBhZ2luYXRpb25cbiAgICAgIGNvbnNvbGUuZGVidWcoXCJGdWxsIGluZGV4IGxvYWRlZCwgcmVjYWxjdWxhdGluZyBwYWdpbmF0aW9uLi4uXCIpO1xuICAgICAgbGV0IHBhZ2luYXRpb24gPSByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoU29ydHMoXG4gICAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBzb3J0cywgY3Vyc29yLmdldChcIm1vZGVsc1wiKSwgY3Vyc29yLmdldChcImxpbWl0XCIpXG4gICAgICApO1xuICAgICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwgcGFnaW5hdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFBhcnQgb2YgaW5kZXggbG9hZGVkIOKAkyBjYW4gb25seSByZXNldFxuICAgICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwge30pO1xuICAgIH1cbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufVxuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIFJlY2FsY3VsYXRlcyBgcGFnaW5hdGlvbmAgd2l0aCBuZXcgYHNvcnRzYFxuICogTWF5IGJlIGFwcGxpZWQgb25seSB3aGVuIGBtb2RlbHMubGVuZ3RoID09IHRvdGFsYCwgc28gYG1vZGVsc2BcbiAqIHJlcHJlc2VudCBmdWxsIHNldCBvZiBpZHMgYW5kIGBwYWdpbmF0aW9uYCBjYW4gdGhlbiBiZSByZWNyZWF0ZWQgZnJvbSBzY3JhdGguXG4gKiBAcHVyZVxuICogQHBhcmFtIHBhZ2luYXRpb24ge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSBpbnB1dCBwYWdpbmF0aW9uXG4gKiBAcGFyYW0gc29ydHMge0FycmF5PHN0cmluZz59IC0gbmV3IHNvcnRzXG4gKiBAcGFyYW0gbW9kZWxzIHtPYmplY3Q8c3RyaW5nLCBPYmplY3Q+fSAtIG9iaiBvZiBtb2RlbHNcbiAqIEBwYXJhbSBsaW1pdCB7bnVtYmVyfSAtIGN1cnJlbnQgbGltaXRcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBBcnJheT59IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aFNvcnRzKHBhZ2luYXRpb24sIHNvcnRzLCBtb2RlbHMsIGxpbWl0KSB7XG4gIGlmICghcGFnaW5hdGlvbiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcGFnaW5hdGlvbiBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHtwYWdpbmF0aW9ufWApO1xuICB9XG4gIGlmICghc29ydHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgc29ydHMgbXVzdCBiZSBhIGJhc2ljIEFycmF5LCBnb3QgJHtzb3J0c31gKTtcbiAgfVxuICBpZiAoIW1vZGVscyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbW9kZWxzIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke21vZGVsc31gKTtcbiAgfVxuICBpZiAodHlwZW9mIGxpbWl0ICE9IFwibnVtYmVyXCIgfHwgbGltaXQgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbGltaXQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciwgZ290ICR7bGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGlmIChzb3J0cy5sZW5ndGgpIHtcbiAgICAgIGxldCB1bnNvcnRlZE1vZGVscyA9IE9iamVjdC52YWx1ZXMobW9kZWxzKTtcbiAgICAgIGxldCBzb3J0ZWRNb2RlbHMgPSBzb3J0QnlPcmRlcih1bnNvcnRlZE1vZGVscywgLi4ubG9kYXNoaWZ5U29ydHMoc29ydHMpKTtcbiAgICAgIHJldHVybiBjaHVua2VkKHNvcnRlZE1vZGVscy5tYXAobSA9PiBtLmlkKSwgbGltaXQpLnJlZHVjZSgob2JqLCBpZHMsIGkpID0+IHtcbiAgICAgICAgb2JqW2kgKiBsaW1pdF0gPSBpZHM7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYWdpbmF0aW9uO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9pbXBvcnQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBBcnJheSB8fCAhb2JqW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFtZW1vW2RldGFpbC5wYXRoXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAvL21peGluczogWy0tUmVhY3RSb3V0ZXIuU3RhdGUtLSwgc3RhdGUubWl4aW5dLFxuXG4gIC8vY3Vyc29ycygpIHtcbiAgLy8gIHJldHVybiB7XG4gIC8vICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAvLyAgfVxuICAvL30sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2PkFkZDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL3JldHVybiAoXG4gICAgLy8gIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPlxuICAgIC8vKTtcbiAgfVxufSk7XG5cbi8vbGV0IEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4vLyAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuLy8gICAgcmV0dXJuIHtcbi8vICAgICAgbW9kZWw6IHtcbi8vICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4vLyAgICAgICAgYXNzZW1ibHlEYXRlOiB1bmRlZmluZWQsXG4vLyAgICAgICAgbWFudWZhY3R1cmVyOiB1bmRlZmluZWQsXG4vLyAgICAgIH0sXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgLy92YWxpZGF0b3JUeXBlcygpIHtcbi8vICAvLyAgcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4vLyAgLy99LFxuLy9cbi8vICAvL3ZhbGlkYXRvckRhdGEoKSB7XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIC8vfSxcbi8vXG4vLyAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIC8vbGV0IHNjaGVtYSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvclR5cGVzXCIpIHx8IHt9O1xuLy8gICAgLy9sZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbi8vICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbi8vICAgIC8vICByZXR1cm4gYiBpbnN0YW5jZW9mIEFycmF5ID8gYiA6IHVuZGVmaW5lZDtcbi8vICAgIC8vfSk7XG4vLyAgICAvL3JldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbi8vICAgIC8vICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4vLyAgICAvL30pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAvLyAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgLy8gIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4vLyAgICAvLyAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuLy8gICAgLy99LmJpbmQodGhpcyk7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuLy8gICAgLy9yZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldEluaXRpYWxTdGF0ZSgpLm1vZGVsKSxcbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuLy8gICAgICBpZiAoaXNWYWxpZCkge1xuLy8gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbi8vICAgICAgICByb2JvdEFjdGlvbnMuYWRkKHtcbi8vICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgIH0pO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuLy8gICAgaWYgKCFPYmplY3QudmFsdWVzKGVycm9ycykubGVuZ3RoKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpLmxlbmd0aCA9PSAwO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fSBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L3NlY3Rpb24+XG4vLyAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4vLyAgICAgICk7XG4vLyAgICB9XG4vLyAgfVxuLy99KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7YnJhbmNofSBmcm9tIFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmQsIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5AYnJhbmNoKHtcbiAgY3Vyc29yczoge1xuICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgfSxcbiAgZmFjZXRzOiB7XG4gICAgbW9kZWw6IFwiY3VycmVudFJvYm90XCIsXG4gIH0sXG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3REZXRhaWwgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgbG9hZERhdGEgPSByb2JvdEFjdGlvbnMuZXN0YWJsaXNoTW9kZWw7XG5cbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHtsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcy5yb2JvdHM7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbiAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRGV0YWlsIFwiICsgbW9kZWwubmFtZX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRodW1ibmFpbCB0aHVtYm5haWwtcm9ib3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PlNlcmlhbCBOdW1iZXI8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmlkfTwvZGQ+XG4gICAgICAgICAgICAgICAgICAgIDxkdD5Bc3NlbWJseSBEYXRlPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5hc3NlbWJseURhdGV9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0Pk1hbnVmYWN0dXJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwubWFudWZhY3R1cmVyfTwvZGQ+XG4gICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmVzdWx0IGZyb20gXCJsb2Rhc2gucmVzdWx0XCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJsb2Rhc2guZGVib3VuY2VcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG4vL2ltcG9ydCBKb2kgZnJvbSBcImpvaVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbi8vbGV0IFZhbGlkYXRvcnMgZnJvbSBcInNoYXJlZC9yb2JvdC92YWxpZGF0b3JzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmQsIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBmbGF0dGVuQW5kUmVzZXRUbyhvYmosIHRvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoIHx8IFwiXCI7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLnJlZHVjZShmdW5jdGlvbiAobWVtbywga2V5KSB7XG4gICAgaWYgKG9ialtrZXldIGluc3RhbmNlb2YgQXJyYXkgfHwgIW9ialtrZXldIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfSwge30pO1xufVxuXG4vL2Z1bmN0aW9uIHZhbGlkYXRlKGpvaVNjaGVtYSwgZGF0YSwga2V5KSB7XG4vLyAgam9pU2NoZW1hID0gam9pU2NoZW1hIHx8IHt9O1xuLy8gIGRhdGEgPSBkYXRhIHx8IHt9O1xuLy8gIGxldCBqb2lPcHRpb25zID0ge1xuLy8gICAgYWJvcnRFYXJseTogZmFsc2UsXG4vLyAgICBhbGxvd1Vua25vd246IHRydWUsXG4vLyAgfTtcbi8vICBsZXQgZXJyb3JzID0gZm9ybWF0RXJyb3JzKEpvaS52YWxpZGF0ZShkYXRhLCBqb2lTY2hlbWEsIGpvaU9wdGlvbnMpKTtcbi8vICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuLy8gICAgICBmbGF0dGVuQW5kUmVzZXRUbyhqb2lTY2hlbWEsIFtdKSxcbi8vICAgICAgZXJyb3JzXG4vLyAgICApO1xuLy8gIH0gZWxzZSB7XG4vLyAgICBsZXQgcmVzdWx0ID0ge307XG4vLyAgICByZXN1bHRba2V5XSA9IGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgcmV0dXJuIHJlc3VsdDtcbi8vICB9XG4vL31cblxuLy9mdW5jdGlvbiBmb3JtYXRFcnJvcnMoam9pUmVzdWx0KSB7XG4vLyAgaWYgKGpvaVJlc3VsdC5lcnJvciAhPT0gbnVsbCkge1xuLy8gICAgcmV0dXJuIGpvaVJlc3VsdC5lcnJvci5kZXRhaWxzLnJlZHVjZShmdW5jdGlvbiAobWVtbywgZGV0YWlsKSB7XG4vLyAgICAgIGlmICghbWVtb1tkZXRhaWwucGF0aF0gaW5zdGFuY2VvZiBBcnJheSkge1xuLy8gICAgICAgIG1lbW9bZGV0YWlsLnBhdGhdID0gW107XG4vLyAgICAgIH1cbi8vICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4vLyAgICAgIHJldHVybiBtZW1vO1xuLy8gICAgfSwge30pO1xuLy8gIH0gZWxzZSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgfVxuLy99XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vY3Vyc29ycygpIHtcbi8vICByZXR1cm4ge1xuLy8gICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4vLyAgICBsb2FkTW9kZWw6IFtcInJvYm90c1wiLCBcIm1vZGVsc1wiLCB0aGlzLmdldFBhcmFtcygpLmlkXSxcbi8vICB9XG4vL30sXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEVkaXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgbG9hZERhdGEgPSByb2JvdEFjdGlvbnMuZXN0YWJsaXNoTW9kZWw7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2PkVkaXQ8L2Rpdj47XG4gICAgLy9sZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgLy9sZXQgbG9hZE1vZGVsID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmxvYWRNb2RlbDtcbiAgICAvL3JldHVybiAoXG4gICAgLy8gIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkRXJyb3I9e2xvYWRFcnJvcn0gbG9hZE1vZGVsPXtsb2FkTW9kZWx9Lz5cbiAgICAvLyk7XG4gIH1cbn1cblxuLy9sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbi8vICBnZXRJbml0aWFsU3RhdGUoKSB7XG4vLyAgICByZXR1cm4ge1xuLy8gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMpIHtcbi8vICAgIGlmICghT2JqZWN0LnZhbHVlcyh0aGlzLnN0YXRlLm1vZGVsKS5sZW5ndGgpIHtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLmxvYWRNb2RlbCksXG4vLyAgICAgIH0pXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgICAvL3JldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRvckRhdGEoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGIgaW5zdGFuY2VvZiBBcnJheSA/IGIgOiB1bmRlZmluZWQ7XG4vLyAgICAvL30pO1xuLy8gICAgLy9yZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuLy8gICAgLy8gIHRoaXMuc2V0U3RhdGUoe1xuLy8gICAgLy8gICAgZXJyb3JzOiBuZXh0RXJyb3JzXG4vLyAgICAvLyAgfSwgKCkgPT4gcmVzb2x2ZSh0aGlzLmlzVmFsaWQoa2V5KSkpO1xuLy8gICAgLy99KTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVDaGFuZ2VGb3I6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gICAgICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4vLyAgICAvLyAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuLy8gICAgfS5iaW5kKHRoaXMpO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlRGVib3VuY2VkOiBkZWJvdW5jZShmdW5jdGlvbiB2YWxpZGF0ZURlYm91bmNlZChrZXkpIHtcbi8vICAgIHJldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbi8vICAgIH0sIHRoaXMudmFsaWRhdGUpO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuLy8gICAgICBpZiAoaXNWYWxpZCkge1xuLy8gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbi8vICAgICAgICByb2JvdEFjdGlvbnMuZWRpdCh7XG4vLyAgICAgICAgICBpZDogdGhpcy5zdGF0ZS5tb2RlbC5pZCxcbi8vICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgIH0pO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuLy8gICAgaWYgKCFPYmplY3QudmFsdWVzKGVycm9ycykubGVuZ3RoKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiB0cnVlO1xuLy8gICAgLy9yZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhrZXkpLmxlbmd0aCA9PSAwKTtcbi8vICB9LFxuLy9cbi8vICByZW5kZXIoKSB7XG4vLyAgICBsZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yLCBsb2FkTW9kZWx9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFZGl0IFwiICsgbW9kZWwubmFtZX0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fSBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leWVcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L2E+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS0zXCI+XG4vLyAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtcImh0dHA6Ly9yb2JvaGFzaC5vcmcvXCIgKyBtb2RlbC5pZCArIFwiP3NpemU9MjAweDIwMFwifSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4vLyAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuLy8gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+e21vZGVsLm5hbWV9PC9oMT5cbi8vICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbi8vICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYXNzZW1ibHlEYXRlXCI+QXNzZW1ibHkgRGF0ZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcImFzc2VtYmx5RGF0ZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L3NlY3Rpb24+XG4vLyAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4vLyAgICAgICk7XG4vLyAgICB9XG4vLyAgfVxuLy99KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cblxuLy8odGhpcy52YWxpZGF0b3JUeXBlcygpLm1hbnVmYWN0dXJlci5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKVxuLy8odGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLCIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7YnJhbmNofSBmcm9tIFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQge3RvQXJyYXl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgRXh0ZXJuYWxQYWdpbmF0aW9uLCBJbnRlcm5hbFBhZ2luYXRpb24sIExpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90SXRlbSBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuXG4gIGZhY2V0czoge1xuICAgIGN1cnJlbnRSb2JvdHM6IFwiY3VycmVudFJvYm90c1wiLFxuICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hJbmRleDtcblxuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHNldExpbWl0KGxpbWl0KSB7XG4gICAgcm9ib3RBY3Rpb25zLnNldExpbWl0KGxpbWl0KTtcbiAgICByb2JvdEFjdGlvbnMubG9hZEluZGV4KCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHt0b3RhbCwgbG9hZGluZywgbG9hZEVycm9yLCBvZmZzZXQsIGxpbWl0fSA9IHRoaXMucHJvcHMucm9ib3RzO1xuICAgIGxldCBtb2RlbHMgPSB0aGlzLnByb3BzLmN1cnJlbnRSb2JvdHM7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICAgICAgICAgIHRvPVwicm9ib3QtaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3NvcnQ6IFwiK25hbWVcIn19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgU29ydEJ5ICtuYW1lXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICB0bz1cInJvYm90LWluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3tzb3J0OiBcIi1uYW1lXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgIFNvcnRCeSAtbmFtZVxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDMpfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDNcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDUpfT5cbiAgICAgICAgICAgICAgICAgICAgICBQZXJwYWdlIDVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnNldExpbWl0KDEwKX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSAxMFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1hZGRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmVlblwiIHRpdGxlPVwiQWRkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbFBhZ2luYXRpb24gZW5kcG9pbnQ9XCJyb2JvdC1pbmRleFwiIHRvdGFsPXt0b3RhbH0gb2Zmc2V0PXtvZmZzZXR9IGxpbWl0PXtsaW1pdH0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxJbnRlcm5hbFBhZ2luYXRpb24gb25DbGljaz17b2Zmc2V0ID0+IHJvYm90QWN0aW9ucy5zZXRPZmZzZXQob2Zmc2V0KX0gdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7Qm9keSwgSG9tZSwgQWJvdXQsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuaW1wb3J0IFJvYm90SW5kZXggZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIjtcbmltcG9ydCBSb2JvdEFkZCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIjtcbmltcG9ydCBSb2JvdERldGFpbCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIjtcbmltcG9ydCBSb2JvdEVkaXQgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCAoXG4gIDxSb3V0ZSBwYXRoPVwiL1wiIGhhbmRsZXI9e0JvZHl9PlxuICAgIDxEZWZhdWx0Um91dGUgaGFuZGxlcj17SG9tZX0gbmFtZT1cImhvbWVcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvYWJvdXRcIiBuYW1lPVwiYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0gbG9hZGVyPVwieHh4XCIvPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9cIiBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzL2FkZFwiIG5hbWU9XCJyb2JvdC1hZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy86aWRcIiBuYW1lPVwicm9ib3QtZGV0YWlsXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkL2VkaXRcIiBuYW1lPVwicm9ib3QtZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IHNvcnRCeSBmcm9tIFwibG9kYXNoLnNvcnRieVwiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIFNwbGl0IGFycmF5IGludG8gY2h1bmtzIHdpdGggcHJlZGVmaW5lZCBjaHVuayBsZW5ndGguIFVzZWZ1bCBmb3IgcGFnaW5hdGlvbi5cbiAqIEV4YW1wbGU6XG4gKiAgIGNodW5rZWQoWzEsIDIsIDMsIDQsIDVdLCAyKSA9PSBbWzEsIDJdLCBbMywgNF0sIFs1XV1cbiAqIEBwdXJlXG4gKiBAcGFyYW0gYXJyYXkge0FycmF5fSAtIGFycmF5IHRvIGJlIGNodW5rZWRcbiAqIEBwYXJhbSBuIHtudW1iZXJ9IC0gbGVuZ3RoIG9mIGNodW5rXG4gKiBAcmV0dXJucyB7QXJyYXl9IC0gY2h1bmtlZCBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2h1bmtlZChhcnJheSwgbikge1xuICBsZXQgbCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyBuKTtcbiAgcmV0dXJuIHJhbmdlKGwpLm1hcCgoeCwgaSkgPT4gYXJyYXkuc2xpY2UoaSpuLCBpKm4gKyBuKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgc29ydGluZyBhcnJheSBpbiBcInNob3J0XCIgZm9ybWF0IHRvIHNvcnRpbmcgYXJyYXkgaW4gXCJsb2Rhc2hcIiAobG9kYXNoLnNvcnRCeU9yZGVyKSBmb3JtYXQuXG4gKiBFeGFtcGxlOlxuICogICBsb2Rhc2hpZnlTb3J0cyhbXCIrbmFtZVwiLCBcIi1hZ2VcIl0pID09IFtbXCJuYW1lXCIsIFwiYWdlXCJdLCBbdHJ1ZSwgZmFsc2VdXVxuICogQHB1cmVcbiAqIEBwYXJhbSBzb3J0cyB7QXJyYXk8c3RyaW5nPn0gLSBhcnJheSBpbiBcInNob3J0XCIgZm9ybWF0XG4gKiBAcmV0dXJucyB7QXJyYXk8QXJyYXk8c3RyaW5nPj59IC0gYXJyYXkgaW4gXCJsb2Rhc2hcIiBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZGFzaGlmeVNvcnRzKHNvcnRzKSB7XG4gIHJldHVybiBbXG4gICAgc29ydHMubWFwKHYgPT4gdi5zbGljZSgxKSksXG4gICAgc29ydHMubWFwKHYgPT4gdlswXSA9PSBcIitcIiksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXAob2JqZWN0LCBvdGhlcikge1xuICByZXR1cm4gbWVyZ2Uoe30sIG9iamVjdCwgb3RoZXIsIChhLCBiKSA9PiB7XG4gICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJyYXlHcm91cChvYmplY3QsIHNvcnRlcj0odiA9PiB2KSkge1xuICByZXR1cm4gc29ydEJ5KE9iamVjdC5rZXlzKG9iamVjdCksIHNvcnRlcikucmVkdWNlKChjb21iaW5lZEFycmF5LCBrZXkpID0+IHtcbiAgICByZXR1cm4gY29tYmluZWRBcnJheS5jb25jYXQob2JqZWN0W2tleV0pO1xuICB9LCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0TGVzc2VyT2Zmc2V0KHBhZ2luYXRpb24sIG9mZnNldCkge1xuICBsZXQgb2Zmc2V0cyA9IE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLm1hcCh2ID0+IHBhcnNlSW50KHYpKS5zb3J0KCkucmV2ZXJzZSgpO1xuICBmb3IgKGxldCBvIG9mIG9mZnNldHMpIHtcbiAgICBpZiAocGFyc2VJbnQobykgPCBvZmZzZXQpIHtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XG4gIGlmIChhcnJheSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgob2JqZWN0LCBpdGVtKSA9PiB7XG4gICAgICBvYmplY3RbaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYGFycmF5IG11c3QgYmUgcGxhaW4gQXJyYXksIGdvdCAke2FycmF5fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iamVjdCkge1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIHNvcnRCeShcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGtleSA9PiBvYmplY3Rba2V5XSksXG4gICAgICBpdGVtID0+IGl0ZW0uaWRcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGBvYmplY3QgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7b2JqZWN0fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSkge1xuICByZXR1cm4ge1xuICAgIGZpbHRlcnM6IHF1ZXJ5LmZpbHRlcixcbiAgICBzb3J0czogcXVlcnkuc29ydCA/IHF1ZXJ5LnNvcnQuc3BsaXQoXCIsXCIpLm1hcCh2ID0+IHYucmVwbGFjZSgvXiAvLCBcIitcIikpIDogdW5kZWZpbmVkLFxuICAgIG9mZnNldDogcXVlcnkucGFnZSAmJiAocXVlcnkucGFnZS5vZmZzZXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLm9mZnNldCkgOiB1bmRlZmluZWQsXG4gICAgbGltaXQ6IHF1ZXJ5LnBhZ2UgJiYgKHF1ZXJ5LnBhZ2UubGltaXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLmxpbWl0KSA6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEpzb25BcGlRdWVyeShtb2RpZmllcnMpIHtcbiAgaWYgKCFtb2RpZmllcnMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG1vZGlmaWVycyBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHttb2RpZmllcnN9YCk7XG4gIH1cblxuICBsZXQgc29ydE9iaiA9IHt9O1xuICBsZXQgZmlsdGVyT2JqID0ge307XG4gIGxldCBwYWdlT2JqID0ge307XG5cbiAgaWYgKG1vZGlmaWVycy5maWx0ZXJzKSB7XG4gICAgZmlsdGVyT2JqID0gT2JqZWN0LmtleXMobW9kaWZpZXJzLmZpbHRlcnMpLnJlZHVjZSgoZmlsdGVyT2JqLCBrZXkpID0+IHtcbiAgICAgIGZpbHRlck9ialtgZmlsdGVyWyR7a2V5fV1gXSA9IGZpbHRlcnNba2V5XTtcbiAgICAgIHJldHVybiBmaWx0ZXJPYmo7XG4gICAgfSwgZmlsdGVyT2JqKTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLnNvcnRzKSB7XG4gICAgc29ydE9ialtcInNvcnRcIl0gPSBtb2RpZmllcnMuc29ydHMuam9pbihcIixcIik7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5vZmZzZXQgfHwgbW9kaWZpZXJzLm9mZnNldCA9PSAwKSB7XG4gICAgcGFnZU9ialtcInBhZ2Vbb2Zmc2V0XVwiXSA9IG1vZGlmaWVycy5vZmZzZXQ7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5saW1pdCB8fCBtb2RpZmllcnMubGltaXQgPT0gMCkge1xuICAgIHBhZ2VPYmpbXCJwYWdlW2xpbWl0XVwiXSA9IG1vZGlmaWVycy5saW1pdDtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzb3J0T2JqLCBmaWx0ZXJPYmosIHBhZ2VPYmopO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBJbnNwZWN0IGZyb20gXCJ1dGlsLWluc3BlY3RcIjtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSG93IGl0J3MgZXZlciBtaXNzZWQ/IVxuUmVnRXhwLmVzY2FwZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufTtcblxuLy8gVW5jb21tZW50IGlmIHVzZSBJb0pTXG4vLyBsZXQgcHJvY2VzcyA9IHByb2Nlc3MgfHwgdW5kZWZpbmVkO1xuLy9pZiAocHJvY2Vzcykge1xuICAvLyBJb0pTIGhhcyBgdW5oYW5kbGVkUmVqZWN0aW9uYCBob29rXG4gIC8vcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBmdW5jdGlvbiAocmVhc29uLCBwKSB7XG4gIC8vICB0aHJvdyBFcnJvcihgVW5oYW5kbGVkUmVqZWN0aW9uOiAke3JlYXNvbn1gKTtcbiAgLy99KTtcbi8vfSBlbHNlIHtcbiAgUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIGRvbmUocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpc1xuICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhyb3cgZTsgfSwgMCk7XG4gICAgICB9KTtcbiAgfTtcbi8vfVxuXG4vLyBXb3JrYXJvdW5kIG1ldGhvZCBhcyBuYXRpdmUgYnJvd3NlciBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgSW1tdXRhYmxlIGlzIGF3ZnVsXG5sZXQgd2luZG93ID0gd2luZG93IHx8IHVuZGVmaW5lZDtcbmlmICh3aW5kb3cpIHtcbiAgd2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGVjaG8oKSB7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBJbnNwZWN0KHYpKSk7XG4gIH07XG59Il19
