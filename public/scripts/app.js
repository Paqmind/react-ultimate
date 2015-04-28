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

},{"babel/polyfill":"babel/polyfill","frontend/common/helpers":27,"frontend/common/state":31,"frontend/routes":53,"react":"react","react-router":"react-router","shared/shims":69}],2:[function(require,module,exports){
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

},{"baobab":"baobab","frontend/common/helpers":27,"lodash.sortbyorder":"lodash.sortbyorder","lodash.take":65}],32:[function(require,module,exports){
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

},{"./load-index":40,"frontend/common/helpers":27,"frontend/common/router":30,"frontend/common/state":31,"lodash.filter":54,"lodash.flatten":"lodash.flatten","lodash.sortby":"lodash.sortby","shared/common/helpers":68}],45:[function(require,module,exports){
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
    key: "contextTypes",
    value: {
      router: _React2["default"].PropTypes.func.isRequired },
    enumerable: true
  }, {
    key: "loadData",
    value: _robotActions2["default"].establishModel,
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
    key: "contextTypes",
    value: {
      router: _React2["default"].PropTypes.func.isRequired },
    enumerable: true
  }, {
    key: "loadData",
    value: _robotActions2["default"].establishIndex,
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
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/about", name: "about", handler: _Body$Home$About$NotFound.About }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/", name: "robot-index", handler: _RobotIndex2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/add", name: "robot-add", handler: _RobotAdd2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/:id", name: "robot-detail", handler: _RobotDetail2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.Route, { path: "/robots/:id/edit", name: "robot-edit", handler: _RobotEdit2["default"] }),
  _React2["default"].createElement(_Route$DefaultRoute$NotFoundRoute.NotFoundRoute, { handler: _Body$Home$About$NotFound.NotFound })
);
module.exports = exports["default"];

},{"frontend/common/components":15,"frontend/robot/components/add":47,"frontend/robot/components/detail":48,"frontend/robot/components/edit":49,"frontend/robot/components/index":50,"react":"react","react-router":"react-router"}],54:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayFilter = require('lodash._arrayfilter'),
    baseCallback = require('lodash._basecallback'),
    baseFilter = require('lodash._basefilter'),
    isArray = require('lodash.isarray'),
    keys = require('lodash.keys');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Array} Returns the new filtered array.
 * @example
 *
 * _.filter([4, 5, 6], function(n) {
 *   return n % 2 == 0;
 * });
 * // => [4, 6]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // using the `_.matches` callback shorthand
 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
 * // => ['barney']
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.pluck(_.filter(users, 'active', false), 'user');
 * // => ['fred']
 *
 * // using the `_.property` callback shorthand
 * _.pluck(_.filter(users, 'active'), 'user');
 * // => ['barney']
 */
function filter(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  predicate = baseCallback(predicate, thisArg, 3);
  return func(collection, predicate);
}

module.exports = filter;

},{"lodash._arrayfilter":55,"lodash._basecallback":56,"lodash._basefilter":60,"lodash.isarray":"lodash.isarray","lodash.keys":62}],55:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `_.filter` for arrays without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],56:[function(require,module,exports){
/**
 * lodash 3.1.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return typeof thisArg == 'undefined'
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return typeof thisArg == 'undefined'
    ? baseProperty(func + '')
    : baseMatchesProperty(func + '', thisArg);
}

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The source property names to match.
 * @param {Array} values The source values to match.
 * @param {Array} strictCompareFlags Strict comparison flags for source values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
  var index = -1,
      length = props.length,
      noCustomizer = !customizer;

  while (++index < length) {
    if ((noCustomizer && strictCompareFlags[index])
          ? values[index] !== object[props[index]]
          : !(props[index] in object)
        ) {
      return false;
    }
  }
  index = -1;
  while (++index < length) {
    var key = props[index],
        objValue = object[key],
        srcValue = values[index];

    if (noCustomizer && strictCompareFlags[index]) {
      var result = typeof objValue != 'undefined' || (key in object);
    } else {
      result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (typeof result == 'undefined') {
        result = baseIsEqual(srcValue, objValue, customizer, true);
      }
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var props = keys(source),
      length = props.length;

  if (!length) {
    return constant(true);
  }
  if (length == 1) {
    var key = props[0],
        value = source[key];

    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value &&
          (typeof value != 'undefined' || (key in toObject(object)));
      };
    }
  }
  var values = Array(length),
      strictCompareFlags = Array(length);

  while (length--) {
    value = source[props[length]];
    values[length] = value;
    strictCompareFlags[length] = isStrictComparable(value);
  }
  return function(object) {
    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
  };
}

/**
 * The base implementation of `_.matchesProperty` which does not coerce `key`
 * to a string.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} value The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(key, value) {
  if (isStrictComparable(value)) {
    return function(object) {
      return object != null && object[key] === value &&
        (typeof value != 'undefined' || (key in toObject(object)));
    };
  }
  return function(object) {
    return object != null && baseIsEqual(value, object[key], null, true);
  };
}

/**
 * The base implementation of `_.property` which does not coerce `key` to a string.
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
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
}

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = baseCallback;

},{"lodash._baseisequal":57,"lodash._bindcallback":59,"lodash.keys":62}],57:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray'),
    isTypedArray = require('lodash.istypedarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  // Exit early for identical values.
  if (value === other) {
    // Treat `+0` vs. `-0` as not equal.
    return value !== 0 || (1 / value == 1 / other);
  }
  var valType = typeof value,
      othType = typeof other;

  // Exit early for unlike primitive values.
  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
      value == null || other == null) {
    // Return `false` unless both values are `NaN`.
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length,
      result = true;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Deep compare the contents, ignoring non-numeric properties.
  while (result && ++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    result = undefined;
    if (customizer) {
      result = isLoose
        ? customizer(othValue, arrValue, index)
        : customizer(arrValue, othValue, index);
    }
    if (result === undefined) {
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        var othIndex = othLength;
        while (othIndex--) {
          othValue = other[othIndex];
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          if (result) {
            break;
          }
        }
      } else {
        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
  }
  return !!result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        // But, treat `-0` vs. `+0` as not equal.
        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var skipCtor = isLoose,
      index = -1;

  while (++index < objLength) {
    var key = objProps[index],
        result = isLoose ? key in other : hasOwnProperty.call(other, key);

    if (result) {
      var objValue = object[key],
          othValue = other[key];

      result = undefined;
      if (customizer) {
        result = isLoose
          ? customizer(othValue, objValue, key)
          : customizer(objValue, othValue, key);
      }
      if (result === undefined) {
        // Recursively compare objects (susceptible to call stack limits).
        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
    if (!result) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = baseIsEqual;

},{"lodash.isarray":"lodash.isarray","lodash.istypedarray":58,"lodash.keys":62}],58:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

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
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{}],59:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],60:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseEach = require('lodash._baseeach');

/**
 * The base implementation of `_.filter` without support for callback
 * shorthands or `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"lodash._baseeach":61}],61:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

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
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
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
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
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

module.exports = baseEach;

},{"lodash.keys":62}],62:[function(require,module,exports){
/**
 * lodash 3.0.6 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray'),
    isNative = require('lodash.isnative');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {
  var Ctor = function() { this.x = x; },
      object = { '0': x, 'length': x },
      props = [];

  Ctor.prototype = { 'valueOf': x, 'y': x };
  for (var key in new Ctor) { props.push(key); }

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed the number of function parameters and
   * whose associated argument values are `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(1, 0));

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
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
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

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (object) {
    var Ctor = object.constructor,
        length = object.length;
  }
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isLength(length))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash.isarguments":63,"lodash.isarray":"lodash.isarray","lodash.isnative":64}],63:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

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
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  var length = isObjectLike(value) ? value.length : undefined;
  return isLength(length) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{}],64:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = isNative;

},{}],65:[function(require,module,exports){
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

},{"lodash._baseslice":66,"lodash._isiterateecall":67}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{"lodash.range":"lodash.range"}],69:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmcuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL3BhZ2luYXRpb24tZXh0ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMvYWxlcnQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL3JvdXRlci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vc3RhdGUuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9lc3RhYmxpc2gtcGFnZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2ZldGNoLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvbG9hZC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3JlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3NldC1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LW9mZnNldC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL3NldC1zb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvbW9kZWxzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvdXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5maWx0ZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYXJyYXlmaWx0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2FsbGJhY2svaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2FsbGJhY2svbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2FsbGJhY2svbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWlzZXF1YWwvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc3R5cGVkYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLl9iYXNlY2FsbGJhY2svbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmluZGNhbGxiYWNrL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5maWx0ZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWZpbHRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZmlsdGVyL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VmaWx0ZXIvbm9kZV9tb2R1bGVzL2xvZGFzaC5fYmFzZWVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmZpbHRlci9ub2RlX21vZHVsZXMvbG9kYXNoLmtleXMvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc2FyZ3VtZW50cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guZmlsdGVyL25vZGVfbW9kdWxlcy9sb2Rhc2gua2V5cy9ub2RlX21vZHVsZXMvbG9kYXNoLmlzbmF0aXZlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC50YWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC50YWtlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2Jhc2VzbGljZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gudGFrZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvY29tbW9uL2hlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvc2hhcmVkL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O1FDQ08sZ0JBQWdCOztRQUNoQixjQUFjOztxQkFFSCxPQUFPOzs7OzRDQUM2QixjQUFjOztrQ0FFcEMseUJBQXlCOztxQkFDdkMsdUJBQXVCOzs7O3NCQUN0QixpQkFBaUI7Ozs7O0FBR3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsOEJBUFQsTUFBTSxDQU9nQjtBQUM1QixRQUFNLHFCQUFRO0FBQ2QsVUFBUSxnQ0FUc0IsZUFBZSxBQVNwQjtDQUMxQixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxXQUFXLEVBQUUsR0FBRyxFQUFLOzs7Ozs7QUFNdkMsTUFBSSxTQUFTLEdBQUcsbUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BDLE1BQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzNDLFdBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLFdBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQyxXQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxDLE1BQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ3ZCLE1BQUksRUFBRSxFQUFFO0FBQ04sYUFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDekI7OzJCQUVxQyxvQkEzQmhDLGlCQUFpQixDQTJCaUMsR0FBRyxDQUFDLEtBQUssQ0FBQzs7TUFBN0QsT0FBTyxzQkFBUCxPQUFPO01BQUUsS0FBSyxzQkFBTCxLQUFLO01BQUUsTUFBTSxzQkFBTixNQUFNO01BQUUsS0FBSyxzQkFBTCxLQUFLOztBQUNsQyxXQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELE1BQUksT0FBTyxFQUFFO0FBQ1gsYUFBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDbkM7QUFDRCxNQUFJLEtBQUssRUFBRTtBQUNULGFBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQy9CO0FBQ0QsTUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxQixhQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNqQztBQUNELE1BQUksS0FBSyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDeEIsYUFBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDL0I7O0FBRUQscUJBQU0sTUFBTSxFQUFFLENBQUM7OztBQUdmLE1BQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQ3RCLEdBQUcsQ0FBQyxVQUFBLEtBQUs7V0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFO0dBQUEsQ0FBQyxDQUMxQyxHQUFHLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDZixRQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDckIsY0FBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3JCO0dBQ0YsQ0FBQyxDQUFDOztBQUVMLFNBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDL0IsdUJBQU0sTUFBTSxDQUFDLGlDQUFDLFdBQVcsT0FBRSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUMvRCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7OztBQy9ESDtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OzsrQkN0QjRCLDZCQUE2Qjs7OzsrQkFDN0IsNkJBQTZCOzs7OzhCQUU5Qiw0QkFBNEI7Ozs7OEJBQzVCLDRCQUE0Qjs7Ozt3QkFFbEMscUJBQXFCOzs7OzJCQUNsQix3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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O1FDckhnQixPQUFPLEdBQVAsT0FBTzs7O3FCQUpMLGNBQWM7Ozs7QUFJekIsU0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRTtBQUNoQyxNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsU0FBTyxtQkFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztXQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUFBLENBQUMsQ0FBQztDQUMxRDs7Ozs7Ozs7O3VCQ1BtQixjQUFjOzs7Ozs7QUFJbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFTLE1BQU0sRUFBRTtBQUMvQixTQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDekQsQ0FBQzs7Ozs7Ozs7OztBQVVBLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDdEQsTUFBSSxDQUNELElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQ2hCLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDVixjQUFVLENBQUMsWUFBTTtBQUFFLFlBQU0sQ0FBQyxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNuQyxDQUFDLENBQUM7Q0FDTixDQUFDOzs7O0FBSUosSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sRUFBRTtBQUNWLFFBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxHQUFHO0FBQ3BDLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLHFCQUFRLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFDO0dBQ3hGLENBQUM7Q0FDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgXCJiYWJlbC9wb2x5ZmlsbFwiO1xuaW1wb3J0IFwic2hhcmVkL3NoaW1zXCI7XG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7Y3JlYXRlIGFzIGNyZWF0ZVJvdXRlciwgSGlzdG9yeUxvY2F0aW9ufSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbmltcG9ydCB7cGFyc2VKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXMgZnJvbSBcImZyb250ZW5kL3JvdXRlc1wiO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG53aW5kb3cuX3JvdXRlciA9IGNyZWF0ZVJvdXRlcih7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93Ll9yb3V0ZXIucnVuKChBcHBsaWNhdGlvbiwgdXJsKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIC8vIFNFVCBCQU9CQUIgVVJMIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCBoYW5kbGVyID0gdXJsLnJvdXRlcy5zbGljZSgtMSlbMF0ubmFtZTtcbiAgdXJsQ3Vyc29yLnNldChcImhhbmRsZXJcIiwgaGFuZGxlcik7XG4gIHVybEN1cnNvci5zZXQoXCJwYXJhbXNcIiwgdXJsLnBhcmFtcyk7XG4gIHVybEN1cnNvci5zZXQoXCJxdWVyeVwiLCB1cmwucXVlcnkpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gIH1cblxuICBsZXQge2ZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0fSA9IHBhcnNlSnNvbkFwaVF1ZXJ5KHVybC5xdWVyeSk7XG4gIHVybEN1cnNvci5zZXQoXCJyb3V0ZVwiLCB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lKTtcbiAgaWYgKGZpbHRlcnMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCBmaWx0ZXJzKTtcbiAgfVxuICBpZiAoc29ydHMpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwic29ydHNcIiwgc29ydHMpO1xuICB9XG4gIGlmIChvZmZzZXQgfHwgb2Zmc2V0ID09PSAwKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcIm9mZnNldFwiLCBvZmZzZXQpO1xuICB9XG4gIGlmIChsaW1pdCB8fCBsaW1pdCA9PT0gMCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJsaW1pdFwiLCBsaW1pdCk7XG4gIH1cblxuICBzdGF0ZS5jb21taXQoKTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBsZXQgcHJvbWlzZXMgPSB1cmwucm91dGVzXG4gICAgLm1hcChyb3V0ZSA9PiByb3V0ZS5oYW5kbGVyLm9yaWdpbmFsIHx8IHt9KVxuICAgIC5tYXAob3JpZ2luYWwgPT4ge1xuICAgICAgaWYgKG9yaWdpbmFsLmxvYWREYXRhKSB7XG4gICAgICAgIG9yaWdpbmFsLmxvYWREYXRhKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgIFJlYWN0LnJlbmRlcig8QXBwbGljYXRpb24vPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcbiAgfSk7XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0LW1vZHVsZXMvZGVjb3JhdG9ycy5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucm9vdCA9IHJvb3Q7XG5leHBvcnRzLmJyYW5jaCA9IGJyYW5jaDtcbi8qKlxuICogQmFvYmFiLVJlYWN0IERlY29yYXRvcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEVTNyBkZWNvcmF0b3JzIHN1Z2FyIGZvciBoaWdoZXIgb3JkZXIgY29tcG9uZW50cy5cbiAqL1xuXG52YXIgX1Jvb3QkQnJhbmNoID0gcmVxdWlyZSgnLi9oaWdoZXItb3JkZXIuanMnKTtcblxuZnVuY3Rpb24gcm9vdCh0cmVlKSB7XG4gIGlmICh0eXBlb2YgdHJlZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0cmVlKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5yb290KHRhcmdldCwgdHJlZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJyYW5jaChzcGVjcykge1xuICBpZiAodHlwZW9mIHNwZWNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2goc3BlY3MpO1xuICB9cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLmJyYW5jaCh0YXJnZXQsIHNwZWNzKTtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBSb290IGNvbXBvbmVudFxuICovXG5leHBvcnRzLnJvb3QgPSByb290O1xuXG4vKipcbiAqIEJyYW5jaCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBIaWdoZXIgT3JkZXIgQ29tcG9uZW50XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzYgaGlnaGVyIG9yZGVyIGNvbXBvbmVudCB0byBlbmNoYW5jZSBvbmUncyBjb21wb25lbnQuXG4gKi9cblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX1JlYWN0KTtcblxudmFyIF90eXBlID0gcmVxdWlyZSgnLi91dGlscy90eXBlLmpzJyk7XG5cbnZhciBfdHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdHlwZSk7XG5cbnZhciBfUHJvcFR5cGVzID0gcmVxdWlyZSgnLi91dGlscy9wcm9wLXR5cGVzLmpzJyk7XG5cbnZhciBfUHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9Qcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiByb290KENvbXBvbmVudCwgdHJlZSkge1xuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLkJhb2JhYih0cmVlKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdDpoaWdoZXItb3JkZXIucm9vdDogZ2l2ZW4gdHJlZSBpcyBub3QgYSBCYW9iYWIuJyk7XG5cbiAgdmFyIENvbXBvc2VkQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgdmFyIF9jbGFzcyA9IGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG5cbiAgICAgIGlmIChfUmVhY3QkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5oZXJpdHMoX2NsYXNzLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG4gICAgICBrZXk6ICdnZXRDaGlsZENvbnRleHQnLFxuXG4gICAgICAvLyBIYW5kbGluZyBjaGlsZCBjb250ZXh0XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgdGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6ICdvcmlnaW5hbCcsXG4gICAgICB2YWx1ZTogQ29tcG9uZW50LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3M7XG4gIH0pKF9SZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG4gIHJldHVybiBDb21wb3NlZENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYnJhbmNoKENvbXBvbmVudCkge1xuICB2YXIgc3BlY3MgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gIGlmICghX3R5cGUyWydkZWZhdWx0J10uT2JqZWN0KHNwZWNzKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdC5oaWdoZXItb3JkZXI6IGludmFsaWQgc3BlY2lmaWNhdGlvbnMgJyArICcoc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIGN1cnNvcnMgYW5kL29yIGZhY2V0cyBrZXkpLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudDIpIHtcbiAgICB2YXIgX2NsYXNzMiA9XG5cbiAgICAvLyBCdWlsZGluZyBpbml0aWFsIHN0YXRlXG4gICAgZnVuY3Rpb24gQ29tcG9zZWRDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MyKTtcblxuICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzMi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgdmFyIGZhY2V0ID0gY29udGV4dC50cmVlLmNyZWF0ZUZhY2V0KHNwZWNzLCB0aGlzKTtcblxuICAgICAgaWYgKGZhY2V0KSB0aGlzLnN0YXRlID0gZmFjZXQuZ2V0KCk7XG5cbiAgICAgIHRoaXMuZmFjZXQgPSBmYWNldDtcbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzczIsIF9SZWFjdCRDb21wb25lbnQyKTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MyLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gQ2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjdXJzb3JzOiB0aGlzLmZhY2V0LmN1cnNvcnNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCBtb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH12YXIgaGFuZGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmZhY2V0Lm9uKCd1cGRhdGUnLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsVW5tb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCB1bm1vdW50XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBSZWxlYXNpbmcgZmFjZXRcbiAgICAgICAgdGhpcy5mYWNldC5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZmFjZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdHJlZTogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5iYW9iYWJcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY2hpbGRDb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgY3Vyc29yczogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5jdXJzb3JzXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3MyO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgQ3VzdG9tIFByb3AgVHlwZXNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBQcm9wVHlwZXMgdXNlZCB0byBwcm9wYWdhdGUgY29udGV4dCBzYWZlbHkuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSByZXF1aXJlKCcuL3R5cGUuanMnKTtcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlKHByb3BOYW1lLCB3aGF0KSB7XG4gIHJldHVybiAncHJvcCB0eXBlIGAnICsgcHJvcE5hbWUgKyAnYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlICcgKyB3aGF0ICsgJy4nO1xufVxuXG52YXIgUHJvcFR5cGVzID0ge307XG5cblByb3BUeXBlcy5iYW9iYWIgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIGlmICghdHlwZS5CYW9iYWIocHJvcHNbcHJvcE5hbWVdKSkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdhIEJhb2JhYiB0cmVlJykpO1xufTtcblxuUHJvcFR5cGVzLmN1cnNvcnMgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIHZhciBwID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gIHZhciB2YWxpZCA9IHR5cGUuT2JqZWN0KHApICYmIE9iamVjdC5rZXlzKHApLmV2ZXJ5KGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIHR5cGUuQ3Vyc29yKHBba10pO1xuICB9KTtcblxuICBpZiAoIXZhbGlkKSByZXR1cm4gbmV3IEVycm9yKGVycm9yTWVzc2FnZShwcm9wTmFtZSwgJ0Jhb2JhYiBjdXJzb3JzJykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9wVHlwZXM7IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgVHlwZSBDaGVja2luZ1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogU29tZSBoZWxwZXJzIHRvIHBlcmZvcm0gcnVudGltZSB2YWxpZGF0aW9ucy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHt9O1xuXG50eXBlLk9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbn07XG5cbnR5cGUuQmFvYmFiID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQmFvYmFiXSc7XG59O1xuXG50eXBlLkN1cnNvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEN1cnNvcl0nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlOyIsImltcG9ydCBhbGVydEZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGFsZXJ0RmV0Y2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydExvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtbW9kZWxcIjtcbmltcG9ydCBhbGVydExvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtaW5kZXhcIjtcblxuaW1wb3J0IGFsZXJ0QWRkIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtYWRkXCI7XG5pbXBvcnQgYWxlcnRSZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbGVydDoge1xuICAgIGZldGNoTW9kZWw6IGFsZXJ0RmV0Y2hNb2RlbCxcbiAgICBmZXRjaEluZGV4OiBhbGVydEZldGNoSW5kZXgsXG4gICAgbG9hZE1vZGVsOiBhbGVydExvYWRNb2RlbCxcbiAgICBsb2FkSW5kZXg6IGFsZXJ0TG9hZEluZGV4LFxuICAgIGFkZDogYWxlcnRBZGQsXG4gICAgcmVtb3ZlOiBhbGVydFJlbW92ZSxcbiAgfSxcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCB7QWxlcnR9IGZyb20gXCJmcm9udGVuZC9jb21tb24vbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoSW5kZXhcIik7XG5cbiAgbGV0IHVybCA9IGBhcGkvYWxlcnRzYDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcblxuICBjdXJzb3IubWVyZ2Uoe1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgIHRvdGFsOiAwLFxuICAgIG1vZGVsczoge30sXG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoTW9kZWwoaWQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoTW9kZWw6XCIsIGlkKTtcblxuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgyMDApOyAvLyBIVFRQIHJlc3BvbnNlLnN0YXR1c1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgZmV0Y2hJbmRleCBmcm9tIFwiLi9hbGVydC1mZXRjaC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJsb2FkSW5kZXhcIik7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IGZpbHRlcnMgPSBjdXJzb3IuZ2V0KFwiZmlsdGVyc1wiKTtcbiAgbGV0IHNvcnRzID0gY3Vyc29yLmdldChcInNvcnRzXCIpO1xuICBsZXQgb2Zmc2V0ID0gY3Vyc29yLmdldChcIm9mZnNldFwiKTtcbiAgbGV0IGxpbWl0ID0gY3Vyc29yLmdldChcImxpbWl0XCIpO1xuICBsZXQgcGFnaW5hdGlvbiA9IGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpO1xuXG4gIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gIGlmICghaWRzKSB7XG4gICAgZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2FsZXJ0LWZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xuICBsZXQgYXBpVVJMID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb24tcGVyc2lzdGVudCByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIsIFwibW9kZWxzXCIpLnVuc2V0KGlkKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGdldEFsbE1ldGhvZHMob2JqKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZpbHRlcihrZXkgPT4gdHlwZW9mIG9ialtrZXldID09IFwiZnVuY3Rpb25cIik7XG59XG5cbmZ1bmN0aW9uIGF1dG9CaW5kKG9iaikge1xuICBnZXRBbGxNZXRob2RzKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpXG4gICAgLmZvckVhY2gobXRkID0+IHtcbiAgICAgIG9ialttdGRdID0gb2JqW210ZF0uYmluZChvYmopO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBhdXRvQmluZCh0aGlzKTtcbiAgfVxufSIsImltcG9ydCBBYm91dCBmcm9tIFwiLi9jb21wb25lbnRzL2Fib3V0XCI7XG5pbXBvcnQgQm9keSBmcm9tIFwiLi9jb21wb25lbnRzL2JvZHlcIjtcbmltcG9ydCBFcnJvciBmcm9tIFwiLi9jb21wb25lbnRzL2Vycm9yXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcIi4vY29tcG9uZW50cy9oZWFkcm9vbVwiO1xuaW1wb3J0IEhvbWUgZnJvbSBcIi4vY29tcG9uZW50cy9ob21lXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIjtcbmltcG9ydCBOb3RGb3VuZCBmcm9tIFwiLi9jb21wb25lbnRzL25vdC1mb3VuZFwiO1xuaW1wb3J0IEludGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24taW50ZXJuYWxcIjtcbmltcG9ydCBFeHRlcm5hbFBhZ2luYXRpb24gZnJvbSBcIi4vY29tcG9uZW50cy9wYWdpbmF0aW9uLWV4dGVybmFsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQWJvdXQsIEJvZHksIEVycm9yLCBIZWFkcm9vbSwgSG9tZSwgTG9hZGluZywgTm90Rm91bmQsIEludGVybmFsUGFnaW5hdGlvbiwgRXh0ZXJuYWxQYWdpbmF0aW9uXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IExvYWRpbmcgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xvYWRpbmdcIjtcbmltcG9ydCBOb3RGb3VuZCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbm90LWZvdW5kXCI7XG5pbXBvcnQgQWxlcnRJdGVtIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9hbGVydC1pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgbWl4aW5zOiBbc3RhdGUubWl4aW5dLFxuXG4gIGN1cnNvcnM6IHtcbiAgICBhbGVydHM6IFtcImFsZXJ0c1wiXSxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMuYWxlcnRzO1xuICAgIG1vZGVscyA9IHRvQXJyYXkobW9kZWxzKTtcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9ucyB0b3AtbGVmdFwiPlxuICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxBbGVydEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuLy8gQ2FuJ3QgcnVuIHRoaXMgY3JhcCBmb3Igbm93IFRPRE8gcmVjaGVjayBhZnRlciB0cmFuc2l0aW9uIHRvIFdlYnBhY2tcbi8vIDEpIHJlYWN0L2FkZG9ucyBwdWxscyB3aG9sZSBuZXcgcmVhY3QgY2xvbmUgaW4gYnJvd3NlcmlmeVxuLy8gMikgcmMtY3NzLXRyYW5zaXRpb24tZ3JvdXAgY29udGFpbnMgdW5jb21waWxlZCBKU1ggc3ludGF4XG4vLyBPTUcgd2hhdCBhbiBpZGlvdHMgJl8mXG5cbi8vPENTU1RyYW5zaXRpb25Hcm91cCB0cmFuc2l0aW9uTmFtZT1cImZhZGVcIiBjb21wb25lbnQ9XCJkaXZcIj5cbi8vICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4vLzwvQ1NTVHJhbnNpdGlvbkdyb3VwPlxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7cm9vdH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmssIFJvdXRlSGFuZGxlcn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCI7XG5pbXBvcnQgQWxlcnRJbmRleCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQHJvb3Qoc3RhdGUpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLy9zdGF0aWMgbG9hZFBhZ2UocGFyYW1zLCBxdWVyeSkge1xuICAgIC8vIElnbm9yZSBwYXJhbXMgYW5kIHF1ZXJ5XG4gICAgLy8gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KTtcbiAgICAvL3JldHVybiBjb21tb25BY3Rpb25zLmFsZXJ0LmxvYWRQYWdlKCk7XG4gIC8vfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaGVhZHJvb21DbGFzc05hbWVzID0ge3Zpc2libGU6IFwibmF2YmFyLWRvd25cIiwgaGlkZGVuOiBcIm5hdmJhci11cFwifTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgIDxIZWFkcm9vbSBjb21wb25lbnQ9XCJoZWFkZXJcIiBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIHsvKjxBbGVydEluZGV4Lz4qL31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGxvYWRFcnJvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbXCJ4c1wiLCBcInNtXCIsIFwibWRcIiwgXCJsZ1wiXSksXG4gIH1cblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IFwibWRcIixcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVycm9yIFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3Iuc3RhdHVzICsgXCI6IFwiICsgdGhpcy5wcm9wcy5sb2FkRXJyb3IuZGVzY3JpcHRpb259PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuICAgICAgICAgIFwiYWxlcnQtYXMtaWNvblwiOiB0cnVlLFxuICAgICAgICAgIFwiZmEtc3RhY2tcIjogdHJ1ZSxcbiAgICAgICAgICBbdGhpcy5wcm9wcy5zaXplXTogdHJ1ZVxuICAgICAgICB9KX0+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXN0YWNrLTF4XCI+PC9pPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWJhbiBmYS1zdGFjay0yeFwiPjwvaT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHRocm90dGxlIGZyb20gXCJsb2Rhc2gudGhyb3R0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkcm9vbSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgY29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY29tcG9uZW50OiBcImRpdlwiLFxuICAgIGhlYWRyb29tQ2xhc3NOYW1lczoge1xuICAgICAgdmlzaWJsZTogXCJuYXZiYXItZG93blwiLFxuICAgICAgaGlkZGVuOiBcIm5hdmJhci11cFwiXG4gICAgfSxcbiAgfVxuXG4gIHN0YXRlID0ge1xuICAgIGNsYXNzTmFtZTogXCJcIlxuICB9XG5cbiAgaGFzU2Nyb2xsZWQoKSB7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHVzZXJzIHNjcm9sbCBtb3JlIHRoYW4gZGVsdGFcbiAgICBpZiAoTWF0aC5hYnModGhpcy5sYXN0U2Nyb2xsVG9wIC0gdG9wUG9zaXRpb24pIDw9IHRoaXMuZGVsdGFIZWlnaHQpIHJldHVybjtcblxuICAgIC8vIElmIHRoZXkgc2Nyb2xsZWQgZG93biBhbmQgYXJlIHBhc3QgdGhlIG5hdmJhciwgYWRkIGNsYXNzIGB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlYC5cbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB5b3UgbmV2ZXIgc2VlIHdoYXQgaXMgXCJiZWhpbmRcIiB0aGUgbmF2YmFyLlxuICAgIGlmICh0b3BQb3NpdGlvbiA+IHRoaXMubGFzdFNjcm9sbFRvcCAmJiB0b3BQb3NpdGlvbiA+IHRoaXMuZWxlbWVudEhlaWdodCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy5oaWRkZW59KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpZiAoKHRvcFBvc2l0aW9uICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NsYXNzTmFtZTogdGhpcy5wcm9wcy5oZWFkcm9vbUNsYXNzTmFtZXMudmlzaWJsZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxhc3RTY3JvbGxUb3AgPSB0b3BQb3NpdGlvbjtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIEluaXQgb3B0aW9uc1xuICAgIHRoaXMuZGVsdGFIZWlnaHQgPSB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0ID8gdGhpcy5wcm9wcy5kZWx0YUhlaWdodCA6IDU7XG4gICAgdGhpcy5kZWxheSA9IHRoaXMucHJvcHMuZGVsYXkgPyB0aGlzLnByb3BzLmRlbGF5IDogMjUwO1xuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50SGVpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wcm9wcy5pZCkub2Zmc2V0SGVpZ2h0O1xuXG4gICAgLy8gQWRkIGV2ZW50IGhhbmRsZXIgb24gc2Nyb2xsXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhyb3R0bGUodGhpcy5oYXNTY3JvbGxlZCwgdGhpcy5kZWxheSksIGZhbHNlKTtcblxuICAgIC8vIFVwZGF0ZSBjb21wb25lbnRcInMgY2xhc3NOYW1lXG4gICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmhhc1Njcm9sbGVkLCBmYWxzZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IHRoaXMucHJvcHMuY29tcG9uZW50O1xuICAgIGxldCBwcm9wcyA9IHtpZDogdGhpcy5wcm9wcy5pZCwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSArIFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWV9O1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50LFxuICAgICAgcHJvcHMsXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUmVhY3QgU3RhcnRlclwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZSBob21lXCI+XG4gICAgICAgICAgPGgxPlJlYWN0IHN0YXJ0ZXIgYXBwPC9oMT5cbiAgICAgICAgICA8cD5Qcm9vZiBvZiBjb25jZXB0cywgQ1JVRCwgd2hhdGV2ZXIuLi48L3A+XG4gICAgICAgICAgPHA+UHJvdWRseSBidWlsZCBvbiBFUzYgd2l0aCB0aGUgaGVscCBvZiA8YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiB0cmFuc3BpbGVyLjwvcD5cbiAgICAgICAgICA8aDM+RnJvbnRlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9cIj5SZWFjdDwvYT4gZGVjbGFyYXRpdmUgVUk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWJcIj5CYW9iYWI8L2E+IEpTIGRhdGEgdHJlZSB3aXRoIGN1cnNvcnM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vcmFja3QvcmVhY3Qtcm91dGVyXCI+UmVhY3QtUm91dGVyPC9hPiBkZWNsYXJhdGl2ZSByb3V0ZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZ2FlYXJvbi9yZWFjdC1kb2N1bWVudC10aXRsZVwiPlJlYWN0LURvY3VtZW50LVRpdGxlPC9hPiBkZWNsYXJhdGl2ZSBkb2N1bWVudCB0aXRsZXM8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vcmVhY3QtYm9vdHN0cmFwLmdpdGh1Yi5pby9cIj5SZWFjdC1Cb290c3RyYXA8L2E+IEJvb3RzdHJhcCBjb21wb25lbnRzIGluIFJlYWN0PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jyb3dzZXJpZnkub3JnL1wiPkJyb3dzZXJpZnk8L2E+ICZhbXA7IDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svd2F0Y2hpZnlcIj5XYXRjaGlmeTwvYT4gYnVuZGxlIE5QTSBtb2R1bGVzIHRvIGZyb250ZW5kPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2Jvd2VyLmlvL1wiPkJvd2VyPC9hPiBmcm9udGVuZCBwYWNrYWdlIG1hbmFnZXI8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+QmFja2VuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZXhwcmVzc2pzLmNvbS9cIj5FeHByZXNzPC9hPiB3ZWItYXBwIGJhY2tlbmQgZnJhbWV3b3JrPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21vemlsbGEuZ2l0aHViLmlvL251bmp1Y2tzL1wiPk51bmp1Y2tzPC9hPiB0ZW1wbGF0ZSBlbmdpbmU8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZWxlaXRoL2VtYWlsanNcIj5FbWFpbEpTPC9hPiBTTVRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5Db21tb248L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9iYWJlbGpzLmlvL1wiPkJhYmVsPC9hPiBKUyB0cmFuc3BpbGVyPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2d1bHBqcy5jb20vXCI+R3VscDwvYT4gc3RyZWFtaW5nIGJ1aWxkIHN5c3RlbTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vbG9kYXNoLmNvbS9cIj5Mb2Rhc2g8L2E+IHV0aWxpdHkgbGlicmFyeTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9temFicmlza2llL2F4aW9zXCI+QXhpb3M8L2E+IHByb21pc2UtYmFzZWQgSFRUUCBjbGllbnQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svaW1tdXRhYmxlLWpzXCI+SW1tdXRhYmxlPC9hPiBwZXJzaXN0ZW50IGltbXV0YWJsZSBkYXRhIGZvciBKUzwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmFuZ2UgZnJvbSBcImxvZGFzaC5yYW5nZVwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlcm5hbFBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVuZHBvaW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdG90YWw6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvZmZzZXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsaW1pdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB9XG5cbiAgdG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMucHJvcHMudG90YWwgLyB0aGlzLnByb3BzLmxpbWl0KTtcbiAgfVxuXG4gIG1heE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzKCkgKiB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcHJldk9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0IDw9IDAgPyAwIDogb2Zmc2V0IC0gdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIG5leHRPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA+PSB0aGlzLm1heE9mZnNldCgpID8gdGhpcy5tYXhPZmZzZXQoKSA6IG9mZnNldCArIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGVuZHBvaW50ID0gdGhpcy5wcm9wcy5lbmRwb2ludDtcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8TGluayB0bz17ZW5kcG9pbnR9XG4gICAgICAgICAgICAgIHF1ZXJ5PXt7XCJwYWdlW29mZnNldF1cIjogcHJldk9mZnNldH19XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWluT2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7cHJldk9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxsaSBrZXk9e29mZnNldH0+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89e2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBvZmZzZXR9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBkaXNhYmxlZDogb2Zmc2V0ID09IGN1cnJPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7b2Zmc2V0fWB9PlxuICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBuZXh0T2Zmc2V0fX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtuZXh0T2Zmc2V0fWB9PlxuICAgICAgICAgICAgICA8c3Bhbj4mcmFxdW87PC9zcGFuPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIHsvKlRvdGFsOiB7dGhpcy5wcm9wcy50b3RhbH08YnIvPiovfVxuICAgICAgICB7LypQZXJwYWdlOiB7dGhpcy5wcm9wcy5wZXJwYWdlfTxici8+Ki99XG4gICAgICAgIHsvKlRvdGFsUGFnZXM6IHt0aGlzLnRvdGFsUGFnZXMoKX08YnIvPiovfVxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge2Zvcm1hdEpzb25BcGlRdWVyeX0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9oZWxwZXJzXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9mZnNldDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxpbWl0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMubGltaXQpO1xuICB9XG5cbiAgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXMoKSAqIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBwcmV2T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPD0gMCA/IDAgOiBvZmZzZXQgLSB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgbmV4dE9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0ID49IHRoaXMubWF4T2Zmc2V0KCkgPyB0aGlzLm1heE9mZnNldCgpIDogb2Zmc2V0ICsgdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25DbGljaztcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPG5hdj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKHByZXZPZmZzZXQpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWluT2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7cHJldk9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge3JhbmdlKDAsIG1heE9mZnNldCwgbGltaXQpLm1hcChvZmZzZXQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGtleT17b2Zmc2V0fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DbGljayhvZmZzZXQpfVxuICAgICAgICAgICAgICAgICAgcXVlcnk9e3tcInBhZ2Vbb2Zmc2V0XVwiOiBvZmZzZXR9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBcImJ0bi1saW5rXCI6IHRydWUsIGRpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtvZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgICB7b2Zmc2V0fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG5leHRPZmZzZXQpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtidG46IHRydWUsIFwiYnRuLWxpbmtcIjogdHJ1ZSwgZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWF4T2Zmc2V0fSl9XG4gICAgICAgICAgICAgIHRpdGxlPXtgVG8gb2Zmc2V0ICR7bmV4dE9mZnNldH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICAgIHsvKlRvdGFsOiB7dGhpcy5wcm9wcy50b3RhbH08YnIvPiovfVxuICAgICAgICB7LypQZXJwYWdlOiB7dGhpcy5wcm9wcy5wZXJwYWdlfTxici8+Ki99XG4gICAgICAgIHsvKlRvdGFsUGFnZXM6IHt0aGlzLnRvdGFsUGFnZXMoKX08YnIvPiovfVxuICAgICAgPC9uYXY+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzb3J0QnkgZnJvbSBcImxvZGFzaC5zb3J0YnlcIjtcbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcImxvZGFzaC5pc3BsYWlub2JqZWN0XCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBmdW5jdGlvbiB0b09iamVjdChhcnJheSkge1xuICBpZiAoaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihgYXJyYXkgbXVzdCBiZSBwbGFpbiBBcnJheSwgZ290ICR7YXJyYXl9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChpc1BsYWluT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYG9iamVjdCBtdXN0IGJlIHBsYWluIE9iamVjdCwgZ290ICR7b2JqZWN0fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSkge1xuICByZXR1cm4ge1xuICAgIGZpbHRlcnM6IHF1ZXJ5LmZpbHRlcixcbiAgICBzb3J0czogcXVlcnkuc29ydCA/IHF1ZXJ5LnNvcnQuc3BsaXQoXCIsXCIpLm1hcCh2ID0+IHYucmVwbGFjZSgvXiAvLCBcIitcIikpIDogdW5kZWZpbmVkLFxuICAgIG9mZnNldDogcXVlcnkucGFnZSAmJiAocXVlcnkucGFnZS5vZmZzZXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLm9mZnNldCkgOiB1bmRlZmluZWQsXG4gICAgbGltaXQ6IHF1ZXJ5LnBhZ2UgJiYgKHF1ZXJ5LnBhZ2UubGltaXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBwYXJzZUludChxdWVyeS5wYWdlLmxpbWl0KSA6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEpzb25BcGlRdWVyeShtb2RpZmllcnMpIHtcbiAgaWYgKCFpc1BsYWluT2JqZWN0KG1vZGlmaWVycykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG1vZGlmaWVycyBtdXN0IGJlIHBsYWluIE9iamVjdCwgZ290ICR7bW9kaWZpZXJzfWApO1xuICB9XG5cbiAgbGV0IHNvcnRPYmogPSB7fTtcbiAgbGV0IGZpbHRlck9iaiA9IHt9O1xuICBsZXQgcGFnZU9iaiA9IHt9O1xuXG4gIGlmIChtb2RpZmllcnMuZmlsdGVycykge1xuICAgIGZpbHRlck9iaiA9IE9iamVjdC5rZXlzKG1vZGlmaWVycy5maWx0ZXJzKS5yZWR1Y2UoKGZpbHRlck9iaiwga2V5KSA9PiB7XG4gICAgICBmaWx0ZXJPYmpbYGZpbHRlclske2tleX1dYF0gPSBmaWx0ZXJzW2tleV07XG4gICAgICByZXR1cm4gZmlsdGVyT2JqO1xuICAgIH0sIGZpbHRlck9iaik7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5zb3J0cykge1xuICAgIHNvcnRPYmpbXCJzb3J0XCJdID0gbW9kaWZpZXJzLnNvcnRzLmpvaW4oXCIsXCIpO1xuICB9XG4gIGlmIChtb2RpZmllcnMub2Zmc2V0IHx8IG1vZGlmaWVycy5vZmZzZXQgPT0gMCkge1xuICAgIHBhZ2VPYmpbXCJwYWdlW29mZnNldF1cIl0gPSBtb2RpZmllcnMub2Zmc2V0O1xuICB9XG4gIGlmIChtb2RpZmllcnMubGltaXQgfHwgbW9kaWZpZXJzLmxpbWl0ID09IDApIHtcbiAgICBwYWdlT2JqW1wicGFnZVtsaW1pdF1cIl0gPSBtb2RpZmllcnMubGltaXQ7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc29ydE9iaiwgZmlsdGVyT2JqLCBwYWdlT2JqKTtcbn0iLCJpbXBvcnQgQWxlcnQgZnJvbSBcIi4vbW9kZWxzL2FsZXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtBbGVydH07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IGRhdGEuY2F0ZWdvcnkgPT0gXCJlcnJvclwiID8gMCA6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIFBST1hZIFJPVVRFUiBUTyBSRU1PVkUgQ0lSQ1VMQVIgREVQRU5ERU5DWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR1cm5zOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBhcHAgKHJvdXRlcilcbi8vIHRvOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBwcm94eSAocm91dGVyKVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aChyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VQYXRoKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIG1ha2VIcmVmKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICByZXR1cm4gd2luZG93Ll9yb3V0ZXIubWFrZUhyZWYoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBwYXJhbXMgfHwgY3Vyc29yLmdldChcInBhcmFtc1wiKSxcbiAgICAgIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKVxuICAgICk7XG4gIH0sXG5cbiAgdHJhbnNpdGlvblRvKHJvdXRlPXVuZGVmaW5lZCwgcGFyYW1zPXVuZGVmaW5lZCwgcXVlcnk9dW5kZWZpbmVkKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci50cmFuc2l0aW9uVG8oXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBwYXJhbXMgfHwgY3Vyc29yLmdldChcInBhcmFtc1wiKSxcbiAgICAgIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKVxuICAgICk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQpIHtcbiAgICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICAgIHdpbmRvdy5fcm91dGVyLnJlcGxhY2VXaXRoKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksXG4gICAgICBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIilcbiAgICApO1xuICB9LFxuXG4gIGdvQmFjaygpIHtcbiAgICB3aW5kb3cuX3JvdXRlci5nb0JhY2soKTtcbiAgfSxcblxuICBydW4ocmVuZGVyKSB7XG4gICAgd2luZG93Ll9yb3V0ZXIucnVuKHJlbmRlcik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHByb3h5O1xuXG5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB0YWtlIGZyb20gXCJsb2Rhc2gudGFrZVwiO1xuaW1wb3J0IHNvcnRCeU9yZGVyIGZyb20gXCJsb2Rhc2guc29ydGJ5b3JkZXJcIjtcbmltcG9ydCBCYW9iYWIgZnJvbSBcImJhb2JhYlwiO1xuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcblxuLy8gU1RBVEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IEVYQU1QTEUgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCwgLy8ge3B1Ymxpc2hlZDogdHJ1ZX0gfHwgdW5kZWZpbmVkXG4gIFNPUlRTOiB1bmRlZmluZWQsICAgLy8gW1wiK3B1Ymxpc2hlZEF0XCIsIFwiLWlkXCJdIHx8IHVuZGVmaW5lZFxuICBPRkZTRVQ6IDAsICAgICAgICAgIC8vIDAgfHwgLTFcbiAgTElNSVQ6IDIwLCAgICAgICAgICAvLyAxMCB8fCAyMCB8fCA1MCAuLi5cbn07XG5cbmV4cG9ydCBjb25zdCBST0JPVCA9IHtcbiAgRklMVEVSUzogdW5kZWZpbmVkLFxuICBTT1JUUzogW1wiK25hbWVcIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59O1xuXG5leHBvcnQgY29uc3QgQUxFUlQgPSB7XG4gIEZJTFRFUlM6IHVuZGVmaW5lZCxcbiAgU09SVFM6IFtcIitjcmVhdGVkT25cIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBCYW9iYWIoXG4gIHsgLy8gREFUQVxuICAgIHVybDoge1xuICAgICAgaGFuZGxlcjogdW5kZWZpbmVkLFxuICAgICAgcGFyYW1zOiB1bmRlZmluZWQsXG4gICAgICBxdWVyeTogdW5kZWZpbmVkLFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgIGZpbHRlcnM6IHVuZGVmaW5lZCxcbiAgICAgIHNvcnRzOiB1bmRlZmluZWQsXG4gICAgICBvZmZzZXQ6IHVuZGVmaW5lZCxcbiAgICAgIGxpbWl0OiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIHJvYm90czoge1xuICAgICAgLy8gREFUQVxuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnaW5hdGlvbjoge30sXG5cbiAgICAgIC8vIExPQUQgQVJURUZBQ1RTXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIElOREVYXG4gICAgICBmaWx0ZXJzOiBST0JPVC5GSUxURVJTLFxuICAgICAgc29ydHM6IFJPQk9ULlNPUlRTLFxuICAgICAgb2Zmc2V0OiBST0JPVC5PRkZTRVQsXG4gICAgICBsaW1pdDogUk9CT1QuTElNSVQsXG5cbiAgICAgIC8vIE1PREVMXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgIH0sXG5cbiAgICBhbGVydHM6IHtcbiAgICAgIC8vIERBVEFcbiAgICAgIG1vZGVsczoge30sXG4gICAgICB0b3RhbDogMCxcbiAgICAgIHBhZ2luYXRpb246IHt9LFxuXG4gICAgICAvLyBMT0FEIEFSVEVGQUNUU1xuICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuXG4gICAgICAvLyBJTkRFWFxuICAgICAgZmlsdGVyczogQUxFUlQuRklMVEVSUyxcbiAgICAgIHNvcnRzOiBBTEVSVC5TT1JUUyxcbiAgICAgIG9mZnNldDogQUxFUlQuT0ZGU0VULFxuICAgICAgbGltaXQ6IEFMRVJULkxJTUlULFxuXG4gICAgICAvLyBNT0RFTFxuICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuICB9LFxuICB7IC8vIE9QVElPTlNcbiAgICBmYWNldHM6IHtcbiAgICAgIGN1cnJlbnRSb2JvdDoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQge21vZGVscywgaWR9ID0gZGF0YS5yb2JvdHM7XG4gICAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9kZWxzW2lkXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGN1cnJlbnRSb2JvdHM6IHtcbiAgICAgICAgY3Vyc29yczoge1xuICAgICAgICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgbGV0IHttb2RlbHMsIHBhZ2luYXRpb24sIG9mZnNldH0gPSBkYXRhLnJvYm90cztcbiAgICAgICAgICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICAgICAgICAgIGlmIChpZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBpZHMubWFwKGlkID0+IG1vZGVsc1tpZF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4pO1xuXG4vKipcbiAqIENvbnZlcnRzIHNvcnQgdGFibGUgaW4gKipzaG9ydCoqIGZvcm1hdCB0byBzb3J0IHRhYmxlIGluICoqbG9kYXNoKiogZm9ybWF0XG4gKiBAcGFyYW0gc29ydHMge0FycmF5PHN0cmluZz59IC0gKipzaG9ydCoqIHNvcnQgdGFibGUsIGUuZy4gW1wiK25hbWVcIiwgXCItYWdlXCJdXG4gKiBAcmV0dXJucyB7QXJyYXk8QXJyYXk8c3RyaW5nPj59ICoqbG9kYXNoKiogc29ydCB0YWJsZSwgZS5nLiBbW1wibmFtZVwiLCBcImFnZVwiXSwgW3RydWUsIGZhbHNlXV1cbiAqL1xuZnVuY3Rpb24gbG9kYXNoaWZ5U29ydHMoc29ydHMpIHtcbiAgcmV0dXJuIFtcbiAgICBzb3J0cy5tYXAodiA9PiB2LnNsaWNlKDEpKSxcbiAgICBzb3J0cy5tYXAodiA9PiB2WzBdID09IFwiK1wiKSxcbiAgXTtcbn1cblxuLypcbkNoYW5nZSBmaWx0ZXJzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIHNvcnRzOlxuICAvL2lmIHBhZ2luYXRpb24ubGVuZ3RoIDwgdG90YWw6XG4gIC8vICBwdXJnZSBwYWdpbmF0aW9uIVxuICBmZXRjaCFcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCFcblxuQ2hhbmdlIG9mZnNldDpcbiAgLy9pZiBjYW4ndCBiZSBsb2FkZWQ6XG4gIC8vICBmZXRjaCFcbiAgLy8gdXBkYXRlIHBhZ2luYXRpb25cbiAgcmVkaXJlY3QgdG8gbmV3IG9mZnNldCFcblxuQ2hhbmdlIGxpbWl0OlxuICByZWRpcmVjdCB0byBvZmZzZXQgPSAwISB8fCByZWJ1aWxkIHBhZ2luYXRpb24gYW5kIGlmIGNhbid0IGJlIGxvYWRlZDogZmV0Y2hcbiovIiwiaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9mZXRjaC1pbmRleFwiO1xuXG5pbXBvcnQgbG9hZE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvbG9hZC1tb2RlbFwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtaW5kZXhcIjtcblxuaW1wb3J0IHNldEZpbHRlcnMgZnJvbSBcIi4vYWN0aW9ucy9zZXQtZmlsdGVyc1wiO1xuaW1wb3J0IHNldFNvcnRzIGZyb20gXCIuL2FjdGlvbnMvc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL2FjdGlvbnMvc2V0LW9mZnNldFwiO1xuaW1wb3J0IHNldExpbWl0IGZyb20gXCIuL2FjdGlvbnMvc2V0LWxpbWl0XCI7XG5cbmltcG9ydCBlc3RhYmxpc2hNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbFwiO1xuaW1wb3J0IGVzdGFibGlzaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLWluZGV4XCI7XG5pbXBvcnQgZXN0YWJsaXNoUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1wYWdlXCI7XG5cbmltcG9ydCBhZGQgZnJvbSBcIi4vYWN0aW9ucy9hZGRcIjtcbmltcG9ydCBlZGl0IGZyb20gXCIuL2FjdGlvbnMvZWRpdFwiO1xuaW1wb3J0IHJlbW92ZSBmcm9tIFwiLi9hY3Rpb25zL3JlbW92ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZldGNoTW9kZWwsIGZldGNoSW5kZXgsXG4gIGxvYWRNb2RlbCwgbG9hZEluZGV4LFxuICBzZXRGaWx0ZXJzLCBzZXRTb3J0cywgc2V0T2Zmc2V0LCBzZXRMaW1pdCxcbiAgZXN0YWJsaXNoTW9kZWwsIGVzdGFibGlzaEluZGV4LCBlc3RhYmxpc2hQYWdlLFxuICBhZGQsIGVkaXQsIHJlbW92ZVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90IGZyb20gXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dChhcGlVUkwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3QgZnJvbSBcImZyb250ZW5kL3JvYm90L21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCBhcGlVUkwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQoYXBpVVJMLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzXG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hJbmRleFwiKTtcblxuICBsZXQgdXJsQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuICBsZXQgcm9ib3RzQ3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgdXJsRmlsdGVycyA9IHVybEN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgdXJsU29ydHMgPSB1cmxDdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCB1cmxPZmZzZXQgPSB1cmxDdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgdXJsTGltaXQgPSB1cmxDdXJzb3IuZ2V0KFwibGltaXRcIik7XG5cbiAgaWYgKHVybEZpbHRlcnMpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCB1cmxGaWx0ZXJzKTtcbiAgfVxuICBpZiAodXJsU29ydHMpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwic29ydHNcIiwgdXJsU29ydHMpO1xuICB9XG4gIGlmICh1cmxPZmZzZXQgfHwgdXJsT2Zmc2V0ID09PSAwKSB7XG4gICAgcm9ib3RzQ3Vyc29yLnNldChcIm9mZnNldFwiLCB1cmxPZmZzZXQpO1xuICB9XG4gIGlmICh1cmxMaW1pdCB8fCB1cmxMaW1pdCA9PT0gMCkge1xuICAgIHJvYm90c0N1cnNvci5zZXQoXCJsaW1pdFwiLCB1cmxMaW1pdCk7XG4gIH1cbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZEluZGV4KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHtmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkTW9kZWwgZnJvbSBcIi4vbG9hZC1tb2RlbFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaE1vZGVsXCIpO1xuXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCByb2JvdHNDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCB1cmxJZCA9IHVybEN1cnNvci5nZXQoXCJpZFwiKTtcblxuICBpZiAodXJsSWQpIHtcbiAgICByb2JvdHNDdXJzb3Iuc2V0KFwiaWRcIiwgdXJsSWQpO1xuICB9XG4gIHN0YXRlLmNvbW1pdCgpO1xuXG4gIGxvYWRNb2RlbCgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hQYWdlOlwiLCBwYXJhbXMsIHF1ZXJ5KTtcblxuICAvL2xldCByb2JvdHNDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG5cbiAgLy8gQ0hBTkdFIFNUQVRFXG4gIC8vID8/P1xuICAvL3N0YXRlLmNvbW1pdCgpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdCwgZm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hJbmRleFwiKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzL2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9KTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAvLyBDdXJyZW50IHN0YXRlXG4gICAgICBsZXQgbW9kZWxzID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIpLmdldCgpO1xuICAgICAgbGV0IHBhZ2luYXRpb24gPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJwYWdpbmF0aW9uXCIpLmdldCgpO1xuXG4gICAgICAvLyBOZXcgZGF0YVxuICAgICAgbGV0IHtkYXRhLCBtZXRhfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBsZXQgZmV0Y2hlZE1vZGVscyA9IHRvT2JqZWN0KGRhdGEpO1xuXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIGN1cnNvci5tZXJnZSh7XG4gICAgICAgIHRvdGFsOiBtZXRhLnBhZ2UgJiYgbWV0YS5wYWdlLnRvdGFsIHx8IE9iamVjdC5rZXlzKG1vZGVscykubGVuZ3RoLFxuICAgICAgICBtb2RlbHM6IE9iamVjdC5hc3NpZ24obW9kZWxzLCBmZXRjaGVkTW9kZWxzKSxcbiAgICAgICAgcGFnaW5hdGlvbjogT2JqZWN0LmFzc2lnbihwYWdpbmF0aW9uLCB7W29mZnNldF06IE9iamVjdC5rZXlzKGZldGNoZWRNb2RlbHMpfSksXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICBsb2FkRXJyb3I6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHN0YXRlLmNvbW1pdCgpO1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgIH0pXG4gICAgLmNhdGNoKHJlc3BvbnNlID0+IHtcbiAgICAgIGlmIChyZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IHJlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGxvYWRFcnJvciA9IHtcbiAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICB1cmw6IGFwaVVSTFxuICAgICAgICB9O1xuICAgICAgICBjdXJzb3IubWVyZ2Uoe2xvYWRpbmc6IGZhbHNlLCBsb2FkRXJyb3J9KTtcbiAgICAgICAgc3RhdGUuY29tbWl0KCk7IC8vIEdvZCwgdGhpcyBpcyByZXF1aXJlZCBqdXN0IGFib3V0IGV2ZXJ5d2hlcmUhIDooXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3Q6ZmV0Y2hQYWdlYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hNb2RlbChpZCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hNb2RlbDpcIiwgaWQpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL2N1cnNvci5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9jdXJzb3Iuc2VsZWN0KFwibW9kZWxzXCIpLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgLy8gV09SS0FST1VORDpcbiAgICAgIGN1cnNvci5hcHBseShyb2JvdHMgPT4ge1xuICAgICAgICBsZXQgbW9kZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLm1vZGVscyk7XG4gICAgICAgIG1vZGVsc1ttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJvYm90cywge1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgIG1vZGVsczogbW9kZWxzLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaE1vZGVsYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJmcm9udGVuZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2ZldGNoLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRJbmRleCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgZmlsdGVycyA9IGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgc29ydHMgPSBjdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCBvZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgbGltaXQgPSBjdXJzb3IuZ2V0KFwibGltaXRcIik7XG4gIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgaWYgKCFpZHMgfHwgaWRzLmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2ZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IGFwaVVSTCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZShhcGlVUkwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogbG9hZEVycm9yLFxuICAgICAgfSk7XG4gICAgICByb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogYXBpVVJMXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGxvYWRJbmRleCBmcm9tIFwiLi9sb2FkLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldEZpbHRlcnMoZmlsdGVycykge1xuICBjb25zb2xlLmRlYnVnKFwic2V0RmlsdGVyczpcIiwgZmlsdGVycyk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgY3Vyc29yLnNldChcImZpbHRlcnNcIiwgZmlsdGVycyk7XG4gIC8vIFRPRE8gcmVldmFsdWF0ZSBwYWdpbmF0aW9uXG4gIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIFtdKTtcbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZEluZGV4KCk7XG59XG5cbi8vIEZJTFRFUlxuLy9pZiAoZmlsdGVycykge1xuLy8gIE9iamVjdC5rZXlzKGZpbHRlcnMpLmVhY2goa2V5ID0+IHtcbi8vICAgIG1vZGVscyA9IG1vZGVscy5maWx0ZXIobW9kZWwgPT4gbW9kZWxba2V5XSA9PT0gZmlsdGVyc1trZXldKTtcbi8vICB9KTtcbi8vfSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IHNvcnRCeSBmcm9tIFwibG9kYXNoLnNvcnRieVwiO1xuXG5pbXBvcnQge2NodW5rZWR9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCB7Zm9ybWF0SnNvbkFwaVF1ZXJ5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0TGltaXQobGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcInNldExpbWl0OlwiLCBsaW1pdCk7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IGN1cnJlbnRVcmxQYXJhbXMgPSB1cmxDdXJzb3IuZ2V0KFwicGFyYW1zXCIpO1xuICBsZXQgY3VycmVudFVybFF1ZXJ5ID0gdXJsQ3Vyc29yLmdldChcInF1ZXJ5XCIpO1xuXG4gIGxldCByb2JvdEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSByb2JvdEN1cnNvci5nZXQoXCJvZmZzZXRcIik7XG4gIGxldCBjdXJyZW50TGltaXQgPSByb2JvdEN1cnNvci5nZXQoXCJsaW1pdFwiKTtcbiAgbGV0IGN1cnJlbnRQYWdpbmF0aW9uID0gcm9ib3RDdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICBpZiAobGltaXQgIT0gY3VycmVudExpbWl0KSB7XG4gICAgbGV0IG5ld0xpbWl0ID0gbGltaXQ7XG4gICAgbGV0IG5ld1BhZ2luYXRpb24gPSByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQoY3VycmVudFBhZ2luYXRpb24sIG5ld0xpbWl0KTtcblxuICAgIHJvYm90Q3Vyc29yLnNldChcImxpbWl0XCIsIG5ld0xpbWl0KTtcbiAgICByb2JvdEN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIG5ld1BhZ2luYXRpb24pO1xuICAgIGlmICghbmV3UGFnaW5hdGlvbltjdXJyZW50T2Zmc2V0XSkge1xuICAgICAgbGV0IG5ld09mZnNldCA9IGZpcnN0TGVzc2VyT2Zmc2V0KG5ld1BhZ2luYXRpb24sIGN1cnJlbnRPZmZzZXQpO1xuICAgICAgbGV0IG5ld1VybFF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KHtvZmZzZXQ6IG5ld09mZnNldH0pO1xuICAgICAgcm91dGVyLnRyYW5zaXRpb25Ubyh1bmRlZmluZWQsIHVuZGVmaW5lZCwgbmV3VXJsUXVlcnkpO1xuICAgIH1cbiAgICBzdGF0ZS5jb21taXQoKTtcblxuICAgIGxvYWRJbmRleCgpO1xuICB9XG59XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogUmVjYWxjdWxhdGVzIGBwYWdpbmF0aW9uYCB3aXRoIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIFN1cHBvcnRzIGludmFsaWQgZGF0YSBsaWtlIG92ZXJsYXBwaW5nIG9mZnNldHNcbiAqIEBwdXJlXG4gKiBAcGFyYW0gcGFnaW5hdGlvbiB7T2JqZWN0fSAtIGlucHV0IHBhZ2luYXRpb25cbiAqIEBwYXJhbSBuZXdMaW1pdCB7TnVtYmVyfSAtIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aExpbWl0KHBhZ2luYXRpb24sIG5ld0xpbWl0KSB7XG4gIGlmIChuZXdMaW1pdCA8PTAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBuZXdMaW1pdCBtdXN0IGJlID49IDAsIGdvdCAke25ld0xpbWl0fWApO1xuICB9XG4gIGxldCBtYXhPZmZzZXQgPSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKSk7XG4gIGxldCBsZW5ndGggPSBtYXhPZmZzZXQgKyBwYWdpbmF0aW9uW21heE9mZnNldF0ubGVuZ3RoO1xuICBsZXQgb2Zmc2V0cyA9IHNvcnRCeShPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkpO1xuICBsZXQgZmxhdFZhbHVlcyA9IG9mZnNldHNcbiAgICAucmVkdWNlKChtZW1vLCBvZmZzZXQpID0+IHtcbiAgICAgIHBhZ2luYXRpb25bb2Zmc2V0XS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgICBtZW1vW29mZnNldCArIGldID0gaWQ7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sIEFycmF5KGxlbmd0aCkpO1xuICByZXR1cm4gY2h1bmtlZChmbGF0VmFsdWVzLCBuZXdMaW1pdCkucmVkdWNlKChvYmosIGlkcywgaSkgPT4ge1xuICAgIGlkcyA9IGZpbHRlcihpZHMpO1xuICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICBvYmpbaSAqIG5ld0xpbWl0XSA9IGlkcztcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBvZmZzZXQpIHtcbiAgbGV0IG9mZnNldHMgPSBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkuc29ydCgpLnJldmVyc2UoKTtcbiAgZm9yIChsZXQgbyBvZiBvZmZzZXRzKSB7XG4gICAgaWYgKHBhcnNlSW50KG8pIDwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gbztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDA7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQob2Zmc2V0KSB7XG4gIGNvbnNvbGUuZGVidWcoXCJzZXRPZmZzZXQ6XCIsIG9mZnNldCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IGN1cnJlbnRPZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuXG4gIGlmIChvZmZzZXQgIT0gY3VycmVudE9mZnNldCkge1xuICAgIGxldCBuZXdPZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICBjdXJzb3Iuc2V0KFwib2Zmc2V0XCIsIG5ld09mZnNldCk7XG4gICAgc3RhdGUuY29tbWl0KCk7XG5cbiAgICBsb2FkSW5kZXgoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0U29ydHMoc29ydHMpIHtcbiAgY29uc29sZS5kZWJ1ZyhcInNldFNvcnRzOlwiLCBzb3J0cyk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgY3Vyc29yLnNldChcInNvcnRzXCIsIHNvcnRzKTtcbiAgLy8gVE9ETyByZWV2YWx1YXRlIHBhZ2luYXRpb25cbiAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwgW10pO1xuICBzdGF0ZS5jb21taXQoKTtcblxuICBsb2FkSW5kZXgoKTtcbn1cblxuLy8gU09SVFxuLy9pZiAoc29ydHMpIHtcbi8vICBtb2RlbHMgPSBzb3J0QnlPcmRlcihtb2RlbHMsIC4uLmxvZGFzaGlmeVNvcnRzKHNvcnRzKSk7XG4vL30iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmVzdWx0IGZyb20gXCJsb2Rhc2gucmVzdWx0XCI7XG5pbXBvcnQgaXNBcnJheSBmcm9tIFwibG9kYXNoLmlzYXJyYXlcIjtcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gXCJsb2Rhc2guaXNwbGFpbm9iamVjdFwiO1xuaW1wb3J0IGlzRW1wdHkgZnJvbSBcImxvZGFzaC5pc2VtcHR5XCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJsb2Rhc2guZGVib3VuY2VcIjtcbmltcG9ydCBmbGF0dGVuIGZyb20gXCJsb2Rhc2guZmxhdHRlblwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG4vL2ltcG9ydCBKb2kgZnJvbSBcImpvaVwiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9pbXBvcnQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvYmpba2V5XSkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24obWVtbywgZmxhdHRlbkFuZFJlc2V0VG8ob2JqW2tleV0sIHRvLCBwYXRoICsga2V5KyBcIi5cIikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZW1vW3BhdGggKyBrZXldID0gdG87XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1lbW9bZGV0YWlsLnBhdGhdKSkge1xuLy8gICAgICAgIG1lbW9bZGV0YWlsLnBhdGhdID0gW107XG4vLyAgICAgIH1cbi8vICAgICAgbWVtb1tkZXRhaWwucGF0aF0ucHVzaChkZXRhaWwubWVzc2FnZSk7XG4vLyAgICAgIHJldHVybiBtZW1vO1xuLy8gICAgfSwge30pO1xuLy8gIH0gZWxzZSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgfVxuLy99XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgLy9taXhpbnM6IFstLVJlYWN0Um91dGVyLlN0YXRlLS0sIHN0YXRlLm1peGluXSxcblxuICAvL2N1cnNvcnMoKSB7XG4gIC8vICByZXR1cm4ge1xuICAvLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbiAgLy8gIH1cbiAgLy99LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5BZGQ8L2Rpdj47XG4gICAgLy9sZXQge21vZGVscywgbG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMuc3RhdGUuY3Vyc29ycy5yb2JvdHM7XG4gICAgLy9yZXR1cm4gKFxuICAgIC8vICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGluZz17bG9hZGluZ30gbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz5cbiAgICAvLyk7XG4gIH1cbn0pO1xuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiB7XG4vLyAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIGFzc2VtYmx5RGF0ZTogdW5kZWZpbmVkLFxuLy8gICAgICAgIG1hbnVmYWN0dXJlcjogdW5kZWZpbmVkLFxuLy8gICAgICB9LFxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIC8vdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgLy8gIHJldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIC8vfSxcbi8vXG4vLyAgLy92YWxpZGF0b3JEYXRhKCkge1xuLy8gIC8vICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAvL30sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL3JldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgIC8vICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgIC8vICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbi8vICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4vLyAgICAvL30uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICAvL3JldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4vLyAgICAgIGlmIChpc1ZhbGlkKSB7XG4vLyAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuLy8gICAgICAgIHJvYm90QWN0aW9ucy5hZGQoe1xuLy8gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgfSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4vLyAgICBpZiAoaXNFbXB0eShlcnJvcnMpKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwicGFnZS1hY3Rpb25zXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fSBjbGFzc05hbWU9XCJidG4gYnRuLWdyYXktbGlnaHRcIiB0aXRsZT1cIkJhY2sgdG8gbGlzdFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWxlZnRcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICA8L0xpbms+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4vLyAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj5BZGQgUm9ib3Q8L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+TmFtZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibmFtZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibmFtZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJuYW1lXCIgcmVmPVwibmFtZVwiIHZhbHVlPXttb2RlbC5uYW1lfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibmFtZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm5hbWVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImFzc2VtYmx5RGF0ZVwiPkFzc2VtYmx5IERhdGU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcImFzc2VtYmx5RGF0ZVwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwiYXNzZW1ibHlEYXRlXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cImFzc2VtYmx5RGF0ZVwiIHJlZj1cImFzc2VtYmx5RGF0ZVwiIHZhbHVlPXttb2RlbC5hc3NlbWJseURhdGV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJhc3NlbWJseURhdGVcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vL1xuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5tYW51ZmFjdHVyZXIuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm1hbnVmYWN0dXJlclwiPk1hbnVmYWN0dXJlcjwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwibWFudWZhY3R1cmVyXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJtYW51ZmFjdHVyZXJcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibWFudWZhY3R1cmVyXCIgcmVmPVwibWFudWZhY3R1cmVyXCIgdmFsdWU9e21vZGVsLm1hbnVmYWN0dXJlcn0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm1hbnVmYWN0dXJlclwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcIm1hbnVmYWN0dXJlclwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2ZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVJlc2V0fT5SZXNldDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBkaXNhYmxlZD17IXRoaXMuaXNWYWxpZCgpfSB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L3NlY3Rpb24+XG4vLyAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4vLyAgICAgICk7XG4vLyAgICB9XG4vLyAgfVxuLy99KTtcblxuLypcbjxUZXh0SW5wdXQgbGFiZWw9XCJOYW1lXCIgcGxhY2Vob2xkZXI9XCJOYW1lXCIgaWQ9XCJtb2RlbC5uYW1lXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIkFzc2VtYmx5IERhdGVcIiBwbGFjZWhvbGRlcj1cIkFzc2VtYmx5IERhdGVcIiBpZD1cIm1vZGVsLmFzc2VtYmx5RGF0ZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJNYW51ZmFjdHVyZXJcIiBwbGFjZWhvbGRlcj1cIk1hbnVmYWN0dXJlclwiIGlkPVwibW9kZWwubWFudWZhY3R1cmVyXCIgZm9ybT17dGhpc30vPlxuKi9cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7YnJhbmNofSBmcm9tIFwiYmFvYmFiLXJlYWN0L2RlY29yYXRvcnNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuICBmYWNldHM6IHtcbiAgICBtb2RlbDogXCJjdXJyZW50Um9ib3RcIixcbiAgfSxcbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdERldGFpbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaE1vZGVsO1xuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge2xvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzLnJvYm90cztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJEZXRhaWwgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuaWR9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmFzc2VtYmx5RGF0ZX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5tYW51ZmFjdHVyZXJ9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBpc0FycmF5IGZyb20gXCJsb2Rhc2guaXNhcnJheVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcImxvZGFzaC5pc3BsYWlub2JqZWN0XCI7XG5pbXBvcnQgaXNFbXB0eSBmcm9tIFwibG9kYXNoLmlzZW1wdHlcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG4vL2xldCBWYWxpZGF0b3JzIGZyb20gXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuLy9mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuLy8gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbi8vICBkYXRhID0gZGF0YSB8fCB7fTtcbi8vICBsZXQgam9pT3B0aW9ucyA9IHtcbi8vICAgIGFib3J0RWFybHk6IGZhbHNlLFxuLy8gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuLy8gIH07XG4vLyAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4vLyAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbi8vICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4vLyAgICAgIGVycm9yc1xuLy8gICAgKTtcbi8vICB9IGVsc2Uge1xuLy8gICAgbGV0IHJlc3VsdCA9IHt9O1xuLy8gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgIHJldHVybiByZXN1bHQ7XG4vLyAgfVxuLy99XG5cbi8vZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuLy8gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbi8vICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuLy8gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVtb1tkZXRhaWwucGF0aF0pKSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9jdXJzb3JzKCkge1xuLy8gIHJldHVybiB7XG4vLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbi8vICAgIGxvYWRNb2RlbDogW1wicm9ib3RzXCIsIFwibW9kZWxzXCIsIHRoaXMuZ2V0UGFyYW1zKCkuaWRdLFxuLy8gIH1cbi8vfSxcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90RWRpdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hNb2RlbDtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+RWRpdDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL2xldCBsb2FkTW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubG9hZE1vZGVsO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgIC8vKTtcbiAgfVxufVxuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuLy8gICAgaWYgKGlzRW1wdHkodGhpcy5zdGF0ZS5tb2RlbCkpIHtcbi8vICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHByb3BzLmxvYWRNb2RlbCksXG4vLyAgICAgIH0pXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yVHlwZXMoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgICAvL3JldHVybiBWYWxpZGF0b3JzLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRvckRhdGEoKSB7XG4vLyAgICByZXR1cm4ge307XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRlOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL2xldCBzY2hlbWEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JUeXBlc1wiKSB8fCB7fTtcbi8vICAgIC8vbGV0IGRhdGEgPSByZXN1bHQodGhpcywgXCJ2YWxpZGF0b3JEYXRhXCIpIHx8IHRoaXMuc3RhdGU7XG4vLyAgICAvL2xldCBuZXh0RXJyb3JzID0gbWVyZ2Uoe30sIHRoaXMuc3RhdGUuZXJyb3JzLCB2YWxpZGF0ZShzY2hlbWEsIGRhdGEsIGtleSksIGZ1bmN0aW9uIChhLCBiKSB7XG4vLyAgICAvLyAgcmV0dXJuIGlzQXJyYXkoYikgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgICAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuLy8gICAgLy8gIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbi8vICAgIH0uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbi8vICAgICAgaWYgKGlzVmFsaWQpIHtcbi8vICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4vLyAgICAgICAgcm9ib3RBY3Rpb25zLmVkaXQoe1xuLy8gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4vLyAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBhc3NlbWJseURhdGU6IHRoaXMucmVmcy5hc3NlbWJseURhdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICB9KTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9LFxuLy9cbi8vICBnZXRWYWxpZGF0aW9uTWVzc2FnZXM6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbi8vICAgIGlmIChpc0VtcHR5KGVycm9ycykpIHtcbi8vICAgICAgcmV0dXJuIFtdO1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24gKGVycm9yKSB7XG4vLyAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbi8vICAgICAgICB9KSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgaXNWYWxpZDogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIHRydWU7XG4vLyAgICAvL3JldHVybiBpc0VtcHR5KHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3IsIGxvYWRNb2RlbH0gPSB0aGlzLnByb3BzO1xuLy8gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vXG4vLyAgICBpZiAobG9hZGluZykge1xuLy8gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbi8vICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4vLyAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICByZXR1cm4gKFxuLy8gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbi8vICAgICAgICAgIDxkaXY+XG4vLyAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvYT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbi8vICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHticmFuY2h9IGZyb20gXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgRXh0ZXJuYWxQYWdpbmF0aW9uLCBJbnRlcm5hbFBhZ2luYXRpb259IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90SXRlbSBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pdGVtXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuXG4gIGZhY2V0czoge1xuICAgIGN1cnJlbnRSb2JvdHM6IFwiY3VycmVudFJvYm90c1wiLFxuICB9XG59KVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RJbmRleCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaEluZGV4O1xuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge3RvdGFsLCBsb2FkaW5nLCBsb2FkRXJyb3IsIG9mZnNldCwgbGltaXR9ID0gdGhpcy5wcm9wcy5yb2JvdHM7XG4gICAgbGV0IG1vZGVscyA9IHRoaXMucHJvcHMuY3VycmVudFJvYm90cztcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiByb2JvdEFjdGlvbnMuc2V0TGltaXQoMyl9PlxuICAgICAgICAgICAgICAgICAgICAgIFBlcnBhZ2UgM1xuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1zZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHJvYm90QWN0aW9ucy5zZXRMaW1pdCg1KX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSA1XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gcm9ib3RBY3Rpb25zLnNldExpbWl0KDEwKX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSAxMFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1hZGRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmVlblwiIHRpdGxlPVwiQWRkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXBsdXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbFBhZ2luYXRpb24gZW5kcG9pbnQ9XCJyb2JvdC1pbmRleFwiIHRvdGFsPXt0b3RhbH0gb2Zmc2V0PXtvZmZzZXR9IGxpbWl0PXtsaW1pdH0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxJbnRlcm5hbFBhZ2luYXRpb24gb25DbGljaz17b2Zmc2V0ID0+IHJvYm90QWN0aW9ucy5zZXRPZmZzZXQob2Zmc2V0KX0gdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RJdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBtb2RlbDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGtleT17bW9kZWwuaWR9IGNsYXNzTmFtZT1cImNvbC1zbS02IGNvbC1tZC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIGtleT17bW9kZWwuaWR9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInBhbmVsLXRpdGxlXCI+PExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fT57bW9kZWwubmFtZX08L0xpbms+PC9oND5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWJvZHkgdGV4dC1jZW50ZXIgbm9wYWRkaW5nXCI+XG4gICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19PlxuICAgICAgICAgICAgICA8aW1nIHNyYz17J2h0dHA6Ly9yb2JvaGFzaC5vcmcvJyArIG1vZGVsLmlkICsgJz9zaXplPTIwMHgyMDAnfSB3aWR0aD1cIjIwMHB4XCIgaGVpZ2h0PVwiMjAwcHhcIi8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1mb290ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tYmx1ZVwiIHRpdGxlPVwiRGV0YWlsXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1leWVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZWRpdFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19IGNsYXNzTmFtZT1cImJ0biBidG4tb3JhbmdlXCIgdGl0bGU9XCJFZGl0XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBVVUlEIGZyb20gXCJub2RlLXV1aWRcIjtcblxuLy8gTU9ERUxTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxlcnQoZGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBtZXNzYWdlOiB1bmRlZmluZWQsXG4gICAgY2F0ZWdvcnk6IHVuZGVmaW5lZCxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7Um91dGUsIERlZmF1bHRSb3V0ZSwgTm90Rm91bmRSb3V0ZX0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQge0JvZHksIEhvbWUsIEFib3V0LCBOb3RGb3VuZH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5cbmltcG9ydCBSb2JvdEluZGV4IGZyb20gXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4XCI7XG5pbXBvcnQgUm9ib3RBZGQgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkXCI7XG5pbXBvcnQgUm9ib3REZXRhaWwgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsXCI7XG5pbXBvcnQgUm9ib3RFZGl0IGZyb20gXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2VkaXRcIjtcblxuLy8gUk9VVEVTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgKFxuICA8Um91dGUgcGF0aD1cIi9cIiBoYW5kbGVyPXtCb2R5fT5cbiAgICA8RGVmYXVsdFJvdXRlIGhhbmRsZXI9e0hvbWV9IG5hbWU9XCJob21lXCIvPlxuICAgIDxSb3V0ZSBwYXRoPVwiL2Fib3V0XCIgbmFtZT1cImFib3V0XCIgaGFuZGxlcj17QWJvdXR9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvXCIgbmFtZT1cInJvYm90LWluZGV4XCIgaGFuZGxlcj17Um9ib3RJbmRleH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9hZGRcIiBuYW1lPVwicm9ib3QtYWRkXCIgaGFuZGxlcj17Um9ib3RBZGR9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkXCIgbmFtZT1cInJvYm90LWRldGFpbFwiIGhhbmRsZXI9e1JvYm90RGV0YWlsfS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzLzppZC9lZGl0XCIgbmFtZT1cInJvYm90LWVkaXRcIiBoYW5kbGVyPXtSb2JvdEVkaXR9Lz5cbiAgICA8Tm90Rm91bmRSb3V0ZSBoYW5kbGVyPXtOb3RGb3VuZH0vPlxuICA8L1JvdXRlPlxuKTsiLCIvKipcbiAqIGxvZGFzaCAzLjEuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnbG9kYXNoLl9hcnJheWZpbHRlcicpLFxuICAgIGJhc2VDYWxsYmFjayA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWNhbGxiYWNrJyksXG4gICAgYmFzZUZpbHRlciA9IHJlcXVpcmUoJ2xvZGFzaC5fYmFzZWZpbHRlcicpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXNhcnJheScpLFxuICAgIGtleXMgPSByZXF1aXJlKCdsb2Rhc2gua2V5cycpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzXG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYHByZWRpY2F0ZWAgdGhlIGNyZWF0ZWQgYF8ucHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBJZiBhIHZhbHVlIGlzIGFsc28gcHJvdmlkZWQgZm9yIGB0aGlzQXJnYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzUHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIGEgbWF0Y2hpbmcgcHJvcGVydHlcbiAqIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gKlxuICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgcHJlZGljYXRlYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzYCBzdHlsZVxuICogY2FsbGJhY2sgcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW5cbiAqIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgc2VsZWN0XG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZFxuICogIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYHByZWRpY2F0ZWAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5maWx0ZXIoWzQsIDUsIDZdLCBmdW5jdGlvbihuKSB7XG4gKiAgIHJldHVybiBuICUgMiA9PSAwO1xuICogfSk7XG4gKiAvLyA9PiBbNCwgNl1cbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH1cbiAqIF07XG4gKlxuICogLy8gdXNpbmcgdGhlIGBfLm1hdGNoZXNgIGNhbGxiYWNrIHNob3J0aGFuZFxuICogXy5wbHVjayhfLmZpbHRlcih1c2VycywgeyAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0pLCAndXNlcicpO1xuICogLy8gPT4gWydiYXJuZXknXVxuICpcbiAqIC8vIHVzaW5nIHRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGNhbGxiYWNrIHNob3J0aGFuZFxuICogXy5wbHVjayhfLmZpbHRlcih1c2VycywgJ2FjdGl2ZScsIGZhbHNlKSwgJ3VzZXInKTtcbiAqIC8vID0+IFsnZnJlZCddXG4gKlxuICogLy8gdXNpbmcgdGhlIGBfLnByb3BlcnR5YCBjYWxsYmFjayBzaG9ydGhhbmRcbiAqIF8ucGx1Y2soXy5maWx0ZXIodXNlcnMsICdhY3RpdmUnKSwgJ3VzZXInKTtcbiAqIC8vID0+IFsnYmFybmV5J11cbiAqL1xuZnVuY3Rpb24gZmlsdGVyKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUZpbHRlciA6IGJhc2VGaWx0ZXI7XG4gIHByZWRpY2F0ZSA9IGJhc2VDYWxsYmFjayhwcmVkaWNhdGUsIHRoaXNBcmcsIDMpO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBwcmVkaWNhdGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlcjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIG9yIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbKytyZXNJbmRleF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMS4zIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2Vpc2VxdWFsJyksXG4gICAgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnbG9kYXNoLl9iaW5kY2FsbGJhY2snKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jYWxsYmFja2Agd2hpY2ggc3VwcG9ydHMgc3BlY2lmeWluZyB0aGVcbiAqIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gW2Z1bmM9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJhc2VDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jO1xuICBpZiAodHlwZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnXG4gICAgICA/IGZ1bmNcbiAgICAgIDogYmluZENhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KTtcbiAgfVxuICBpZiAoZnVuYyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlID09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGJhc2VNYXRjaGVzKGZ1bmMpO1xuICB9XG4gIHJldHVybiB0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJ1xuICAgID8gYmFzZVByb3BlcnR5KGZ1bmMgKyAnJylcbiAgICA6IGJhc2VNYXRjaGVzUHJvcGVydHkoZnVuYyArICcnLCB0aGlzQXJnKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hdGNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgc291cmNlIHByb3BlcnR5IG5hbWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSBzb3VyY2UgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gc3RyaWN0Q29tcGFyZUZsYWdzIFN0cmljdCBjb21wYXJpc29uIGZsYWdzIGZvciBzb3VyY2UgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBtYXRjaCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXRjaChvYmplY3QsIHByb3BzLCB2YWx1ZXMsIHN0cmljdENvbXBhcmVGbGFncywgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIG5vQ3VzdG9taXplciA9ICFjdXN0b21pemVyO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgc3RyaWN0Q29tcGFyZUZsYWdzW2luZGV4XSlcbiAgICAgICAgICA/IHZhbHVlc1tpbmRleF0gIT09IG9iamVjdFtwcm9wc1tpbmRleF1dXG4gICAgICAgICAgOiAhKHByb3BzW2luZGV4XSBpbiBvYmplY3QpXG4gICAgICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBpbmRleCA9IC0xO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gdmFsdWVzW2luZGV4XTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgc3RyaWN0Q29tcGFyZUZsYWdzW2luZGV4XSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHR5cGVvZiBvYmpWYWx1ZSAhPSAndW5kZWZpbmVkJyB8fCAoa2V5IGluIG9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5KSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlc3VsdCA9IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgY3VzdG9taXplciwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXMgbm90IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG4gIH1cbiAgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgdmFyIGtleSA9IHByb3BzWzBdLFxuICAgICAgICB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgaWYgKGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIG9iamVjdFtrZXldID09PSB2YWx1ZSAmJlxuICAgICAgICAgICh0eXBlb2YgdmFsdWUgIT0gJ3VuZGVmaW5lZCcgfHwgKGtleSBpbiB0b09iamVjdChvYmplY3QpKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHN0cmljdENvbXBhcmVGbGFncyA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFsdWUgPSBzb3VyY2VbcHJvcHNbbGVuZ3RoXV07XG4gICAgdmFsdWVzW2xlbmd0aF0gPSB2YWx1ZTtcbiAgICBzdHJpY3RDb21wYXJlRmxhZ3NbbGVuZ3RoXSA9IGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBiYXNlSXNNYXRjaCh0b09iamVjdChvYmplY3QpLCBwcm9wcywgdmFsdWVzLCBzdHJpY3RDb21wYXJlRmxhZ3MpO1xuICB9O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNQcm9wZXJ0eWAgd2hpY2ggZG9lcyBub3QgY29lcmNlIGBrZXlgXG4gKiB0byBhIHN0cmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICBpZiAoaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBvYmplY3Rba2V5XSA9PT0gdmFsdWUgJiZcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSAhPSAndW5kZWZpbmVkJyB8fCAoa2V5IGluIHRvT2JqZWN0KG9iamVjdCkpKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgYmFzZUlzRXF1YWwodmFsdWUsIG9iamVjdFtrZXldLCBudWxsLCB0cnVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2hpY2ggZG9lcyBub3QgY29lcmNlIGBrZXlgIHRvIGEgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAodmFsdWUgPT09IDAgPyAoKDEgLyB2YWx1ZSkgPiAwKSA6ICFpc09iamVjdCh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0IGlzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICogdmFyIGdldHRlciA9IF8uY29uc3RhbnQob2JqZWN0KTtcbiAqXG4gKiBnZXR0ZXIoKSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNhbGxiYWNrO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjQgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJyYXknKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2guaXN0eXBlZGFycmF5JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJ2xvZGFzaC5rZXlzJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aXRob3V0IHN1cHBvcnQgZm9yIGB0aGlzYCBiaW5kaW5nXG4gKiBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xvb3NlXSBTcGVjaWZ5IHBlcmZvcm1pbmcgcGFydGlhbCBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0FdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQl0gVHJhY2tzIHRyYXZlcnNlZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIGlkZW50aWNhbCB2YWx1ZXMuXG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICAvLyBUcmVhdCBgKzBgIHZzLiBgLTBgIGFzIG5vdCBlcXVhbC5cbiAgICByZXR1cm4gdmFsdWUgIT09IDAgfHwgKDEgLyB2YWx1ZSA9PSAxIC8gb3RoZXIpO1xuICB9XG4gIHZhciB2YWxUeXBlID0gdHlwZW9mIHZhbHVlLFxuICAgICAgb3RoVHlwZSA9IHR5cGVvZiBvdGhlcjtcblxuICAvLyBFeGl0IGVhcmx5IGZvciB1bmxpa2UgcHJpbWl0aXZlIHZhbHVlcy5cbiAgaWYgKCh2YWxUeXBlICE9ICdmdW5jdGlvbicgJiYgdmFsVHlwZSAhPSAnb2JqZWN0JyAmJiBvdGhUeXBlICE9ICdmdW5jdGlvbicgJiYgb3RoVHlwZSAhPSAnb2JqZWN0JykgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCkge1xuICAgIC8vIFJldHVybiBgZmFsc2VgIHVubGVzcyBib3RoIHZhbHVlcyBhcmUgYE5hTmAuXG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJhc2VJc0VxdWFsLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQik7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIG9iamVjdHMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xvb3NlXSBTcGVjaWZ5IHBlcmZvcm1pbmcgcGFydGlhbCBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IGFycmF5VGFnLFxuICAgICAgb3RoVGFnID0gYXJyYXlUYWc7XG5cbiAgaWYgKCFvYmpJc0Fycikge1xuICAgIG9ialRhZyA9IG9ialRvU3RyaW5nLmNhbGwob2JqZWN0KTtcbiAgICBpZiAob2JqVGFnID09IGFyZ3NUYWcpIHtcbiAgICAgIG9ialRhZyA9IG9iamVjdFRhZztcbiAgICB9IGVsc2UgaWYgKG9ialRhZyAhPSBvYmplY3RUYWcpIHtcbiAgICAgIG9iaklzQXJyID0gaXNUeXBlZEFycmF5KG9iamVjdCk7XG4gICAgfVxuICB9XG4gIGlmICghb3RoSXNBcnIpIHtcbiAgICBvdGhUYWcgPSBvYmpUb1N0cmluZy5jYWxsKG90aGVyKTtcbiAgICBpZiAob3RoVGFnID09IGFyZ3NUYWcpIHtcbiAgICAgIG90aFRhZyA9IG9iamVjdFRhZztcbiAgICB9IGVsc2UgaWYgKG90aFRhZyAhPSBvYmplY3RUYWcpIHtcbiAgICAgIG90aElzQXJyID0gaXNUeXBlZEFycmF5KG90aGVyKTtcbiAgICB9XG4gIH1cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiAhKG9iaklzQXJyIHx8IG9iaklzT2JqKSkge1xuICAgIHJldHVybiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZyk7XG4gIH1cbiAgaWYgKCFpc0xvb3NlKSB7XG4gICAgdmFyIHZhbFdyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aFdyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmICh2YWxXcmFwcGVkIHx8IG90aFdyYXBwZWQpIHtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmModmFsV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LCBvdGhXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQik7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gZGV0ZWN0aW5nIGNpcmN1bGFyIHJlZmVyZW5jZXMgc2VlIGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jSk8uXG4gIHN0YWNrQSB8fCAoc3RhY2tBID0gW10pO1xuICBzdGFja0IgfHwgKHN0YWNrQiA9IFtdKTtcblxuICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IG9iamVjdCkge1xuICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdID09IG90aGVyO1xuICAgIH1cbiAgfVxuICAvLyBBZGQgYG9iamVjdGAgYW5kIGBvdGhlcmAgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICBzdGFja0EucHVzaChvYmplY3QpO1xuICBzdGFja0IucHVzaChvdGhlcik7XG5cbiAgdmFyIHJlc3VsdCA9IChvYmpJc0FyciA/IGVxdWFsQXJyYXlzIDogZXF1YWxPYmplY3RzKShvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcblxuICBzdGFja0EucG9wKCk7XG4gIHN0YWNrQi5wb3AoKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyBhcnJheXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xvb3NlXSBTcGVjaWZ5IHBlcmZvcm1pbmcgcGFydGlhbCBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0FdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQl0gVHJhY2tzIHRyYXZlcnNlZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSB0cnVlO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNMb29zZSAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gIHdoaWxlIChyZXN1bHQgJiYgKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHJlc3VsdCA9IGlzTG9vc2VcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgpXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4KTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgaWYgKGlzTG9vc2UpIHtcbiAgICAgICAgdmFyIG90aEluZGV4ID0gb3RoTGVuZ3RoO1xuICAgICAgICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgICAgICAgIG90aFZhbHVlID0gb3RoZXJbb3RoSW5kZXhdO1xuICAgICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuICEhcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtYmVycywgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzIGFuZCBib29sZWFuc1xuICAgICAgLy8gdG8gYDFgIG9yIGAwYCB0cmVhdGluZyBpbnZhbGlkIGRhdGVzIGNvZXJjZWQgdG8gYE5hTmAgYXMgbm90IGVxdWFsLlxuICAgICAgcmV0dXJuICtvYmplY3QgPT0gK290aGVyO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIFRyZWF0IGBOYU5gIHZzLiBgTmFOYCBhcyBlcXVhbC5cbiAgICAgIHJldHVybiAob2JqZWN0ICE9ICtvYmplY3QpXG4gICAgICAgID8gb3RoZXIgIT0gK290aGVyXG4gICAgICAgIC8vIEJ1dCwgdHJlYXQgYC0wYCB2cy4gYCswYCBhcyBub3QgZXF1YWwuXG4gICAgICAgIDogKG9iamVjdCA9PSAwID8gKCgxIC8gb2JqZWN0KSA9PSAoMSAvIG90aGVyKSkgOiBvYmplY3QgPT0gK290aGVyKTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncyBwcmltaXRpdmVzIGFuZCBzdHJpbmdcbiAgICAgIC8vIG9iamVjdHMgYXMgZXF1YWwuIFNlZSBodHRwczovL2VzNS5naXRodWIuaW8vI3gxNS4xMC42LjQgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNMb29zZV0gU3BlY2lmeSBwZXJmb3JtaW5nIHBhcnRpYWwgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0JdIFRyYWNrcyB0cmF2ZXJzZWQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBvYmpQcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0ga2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzTG9vc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHNraXBDdG9yID0gaXNMb29zZSxcbiAgICAgIGluZGV4ID0gLTE7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdLFxuICAgICAgICByZXN1bHQgPSBpc0xvb3NlID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgICAgcmVzdWx0ID0gaXNMb29zZVxuICAgICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSlcbiAgICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXkpO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgICByZXN1bHQgPSAob2JqVmFsdWUgJiYgb2JqVmFsdWUgPT09IG90aFZhbHVlKSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAoIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPSB0eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPSB0eXBlZEFycmF5VGFnc1ttYXBUYWddID1cbnR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID1cbnR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzZXRUYWddID1cbnR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPSB0eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4xIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlQ2FsbGJhY2tgIHdoaWNoIG9ubHkgc3VwcG9ydHMgYHRoaXNgIGJpbmRpbmdcbiAqIGFuZCBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodGhpc0FyZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbiAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kQ2FsbGJhY2s7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGJhc2VFYWNoID0gcmVxdWlyZSgnbG9kYXNoLl9iYXNlZWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbHRlcmAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBvciBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaWx0ZXIoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmlsdGVyO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBrZXlzID0gcmVxdWlyZSgnbG9kYXNoLmtleXMnKTtcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9ySW5gIGFuZCBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXNcbiAqIG92ZXIgYG9iamVjdGAgcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGludm9raW5nIGBpdGVyYXRlZWAgZm9yXG4gKiBlYWNoIHByb3BlcnR5LiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHlcbiAqIHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uID8gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pIDogMDtcbiAgICBpZiAoIWlzTGVuZ3RoKGxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IHRvT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgYF8uZm9ySW5gIG9yIGBfLmZvckluUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpdGVyYWJsZSA9IHRvT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogaW4gU2FmYXJpIG9uIGlPUyA4LjEgQVJNNjQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBcImxlbmd0aFwiIHZhbHVlLlxuICovXG52YXIgZ2V0TGVuZ3RoID0gYmFzZVByb3BlcnR5KCdsZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0IGlzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKCEhdmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0Jyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuNiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnbG9kYXNoLmlzYXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC5pc2FycmF5JyksXG4gICAgaXNOYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guaXNuYXRpdmUnKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gaXNOYXRpdmUobmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzKSAmJiBuYXRpdmVLZXlzO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIEFuIG9iamVjdCBlbnZpcm9ubWVudCBmZWF0dXJlIGZsYWdzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAdHlwZSBPYmplY3RcbiAqL1xudmFyIHN1cHBvcnQgPSB7fTtcblxuKGZ1bmN0aW9uKHgpIHtcbiAgdmFyIEN0b3IgPSBmdW5jdGlvbigpIHsgdGhpcy54ID0geDsgfSxcbiAgICAgIG9iamVjdCA9IHsgJzAnOiB4LCAnbGVuZ3RoJzogeCB9LFxuICAgICAgcHJvcHMgPSBbXTtcblxuICBDdG9yLnByb3RvdHlwZSA9IHsgJ3ZhbHVlT2YnOiB4LCAneSc6IHggfTtcbiAgZm9yICh2YXIga2V5IGluIG5ldyBDdG9yKSB7IHByb3BzLnB1c2goa2V5KTsgfVxuXG4gIC8qKlxuICAgKiBEZXRlY3QgaWYgYGFyZ3VtZW50c2Agb2JqZWN0IGluZGV4ZXMgYXJlIG5vbi1lbnVtZXJhYmxlLlxuICAgKlxuICAgKiBJbiBGaXJlZm94IDwgNCwgSUUgPCA5LCBQaGFudG9tSlMsIGFuZCBTYWZhcmkgPCA1LjEgYGFyZ3VtZW50c2Agb2JqZWN0XG4gICAqIGluZGV4ZXMgYXJlIG5vbi1lbnVtZXJhYmxlLiBDaHJvbWUgPCAyNSBhbmQgTm9kZS5qcyA8IDAuMTEuMCB0cmVhdFxuICAgKiBgYXJndW1lbnRzYCBvYmplY3QgaW5kZXhlcyBhcyBub24tZW51bWVyYWJsZSBhbmQgZmFpbCBgaGFzT3duUHJvcGVydHlgXG4gICAqIGNoZWNrcyBmb3IgaW5kZXhlcyB0aGF0IGV4Y2VlZCB0aGUgbnVtYmVyIG9mIGZ1bmN0aW9uIHBhcmFtZXRlcnMgYW5kXG4gICAqIHdob3NlIGFzc29jaWF0ZWQgYXJndW1lbnQgdmFsdWVzIGFyZSBgMGAuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICogQHR5cGUgYm9vbGVhblxuICAgKi9cbiAgdHJ5IHtcbiAgICBzdXBwb3J0Lm5vbkVudW1BcmdzID0gIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgc3VwcG9ydC5ub25FbnVtQXJncyA9IHRydWU7XG4gIH1cbn0oMSwgMCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBjcmVhdGVzIGFuIGFycmF5IG9mIHRoZVxuICogb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIHNoaW1LZXlzKG9iamVjdCkge1xuICB2YXIgcHJvcHMgPSBrZXlzSW4ob2JqZWN0KSxcbiAgICAgIHByb3BzTGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gcHJvcHNMZW5ndGggJiYgb2JqZWN0Lmxlbmd0aDtcblxuICB2YXIgYWxsb3dJbmRleGVzID0gbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IChzdXBwb3J0Lm5vbkVudW1BcmdzICYmIGlzQXJndW1lbnRzKG9iamVjdCkpKTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgcHJvcHNMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIGlmICgoYWxsb3dJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbnZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIH1cbiAgaWYgKCh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlID09PSBvYmplY3QpIHx8XG4gICAgICAodHlwZW9mIG9iamVjdCAhPSAnZnVuY3Rpb24nICYmIGlzTGVuZ3RoKGxlbmd0aCkpKSB7XG4gICAgcmV0dXJuIHNoaW1LZXlzKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgPyBuYXRpdmVLZXlzKG9iamVjdCkgOiBbXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzSW4obmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYicsICdjJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xuZnVuY3Rpb24ga2V5c0luKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7XG4gIGxlbmd0aCA9IChsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgKHN1cHBvcnQubm9uRW51bUFyZ3MgJiYgaXNBcmd1bWVudHMob2JqZWN0KSkpICYmIGxlbmd0aCkgfHwgMDtcblxuICB2YXIgQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBpc1Byb3RvID0gdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0LFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHNraXBJbmRleGVzID0gbGVuZ3RoID4gMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSAoaW5kZXggKyAnJyk7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghKHNraXBJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSAmJlxuICAgICAgICAhKGtleSA9PSAnY29uc3RydWN0b3InICYmIChpc1Byb3RvIHx8ICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHZhciBsZW5ndGggPSBpc09iamVjdExpa2UodmFsdWUpID8gdmFsdWUubGVuZ3RoIDogdW5kZWZpbmVkO1xuICByZXR1cm4gaXNMZW5ndGgobGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3NwZWNpYWwgY2hhcmFjdGVyc10oaHR0cDovL3d3dy5yZWd1bGFyLWV4cHJlc3Npb25zLmluZm8vY2hhcmFjdGVycy5odG1sI3NwZWNpYWwpLlxuICogSW4gYWRkaXRpb24gdG8gc3BlY2lhbCBjaGFyYWN0ZXJzIHRoZSBmb3J3YXJkIHNsYXNoIGlzIGVzY2FwZWQgdG8gYWxsb3cgZm9yXG4gKiBlYXNpZXIgYGV2YWxgIHVzZSBhbmQgYEZ1bmN0aW9uYCBjb21waWxhdGlvbi5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhcnMgPSAvWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgcmVIYXNSZWdFeHBDaGFycyA9IFJlZ0V4cChyZVJlZ0V4cENoYXJzLnNvdXJjZSk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpID4gNSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGlmIGl0IGlzIG5vdCBvbmUuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZFxuICogZm9yIGBudWxsYCBvciBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiAodmFsdWUgKyAnJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGVzY2FwZVJlZ0V4cChvYmpUb1N0cmluZylcbiAgLnJlcGxhY2UoL3RvU3RyaW5nfChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNUYWcpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIHRoZSBgUmVnRXhwYCBzcGVjaWFsIGNoYXJhY3RlcnMgXCJcXFwiLCBcIi9cIiwgXCJeXCIsIFwiJFwiLCBcIi5cIiwgXCJ8XCIsIFwiP1wiLFxuICogXCIqXCIsIFwiK1wiLCBcIihcIiwgXCIpXCIsIFwiW1wiLCBcIl1cIiwgXCJ7XCIgYW5kIFwifVwiIGluIGBzdHJpbmdgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byBlc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5lc2NhcGVSZWdFeHAoJ1tsb2Rhc2hdKGh0dHBzOi8vbG9kYXNoLmNvbS8pJyk7XG4gKiAvLyA9PiAnXFxbbG9kYXNoXFxdXFwoaHR0cHM6XFwvXFwvbG9kYXNoXFwuY29tXFwvXFwpJ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gIHN0cmluZyA9IGJhc2VUb1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1JlZ0V4cENoYXJzLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlUmVnRXhwQ2hhcnMsICdcXFxcJCYnKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCdsb2Rhc2guX2Jhc2VzbGljZScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbGljZSBvZiBgYXJyYXlgIHdpdGggYG5gIGVsZW1lbnRzIHRha2VuIGZyb20gdGhlIGJlZ2lubmluZy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHR5cGUgRnVuY3Rpb25cbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPTFdIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gdGFrZS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhIGNhbGxiYWNrIGZvciBmdW5jdGlvbnMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IFsxXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDIpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgNSk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAwKTtcbiAqIC8vID0+IFtdXG4gKi9cbmZ1bmN0aW9uIHRha2UoYXJyYXksIG4sIGd1YXJkKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChndWFyZCA/IGlzSXRlcmF0ZWVDYWxsKGFycmF5LCBuLCBndWFyZCkgOiBuID09IG51bGwpIHtcbiAgICBuID0gMTtcbiAgfVxuICByZXR1cm4gYmFzZVNsaWNlKGFycmF5LCAwLCBuIDwgMCA/IDAgOiBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0YWtlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHN0YXJ0ID0gc3RhcnQgPT0gbnVsbCA/IDAgOiAoK3N0YXJ0IHx8IDApO1xuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgfVxuICBlbmQgPSAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gbGVuZ3RoKSA/IGxlbmd0aCA6ICgrZW5kIHx8IDApO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjYgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBcImxlbmd0aFwiIHByb3BlcnR5IHZhbHVlIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gYXZvaWQgYSBbSklUIGJ1Z10oaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE0Mjc5MilcbiAqIGluIFNhZmFyaSBvbiBpT1MgOC4xIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gK3ZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJykge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgob2JqZWN0KSxcbiAgICAgICAgcHJlcmVxID0gaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGluZGV4LCBsZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIHByZXJlcSA9IHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0O1xuICB9XG4gIGlmIChwcmVyZXEpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICghIXZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gYGNodW5rZWQoWzEsIDIsIDMsIDQsIDVdLCAyKWAgPT4gW1sxLCAyXSwgWzMsIDRdLCBbNV1dXG5leHBvcnQgZnVuY3Rpb24gY2h1bmtlZChhcnJheSwgbikge1xuICBsZXQgbCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyBuKTtcbiAgcmV0dXJuIHJhbmdlKGwpLm1hcCgoeCwgaSkgPT4gYXJyYXkuc2xpY2UoaSpuLCBpKm4gKyBuKSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInV0aWwtaW5zcGVjdFwiO1xuXG4vLyBTSElNUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIb3cgaXQncyBldmVyIG1pc3NlZD8hXG5SZWdFeHAuZXNjYXBlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG59O1xuXG4vLyBVbmNvbW1lbnQgaWYgdXNlIElvSlNcbi8vIGxldCBwcm9jZXNzID0gcHJvY2VzcyB8fCB1bmRlZmluZWQ7XG4vL2lmIChwcm9jZXNzKSB7XG4gIC8vIElvSlMgaGFzIGB1bmhhbmRsZWRSZWplY3Rpb25gIGhvb2tcbiAgLy9wcm9jZXNzLm9uKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIGZ1bmN0aW9uIChyZWFzb24sIHApIHtcbiAgLy8gIHRocm93IEVycm9yKGBVbmhhbmRsZWRSZWplY3Rpb246ICR7cmVhc29ufWApO1xuICAvL30pO1xuLy99IGVsc2Uge1xuICBQcm9taXNlLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gZG9uZShyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzXG4gICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aHJvdyBlOyB9LCAwKTtcbiAgICAgIH0pO1xuICB9O1xuLy99XG5cbi8vIFdvcmthcm91bmQgbWV0aG9kIGFzIG5hdGl2ZSBicm93c2VyIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBJbW11dGFibGUgaXMgYXdmdWxcbmxldCB3aW5kb3cgPSB3aW5kb3cgfHwgdW5kZWZpbmVkO1xuaWYgKHdpbmRvdykge1xuICB3aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gZWNobygpIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IEluc3BlY3QodikpKTtcbiAgfTtcbn0iXX0=
