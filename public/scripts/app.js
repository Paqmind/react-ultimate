(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

require("babel/polyfill");

require("shared/shims");

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _createRouter$HistoryLocation = require("react-router");

var _normalize$parseJsonApiQuery = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _routes = require("frontend/routes");

var _routes2 = _interopRequireDefault(_routes);

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
  var params = _normalize$parseJsonApiQuery.normalize(url.params);
  var query = _normalize$parseJsonApiQuery.normalize(url.query);

  urlCursor.set("handler", handler);
  urlCursor.set("route", url.routes.slice(-1)[0].name);
  urlCursor.set("params", params);
  urlCursor.set("query", query);

  var id = url.params.id;
  if (id) {
    urlCursor.set("id", id);
  }

  var parsedQuery = _normalize$parseJsonApiQuery.parseJsonApiQuery(query);
  if (parsedQuery.hasOwnProperty("filters")) {
    urlCursor.set("filters", parsedQuery.filters);
  }
  if (parsedQuery.hasOwnProperty("sorts")) {
    urlCursor.set("sorts", parsedQuery.sorts);
  }
  if (parsedQuery.hasOwnProperty("offset")) {
    urlCursor.set("offset", parsedQuery.offset);
  }
  if (parsedQuery.hasOwnProperty("limit")) {
    urlCursor.set("limit", parsedQuery.limit);
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
    _React2["default"].render(_React2["default"].createElement(Application, null), document.getElementById("app"));
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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

var _React2 = _interopRequireDefault(_React);

var _type = require('./utils/type.js');

var _type2 = _interopRequireDefault(_type);

var _PropTypes = require('./utils/prop-types.js');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alertFetchModel = require("./actions/alert-fetch-model");

var _alertFetchModel2 = _interopRequireDefault(_alertFetchModel);

var _alertFetchIndex = require("./actions/alert-fetch-index");

var _alertFetchIndex2 = _interopRequireDefault(_alertFetchIndex);

var _alertLoadModel = require("./actions/alert-load-model");

var _alertLoadModel2 = _interopRequireDefault(_alertLoadModel);

var _alertLoadIndex = require("./actions/alert-load-index");

var _alertLoadIndex2 = _interopRequireDefault(_alertLoadIndex);

var _alertAdd = require("./actions/alert-add");

var _alertAdd2 = _interopRequireDefault(_alertAdd);

var _alertRemove = require("./actions/alert-remove");

var _alertRemove2 = _interopRequireDefault(_alertRemove);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _toObject = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _fetchIndex = require("./alert-fetch-index");

var _fetchIndex2 = _interopRequireDefault(_fetchIndex);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _fetchModel = require("./alert-fetch-model");

var _fetchModel2 = _interopRequireDefault(_fetchModel);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

function remove(id) {
  var url = "/api/alerts/" + id;

  // Non-persistent remove
  _state2["default"].select("alerts", "models").unset(id);
}

module.exports = exports["default"];

},{"frontend/common/state":31}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _About = require("./components/about");

var _About2 = _interopRequireDefault(_About);

var _Body = require("./components/body");

var _Body2 = _interopRequireDefault(_Body);

var _Headroom = require("./components/headroom");

var _Headroom2 = _interopRequireDefault(_Headroom);

var _Home = require("./components/home");

var _Home2 = _interopRequireDefault(_Home);

var _Error = require("./components/error");

var _Error2 = _interopRequireDefault(_Error);

var _NotFound = require("./components/not-found");

var _NotFound2 = _interopRequireDefault(_NotFound);

var _Loading = require("./components/loading");

var _Loading2 = _interopRequireDefault(_Loading);

var _InternalPagination = require("./components/pagination-internal");

var _InternalPagination2 = _interopRequireDefault(_InternalPagination);

var _ExternalPagination = require("./components/pagination-external");

var _ExternalPagination2 = _interopRequireDefault(_ExternalPagination);

var _Link = require("./components/link");

var _Link2 = _interopRequireDefault(_Link);

exports["default"] = {
  About: _About2["default"], Body: _Body2["default"], Headroom: _Headroom2["default"], Home: _Home2["default"],
  Error: _Error2["default"], NotFound: _NotFound2["default"], Loading: _Loading2["default"],
  InternalPagination: _InternalPagination2["default"], ExternalPagination: _ExternalPagination2["default"],
  Link: _Link2["default"] };
module.exports = exports["default"];

},{"./components/about":16,"./components/body":19,"./components/error":20,"./components/headroom":21,"./components/home":22,"./components/link":23,"./components/loading":24,"./components/not-found":25,"./components/pagination-external":26,"./components/pagination-internal":27}],16:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

//let CSSTransitionGroup from "rc-css-transition-group";

var _toArray = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Loading = require("frontend/common/components/loading");

var _Loading2 = _interopRequireDefault(_Loading);

var _NotFound = require("frontend/common/components/not-found");

var _NotFound2 = _interopRequireDefault(_NotFound);

var _AlertItem = require("frontend/common/components/alert-item");

var _AlertItem2 = _interopRequireDefault(_AlertItem);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _classNames2 = require("classnames");

var _classNames3 = _interopRequireDefault(_classNames2);

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _root = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Link$RouteHandler = require("react-router");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Component3 = require("frontend/common/component");

var _Component4 = _interopRequireDefault(_Component3);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

var _Headroom = require("frontend/common/components/headroom");

var _Headroom2 = _interopRequireDefault(_Headroom);

var _AlertIndex = require("frontend/common/components/alert-index");

var _AlertIndex2 = _interopRequireDefault(_AlertIndex);

var Menu = (function (_Component) {
  function Menu() {
    _classCallCheck(this, Menu);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Menu, _Component);

  _createClass(Menu, [{
    key: "render",
    value: function render() {
      return _React2["default"].createElement(
        "nav",
        { className: "navbar-collapse navbar-page-header navbar-right effect brackets collapse" + (this.props.menuCollapse ? "in" : "") },
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
      );
    }
  }]);

  return Menu;
})(_Component4["default"]);

var Body = (function (_Component2) {
  function Body() {
    _classCallCheck(this, _Body);

    _get(Object.getPrototypeOf(_Body.prototype), "constructor", this).call(this);
    this.state = {
      menuCollapse: false
    };
  }

  _inherits(Body, _Component2);

  var _Body = Body;

  _createClass(_Body, [{
    key: "hideMenu",

    //static loadPage(params, query) {
    // Ignore params and query
    // establishPage(params, query);
    //return commonActions.alert.loadPage();
    //}

    value: function hideMenu() {
      this.setState({ menuCollapse: false });
    }
  }, {
    key: "onCickOnNavbarToggle",
    value: function onCickOnNavbarToggle(event) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      this.setState({ menuCollapse: !this.state.menuCollapse });
    }
  }, {
    key: "documentClickHandler",
    value: function documentClickHandler() {
      if (!this.state.menuCollapse) {
        return;
      } // Menu should collapsed on any click (on link, on toogler or outside the block)
      this.hideMenu();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "render",
    value: function render() {
      var headroomClassNames = { visible: "navbar-down", hidden: "navbar-up" };
      return _React2["default"].createElement(
        "div",
        null,
        _React2["default"].createElement(
          _Headroom2["default"],
          { component: "header", id: "header", className: "navbar navbar-default", headroomClassNames: headroomClassNames },
          _React2["default"].createElement(
            "div",
            { className: "container" },
            _React2["default"].createElement(
              "div",
              { className: "navbar-header" },
              _React2["default"].createElement(
                "button",
                { className: "navbar-toggle collapsed", type: "button", "data-target": ".navbar-page-header", onClick: this.onCickOnNavbarToggle },
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
            _React2["default"].createElement(Menu, { menuCollapse: this.state.menuCollapse })
          )
        ),
        _React2["default"].createElement(
          "main",
          { id: "main" },
          _React2["default"].createElement(_Link$RouteHandler.RouteHandler, null)
        )
      );
    }
  }]);

  Body = _root.root(_state2["default"])(Body) || Body;
  return Body;
})(_Component4["default"]);

exports["default"] = Body;
module.exports = exports["default"];

// EXPORTS =========================================================================================
/*<AlertIndex/>*/

},{"baobab-react/decorators":2,"frontend/common/actions":7,"frontend/common/component":14,"frontend/common/components/alert-index":17,"frontend/common/components/headroom":21,"frontend/common/state":31,"react":"react","react-router":"react-router"}],20:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _Class2 = require("classnames");

var _Class3 = _interopRequireDefault(_Class2);

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _throttle = require("lodash.throttle");

var _throttle2 = _interopRequireDefault(_throttle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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
    key: "hasScrolled",
    value: function hasScrolled() {
      var windowHeight = window.innerHeight;
      var topPosition = document.body.scrollTop;
      var documentHeight = document.body.clientHeight;

      // Make sure users scroll more than delta
      if (Math.abs(this.lastScrollTop - topPosition) <= this.deltaHeight) {
        return;
      } // If they scrolled down and are past the navbar, add class `this.props.headroomClassNames.visible`.
      // This is necessary so you never see what is "behind" the navbar.
      if (topPosition > this.lastScrollTop && topPosition > this.elementHeight) {
        this.setState({ className: this.props.headroomClassNames.hidden });
      } else {
        if (topPosition + windowHeight < documentHeight) {
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _merge = require("lodash.merge");

var _merge2 = _interopRequireDefault(_merge);

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _ReactRouter = require("react-router");

var _ReactRouter2 = _interopRequireDefault(_ReactRouter);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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
      if (props.hasOwnProperty("withParams")) {
        props.withParams = props.withParams === true ? {} : props.withParams;
        props.params = _merge2["default"]({}, params, props.withParams);
        delete props.withParams;
      }
      if (props.hasOwnProperty("withQuery")) {
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireDefault(_range);

var _Class = require("classnames");

var _Class2 = _interopRequireDefault(_Class);

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _Link = require("./link");

var _Link2 = _interopRequireDefault(_Link);

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
              { className: _Class2["default"]({ disabled: currOffset == minOffset }) },
              _React2["default"].createElement(
                _Link2["default"],
                { to: endpoint,
                  withParams: true,
                  withQuery: { page: { offset: prevOffset } },
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
                { key: offset, className: _Class2["default"]({ disabled: offset == currOffset }) },
                _React2["default"].createElement(
                  _Link2["default"],
                  { to: endpoint,
                    withParams: true,
                    withQuery: { page: { offset: offset } },
                    title: "To offset " + offset },
                  offset
                )
              );
            }),
            _React2["default"].createElement(
              "li",
              { className: _Class2["default"]({ disabled: currOffset == maxOffset }) },
              _React2["default"].createElement(
                _Link2["default"],
                { to: endpoint,
                  withParams: true,
                  withQuery: { page: { offset: nextOffset } },
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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"lodash.range":"lodash.range","react":"react"}],27:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireDefault(_range);

var _Class = require("classnames");

var _Class2 = _interopRequireDefault(_Class);

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _Link = require("./link");

var _Link2 = _interopRequireDefault(_Link);

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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"lodash.range":"lodash.range","react":"react"}],28:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Alert = require("./models/alert");

var _Alert2 = _interopRequireDefault(_Alert);

exports["default"] = { Alert: _Alert2["default"] };
module.exports = exports["default"];

},{"./models/alert":29}],29:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
// IMPORTS =========================================================================================

var _UUID = require("node-uuid");

var _UUID2 = _interopRequireDefault(_UUID);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _merge = require("lodash.merge");

var _merge2 = _interopRequireDefault(_merge);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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
    var withParams = arguments[3] === undefined ? {} : arguments[3];
    var withQuery = arguments[4] === undefined ? {} : arguments[4];

    var cursor = _state2["default"].select("url");
    return window._router.makePath(route || cursor.get("route"), _merge2["default"]({}, params || cursor.get("params"), withParams), _merge2["default"]({}, query || cursor.get("query"), withQuery));
  },

  makeHref: function makeHref() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];
    var withParams = arguments[3] === undefined ? {} : arguments[3];
    var withQuery = arguments[4] === undefined ? {} : arguments[4];

    var cursor = _state2["default"].select("url");
    return window._router.makeHref(route || cursor.get("route"), _merge2["default"]({}, params || cursor.get("params"), withParams), _merge2["default"]({}, query || cursor.get("query"), withQuery));
  },

  transitionTo: function transitionTo() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];
    var withParams = arguments[3] === undefined ? {} : arguments[3];
    var withQuery = arguments[4] === undefined ? {} : arguments[4];

    var cursor = _state2["default"].select("url");
    window._router.transitionTo(route || cursor.get("route"), _merge2["default"]({}, params || cursor.get("params"), withParams), _merge2["default"]({}, query || cursor.get("query"), withQuery));
  },

  replaceWith: function replaceWith() {
    var route = arguments[0] === undefined ? undefined : arguments[0];
    var params = arguments[1] === undefined ? undefined : arguments[1];
    var query = arguments[2] === undefined ? undefined : arguments[2];
    var withParams = arguments[3] === undefined ? {} : arguments[3];
    var withQuery = arguments[4] === undefined ? {} : arguments[4];

    var cursor = _state2["default"].select("url");
    window._router.replaceWith(route || cursor.get("route"), _merge2["default"]({}, params || cursor.get("params"), withParams), _merge2["default"]({}, query || cursor.get("query"), withQuery));
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

},{"frontend/common/state":31,"lodash.merge":"lodash.merge"}],31:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _Baobab = require("baobab");

var _Baobab2 = _interopRequireDefault(_Baobab);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchModel = require("./actions/fetch-model");

var _fetchModel2 = _interopRequireDefault(_fetchModel);

var _fetchIndex = require("./actions/fetch-index");

var _fetchIndex2 = _interopRequireDefault(_fetchIndex);

var _loadModel = require("./actions/load-model");

var _loadModel2 = _interopRequireDefault(_loadModel);

var _loadIndex = require("./actions/load-index");

var _loadIndex2 = _interopRequireDefault(_loadIndex);

var _setFilters = require("./actions/set-filters");

var _setFilters2 = _interopRequireDefault(_setFilters);

var _setSorts = require("./actions/set-sorts");

var _setSorts2 = _interopRequireDefault(_setSorts);

var _setOffset = require("./actions/set-offset");

var _setOffset2 = _interopRequireDefault(_setOffset);

var _setLimit = require("./actions/set-limit");

var _setLimit2 = _interopRequireDefault(_setLimit);

var _setId = require("./actions/set-id");

var _setId2 = _interopRequireDefault(_setId);

var _establishModel = require("./actions/establish-model");

var _establishModel2 = _interopRequireDefault(_establishModel);

var _establishIndex = require("./actions/establish-index");

var _establishIndex2 = _interopRequireDefault(_establishIndex);

var _establishPage = require("./actions/establish-page");

var _establishPage2 = _interopRequireDefault(_establishPage);

var _add = require("./actions/add");

var _add2 = _interopRequireDefault(_add);

var _edit = require("./actions/edit");

var _edit2 = _interopRequireDefault(_edit);

var _remove = require("./actions/remove");

var _remove2 = _interopRequireDefault(_remove);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = add;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

var _Robot = require("frontend/robot/models");

var _Robot2 = _interopRequireDefault(_Robot);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = edit;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

var _Robot = require("frontend/robot/models");

var _Robot2 = _interopRequireDefault(_Robot);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishIndex;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireDefault(_loadIndex);

var _setFilters = require("./set-filters");

var _setFilters2 = _interopRequireDefault(_setFilters);

var _setSorts = require("./set-sorts");

var _setSorts2 = _interopRequireDefault(_setSorts);

var _setOffset = require("./set-offset");

var _setOffset2 = _interopRequireDefault(_setOffset);

var _setLimit = require("./set-limit");

var _setLimit2 = _interopRequireDefault(_setLimit);

function establishIndex() {
  console.debug("establishIndex");

  var cursor = _state2["default"].select("url");

  _setFilters2["default"](cursor.get("filters") || undefined); // false -> undefined
  _setSorts2["default"](cursor.get("sorts") || undefined); // false -> undefined
  _setOffset2["default"](cursor.get("offset"));
  _setLimit2["default"](cursor.get("limit"));

  _loadIndex2["default"]();
}

module.exports = exports["default"];

},{"./load-index":40,"./set-filters":43,"./set-limit":45,"./set-offset":46,"./set-sorts":47,"frontend/common/router":30,"frontend/common/state":31}],36:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishModel;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _loadModel = require("./load-model");

var _loadModel2 = _interopRequireDefault(_loadModel);

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

},{"./load-model":41,"frontend/common/router":30,"frontend/common/state":31}],37:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishPage;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _loadIndex = require("./load-index");

var _loadIndex2 = _interopRequireDefault(_loadIndex);

function establishPage(params, query) {
  console.debug("establishPage:", params, query);

  //let robotsCursor = state.select("robots");

  // CHANGE STATE
  // ???
  //state.commit();
}

module.exports = exports["default"];

},{"./load-index":40,"frontend/common/router":30,"frontend/common/state":31}],38:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _toObject$formatJsonApiQuery = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = fetchModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _toObject = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadIndex;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _toObject = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _fetchIndex = require("./fetch-index");

var _fetchIndex2 = _interopRequireDefault(_fetchIndex);

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

function isMaxOffset(pagination, offset) {
  return offset == Math.max.apply(Math, Object.keys(pagination).map(function (v) {
    return parseInt(v);
  }));
}
module.exports = exports["default"];

},{"./fetch-index":38,"axios":"axios","frontend/common/state":31,"shared/common/helpers":55}],41:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = loadModel;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _fetchModel = require("./fetch-model");

var _fetchModel2 = _interopRequireDefault(_fetchModel);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = remove;
// IMPORTS =========================================================================================

var _Axios = require("axios");

var _Axios2 = _interopRequireDefault(_Axios);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

var _commonActions = require("frontend/common/actions");

var _commonActions2 = _interopRequireDefault(_commonActions);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setFilters;
// IMPORTS =========================================================================================

var _isEqual = require("lodash.isequal");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _filter = require("lodash.filter");

var _filter2 = _interopRequireDefault(_filter);

var _chunked$flattenArrayGroup$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireDefault(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

function setFilters() {
  var filters = arguments[0] === undefined ? _state$ROBOT.ROBOT.FILTERS : arguments[0];

  console.debug("setFilters(" + JSON.stringify(filters) + ")");

  var urlCursor = _state$ROBOT2["default"].select("url");
  var cursor = _state$ROBOT2["default"].select("robots");
  if (!_isEqual2["default"](filters, cursor.get("filters"))) {
    cursor.set("filters", filters);
    var paginationLength = _chunked$flattenArrayGroup$firstLesserOffset.flattenArrayGroup(cursor.get("pagination")).length;
    if (paginationLength && paginationLength >= cursor.get("total")) {
      // Full index loaded – can recalculate pagination
      console.debug("Full index loaded, recalculating pagination...");
      var pagination = recalculatePaginationWithFilters(cursor.get("pagination"), filters, cursor.get("models"), cursor.get("limit"));
      if (!pagination[cursor.get("offset")]) {
        // Number of pages reduced - redirect to closest
        var offset = _chunked$flattenArrayGroup$firstLesserOffset.firstLesserOffset(pagination, cursor.get("offset"));
        _router2["default"].transitionTo(undefined, // route
        undefined, // params
        undefined, // query
        {}, // withParams
        { page: { offset: offset } } // withQuery
        );
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
      var filteredModels = _filter2["default"](unfilteredModels, filters);
      return _chunked$flattenArrayGroup$firstLesserOffset.chunked(filteredModels.map(function (m) {
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

},{"frontend/common/router":30,"frontend/common/state":31,"lodash.filter":"lodash.filter","lodash.isequal":"lodash.isequal","shared/common/helpers":55}],44:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setOffset;
// IMPORTS =========================================================================================

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setLimit;
// IMPORTS =========================================================================================

var _filter = require("lodash.filter");

var _filter2 = _interopRequireDefault(_filter);

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireDefault(_sortBy);

var _chunked$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireDefault(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

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
      var offset = _chunked$firstLesserOffset.firstLesserOffset(pagination, cursor.get("offset"));
      _router2["default"].transitionTo(undefined, // route
      undefined, // params
      undefined, // query
      {}, // withParams
      { page: { offset: offset } } // withQuery
      );
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
        v: _chunked$firstLesserOffset.chunked(ids, limit).reduce(function (obj, offsetIds, i) {
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setOffset;
// IMPORTS =========================================================================================

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireDefault(_state$ROBOT);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = setSorts;
// IMPORTS =========================================================================================

var _isEqual = require("lodash.isequal");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _sortByOrder = require("lodash.sortbyorder");

var _sortByOrder2 = _interopRequireDefault(_sortByOrder);

var _chunked$lodashifySorts$flattenArrayGroup$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireDefault(_state$ROBOT);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _result = require("lodash.result");

var _result2 = _interopRequireDefault(_result);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireDefault(_merge);

var _debounce = require("lodash.debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _flatten = require("lodash.flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _Class = require("classnames");

var _Class2 = _interopRequireDefault(_Class);

//import Joi from "joi";

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

//import Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireDefault(_robotActions);

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
//            <div id="actions">
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _branch = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

// COMPONENTS ======================================================================================

var _robotActions2 = _interopRequireDefault(_robotActions);

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
              { id: "actions" },
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _result = require("lodash.result");

var _result2 = _interopRequireDefault(_result);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireDefault(_merge);

var _debounce = require("lodash.debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _flatten = require("lodash.flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _Class = require("classnames");

var _Class2 = _interopRequireDefault(_Class);

//import Joi from "joi";

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

//let Validators from "shared/robot/validators";

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _Error$Loading$NotFound$Link = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireDefault(_robotActions);

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
//            <div id="actions">
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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _branch = require("baobab-react/decorators");

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _DocumentTitle = require("react-document-title");

var _DocumentTitle2 = _interopRequireDefault(_DocumentTitle);

var _toArray = require("shared/common/helpers");

var _state = require("frontend/common/state");

var _state2 = _interopRequireDefault(_state);

var _Component5 = require("frontend/common/component");

var _Component6 = _interopRequireDefault(_Component5);

var _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireDefault(_robotActions);

var _RobotItem = require("frontend/robot/components/item");

var _RobotItem2 = _interopRequireDefault(_RobotItem);

var _router = require("frontend/common/router");

var _router2 = _interopRequireDefault(_router);

// COMPONENTS ======================================================================================

var PerPage = (function (_Component) {
  function PerPage() {
    _classCallCheck(this, PerPage);

    _get(Object.getPrototypeOf(PerPage.prototype), "constructor", this).call(this);
    this.state = {
      expanded: false
    };
  }

  _inherits(PerPage, _Component);

  _createClass(PerPage, [{
    key: "setLimit",
    value: function setLimit(limit) {
      _robotActions2["default"].setLimit(limit);
      _robotActions2["default"].loadIndex();
      this.hideDropdown();
    }
  }, {
    key: "hideDropdown",
    value: function hideDropdown() {
      this.setState({ expanded: false });
    }
  }, {
    key: "onClickOnHeader",
    value: function onClickOnHeader(event) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      this.setState({ expanded: !this.state.expanded });
    }
  }, {
    key: "documentClickHandler",
    value: function documentClickHandler() {
      this.hideDropdown();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      var items = this.props.options.map(function (item, key) {
        return _React2["default"].createElement(
          "li",
          { key: key, role: "presentation", className: item == self.props.current ? "disabled" : "" },
          _React2["default"].createElement(
            "a",
            { role: "menuitem", tabIndex: "-1", href: "#", onClick: function () {
                return self.setLimit(item);
              } },
            item
          )
        );
      });
      return _React2["default"].createElement(
        "div",
        { className: "dropdown" + (this.state.expanded ? " open" : "") },
        _React2["default"].createElement(
          "button",
          { className: "btn btn-default btn-sm dropdown-toggle", type: "button",
            "data-toggle": "dropdown", "aria-expanded": this.state.expanded, onClick: this.onClickOnHeader },
          "Perpage ",
          this.props.current,
          " ",
          _React2["default"].createElement("span", { className: "caret" })
        ),
        _React2["default"].createElement(
          "ul",
          { className: "dropdown-menu", role: "menu" },
          items
        )
      );
    }
  }]);

  return PerPage;
})(_Component6["default"]);

var SortBy = (function (_Component2) {
  function SortBy() {
    _classCallCheck(this, SortBy);

    _get(Object.getPrototypeOf(SortBy.prototype), "constructor", this).call(this);
    this.state = {
      expanded: false
    };
  }

  _inherits(SortBy, _Component2);

  _createClass(SortBy, [{
    key: "resort",
    value: function resort() {
      this.hideDropdown();
    }
  }, {
    key: "hideDropdown",
    value: function hideDropdown() {
      this.setState({ expanded: false });
    }
  }, {
    key: "onClickOnHeader",
    value: function onClickOnHeader(event) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      this.setState({ expanded: !this.state.expanded });
    }
  }, {
    key: "documentClickHandler",
    value: function documentClickHandler() {
      this.hideDropdown();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener("click", this.documentClickHandler);
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      var items = this.props.options.map(function (item, key) {
        return _React2["default"].createElement(
          "li",
          { key: key, role: "presentation", className: item == self.props.current ? "disabled" : "" },
          _React2["default"].createElement(
            _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
            { role: "menuitem", tabIndex: "-1", to: "robot-index", withQuery: { sort: item }, onClick: self.resort },
            item
          )
        );
      });
      return _React2["default"].createElement(
        "div",
        { className: "dropdown" + (this.state.expanded ? " open" : "") },
        _React2["default"].createElement(
          "button",
          { className: "btn btn-default btn-sm dropdown-toggle", type: "button",
            "data-toggle": "dropdown", "aria-expanded": this.state.expanded, onClick: this.onClickOnHeader },
          "SortBy ",
          this.props.current,
          " ",
          _React2["default"].createElement("span", { className: "caret" })
        ),
        _React2["default"].createElement(
          "ul",
          { className: "dropdown-menu", role: "menu" },
          items
        )
      );
    }
  }]);

  return SortBy;
})(_Component6["default"]);

var Filters = (function (_Component3) {
  function Filters() {
    _classCallCheck(this, Filters);

    if (_Component3 != null) {
      _Component3.apply(this, arguments);
    }
  }

  _inherits(Filters, _Component3);

  _createClass(Filters, [{
    key: "onSubmitFilterForm",
    value: function onSubmitFilterForm(event) {
      event.preventDefault();
      var filters = {};
      for (var i = 0; i < event.target.elements.length; i++) {
        if (event.target.elements[i].name) {
          filters[event.target.elements[i].name] = event.target.elements[i].value;
        }
      }
      _router2["default"].transitionTo("robot-index", {}, { filter: filters });
    }
  }, {
    key: "render",
    value: function render() {
      return _React2["default"].createElement(
        "div",
        { className: "container" },
        _React2["default"].createElement(
          "form",
          { className: "form-inline", onSubmit: this.onSubmitFilterForm },
          _React2["default"].createElement(
            "div",
            { className: "form-group form-group-sm margin-right" },
            _React2["default"].createElement(
              "label",
              { forName: "manufacturer" },
              "Manufacturer"
            ),
            " ",
            _React2["default"].createElement(
              "select",
              { name: "manufacturer", className: "form-control", defaultValue: this.props.current.manufacturer },
              _React2["default"].createElement("option", { key: "0", value: "" }),
              _React2["default"].createElement(
                "option",
                { key: "1", value: "Russia" },
                "Russia"
              ),
              _React2["default"].createElement(
                "option",
                { key: "2", value: "USA" },
                "USA"
              )
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "form-group margin-right-xs" },
            _React2["default"].createElement(
              "button",
              { type: "submit", className: "btn btn-sm btn-primary" },
              "Filter"
            )
          ),
          _React2["default"].createElement(
            "div",
            { className: "form-group margin-right" },
            _React2["default"].createElement(
              _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
              { to: "robot-index", withQuery: { filter: false }, className: "btn btn-sm btn-gray" },
              "Reset"
            )
          )
        )
      );
    }
  }]);

  return Filters;
})(_Component6["default"]);

var RobotIndex = (function (_Component4) {
  function RobotIndex() {
    _classCallCheck(this, _RobotIndex);

    if (_Component4 != null) {
      _Component4.apply(this, arguments);
    }
  }

  _inherits(RobotIndex, _Component4);

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
              { id: "actions" },
              _React2["default"].createElement(
                "div",
                { className: "container margin-bottom" },
                _React2["default"].createElement(
                  "div",
                  { className: "pull-left" },
                  _React2["default"].createElement(PerPage, { current: limit, options: [3, 5, 10] })
                ),
                _React2["default"].createElement(
                  "div",
                  { className: "pull-left" },
                  _React2["default"].createElement(SortBy, { current: this.props.robots.sorts[0], options: ["+name", "-name"] })
                ),
                _React2["default"].createElement(
                  "div",
                  { className: "pull-right" },
                  _React2["default"].createElement(
                    _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
                    { to: "robot-add", className: "btn btn-sm btn-green", title: "Add" },
                    _React2["default"].createElement("span", { className: "fa fa-plus" })
                  )
                )
              ),
              _React2["default"].createElement(Filters, { current: this.props.robots.filters })
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
})(_Component6["default"]);

exports["default"] = RobotIndex;
module.exports = exports["default"];
/* TODO: .sorts[0] => hack, don't know how to do it right */

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/

},{"baobab-react/decorators":2,"frontend/common/component":14,"frontend/common/components":15,"frontend/common/router":30,"frontend/common/state":31,"frontend/robot/actions":32,"frontend/robot/components/item":52,"react":"react","react-document-title":"react-document-title","shared/common/helpers":55}],52:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Component2 = require("frontend/common/component");

var _Component3 = _interopRequireDefault(_Component2);

var _Link = require("frontend/common/components");

var _robotActions = require("frontend/robot/actions");

var _robotActions2 = _interopRequireDefault(_robotActions);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// MODELS ==========================================================================================
exports["default"] = Alert;
// IMPORTS =========================================================================================

var _UUID = require("node-uuid");

var _UUID2 = _interopRequireDefault(_UUID);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
// IMPORTS =========================================================================================

var _React = require("react");

var _React2 = _interopRequireDefault(_React);

var _Route$DefaultRoute$NotFoundRoute = require("react-router");

// Components

var _Body$Home$About$NotFound = require("frontend/common/components");

var _RobotIndex = require("frontend/robot/components/index");

var _RobotIndex2 = _interopRequireDefault(_RobotIndex);

var _RobotAdd = require("frontend/robot/components/add");

var _RobotAdd2 = _interopRequireDefault(_RobotAdd);

var _RobotDetail = require("frontend/robot/components/detail");

var _RobotDetail2 = _interopRequireDefault(_RobotDetail);

var _RobotEdit = require("frontend/robot/components/edit");

var _RobotEdit2 = _interopRequireDefault(_RobotEdit);

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

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

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
exports.normalize = normalize;
// IMPORTS =========================================================================================

var _range = require("lodash.range");

var _range2 = _interopRequireDefault(_range);

var _merge = require("lodash.merge");

var _merge2 = _interopRequireDefault(_merge);

var _sortBy = require("lodash.sortby");

var _sortBy2 = _interopRequireDefault(_sortBy);

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
    offset: query.page && (query.page.offset || query.page.offset == 0) ? query.page.offset : undefined,
    limit: query.page && (query.page.limit || query.page.offset == 0) ? query.page.limit : undefined };
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
      filterObj["filter[" + key + "]"] = modifiers.filters[key];
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

function normalize(data) {
  if (data instanceof Array) {
    return data.map(function (v) {
      return normalize(v);
    });
  } else if (data instanceof Object) {
    return Object.keys(data).reduce(function (obj, k) {
      obj[k] = normalize(data[k]);
      return obj;
    }, {});
  } else if (typeof data == "string") {
    if (data === "false") {
      return false;
    } else if (data === "true") {
      return true;
    } else if (data === "undefined") {
      return undefined;
    } else if (data === "null") {
      return null;
    } else if (data.match(/^-?\d+\.\d+/)) {
      return parseFloat(data);
    } else if (data.match(/^-?\d+/)) {
      return parseInt(data);
    } else {
      return data;
    }
  } else {
    return data;
  }
}

},{"lodash.merge":"lodash.merge","lodash.range":"lodash.range","lodash.sortby":"lodash.sortby"}],56:[function(require,module,exports){
"use strict";

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

var _Inspect = require("util-inspect");

var _Inspect2 = _interopRequireDefault(_Inspect);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xpbmsuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1leHRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9wYWdpbmF0aW9uLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL21vZGVscy9hbGVydC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1wYWdlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9mZXRjaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWZpbHRlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtaWQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtbGltaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtb2Zmc2V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LXNvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNDTyxnQkFBZ0I7O1FBQ2hCLGNBQWM7O3FCQUVILE9BQU87Ozs7NENBQzZCLGNBQWM7OzJDQUV6Qix1QkFBdUI7O3FCQUNoRCx1QkFBdUI7Ozs7c0JBQ3RCLGlCQUFpQjs7Ozs7QUFHcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyw4QkFQVCxNQUFNLENBT2dCO0FBQzVCLFFBQU0scUJBQVE7QUFDZCxVQUFRLGdDQVRzQixlQUFlLEFBU3BCO0NBQzFCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUs7Ozs7O0FBS3ZDLFNBQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUc1QixNQUFJLFNBQVMsR0FBRyxtQkFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEMsTUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDM0MsTUFBSSxNQUFNLEdBQUcsNkJBcEJQLFNBQVMsQ0FvQlEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLE1BQUksS0FBSyxHQUFHLDZCQXJCTixTQUFTLENBcUJPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFakMsV0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDbEMsV0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyRCxXQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoQyxXQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFOUIsTUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDdkIsTUFBSSxFQUFFLEVBQUU7QUFDTixhQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxNQUFJLFdBQVcsR0FBRyw2QkFqQ0QsaUJBQWlCLENBaUNFLEtBQUssQ0FBQyxDQUFDO0FBQzNDLE1BQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUN6QyxhQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDL0M7QUFDRCxNQUFJLFdBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDdkMsYUFBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzNDO0FBQ0QsTUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3hDLGFBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM3QztBQUNELE1BQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN2QyxhQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDM0M7O0FBRUQscUJBQU0sTUFBTSxFQUFFLENBQUM7OztBQUdmLE1BQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQ3RCLEdBQUcsQ0FBQyxVQUFBLEtBQUs7V0FBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFO0dBQUEsQ0FBQyxDQUMxQyxHQUFHLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDZixRQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDckIsY0FBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3JCO0dBQ0YsQ0FBQyxDQUFDOztBQUVMLFNBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDL0IsdUJBQU0sTUFBTSxDQUFDLGlDQUFDLFdBQVcsT0FBRSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUM5RCxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7OztBQ3BFSDtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7K0JDdEI0Qiw2QkFBNkI7Ozs7K0JBQzdCLDZCQUE2Qjs7Ozs4QkFFOUIsNEJBQTRCOzs7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QUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQ2hCLENBQUMsVUFBQSxDQUFDLEVBQUk7QUFDVixjQUFVLENBQUMsWUFBTTtBQUFFLFlBQU0sQ0FBQyxDQUFDO0tBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNuQyxDQUFDLENBQUM7Q0FDTixDQUFDOzs7O0FBSUosSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sRUFBRTtBQUNWLFFBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxHQUFHO0FBQ3BDLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQzthQUFJLHFCQUFRLENBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFDO0dBQ3hGLENBQUM7Q0FDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgXCJiYWJlbC9wb2x5ZmlsbFwiO1xuaW1wb3J0IFwic2hhcmVkL3NoaW1zXCI7XG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7Y3JlYXRlIGFzIGNyZWF0ZVJvdXRlciwgSGlzdG9yeUxvY2F0aW9ufSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbmltcG9ydCB7bm9ybWFsaXplLCBwYXJzZUpzb25BcGlRdWVyeX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXMgZnJvbSBcImZyb250ZW5kL3JvdXRlc1wiO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG53aW5kb3cuX3JvdXRlciA9IGNyZWF0ZVJvdXRlcih7XG4gIHJvdXRlczogcm91dGVzLFxuICBsb2NhdGlvbjogSGlzdG9yeUxvY2F0aW9uXG59KTtcblxud2luZG93Ll9yb3V0ZXIucnVuKChBcHBsaWNhdGlvbiwgdXJsKSA9PiB7XG4gIC8vIHlvdSBtaWdodCB3YW50IHRvIHB1c2ggdGhlIHN0YXRlIG9mIHRoZSByb3V0ZXIgdG8gYVxuICAvLyBzdG9yZSBmb3Igd2hhdGV2ZXIgcmVhc29uXG4gIC8vIFJvdXRlckFjdGlvbnMucm91dGVDaGFuZ2Uoe3JvdXRlclN0YXRlOiBzdGF0ZX0pO1xuXG4gIGNvbnNvbGUuZGVidWcoXCJyb3V0ZXIucnVuXCIpO1xuXG4gIC8vIFNFVCBCQU9CQUIgVVJMIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCBoYW5kbGVyID0gdXJsLnJvdXRlcy5zbGljZSgtMSlbMF0ubmFtZTtcbiAgbGV0IHBhcmFtcyA9IG5vcm1hbGl6ZSh1cmwucGFyYW1zKTtcbiAgbGV0IHF1ZXJ5ID0gbm9ybWFsaXplKHVybC5xdWVyeSk7XG5cbiAgdXJsQ3Vyc29yLnNldChcImhhbmRsZXJcIiwgaGFuZGxlcik7XG4gIHVybEN1cnNvci5zZXQoXCJyb3V0ZVwiLCB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lKTtcbiAgdXJsQ3Vyc29yLnNldChcInBhcmFtc1wiLCBwYXJhbXMpO1xuICB1cmxDdXJzb3Iuc2V0KFwicXVlcnlcIiwgcXVlcnkpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gIH1cblxuICBsZXQgcGFyc2VkUXVlcnkgPSBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSk7XG4gIGlmIChwYXJzZWRRdWVyeS5oYXNPd25Qcm9wZXJ0eShcImZpbHRlcnNcIikpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCBwYXJzZWRRdWVyeS5maWx0ZXJzKTtcbiAgfVxuICBpZiAocGFyc2VkUXVlcnkuaGFzT3duUHJvcGVydHkoXCJzb3J0c1wiKSkge1xuICAgIHVybEN1cnNvci5zZXQoXCJzb3J0c1wiLCBwYXJzZWRRdWVyeS5zb3J0cyk7XG4gIH1cbiAgaWYgKHBhcnNlZFF1ZXJ5Lmhhc093blByb3BlcnR5KFwib2Zmc2V0XCIpKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcIm9mZnNldFwiLCBwYXJzZWRRdWVyeS5vZmZzZXQpO1xuICB9XG4gIGlmIChwYXJzZWRRdWVyeS5oYXNPd25Qcm9wZXJ0eShcImxpbWl0XCIpKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcImxpbWl0XCIsIHBhcnNlZFF1ZXJ5LmxpbWl0KTtcbiAgfVxuXG4gIHN0YXRlLmNvbW1pdCgpO1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGxldCBwcm9taXNlcyA9IHVybC5yb3V0ZXNcbiAgICAubWFwKHJvdXRlID0+IHJvdXRlLmhhbmRsZXIub3JpZ2luYWwgfHwge30pXG4gICAgLm1hcChvcmlnaW5hbCA9PiB7XG4gICAgICBpZiAob3JpZ2luYWwubG9hZERhdGEpIHtcbiAgICAgICAgb3JpZ2luYWwubG9hZERhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgUmVhY3QucmVuZGVyKDxBcHBsaWNhdGlvbi8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKSk7XG4gIH0pO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJvb3QgPSByb290O1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBEZWNvcmF0b3JzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzcgZGVjb3JhdG9ycyBzdWdhciBmb3IgaGlnaGVyIG9yZGVyIGNvbXBvbmVudHMuXG4gKi9cblxudmFyIF9Sb290JEJyYW5jaCA9IHJlcXVpcmUoJy4vaGlnaGVyLW9yZGVyLmpzJyk7XG5cbmZ1bmN0aW9uIHJvb3QodHJlZSkge1xuICBpZiAodHlwZW9mIHRyZWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLnJvb3QodHJlZSk7XG4gIH1yZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0YXJnZXQsIHRyZWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBicmFuY2goc3BlY3MpIHtcbiAgaWYgKHR5cGVvZiBzcGVjcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2guYnJhbmNoKHNwZWNzKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2godGFyZ2V0LCBzcGVjcyk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlRGVmYXVsdCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBSb290IGNvbXBvbmVudFxuICovXG5leHBvcnRzLnJvb3QgPSByb290O1xuXG4vKipcbiAqIEJyYW5jaCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBIaWdoZXIgT3JkZXIgQ29tcG9uZW50XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzYgaGlnaGVyIG9yZGVyIGNvbXBvbmVudCB0byBlbmNoYW5jZSBvbmUncyBjb21wb25lbnQuXG4gKi9cblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUmVhY3QpO1xuXG52YXIgX3R5cGUgPSByZXF1aXJlKCcuL3V0aWxzL3R5cGUuanMnKTtcblxudmFyIF90eXBlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGUpO1xuXG52YXIgX1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vdXRpbHMvcHJvcC10eXBlcy5qcycpO1xuXG52YXIgX1Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Qcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiByb290KENvbXBvbmVudCwgdHJlZSkge1xuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLkJhb2JhYih0cmVlKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdDpoaWdoZXItb3JkZXIucm9vdDogZ2l2ZW4gdHJlZSBpcyBub3QgYSBCYW9iYWIuJyk7XG5cbiAgdmFyIENvbXBvc2VkQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgdmFyIF9jbGFzcyA9IGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG5cbiAgICAgIGlmIChfUmVhY3QkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5oZXJpdHMoX2NsYXNzLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG4gICAgICBrZXk6ICdnZXRDaGlsZENvbnRleHQnLFxuXG4gICAgICAvLyBIYW5kbGluZyBjaGlsZCBjb250ZXh0XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgdGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6ICdvcmlnaW5hbCcsXG4gICAgICB2YWx1ZTogQ29tcG9uZW50LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3M7XG4gIH0pKF9SZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG4gIHJldHVybiBDb21wb3NlZENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYnJhbmNoKENvbXBvbmVudCkge1xuICB2YXIgc3BlY3MgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gIGlmICghX3R5cGUyWydkZWZhdWx0J10uT2JqZWN0KHNwZWNzKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdC5oaWdoZXItb3JkZXI6IGludmFsaWQgc3BlY2lmaWNhdGlvbnMgJyArICcoc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIGN1cnNvcnMgYW5kL29yIGZhY2V0cyBrZXkpLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudDIpIHtcbiAgICB2YXIgX2NsYXNzMiA9XG5cbiAgICAvLyBCdWlsZGluZyBpbml0aWFsIHN0YXRlXG4gICAgZnVuY3Rpb24gQ29tcG9zZWRDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MyKTtcblxuICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzMi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgdmFyIGZhY2V0ID0gY29udGV4dC50cmVlLmNyZWF0ZUZhY2V0KHNwZWNzLCBbcHJvcHMsIGNvbnRleHRdKTtcblxuICAgICAgaWYgKGZhY2V0KSB0aGlzLnN0YXRlID0gZmFjZXQuZ2V0KCk7XG5cbiAgICAgIHRoaXMuZmFjZXQgPSBmYWNldDtcbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzczIsIF9SZWFjdCRDb21wb25lbnQyKTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MyLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gQ2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjdXJzb3JzOiB0aGlzLmZhY2V0LmN1cnNvcnNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCBtb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH12YXIgaGFuZGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmZhY2V0Lm9uKCd1cGRhdGUnLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsVW5tb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCB1bm1vdW50XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBSZWxlYXNpbmcgZmFjZXRcbiAgICAgICAgdGhpcy5mYWNldC5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZmFjZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuXG4gICAgICAvLyBPbiBuZXcgcHJvcHNcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfXRoaXMuZmFjZXQucmVmcmVzaChbcHJvcHMsIHRoaXMuY29udGV4dF0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZmFjZXQuZ2V0KCkpO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdHJlZTogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5iYW9iYWJcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY2hpbGRDb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgY3Vyc29yczogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5jdXJzb3JzXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3MyO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgQ3VzdG9tIFByb3AgVHlwZXNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBQcm9wVHlwZXMgdXNlZCB0byBwcm9wYWdhdGUgY29udGV4dCBzYWZlbHkuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSByZXF1aXJlKCcuL3R5cGUuanMnKTtcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlKHByb3BOYW1lLCB3aGF0KSB7XG4gIHJldHVybiAncHJvcCB0eXBlIGAnICsgcHJvcE5hbWUgKyAnYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlICcgKyB3aGF0ICsgJy4nO1xufVxuXG52YXIgUHJvcFR5cGVzID0ge307XG5cblByb3BUeXBlcy5iYW9iYWIgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIGlmICghdHlwZS5CYW9iYWIocHJvcHNbcHJvcE5hbWVdKSkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdhIEJhb2JhYiB0cmVlJykpO1xufTtcblxuUHJvcFR5cGVzLmN1cnNvcnMgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIHZhciBwID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gIHZhciB2YWxpZCA9IHR5cGUuT2JqZWN0KHApICYmIE9iamVjdC5rZXlzKHApLmV2ZXJ5KGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIHR5cGUuQ3Vyc29yKHBba10pO1xuICB9KTtcblxuICBpZiAoIXZhbGlkKSByZXR1cm4gbmV3IEVycm9yKGVycm9yTWVzc2FnZShwcm9wTmFtZSwgJ0Jhb2JhYiBjdXJzb3JzJykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9wVHlwZXM7IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgVHlwZSBDaGVja2luZ1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogU29tZSBoZWxwZXJzIHRvIHBlcmZvcm0gcnVudGltZSB2YWxpZGF0aW9ucy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHt9O1xuXG50eXBlLk9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbn07XG5cbnR5cGUuQmFvYmFiID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQmFvYmFiXSc7XG59O1xuXG50eXBlLkN1cnNvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEN1cnNvcl0nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlOyIsImltcG9ydCBhbGVydEZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGFsZXJ0RmV0Y2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydExvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtbW9kZWxcIjtcbmltcG9ydCBhbGVydExvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtaW5kZXhcIjtcblxuaW1wb3J0IGFsZXJ0QWRkIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtYWRkXCI7XG5pbXBvcnQgYWxlcnRSZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbGVydDoge1xuICAgIGZldGNoTW9kZWw6IGFsZXJ0RmV0Y2hNb2RlbCxcbiAgICBmZXRjaEluZGV4OiBhbGVydEZldGNoSW5kZXgsXG4gICAgbG9hZE1vZGVsOiBhbGVydExvYWRNb2RlbCxcbiAgICBsb2FkSW5kZXg6IGFsZXJ0TG9hZEluZGV4LFxuICAgIGFkZDogYWxlcnRBZGQsXG4gICAgcmVtb3ZlOiBhbGVydFJlbW92ZSxcbiAgfSxcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCB7QWxlcnR9IGZyb20gXCJmcm9udGVuZC9jb21tb24vbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoSW5kZXhcIik7XG5cbiAgbGV0IHVybCA9IGBhcGkvYWxlcnRzYDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcblxuICBjdXJzb3IubWVyZ2Uoe1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgIHRvdGFsOiAwLFxuICAgIG1vZGVsczoge30sXG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoTW9kZWwoaWQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoTW9kZWw6XCIsIGlkKTtcblxuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgyMDApOyAvLyBIVFRQIHJlc3BvbnNlLnN0YXR1c1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRJbmRleCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpO1xuICBsZXQgZmlsdGVycyA9IGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgc29ydHMgPSBjdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCBvZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgbGltaXQgPSBjdXJzb3IuZ2V0KFwibGltaXRcIik7XG4gIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgaWYgKCFpZHMpIHtcbiAgICBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWxlcnQtZmV0Y2gtbW9kZWxcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZE1vZGVsXCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBtb2RlbHMgPSBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpO1xuICBsZXQgaWQgPSBjdXJzb3IuZ2V0KFwiaWRcIik7XG5cbiAgbGV0IG1vZGVsID0gbW9kZWxzW2lkXTtcbiAgaWYgKCFtb2RlbCkge1xuICAgIGZldGNoTW9kZWwoaWQpO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCB1cmwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbi1wZXJzaXN0ZW50IHJlbW92ZVxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZ2V0QWxsTWV0aG9kcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZmlsdGVyKGtleSA9PiB0eXBlb2Ygb2JqW2tleV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gYXV0b0JpbmQob2JqKSB7XG4gIGdldEFsbE1ldGhvZHMob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSlcbiAgICAuZm9yRWFjaChtdGQgPT4ge1xuICAgICAgb2JqW210ZF0gPSBvYmpbbXRkXS5iaW5kKG9iaik7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9CaW5kKHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IEFib3V0IGZyb20gXCIuL2NvbXBvbmVudHMvYWJvdXRcIjtcbmltcG9ydCBCb2R5IGZyb20gXCIuL2NvbXBvbmVudHMvYm9keVwiO1xuaW1wb3J0IEhlYWRyb29tIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZHJvb21cIjtcbmltcG9ydCBIb21lIGZyb20gXCIuL2NvbXBvbmVudHMvaG9tZVwiO1xuXG5pbXBvcnQgRXJyb3IgZnJvbSBcIi4vY29tcG9uZW50cy9lcnJvclwiO1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gXCIuL2NvbXBvbmVudHMvbm90LWZvdW5kXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIjtcblxuaW1wb3J0IEludGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24taW50ZXJuYWxcIjtcbmltcG9ydCBFeHRlcm5hbFBhZ2luYXRpb24gZnJvbSBcIi4vY29tcG9uZW50cy9wYWdpbmF0aW9uLWV4dGVybmFsXCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9jb21wb25lbnRzL2xpbmtcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBBYm91dCwgQm9keSwgSGVhZHJvb20sIEhvbWUsXG4gIEVycm9yLCBOb3RGb3VuZCwgTG9hZGluZyxcbiAgSW50ZXJuYWxQYWdpbmF0aW9uLCBFeHRlcm5hbFBhZ2luYXRpb24sXG4gIExpbmssXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBMb2FkaW5nIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCI7XG5pbXBvcnQgTm90Rm91bmQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiO1xuaW1wb3J0IEFsZXJ0SXRlbSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaXRlbVwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW3N0YXRlLm1peGluXSxcblxuICBjdXJzb3JzOiB7XG4gICAgYWxlcnRzOiBbXCJhbGVydHNcIl0sXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmFsZXJ0cztcbiAgICBtb2RlbHMgPSB0b0FycmF5KG1vZGVscyk7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbnMgdG9wLWxlZnRcIj5cbiAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAge2xvYWRpbmcgPyA8TG9hZGluZy8+IDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIENhbid0IHJ1biB0aGlzIGNyYXAgZm9yIG5vdyBUT0RPIHJlY2hlY2sgYWZ0ZXIgdHJhbnNpdGlvbiB0byBXZWJwYWNrXG4vLyAxKSByZWFjdC9hZGRvbnMgcHVsbHMgd2hvbGUgbmV3IHJlYWN0IGNsb25lIGluIGJyb3dzZXJpZnlcbi8vIDIpIHJjLWNzcy10cmFuc2l0aW9uLWdyb3VwIGNvbnRhaW5zIHVuY29tcGlsZWQgSlNYIHN5bnRheFxuLy8gT01HIHdoYXQgYW4gaWRpb3RzICZfJlxuXG4vLzxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4vLyAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuLy88L0NTU1RyYW5zaXRpb25Hcm91cD5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7cm9vdH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmssIFJvdXRlSGFuZGxlcn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCI7XG5pbXBvcnQgQWxlcnRJbmRleCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIjtcblxuXG5jbGFzcyBNZW51IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bmF2IGNsYXNzTmFtZT17XCJuYXZiYXItY29sbGFwc2UgbmF2YmFyLXBhZ2UtaGVhZGVyIG5hdmJhci1yaWdodCBlZmZlY3QgYnJhY2tldHMgY29sbGFwc2VcIiArICh0aGlzLnByb3BzLm1lbnVDb2xsYXBzZSA/IFwiaW5cIiA6IFwiXCIpfT5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdiBuYXZiYXItbmF2XCI+XG4gICAgICAgICAgPGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cbiAgICAgICAgICA8bGk+PExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHBhcmFtcz17e3BhZ2U6IDF9fT5Sb2JvdHM8L0xpbms+PC9saT5cbiAgICAgICAgICA8bGk+PExpbmsgdG89XCJhYm91dFwiPkFib3V0PC9MaW5rPjwvbGk+XG4gICAgICAgIDwvdWw+XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9XG59XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkByb290KHN0YXRlKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9keSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lbnVDb2xsYXBzZTogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgLy9zdGF0aWMgbG9hZFBhZ2UocGFyYW1zLCBxdWVyeSkge1xuICAgIC8vIElnbm9yZSBwYXJhbXMgYW5kIHF1ZXJ5XG4gICAgLy8gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KTtcbiAgICAvL3JldHVybiBjb21tb25BY3Rpb25zLmFsZXJ0LmxvYWRQYWdlKCk7XG4gIC8vfVxuXG4gIGhpZGVNZW51KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe21lbnVDb2xsYXBzZTogZmFsc2V9KTtcbiAgfVxuXG4gIG9uQ2lja09uTmF2YmFyVG9nZ2xlKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQubmF0aXZlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7bWVudUNvbGxhcHNlOiAhdGhpcy5zdGF0ZS5tZW51Q29sbGFwc2V9KTtcbiAgfVxuXG4gIGRvY3VtZW50Q2xpY2tIYW5kbGVyKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5tZW51Q29sbGFwc2UpIHJldHVybjtcblxuICAgIC8vIE1lbnUgc2hvdWxkIGNvbGxhcHNlZCBvbiBhbnkgY2xpY2sgKG9uIGxpbmssIG9uIHRvb2dsZXIgb3Igb3V0c2lkZSB0aGUgYmxvY2spXG4gICAgdGhpcy5oaWRlTWVudSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZG9jdW1lbnRDbGlja0hhbmRsZXIpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZG9jdW1lbnRDbGlja0hhbmRsZXIpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBoZWFkcm9vbUNsYXNzTmFtZXMgPSB7dmlzaWJsZTogXCJuYXZiYXItZG93blwiLCBoaWRkZW46IFwibmF2YmFyLXVwXCJ9O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICAgPEhlYWRyb29tIGNvbXBvbmVudD1cImhlYWRlclwiIGlkPVwiaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRhcmdldD1cIi5uYXZiYXItcGFnZS1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLm9uQ2lja09uTmF2YmFyVG9nZ2xlfT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5XCI+VG9nZ2xlIG5hdmlnYXRpb248L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYmFycyBmYS1sZ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxMaW5rIGNsYXNzTmFtZT1cIm5hdmJhci1icmFuZFwiIHRvPVwiaG9tZVwiPjxzcGFuIGNsYXNzTmFtZT1cImxpZ2h0XCI+UmVhY3Q8L3NwYW4+U3RhcnRlcjwvTGluaz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPE1lbnUgbWVudUNvbGxhcHNlPXt0aGlzLnN0YXRlLm1lbnVDb2xsYXBzZX0vPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0hlYWRyb29tPlxuXG4gICAgICAgIDxtYWluIGlkPVwibWFpblwiPlxuICAgICAgICAgIDxSb3V0ZUhhbmRsZXIvPlxuICAgICAgICA8L21haW4+XG5cbiAgICAgICAgey8qPEFsZXJ0SW5kZXgvPiovfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcnJvciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbG9hZEVycm9yOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mKFtcInhzXCIsIFwic21cIiwgXCJtZFwiLCBcImxnXCJdKSxcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc2l6ZTogXCJtZFwiLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJFcnJvciBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLnN0YXR1cyArIFwiOiBcIiArIHRoaXMucHJvcHMubG9hZEVycm9yLmRlc2NyaXB0aW9ufT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbiAgICAgICAgICBcImFsZXJ0LWFzLWljb25cIjogdHJ1ZSxcbiAgICAgICAgICBcImZhLXN0YWNrXCI6IHRydWUsXG4gICAgICAgICAgW3RoaXMucHJvcHMuc2l6ZV06IHRydWVcbiAgICAgICAgfSl9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zdGFjay0xeFwiPjwvaT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1iYW4gZmEtc3RhY2stMnhcIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB0aHJvdHRsZSBmcm9tIFwibG9kYXNoLnRocm90dGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZHJvb20gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGNvbXBvbmVudDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBoZWFkcm9vbUNsYXNzTmFtZXM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIGNvbXBvbmVudDogXCJkaXZcIixcbiAgICBoZWFkcm9vbUNsYXNzTmFtZXM6IHtcbiAgICAgIHZpc2libGU6IFwibmF2YmFyLWRvd25cIixcbiAgICAgIGhpZGRlbjogXCJuYXZiYXItdXBcIlxuICAgIH0sXG4gIH1cblxuICBzdGF0ZSA9IHtcbiAgICBjbGFzc05hbWU6IFwiXCJcbiAgfVxuXG4gIGhhc1Njcm9sbGVkKCkge1xuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IHRvcFBvc2l0aW9uID0gZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgbGV0IGRvY3VtZW50SGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG5cbiAgICAvLyBNYWtlIHN1cmUgdXNlcnMgc2Nyb2xsIG1vcmUgdGhhbiBkZWx0YVxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxhc3RTY3JvbGxUb3AgLSB0b3BQb3NpdGlvbikgPD0gdGhpcy5kZWx0YUhlaWdodCkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGhleSBzY3JvbGxlZCBkb3duIGFuZCBhcmUgcGFzdCB0aGUgbmF2YmFyLCBhZGQgY2xhc3MgYHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGVgLlxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHlvdSBuZXZlciBzZWUgd2hhdCBpcyBcImJlaGluZFwiIHRoZSBuYXZiYXIuXG4gICAgaWYgKHRvcFBvc2l0aW9uID4gdGhpcy5sYXN0U2Nyb2xsVG9wICYmIHRvcFBvc2l0aW9uID4gdGhpcy5lbGVtZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLmhpZGRlbn0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgodG9wUG9zaXRpb24gKyB3aW5kb3dIZWlnaHQpIDwgZG9jdW1lbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRvcFBvc2l0aW9uO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5wcm9wcy5jb21wb25lbnQ7XG4gICAgbGV0IHByb3BzID0ge2lkOiB0aGlzLnByb3BzLmlkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLnN0YXRlLmNsYXNzTmFtZX07XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBjb21wb25lbnQsXG4gICAgICBwcm9wcyxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJlYWN0IFN0YXJ0ZXJcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaG9tZVwiPlxuICAgICAgICAgIDxoMT5SZWFjdCBzdGFydGVyIGFwcDwvaDE+XG4gICAgICAgICAgPHA+UHJvb2Ygb2YgY29uY2VwdHMsIENSVUQsIHdoYXRldmVyLi4uPC9wPlxuICAgICAgICAgIDxwPlByb3VkbHkgYnVpbGQgb24gRVM2IHdpdGggdGhlIGhlbHAgb2YgPGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gdHJhbnNwaWxlci48L3A+XG4gICAgICAgICAgPGgzPkZyb250ZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvXCI+UmVhY3Q8L2E+IGRlY2xhcmF0aXZlIFVJPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL1lvbWd1aXRoZXJlYWwvYmFvYmFiXCI+QmFvYmFiPC9hPiBKUyBkYXRhIHRyZWUgd2l0aCBjdXJzb3JzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3JhY2t0L3JlYWN0LXJvdXRlclwiPlJlYWN0LVJvdXRlcjwvYT4gZGVjbGFyYXRpdmUgcm91dGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVhY3QtZG9jdW1lbnQtdGl0bGVcIj5SZWFjdC1Eb2N1bWVudC1UaXRsZTwvYT4gZGVjbGFyYXRpdmUgZG9jdW1lbnQgdGl0bGVzPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL3JlYWN0LWJvb3RzdHJhcC5naXRodWIuaW8vXCI+UmVhY3QtQm9vdHN0cmFwPC9hPiBCb290c3RyYXAgY29tcG9uZW50cyBpbiBSZWFjdDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9icm93c2VyaWZ5Lm9yZy9cIj5Ccm93c2VyaWZ5PC9hPiAmYW1wOyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N1YnN0YWNrL3dhdGNoaWZ5XCI+V2F0Y2hpZnk8L2E+IGJ1bmRsZSBOUE0gbW9kdWxlcyB0byBmcm9udGVuZDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ib3dlci5pby9cIj5Cb3dlcjwvYT4gZnJvbnRlbmQgcGFja2FnZSBtYW5hZ2VyPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkJhY2tlbmQ8L2gzPlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL2V4cHJlc3Nqcy5jb20vXCI+RXhwcmVzczwvYT4gd2ViLWFwcCBiYWNrZW5kIGZyYW1ld29yazwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb3ppbGxhLmdpdGh1Yi5pby9udW5qdWNrcy9cIj5OdW5qdWNrczwvYT4gdGVtcGxhdGUgZW5naW5lPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2VsZWl0aC9lbWFpbGpzXCI+RW1haWxKUzwvYT4gU01UUCBjbGllbnQ8L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+Q29tbW9uPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vYmFiZWxqcy5pby9cIj5CYWJlbDwvYT4gSlMgdHJhbnNwaWxlcjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9ndWxwanMuY29tL1wiPkd1bHA8L2E+IHN0cmVhbWluZyBidWlsZCBzeXN0ZW08L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2xvZGFzaC5jb20vXCI+TG9kYXNoPC9hPiB1dGlsaXR5IGxpYnJhcnk8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvc1wiPkF4aW9zPC9hPiBwcm9taXNlLWJhc2VkIEhUVFAgY2xpZW50PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cDovL21vbWVudGpzLmNvbS9cIj5Nb21lbnQ8L2E+IGRhdGUtdGltZSBzdHVmZjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9tYXJhay9GYWtlci5qcy9cIj5GYWtlcjwvYT4gZmFrZSBkYXRhIGdlbmVyYXRpb248L2xpPlxuICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICA8aDM+VkNTPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9naXQtc2NtLmNvbS9cIj5HaXQ8L2E+IHZlcnNpb24gY29udHJvbCBzeXN0ZW08L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IG1lcmdlIGZyb20gXCJsb2Rhc2gubWVyZ2VcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdFJvdXRlciBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICBsZXQgcGFyYW1zID0gY3Vyc29yLmdldChcInBhcmFtc1wiKTtcbiAgICBsZXQgcXVlcnkgPSBjdXJzb3IuZ2V0KFwicXVlcnlcIik7XG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoXCJ3aXRoUGFyYW1zXCIpKSB7XG4gICAgICBwcm9wcy53aXRoUGFyYW1zID0gcHJvcHMud2l0aFBhcmFtcyA9PT0gdHJ1ZSA/IHt9IDogcHJvcHMud2l0aFBhcmFtcztcbiAgICAgIHByb3BzLnBhcmFtcyA9IG1lcmdlKHt9LCBwYXJhbXMsIHByb3BzLndpdGhQYXJhbXMpO1xuICAgICAgZGVsZXRlIHByb3BzLndpdGhQYXJhbXM7XG4gICAgfVxuICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShcIndpdGhRdWVyeVwiKSkge1xuICAgICAgcHJvcHMud2l0aFF1ZXJ5ID0gcHJvcHMud2l0aFF1ZXJ5ID09PSB0cnVlID8ge30gOiBwcm9wcy53aXRoUXVlcnk7XG4gICAgICBwcm9wcy5xdWVyeSA9IG1lcmdlKHt9LCBxdWVyeSwgcHJvcHMud2l0aFF1ZXJ5KTtcbiAgICAgIGRlbGV0ZSBwcm9wcy53aXRoUXVlcnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxSZWFjdFJvdXRlci5MaW5rIHsuLi5wcm9wc30+XG4gICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cbiAgICA8L1JlYWN0Um91dGVyLkxpbms+O1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2l6ZUNsYXNzID0gdGhpcy5wcm9wcy5zaXplID8gJyBsb2FkaW5nLScgKyB0aGlzLnByb3BzLnNpemUgOiAnJztcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJMb2FkaW5nLi4uXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImFsZXJ0LWFzLWljb25cIiArIHNpemVDbGFzc30+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtY29nIGZhLXNwaW5cIj48L2k+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdEZvdW5kIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIk5vdCBGb3VuZFwiPlxuICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgcGFnZVwiPlxuICAgICAgICAgIDxoMT5QYWdlIG5vdCBGb3VuZDwvaDE+XG4gICAgICAgICAgPHA+U29tZXRoaW5nIGlzIHdyb25nPC9wPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IExpbmsgZnJvbSBcIi4vbGlua1wiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlcm5hbFBhZ2luYXRpb24gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVuZHBvaW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdG90YWw6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvZmZzZXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBsaW1pdDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB9XG5cbiAgdG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMucHJvcHMudG90YWwgLyB0aGlzLnByb3BzLmxpbWl0KTtcbiAgfVxuXG4gIG1heE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzKCkgKiB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcHJldk9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0IDw9IDAgPyAwIDogb2Zmc2V0IC0gdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIG5leHRPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA+PSB0aGlzLm1heE9mZnNldCgpID8gdGhpcy5tYXhPZmZzZXQoKSA6IG9mZnNldCArIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGVuZHBvaW50ID0gdGhpcy5wcm9wcy5lbmRwb2ludDtcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcblxuICAgIGlmICh0aGlzLnRvdGFsUGFnZXMoKSA+IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX0+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IHByZXZPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtvZmZzZXR9IGNsYXNzTmFtZT17Q2xhc3Moe2Rpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfT5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICAgICAgd2l0aFBhcmFtcz17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgd2l0aFF1ZXJ5PXt7cGFnZToge29mZnNldH19fVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtDbGFzcyh7ZGlzYWJsZWQ6IGN1cnJPZmZzZXQgPT0gbWF4T2Zmc2V0fSl9PlxuICAgICAgICAgICAgICA8TGluayB0bz17ZW5kcG9pbnR9XG4gICAgICAgICAgICAgICAgd2l0aFBhcmFtcz17dHJ1ZX1cbiAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3twYWdlOiB7b2Zmc2V0OiBuZXh0T2Zmc2V0fX19XG4gICAgICAgICAgICAgICAgdGl0bGU9e2BUbyBvZmZzZXQgJHtuZXh0T2Zmc2V0fWB9PlxuICAgICAgICAgICAgICAgIDxzcGFuPiZyYXF1bzs8L3NwYW4+XG4gICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9uYXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPG5hdi8+O1xuICAgIH1cbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9saW5rXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9mZnNldDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxpbWl0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMubGltaXQpO1xuICB9XG5cbiAgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXMoKSAqIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBwcmV2T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPD0gMCA/IDAgOiBvZmZzZXQgLSB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgbmV4dE9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0ID49IHRoaXMubWF4T2Zmc2V0KCkgPyB0aGlzLm1heE9mZnNldCgpIDogb2Zmc2V0ICsgdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25DbGljaztcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcblxuICAgIGlmICh0aGlzLnRvdGFsUGFnZXMoKSA+IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKHByZXZPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAge3JhbmdlKDAsIG1heE9mZnNldCwgbGltaXQpLm1hcChvZmZzZXQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e29mZnNldH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG9mZnNldCl9XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5PXt7XCJwYWdlW29mZnNldF1cIjogb2Zmc2V0fX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBcImJ0bi1saW5rXCI6IHRydWUsIGRpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG5leHRPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmF2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxuYXYvPjtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQWxlcnQgZnJvbSBcIi4vbW9kZWxzL2FsZXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtBbGVydH07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IGRhdGEuY2F0ZWdvcnkgPT0gXCJlcnJvclwiID8gMCA6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIFBST1hZIFJPVVRFUiBUTyBSRU1PVkUgQ0lSQ1VMQVIgREVQRU5ERU5DWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR1cm5zOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBhcHAgKHJvdXRlcilcbi8vIHRvOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBwcm94eSAocm91dGVyKVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aChyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCwgd2l0aFBhcmFtcz17fSwgd2l0aFF1ZXJ5PXt9KSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICByZXR1cm4gd2luZG93Ll9yb3V0ZXIubWFrZVBhdGgoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgbWFrZUhyZWYocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQsIHdpdGhQYXJhbXM9e30sIHdpdGhRdWVyeT17fSkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VIcmVmKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgbWVyZ2Uoe30sIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLCB3aXRoUGFyYW1zKSxcbiAgICAgIG1lcmdlKHt9LCBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIiksIHdpdGhRdWVyeSlcbiAgICApO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyhyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCwgd2l0aFBhcmFtcz17fSwgd2l0aFF1ZXJ5PXt9KSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci50cmFuc2l0aW9uVG8oXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQsIHdpdGhQYXJhbXM9e30sIHdpdGhRdWVyeT17fSkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgd2luZG93Ll9yb3V0ZXIucmVwbGFjZVdpdGgoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5fcm91dGVyLmdvQmFjaygpO1xuICB9LFxuXG4gIHJ1bihyZW5kZXIpIHtcbiAgICB3aW5kb3cuX3JvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG5cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEJhb2JhYiBmcm9tIFwiYmFvYmFiXCI7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBjb25zdCBFWEFNUExFID0ge1xuICBGSUxURVJTOiB1bmRlZmluZWQsIC8vIHtwdWJsaXNoZWQ6IHRydWV9IHx8IHVuZGVmaW5lZFxuICBTT1JUUzogdW5kZWZpbmVkLCAgIC8vIFtcIitwdWJsaXNoZWRBdFwiLCBcIi1pZFwiXSB8fCB1bmRlZmluZWRcbiAgT0ZGU0VUOiAwLCAgICAgICAgICAvLyAwIHx8IC0xXG4gIExJTUlUOiAyMCwgICAgICAgICAgLy8gMTAgfHwgMjAgfHwgNTAgLi4uXG59O1xuXG5leHBvcnQgY29uc3QgUk9CT1QgPSB7XG4gIEZJTFRFUlM6IHt9LFxuICBTT1JUUzogW1wiK25hbWVcIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59O1xuXG5leHBvcnQgY29uc3QgQUxFUlQgPSB7XG4gIEZJTFRFUlM6IHt9LFxuICBTT1JUUzogW1wiK2NyZWF0ZWRPblwiXSxcbiAgT0ZGU0VUOiAwLFxuICBMSU1JVDogNSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhb2JhYihcbiAgeyAvLyBEQVRBXG4gICAgdXJsOiB7XG4gICAgICBoYW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICBwYXJhbXM6IHVuZGVmaW5lZCxcbiAgICAgIHF1ZXJ5OiB1bmRlZmluZWQsXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgZmlsdGVyczogdW5kZWZpbmVkLFxuICAgICAgc29ydHM6IHVuZGVmaW5lZCxcbiAgICAgIG9mZnNldDogdW5kZWZpbmVkLFxuICAgICAgbGltaXQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuXG4gICAgcm9ib3RzOiB7XG4gICAgICAvLyBEQVRBXG4gICAgICBtb2RlbHM6IHt9LFxuICAgICAgdG90YWw6IDAsXG4gICAgICBwYWdpbmF0aW9uOiB7fSxcblxuICAgICAgLy8gTE9BRCBBUlRFRkFDVFNcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcblxuICAgICAgLy8gSU5ERVhcbiAgICAgIGZpbHRlcnM6IFJPQk9ULkZJTFRFUlMsXG4gICAgICBzb3J0czogUk9CT1QuU09SVFMsXG4gICAgICBvZmZzZXQ6IFJPQk9ULk9GRlNFVCxcbiAgICAgIGxpbWl0OiBST0JPVC5MSU1JVCxcblxuICAgICAgLy8gTU9ERUxcbiAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIGFsZXJ0czoge1xuICAgICAgLy8gREFUQVxuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnaW5hdGlvbjoge30sXG5cbiAgICAgIC8vIExPQUQgQVJURUZBQ1RTXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIElOREVYXG4gICAgICBmaWx0ZXJzOiBBTEVSVC5GSUxURVJTLFxuICAgICAgc29ydHM6IEFMRVJULlNPUlRTLFxuICAgICAgb2Zmc2V0OiBBTEVSVC5PRkZTRVQsXG4gICAgICBsaW1pdDogQUxFUlQuTElNSVQsXG5cbiAgICAgIC8vIE1PREVMXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG4gIHsgLy8gT1BUSU9OU1xuICAgIGZhY2V0czoge1xuICAgICAgY3VycmVudFJvYm90OiB7XG4gICAgICAgIGN1cnNvcnM6IHtcbiAgICAgICAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCB7bW9kZWxzLCBpZH0gPSBkYXRhLnJvYm90cztcbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbHNbaWRdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3VycmVudFJvYm90czoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQge21vZGVscywgcGFnaW5hdGlvbiwgb2Zmc2V0fSA9IGRhdGEucm9ib3RzO1xuICAgICAgICAgIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gICAgICAgICAgaWYgKGlkcykge1xuICAgICAgICAgICAgcmV0dXJuIGlkcy5tYXAoaWQgPT4gbW9kZWxzW2lkXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbik7XG5cbi8qXG5DaGFuZ2UgZmlsdGVyczpcbiAgLy9pZiBwYWdpbmF0aW9uLmxlbmd0aCA8IHRvdGFsOlxuICAvLyAgcHVyZ2UgcGFnaW5hdGlvbiFcbiAgZmV0Y2ghXG4gIHJlZGlyZWN0IHRvIG9mZnNldCA9IDAhXG5cbkNoYW5nZSBzb3J0czpcbiAgLy9pZiBwYWdpbmF0aW9uLmxlbmd0aCA8IHRvdGFsOlxuICAvLyAgcHVyZ2UgcGFnaW5hdGlvbiFcbiAgZmV0Y2ghXG4gIHJlZGlyZWN0IHRvIG9mZnNldCA9IDAhXG5cbkNoYW5nZSBvZmZzZXQ6XG4gIC8vaWYgY2FuJ3QgYmUgbG9hZGVkOlxuICAvLyAgZmV0Y2ghXG4gIC8vIHVwZGF0ZSBwYWdpbmF0aW9uXG4gIHJlZGlyZWN0IHRvIG5ldyBvZmZzZXQhXG5cbkNoYW5nZSBsaW1pdDpcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCEgfHwgcmVidWlsZCBwYWdpbmF0aW9uIGFuZCBpZiBjYW4ndCBiZSBsb2FkZWQ6IGZldGNoXG4qLyIsImltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvZmV0Y2gtbW9kZWxcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZmV0Y2gtaW5kZXhcIjtcblxuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtbW9kZWxcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9sb2FkLWluZGV4XCI7XG5cbmltcG9ydCBzZXRGaWx0ZXJzIGZyb20gXCIuL2FjdGlvbnMvc2V0LWZpbHRlcnNcIjtcbmltcG9ydCBzZXRTb3J0cyBmcm9tIFwiLi9hY3Rpb25zL3NldC1zb3J0c1wiO1xuaW1wb3J0IHNldE9mZnNldCBmcm9tIFwiLi9hY3Rpb25zL3NldC1vZmZzZXRcIjtcbmltcG9ydCBzZXRMaW1pdCBmcm9tIFwiLi9hY3Rpb25zL3NldC1saW1pdFwiO1xuaW1wb3J0IHNldElkIGZyb20gXCIuL2FjdGlvbnMvc2V0LWlkXCI7XG5cbmltcG9ydCBlc3RhYmxpc2hNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbFwiO1xuaW1wb3J0IGVzdGFibGlzaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLWluZGV4XCI7XG5pbXBvcnQgZXN0YWJsaXNoUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1wYWdlXCI7XG5cbmltcG9ydCBhZGQgZnJvbSBcIi4vYWN0aW9ucy9hZGRcIjtcbmltcG9ydCBlZGl0IGZyb20gXCIuL2FjdGlvbnMvZWRpdFwiO1xuaW1wb3J0IHJlbW92ZSBmcm9tIFwiLi9hY3Rpb25zL3JlbW92ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZldGNoTW9kZWwsIGZldGNoSW5kZXgsXG4gIGxvYWRNb2RlbCwgbG9hZEluZGV4LFxuICBzZXRGaWx0ZXJzLCBzZXRTb3J0cywgc2V0T2Zmc2V0LCBzZXRMaW1pdCxcbiAgZXN0YWJsaXNoTW9kZWwsIGVzdGFibGlzaEluZGV4LCBlc3RhYmxpc2hQYWdlLFxuICBhZGQsIGVkaXQsIHJlbW92ZVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90IGZyb20gXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dCh1cmwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3QgZnJvbSBcImZyb250ZW5kL3JvYm90L21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQodXJsLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzXG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcbmltcG9ydCBzZXRGaWx0ZXJzIGZyb20gXCIuL3NldC1maWx0ZXJzXCI7XG5pbXBvcnQgc2V0U29ydHMgZnJvbSBcIi4vc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL3NldC1vZmZzZXRcIjtcbmltcG9ydCBzZXRMaW1pdCBmcm9tIFwiLi9zZXQtbGltaXRcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuXG4gIHNldEZpbHRlcnMoY3Vyc29yLmdldChcImZpbHRlcnNcIikgfHwgdW5kZWZpbmVkKTsgLy8gZmFsc2UgLT4gdW5kZWZpbmVkXG4gIHNldFNvcnRzKGN1cnNvci5nZXQoXCJzb3J0c1wiKSB8fCB1bmRlZmluZWQpOyAgICAgLy8gZmFsc2UgLT4gdW5kZWZpbmVkXG4gIHNldE9mZnNldChjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgc2V0TGltaXQoY3Vyc29yLmdldChcImxpbWl0XCIpKTtcblxuICBsb2FkSW5kZXgoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9sb2FkLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVzdGFibGlzaE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwiZXN0YWJsaXNoTW9kZWxcIik7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IHVybElkID0gdXJsQ3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGlmICh1cmxJZCkge1xuICAgIHJvYm90c0N1cnNvci5zZXQoXCJpZFwiLCB1cmxJZCk7XG4gIH1cbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZE1vZGVsKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hQYWdlKHBhcmFtcywgcXVlcnkpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaFBhZ2U6XCIsIHBhcmFtcywgcXVlcnkpO1xuXG4gIC8vbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcblxuICAvLyBDSEFOR0UgU1RBVEVcbiAgLy8gPz8/XG4gIC8vc3RhdGUuY29tbWl0KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hJbmRleFwiKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzL2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9KTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAvLyBDdXJyZW50IHN0YXRlXG4gICAgICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgICAgIC8vIE5ldyBkYXRhXG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBmZXRjaGVkTW9kZWxzID0gdG9PYmplY3QoZGF0YSk7XG5cbiAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgY3Vyc29yLm1lcmdlKHtcbiAgICAgICAgdG90YWw6IG1ldGEucGFnZSAmJiBtZXRhLnBhZ2UudG90YWwgfHwgT2JqZWN0LmtleXMobW9kZWxzKS5sZW5ndGgsXG4gICAgICAgIG1vZGVsczogT2JqZWN0LmFzc2lnbihtb2RlbHMsIGZldGNoZWRNb2RlbHMpLFxuICAgICAgICBwYWdpbmF0aW9uOiBPYmplY3QuYXNzaWduKHBhZ2luYXRpb24sIHtbb2Zmc2V0XTogT2JqZWN0LmtleXMoZmV0Y2hlZE1vZGVscyl9KSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaFBhZ2VgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCB7dG9PYmplY3R9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hNb2RlbChpZCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hNb2RlbDpcIiwgaWQpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL2N1cnNvci5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9jdXJzb3Iuc2VsZWN0KFwibW9kZWxzXCIpLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgLy8gV09SS0FST1VORDpcbiAgICAgIGN1cnNvci5hcHBseShyb2JvdHMgPT4ge1xuICAgICAgICBsZXQgbW9kZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLm1vZGVscyk7XG4gICAgICAgIG1vZGVsc1ttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJvYm90cywge1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgIG1vZGVsczogbW9kZWxzLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaE1vZGVsYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0fSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vZmV0Y2gtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZEluZGV4KCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZEluZGV4XCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBmaWx0ZXJzID0gY3Vyc29yLmdldChcImZpbHRlcnNcIik7XG4gIGxldCBzb3J0cyA9IGN1cnNvci5nZXQoXCJzb3J0c1wiKTtcbiAgbGV0IG9mZnNldCA9IGN1cnNvci5nZXQoXCJvZmZzZXRcIik7XG4gIGxldCBsaW1pdCA9IGN1cnNvci5nZXQoXCJsaW1pdFwiKTtcbiAgbGV0IHBhZ2luYXRpb24gPSBjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICBpZiAoIWlkcyB8fCBpZHMubGVuZ3RoIDwgbGltaXQpIHtcbiAgICBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc01heE9mZnNldChwYWdpbmF0aW9uLCBvZmZzZXQpIHtcbiAgcmV0dXJuIG9mZnNldCA9PSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2ZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IHVybCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZSh1cmwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogbG9hZEVycm9yLFxuICAgICAgfSk7XG4gICAgICByb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgaXNFcXVhbCBmcm9tIFwibG9kYXNoLmlzZXF1YWxcIjtcbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcblxuaW1wb3J0IHtjaHVua2VkLCBmbGF0dGVuQXJyYXlHcm91cCwgZmlyc3RMZXNzZXJPZmZzZXR9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSwge1JPQk9UfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldEZpbHRlcnMoZmlsdGVycz1ST0JPVC5GSUxURVJTKSB7XG4gIGNvbnNvbGUuZGVidWcoYHNldEZpbHRlcnMoJHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX0pYCk7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKCFpc0VxdWFsKGZpbHRlcnMsIGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJmaWx0ZXJzXCIsIGZpbHRlcnMpO1xuICAgIGxldCBwYWdpbmF0aW9uTGVuZ3RoID0gZmxhdHRlbkFycmF5R3JvdXAoY3Vyc29yLmdldChcInBhZ2luYXRpb25cIikpLmxlbmd0aDtcbiAgICBpZiAocGFnaW5hdGlvbkxlbmd0aCAmJiBwYWdpbmF0aW9uTGVuZ3RoID49IGN1cnNvci5nZXQoXCJ0b3RhbFwiKSkge1xuICAgICAgLy8gRnVsbCBpbmRleCBsb2FkZWQg4oCTIGNhbiByZWNhbGN1bGF0ZSBwYWdpbmF0aW9uXG4gICAgICBjb25zb2xlLmRlYnVnKFwiRnVsbCBpbmRleCBsb2FkZWQsIHJlY2FsY3VsYXRpbmcgcGFnaW5hdGlvbi4uLlwiKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aEZpbHRlcnMoXG4gICAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBmaWx0ZXJzLCBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpLCBjdXJzb3IuZ2V0KFwibGltaXRcIilcbiAgICAgICk7XG4gICAgICBpZiAoIXBhZ2luYXRpb25bY3Vyc29yLmdldChcIm9mZnNldFwiKV0pIHtcbiAgICAgICAgLy8gTnVtYmVyIG9mIHBhZ2VzIHJlZHVjZWQgLSByZWRpcmVjdCB0byBjbG9zZXN0XG4gICAgICAgIGxldCBvZmZzZXQgPSBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgICAgICAgcm91dGVyLnRyYW5zaXRpb25UbyhcbiAgICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHJvdXRlXG4gICAgICAgICAgdW5kZWZpbmVkLCAgICAgICAvLyBwYXJhbXNcbiAgICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHF1ZXJ5XG4gICAgICAgICAge30sICAgICAgICAgICAgICAvLyB3aXRoUGFyYW1zXG4gICAgICAgICAge3BhZ2U6IHtvZmZzZXR9fSAvLyB3aXRoUXVlcnlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQYXJ0IG9mIGluZGV4IGxvYWRlZCDigJMgY2FuIG9ubHkgcmVzZXRcbiAgICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHt9KTtcbiAgICB9XG4gICAgc3RhdGUuY29tbWl0KCk7XG4gIH1cbn1cblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgYHBhZ2luYXRpb25gIHdpdGggbmV3IGBmaWx0ZXJzYFxuICogTWF5IGJlIGFwcGxpZWQgb25seSB3aGVuIGBtb2RlbHMubGVuZ3RoID09IHRvdGFsYCwgc28gYG1vZGVsc2BcbiAqIHJlcHJlc2VudCBmdWxsIHNldCBvZiBpZHMgYW5kIGBwYWdpbmF0aW9uYCBjYW4gdGhlbiBiZSByZWNyZWF0ZWQgZnJvbSBzY3JhdGguXG4gKiBAcHVyZVxuICogQHBhcmFtIHBhZ2luYXRpb24ge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSBpbnB1dCBwYWdpbmF0aW9uXG4gKiBAcGFyYW0gZmlsdGVycyB7bnVtYmVyfSAtIG5ldyBmaWx0ZXJzXG4gKiBAcGFyYW0gbW9kZWxzIHtPYmplY3Q8c3RyaW5nLCBPYmplY3Q+fSAtIG9iaiBvZiBtb2RlbHNcbiAqIEBwYXJhbSBsaW1pdCB7bnVtYmVyfSAtIGN1cnJlbnQgbGltaXRcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBBcnJheT59IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aEZpbHRlcnMocGFnaW5hdGlvbiwgZmlsdGVycywgbW9kZWxzLCBsaW1pdCkge1xuICBpZiAoIXBhZ2luYXRpb24gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHBhZ2luYXRpb24gbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7cGFnaW5hdGlvbn1gKTtcbiAgfVxuICBpZiAoIWZpbHRlcnMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGZpbHRlcnMgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7ZmlsdGVyc31gKTtcbiAgfVxuICBpZiAoIW1vZGVscyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbW9kZWxzIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke21vZGVsc31gKTtcbiAgfVxuICBpZiAodHlwZW9mIGxpbWl0ICE9IFwibnVtYmVyXCIgfHwgbGltaXQgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbGltaXQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciwgZ290ICR7bGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGlmIChPYmplY3Qua2V5cyhmaWx0ZXJzKS5sZW5ndGgpIHtcbiAgICAgIGxldCB1bmZpbHRlcmVkTW9kZWxzID0gT2JqZWN0LnZhbHVlcyhtb2RlbHMpO1xuICAgICAgbGV0IGZpbHRlcmVkTW9kZWxzID0gZmlsdGVyKHVuZmlsdGVyZWRNb2RlbHMsIGZpbHRlcnMpO1xuICAgICAgcmV0dXJuIGNodW5rZWQoZmlsdGVyZWRNb2RlbHMubWFwKG0gPT4gbS5pZCksIGxpbWl0KS5yZWR1Y2UoKG9iaiwgaWRzLCBpKSA9PiB7XG4gICAgICAgIG9ialtpICogbGltaXRdID0gaWRzO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFnaW5hdGlvbjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldE9mZnNldChpZCkge1xuICBjb25zb2xlLmRlYnVnKGBzZXRJZCgke2lkfSlgKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBpZiAoaWQgIT0gY3Vyc29yLmdldChcImlkXCIpKSB7XG4gICAgY3Vyc29yLnNldChcImlkXCIsIGlkKTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcbmltcG9ydCBzb3J0QnkgZnJvbSBcImxvZGFzaC5zb3J0YnlcIjtcblxuaW1wb3J0IHtjaHVua2VkLCBmaXJzdExlc3Nlck9mZnNldH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlLCB7Uk9CT1R9IGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0TGltaXQobGltaXQ9Uk9CT1QuTElNSVQpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0TGltaXQoJHtsaW1pdH0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKGxpbWl0ICE9IGN1cnNvci5nZXQoXCJsaW1pdFwiKSkge1xuICAgIGNvbnNvbGUuZGVidWcoXCJSZWNhbGN1bGF0aW5nIHBhZ2luYXRpb24uLi5cIik7XG4gICAgY3Vyc29yLnNldChcImxpbWl0XCIsIGxpbWl0KTtcbiAgICBsZXQgcGFnaW5hdGlvbiA9IHJlY2FsY3VsYXRlUGFnaW5hdGlvbldpdGhMaW1pdChcbiAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBsaW1pdFxuICAgICk7XG4gICAgaWYgKCFwYWdpbmF0aW9uW2N1cnNvci5nZXQoXCJvZmZzZXRcIildKSB7XG4gICAgICAvLyBOdW1iZXIgb2YgcGFnZXMgcmVkdWNlZCAtIHJlZGlyZWN0IHRvIGNsb3Nlc3RcbiAgICAgIGxldCBvZmZzZXQgPSBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgICAgIHJvdXRlci50cmFuc2l0aW9uVG8oXG4gICAgICAgIHVuZGVmaW5lZCwgICAgICAgLy8gcm91dGVcbiAgICAgICAgdW5kZWZpbmVkLCAgICAgICAvLyBwYXJhbXNcbiAgICAgICAgdW5kZWZpbmVkLCAgICAgICAvLyBxdWVyeVxuICAgICAgICB7fSwgICAgICAgICAgICAgIC8vIHdpdGhQYXJhbXNcbiAgICAgICAge3BhZ2U6IHtvZmZzZXR9fSAvLyB3aXRoUXVlcnlcbiAgICAgICk7XG4gICAgfVxuICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogUmVjYWxjdWxhdGVzIGBwYWdpbmF0aW9uYCB3aXRoIG5ldyBsaW1pdCAocGVycGFnZSlcbiAqIE1heSBiZSBhcHBsaWVkIHdoZW4gYG1vZGVscy5sZW5ndGggIT0gdG90YWxgLCBzb1xuICogYHBhZ2luYXRpb25gIGNhbid0IGJlIHJlY3JlYXRlZCBmcm9tIHNjcmF0aC5cbiAqICogU3VwcG9ydHMgaW52YWxpZCBkYXRhIGxpa2Ugb3ZlcmxhcHBpbmcgb2Zmc2V0c1xuICogQHB1cmVcbiAqIEBwYXJhbSBwYWdpbmF0aW9uIHtPYmplY3R9IC0gaW5wdXQgcGFnaW5hdGlvblxuICogQHBhcmFtIGxpbWl0IHtOdW1iZXJ9IC0gbmV3IGxpbWl0IChwZXJwYWdlKVxuICogQHJldHVybnMge09iamVjdH0gLSByZWNhbGN1bGF0ZWQgcGFnaW5hdGlvblxuICovXG5mdW5jdGlvbiByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoTGltaXQocGFnaW5hdGlvbiwgbGltaXQpIHtcbiAgaWYgKCFwYWdpbmF0aW9uIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBwYWdpbmF0aW9uIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke3BhZ2luYXRpb259YCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBsaW1pdCAhPSBcIm51bWJlclwiIHx8IGxpbWl0IDw9IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGxpbWl0IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXIsIGdvdCAke2xpbWl0fWApO1xuICB9XG4gIGlmIChPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5sZW5ndGgpIHtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgT2JqZWN0LmtleXMocGFnaW5hdGlvbikpO1xuICAgIGxldCBsZW5ndGggPSBtYXhPZmZzZXQgKyBwYWdpbmF0aW9uW21heE9mZnNldF0ubGVuZ3RoO1xuICAgIGxldCBvZmZzZXRzID0gc29ydEJ5KE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLm1hcCh2ID0+IHBhcnNlSW50KHYpKSk7XG4gICAgbGV0IGlkcyA9IG9mZnNldHNcbiAgICAgIC5yZWR1Y2UoKG1lbW8sIG9mZnNldCkgPT4ge1xuICAgICAgICBwYWdpbmF0aW9uW29mZnNldF0uZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgICAgICBtZW1vW29mZnNldCArIGldID0gaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgIH0sIEFycmF5KGxlbmd0aCkpO1xuICAgIC8vID0+IFssLCwsLDEsMiwzLDQsNSwsLCwsXVxuICAgIHJldHVybiBjaHVua2VkKGlkcywgbGltaXQpLnJlZHVjZSgob2JqLCBvZmZzZXRJZHMsIGkpID0+IHtcbiAgICAgIG9mZnNldElkcyA9IGZpbHRlcihvZmZzZXRJZHMpO1xuICAgICAgaWYgKGlkcy5sZW5ndGgpIHtcbiAgICAgICAgb2JqW2kgKiBsaW1pdF0gPSBvZmZzZXRJZHM7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTsgLy8gPT4gezU6IFsxLCAyLCAzLCA0LCA1XX1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRPZmZzZXQob2Zmc2V0PVJPQk9ULk9GRlNFVCkge1xuICBjb25zb2xlLmRlYnVnKGBzZXRPZmZzZXQoJHtvZmZzZXR9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmIChvZmZzZXQgIT0gY3Vyc29yLmdldChcIm9mZnNldFwiKSkge1xuICAgIGN1cnNvci5zZXQoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBpc0VxdWFsIGZyb20gXCJsb2Rhc2guaXNlcXVhbFwiO1xuaW1wb3J0IHNvcnRCeU9yZGVyIGZyb20gXCJsb2Rhc2guc29ydGJ5b3JkZXJcIjtcbmltcG9ydCB7Y2h1bmtlZCwgbG9kYXNoaWZ5U29ydHMsIGZsYXR0ZW5BcnJheUdyb3VwLCBmaXJzdExlc3Nlck9mZnNldH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlLCB7Uk9CT1R9IGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0U29ydHMoc29ydHM9Uk9CT1QuU09SVFMpIHtcbiAgY29uc29sZS5kZWJ1Zyhgc2V0U29ydHMoJHtKU09OLnN0cmluZ2lmeShzb3J0cyl9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmICghaXNFcXVhbChzb3J0cywgY3Vyc29yLmdldChcInNvcnRzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJzb3J0c1wiLCBzb3J0cyk7XG4gICAgbGV0IHBhZ2luYXRpb25MZW5ndGggPSBmbGF0dGVuQXJyYXlHcm91cChjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKSkubGVuZ3RoO1xuICAgIGlmIChwYWdpbmF0aW9uTGVuZ3RoICYmIHBhZ2luYXRpb25MZW5ndGggPj0gY3Vyc29yLmdldChcInRvdGFsXCIpKSB7XG4gICAgICAvLyBGdWxsIGluZGV4IGxvYWRlZCDigJMgY2FuIHJlY2FsY3VsYXRlIHBhZ2luYXRpb25cbiAgICAgIGNvbnNvbGUuZGVidWcoXCJGdWxsIGluZGV4IGxvYWRlZCwgcmVjYWxjdWxhdGluZyBwYWdpbmF0aW9uLi4uXCIpO1xuICAgICAgbGV0IHBhZ2luYXRpb24gPSByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoU29ydHMoXG4gICAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBzb3J0cywgY3Vyc29yLmdldChcIm1vZGVsc1wiKSwgY3Vyc29yLmdldChcImxpbWl0XCIpXG4gICAgICApO1xuICAgICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwgcGFnaW5hdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFBhcnQgb2YgaW5kZXggbG9hZGVkIOKAkyBjYW4gb25seSByZXNldFxuICAgICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwge30pO1xuICAgIH1cbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufVxuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIFJlY2FsY3VsYXRlcyBgcGFnaW5hdGlvbmAgd2l0aCBuZXcgYHNvcnRzYFxuICogTWF5IGJlIGFwcGxpZWQgb25seSB3aGVuIGBtb2RlbHMubGVuZ3RoID09IHRvdGFsYCwgc28gYG1vZGVsc2BcbiAqIHJlcHJlc2VudCBmdWxsIHNldCBvZiBpZHMgYW5kIGBwYWdpbmF0aW9uYCBjYW4gdGhlbiBiZSByZWNyZWF0ZWQgZnJvbSBzY3JhdGguXG4gKiBAcHVyZVxuICogQHBhcmFtIHBhZ2luYXRpb24ge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSBpbnB1dCBwYWdpbmF0aW9uXG4gKiBAcGFyYW0gc29ydHMge0FycmF5PHN0cmluZz59IC0gbmV3IHNvcnRzXG4gKiBAcGFyYW0gbW9kZWxzIHtPYmplY3Q8c3RyaW5nLCBPYmplY3Q+fSAtIG9iaiBvZiBtb2RlbHNcbiAqIEBwYXJhbSBsaW1pdCB7bnVtYmVyfSAtIGN1cnJlbnQgbGltaXRcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBBcnJheT59IC0gcmVjYWxjdWxhdGVkIHBhZ2luYXRpb25cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aFNvcnRzKHBhZ2luYXRpb24sIHNvcnRzLCBtb2RlbHMsIGxpbWl0KSB7XG4gIGlmICghcGFnaW5hdGlvbiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcGFnaW5hdGlvbiBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHtwYWdpbmF0aW9ufWApO1xuICB9XG4gIGlmICghc29ydHMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgc29ydHMgbXVzdCBiZSBhIGJhc2ljIEFycmF5LCBnb3QgJHtzb3J0c31gKTtcbiAgfVxuICBpZiAoIW1vZGVscyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbW9kZWxzIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke21vZGVsc31gKTtcbiAgfVxuICBpZiAodHlwZW9mIGxpbWl0ICE9IFwibnVtYmVyXCIgfHwgbGltaXQgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbGltaXQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciwgZ290ICR7bGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGlmIChzb3J0cy5sZW5ndGgpIHtcbiAgICAgIGxldCB1bnNvcnRlZE1vZGVscyA9IE9iamVjdC52YWx1ZXMobW9kZWxzKTtcbiAgICAgIGxldCBzb3J0ZWRNb2RlbHMgPSBzb3J0QnlPcmRlcih1bnNvcnRlZE1vZGVscywgLi4ubG9kYXNoaWZ5U29ydHMoc29ydHMpKTtcbiAgICAgIHJldHVybiBjaHVua2VkKHNvcnRlZE1vZGVscy5tYXAobSA9PiBtLmlkKSwgbGltaXQpLnJlZHVjZSgob2JqLCBpZHMsIGkpID0+IHtcbiAgICAgICAgb2JqW2kgKiBsaW1pdF0gPSBpZHM7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYWdpbmF0aW9uO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9pbXBvcnQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBBcnJheSB8fCAhb2JqW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFtZW1vW2RldGFpbC5wYXRoXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAvL21peGluczogWy0tUmVhY3RSb3V0ZXIuU3RhdGUtLSwgc3RhdGUubWl4aW5dLFxuXG4gIC8vY3Vyc29ycygpIHtcbiAgLy8gIHJldHVybiB7XG4gIC8vICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuICAvLyAgfVxuICAvL30sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2PkFkZDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL3JldHVybiAoXG4gICAgLy8gIDxGb3JtIG1vZGVscz17bW9kZWxzfSBsb2FkaW5nPXtsb2FkaW5nfSBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPlxuICAgIC8vKTtcbiAgfVxufSk7XG5cbi8vbGV0IEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4vLyAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuLy8gICAgcmV0dXJuIHtcbi8vICAgICAgbW9kZWw6IHtcbi8vICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4vLyAgICAgICAgYXNzZW1ibHlEYXRlOiB1bmRlZmluZWQsXG4vLyAgICAgICAgbWFudWZhY3R1cmVyOiB1bmRlZmluZWQsXG4vLyAgICAgIH0sXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgLy92YWxpZGF0b3JUeXBlcygpIHtcbi8vICAvLyAgcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4vLyAgLy99LFxuLy9cbi8vICAvL3ZhbGlkYXRvckRhdGEoKSB7XG4vLyAgLy8gIHJldHVybiB0aGlzLnN0YXRlLm1vZGVsO1xuLy8gIC8vfSxcbi8vXG4vLyAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIC8vbGV0IHNjaGVtYSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvclR5cGVzXCIpIHx8IHt9O1xuLy8gICAgLy9sZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbi8vICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbi8vICAgIC8vICByZXR1cm4gYiBpbnN0YW5jZW9mIEFycmF5ID8gYiA6IHVuZGVmaW5lZDtcbi8vICAgIC8vfSk7XG4vLyAgICAvL3JldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbi8vICAgIC8vICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4vLyAgICAvL30pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9yZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAvLyAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgLy8gIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgICAvLyAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7bW9kZWw6IG1vZGVsfSk7XG4vLyAgICAvLyAgdGhpcy52YWxpZGF0ZURlYm91bmNlZChrZXkpO1xuLy8gICAgLy99LmJpbmQodGhpcyk7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuLy8gICAgLy9yZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldEluaXRpYWxTdGF0ZSgpLm1vZGVsKSxcbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZVN1Ym1pdChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMudmFsaWRhdGUoKS50aGVuKGlzVmFsaWQgPT4ge1xuLy8gICAgICBpZiAoaXNWYWxpZCkge1xuLy8gICAgICAgIC8vIFRPRE8gcmVwbGFjZSB3aXRoIFJlYWN0LmZpbmRET01Ob2RlIGF0ICMwLjEzLjBcbi8vICAgICAgICByb2JvdEFjdGlvbnMuYWRkKHtcbi8vICAgICAgICAgIG5hbWU6IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIGFzc2VtYmx5RGF0ZTogdGhpcy5yZWZzLmFzc2VtYmx5RGF0ZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBtYW51ZmFjdHVyZXI6IHRoaXMucmVmcy5tYW51ZmFjdHVyZXIuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgIH0pO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIGFsZXJ0KFwiQ2FuJ3Qgc3VibWl0IGZvcm0gd2l0aCBlcnJvcnNcIik7XG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH0sXG4vL1xuLy8gIGdldFZhbGlkYXRpb25NZXNzYWdlczogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgbGV0IGVycm9ycyA9IHRoaXMuc3RhdGUuZXJyb3JzIHx8IHt9O1xuLy8gICAgaWYgKCFPYmplY3QudmFsdWVzKGVycm9ycykubGVuZ3RoKSB7XG4vLyAgICAgIHJldHVybiBbXTtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgICAgIHJldHVybiBmbGF0dGVuKE9iamVjdC5rZXlzKGVycm9ycykubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuLy8gICAgICAgICAgcmV0dXJuIGVycm9yc1tlcnJvcl0gfHwgW107XG4vLyAgICAgICAgfSkpO1xuLy8gICAgICB9IGVsc2Uge1xuLy8gICAgICAgIHJldHVybiBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgICAgfVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIGlzVmFsaWQ6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkpLmxlbmd0aCA9PSAwO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5wcm9wcztcbi8vICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vL1xuLy8gICAgaWYgKGxvYWRpbmcpIHtcbi8vICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4vLyAgICB9IGVsc2UgaWYgKGxvYWRFcnJvcikge1xuLy8gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgcmV0dXJuIChcbi8vICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJBZGQgUm9ib3RcIn0+XG4vLyAgICAgICAgICA8ZGl2PlxuLy8gICAgICAgICAgICA8ZGl2IGlkPVwiYWN0aW9uc1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1sZWZ0XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1hcnJvdy1sZWZ0XCI+PC9zcGFuPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14cyBtYXJnaW4tbGVmdC1zbVwiPkJhY2sgdG8gbGlzdDwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXIgbWFyZ2luLXRvcC1sZ1wiPlxuLy8gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4vLyAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC14cy0xMiBjb2wtc20tOVwiPlxuLy8gICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwibm9tYXJnaW4tdG9wXCI+QWRkIFJvYm90PC9oMT5cbi8vICAgICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbi8vICAgICAgICAgICAgICAgICAgICA8ZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm5hbWUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm5hbWVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm5hbWVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwibmFtZVwiIHJlZj1cIm5hbWVcIiB2YWx1ZT17bW9kZWwubmFtZX0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcIm5hbWVcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJuYW1lXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkuYXNzZW1ibHlEYXRlLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6ICh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJtYW51ZmFjdHVyZXJcIj5NYW51ZmFjdHVyZXI8L2xhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBvbkJsdXI9e3RoaXMudmFsaWRhdGUuYmluZCh0aGlzLCBcIm1hbnVmYWN0dXJlclwiKX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlRm9yKFwibWFudWZhY3R1cmVyXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm1hbnVmYWN0dXJlclwiIHJlZj1cIm1hbnVmYWN0dXJlclwiIHZhbHVlPXttb2RlbC5tYW51ZmFjdHVyZXJ9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoXCJtYW51ZmFjdHVyZXJcIikubWFwKG1lc3NhZ2UgPT4gPHNwYW4ga2V5PVwiXCI+e21lc3NhZ2V9PC9zcGFuPil9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgPC9maWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVSZXNldH0+UmVzZXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX0gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPC9zZWN0aW9uPlxuLy8gICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuLy8gICAgICApO1xuLy8gICAgfVxuLy8gIH1cbi8vfSk7XG5cbi8qXG48VGV4dElucHV0IGxhYmVsPVwiTmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZVwiIGlkPVwibW9kZWwubmFtZVwiIGZvcm09e3RoaXN9Lz5cbjxUZXh0SW5wdXQgbGFiZWw9XCJBc3NlbWJseSBEYXRlXCIgcGxhY2Vob2xkZXI9XCJBc3NlbWJseSBEYXRlXCIgaWQ9XCJtb2RlbC5hc3NlbWJseURhdGVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiTWFudWZhY3R1cmVyXCIgcGxhY2Vob2xkZXI9XCJNYW51ZmFjdHVyZXJcIiBpZD1cIm1vZGVsLm1hbnVmYWN0dXJlclwiIGZvcm09e3RoaXN9Lz5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2JyYW5jaH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kLCBMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQGJyYW5jaCh7XG4gIGN1cnNvcnM6IHtcbiAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gIH0sXG4gIGZhY2V0czoge1xuICAgIG1vZGVsOiBcImN1cnJlbnRSb2JvdFwiLFxuICB9LFxufSlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90RGV0YWlsIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaE1vZGVsO1xuXG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bG9hZGluZywgbG9hZEVycm9yfSA9IHRoaXMucHJvcHMucm9ib3RzO1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgcmV0dXJuIDxMb2FkaW5nLz47XG4gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkRldGFpbCBcIiArIG1vZGVsLm5hbWV9PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuaWR9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmFzc2VtYmx5RGF0ZX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5tYW51ZmFjdHVyZXJ9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJlc3VsdCBmcm9tIFwibG9kYXNoLnJlc3VsdFwiO1xuaW1wb3J0IG1lcmdlIGZyb20gXCJsb2Rhc2gubWVyZ2VcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwibG9kYXNoLmRlYm91bmNlXCI7XG5pbXBvcnQgZmxhdHRlbiBmcm9tIFwibG9kYXNoLmZsYXR0ZW5cIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuLy9pbXBvcnQgSm9pIGZyb20gXCJqb2lcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG4vL2xldCBWYWxpZGF0b3JzIGZyb20gXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kLCBMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChvYmpba2V5XSBpbnN0YW5jZW9mIEFycmF5IHx8ICFvYmpba2V5XSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuLy9mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuLy8gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbi8vICBkYXRhID0gZGF0YSB8fCB7fTtcbi8vICBsZXQgam9pT3B0aW9ucyA9IHtcbi8vICAgIGFib3J0RWFybHk6IGZhbHNlLFxuLy8gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuLy8gIH07XG4vLyAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4vLyAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbi8vICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4vLyAgICAgIGVycm9yc1xuLy8gICAgKTtcbi8vICB9IGVsc2Uge1xuLy8gICAgbGV0IHJlc3VsdCA9IHt9O1xuLy8gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgIHJldHVybiByZXN1bHQ7XG4vLyAgfVxuLy99XG5cbi8vZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuLy8gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbi8vICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuLy8gICAgICBpZiAoIW1lbW9bZGV0YWlsLnBhdGhdIGluc3RhbmNlb2YgQXJyYXkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL2N1cnNvcnMoKSB7XG4vLyAgcmV0dXJuIHtcbi8vICAgIHJvYm90czogW1wicm9ib3RzXCJdLFxuLy8gICAgbG9hZE1vZGVsOiBbXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgdGhpcy5nZXRQYXJhbXMoKS5pZF0sXG4vLyAgfVxuLy99LFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ib3RFZGl0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaE1vZGVsO1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPGRpdj5FZGl0PC9kaXY+O1xuICAgIC8vbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIC8vbGV0IGxvYWRNb2RlbCA9IHRoaXMuc3RhdGUuY3Vyc29ycy5sb2FkTW9kZWw7XG4gICAgLy9yZXR1cm4gKFxuICAgIC8vICA8Rm9ybSBtb2RlbHM9e21vZGVsc30gbG9hZGluZz17bG9hZGluZ30gbG9hZEVycm9yPXtsb2FkRXJyb3J9IGxvYWRNb2RlbD17bG9hZE1vZGVsfS8+XG4gICAgLy8pO1xuICB9XG59XG5cbi8vbGV0IEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4vLyAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuLy8gICAgcmV0dXJuIHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubG9hZE1vZGVsKSxcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4vLyAgICBpZiAoIU9iamVjdC52YWx1ZXModGhpcy5zdGF0ZS5tb2RlbCkubGVuZ3RoKSB7XG4vLyAgICAgIHRoaXMuc2V0U3RhdGUoe1xuLy8gICAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCBwcm9wcy5sb2FkTW9kZWwpLFxuLy8gICAgICB9KVxuLy8gICAgfVxuLy8gIH0sXG4vL1xuLy8gIHZhbGlkYXRvclR5cGVzKCkge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gICAgLy9yZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0b3JEYXRhKCkge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIC8vICByZXR1cm4gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZTogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9sZXQgc2NoZW1hID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yVHlwZXNcIikgfHwge307XG4vLyAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuLy8gICAgLy9sZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbiAoYSwgYikge1xuLy8gICAgLy8gIHJldHVybiBiIGluc3RhbmNlb2YgQXJyYXkgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4vLyAgICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgICAgbW9kZWxba2V5XSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4vLyAgICAgIHRoaXMuc2V0U3RhdGUoe21vZGVsOiBtb2RlbH0pO1xuLy8gICAgLy8gIHRoaXMudmFsaWRhdGVEZWJvdW5jZWQoa2V5KTtcbi8vICAgIH0uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICByZXR1cm4gdGhpcy52YWxpZGF0ZShrZXkpO1xuLy8gIH0sIDUwMCksXG4vL1xuLy8gIGhhbmRsZVJlc2V0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9LCB0aGlzLnZhbGlkYXRlKTtcbi8vICB9LFxuLy9cbi8vICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnZhbGlkYXRlKCkudGhlbihpc1ZhbGlkID0+IHtcbi8vICAgICAgaWYgKGlzVmFsaWQpIHtcbi8vICAgICAgICAvLyBUT0RPIHJlcGxhY2Ugd2l0aCBSZWFjdC5maW5kRE9NTm9kZSBhdCAjMC4xMy4wXG4vLyAgICAgICAgcm9ib3RBY3Rpb25zLmVkaXQoe1xuLy8gICAgICAgICAgaWQ6IHRoaXMuc3RhdGUubW9kZWwuaWQsXG4vLyAgICAgICAgICBuYW1lOiB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgICBhc3NlbWJseURhdGU6IHRoaXMucmVmcy5hc3NlbWJseURhdGUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgbWFudWZhY3R1cmVyOiB0aGlzLnJlZnMubWFudWZhY3R1cmVyLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICB9KTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICBhbGVydChcIkNhbid0IHN1Ym1pdCBmb3JtIHdpdGggZXJyb3JzXCIpO1xuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9LFxuLy9cbi8vICBnZXRWYWxpZGF0aW9uTWVzc2FnZXM6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIGxldCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycyB8fCB7fTtcbi8vICAgIGlmICghT2JqZWN0LnZhbHVlcyhlcnJvcnMpLmxlbmd0aCkge1xuLy8gICAgICByZXR1cm4gW107XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbi8vICAgICAgICByZXR1cm4gZmxhdHRlbihPYmplY3Qua2V5cyhlcnJvcnMpLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbi8vICAgICAgICAgIHJldHVybiBlcnJvcnNbZXJyb3JdIHx8IFtdO1xuLy8gICAgICAgIH0pKTtcbi8vICAgICAgfSBlbHNlIHtcbi8vICAgICAgICByZXR1cm4gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICAgIH1cbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICBpc1ZhbGlkOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICByZXR1cm4gdHJ1ZTtcbi8vICAgIC8vcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KS5sZW5ndGggPT0gMCk7XG4vLyAgfSxcbi8vXG4vLyAgcmVuZGVyKCkge1xuLy8gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvciwgbG9hZE1vZGVsfSA9IHRoaXMucHJvcHM7XG4vLyAgICBsZXQgbW9kZWwgPSB0aGlzLnN0YXRlLm1vZGVsO1xuLy9cbi8vICAgIGlmIChsb2FkaW5nKSB7XG4vLyAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuLy8gICAgfSBlbHNlIGlmIChsb2FkRXJyb3IpIHtcbi8vICAgICAgcmV0dXJuIDxFcnJvciBsb2FkRXJyb3I9e2xvYWRFcnJvcn0vPjtcbi8vICAgIH0gZWxzZSB7XG4vLyAgICAgIHJldHVybiAoXG4vLyAgICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRWRpdCBcIiArIG1vZGVsLm5hbWV9PlxuLy8gICAgICAgICAgPGRpdj5cbi8vICAgICAgICAgICAgPGRpdiBpZD1cImFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvYT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbi8vICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQge2JyYW5jaH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IHtFcnJvciwgTG9hZGluZywgTm90Rm91bmQsIEV4dGVybmFsUGFnaW5hdGlvbiwgSW50ZXJuYWxQYWdpbmF0aW9uLCBMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcbmltcG9ydCBSb2JvdEl0ZW0gZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBQZXJQYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXhwYW5kZWQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIHNldExpbWl0KGxpbWl0KSB7XG4gICAgcm9ib3RBY3Rpb25zLnNldExpbWl0KGxpbWl0KTtcbiAgICByb2JvdEFjdGlvbnMubG9hZEluZGV4KCk7XG4gICAgdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgfVxuXG4gIGhpZGVEcm9wZG93bigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtleHBhbmRlZDogZmFsc2V9KTtcbiAgfVxuXG4gIG9uQ2xpY2tPbkhlYWRlcihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50Lm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuc2V0U3RhdGUoe2V4cGFuZGVkOiAhdGhpcy5zdGF0ZS5leHBhbmRlZH0pO1xuICB9XG5cbiAgZG9jdW1lbnRDbGlja0hhbmRsZXIoKSB7XG4gICAgdGhpcy5oaWRlRHJvcGRvd24oKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRvY3VtZW50Q2xpY2tIYW5kbGVyKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmRvY3VtZW50Q2xpY2tIYW5kbGVyKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGl0ZW1zID0gdGhpcy5wcm9wcy5vcHRpb25zLm1hcChmdW5jdGlvbihpdGVtLCBrZXkpIHtcbiAgICAgIHJldHVybiA8bGkga2V5PXtrZXl9IHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzc05hbWU9e2l0ZW0gPT0gc2VsZi5wcm9wcy5jdXJyZW50ID8gXCJkaXNhYmxlZFwiOiBcIlwifT5cbiAgICAgICAgPGEgcm9sZT1cIm1lbnVpdGVtXCIgdGFiSW5kZXg9XCItMVwiIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gc2VsZi5zZXRMaW1pdChpdGVtKX0+e2l0ZW19PC9hPlxuICAgICAgPC9saT47XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImRyb3Bkb3duXCIgKyAodGhpcy5zdGF0ZS5leHBhbmRlZCA/IFwiIG9wZW5cIiA6IFwiXCIpfT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPXt0aGlzLnN0YXRlLmV4cGFuZGVkfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2tPbkhlYWRlcn0+XG4gICAgICAgICAgUGVycGFnZSB7dGhpcy5wcm9wcy5jdXJyZW50fSA8c3BhbiBjbGFzc05hbWU9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICB7aXRlbXN9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuY2xhc3MgU29ydEJ5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXhwYW5kZWQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIHJlc29ydCgpIHtcbiAgICB0aGlzLmhpZGVEcm9wZG93bigpO1xuICB9XG5cbiAgaGlkZURyb3Bkb3duKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2V4cGFuZGVkOiBmYWxzZX0pO1xuICB9XG5cbiAgb25DbGlja09uSGVhZGVyKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQubmF0aXZlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZXhwYW5kZWQ6ICF0aGlzLnN0YXRlLmV4cGFuZGVkfSk7XG4gIH1cblxuICBkb2N1bWVudENsaWNrSGFuZGxlcigpIHtcbiAgICB0aGlzLmhpZGVEcm9wZG93bigpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZG9jdW1lbnRDbGlja0hhbmRsZXIpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuZG9jdW1lbnRDbGlja0hhbmRsZXIpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICB2YXIgaXRlbXMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKGl0ZW0sIGtleSkge1xuICAgICAgcmV0dXJuIDxsaSBrZXk9e2tleX0gcm9sZT1cInByZXNlbnRhdGlvblwiIGNsYXNzTmFtZT17aXRlbSA9PSBzZWxmLnByb3BzLmN1cnJlbnQgPyBcImRpc2FibGVkXCI6IFwiXCJ9PlxuICAgICAgICA8TGluayByb2xlPVwibWVudWl0ZW1cIiB0YWJJbmRleD1cIi0xXCIgdG89XCJyb2JvdC1pbmRleFwiIHdpdGhRdWVyeT17e3NvcnQ6IGl0ZW19fSBvbkNsaWNrPXtzZWxmLnJlc29ydH0+e2l0ZW19PC9MaW5rPlxuICAgICAgPC9saT47XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImRyb3Bkb3duXCIgKyAodGhpcy5zdGF0ZS5leHBhbmRlZCA/IFwiIG9wZW5cIiA6IFwiXCIpfT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtIGRyb3Bkb3duLXRvZ2dsZVwiIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWV4cGFuZGVkPXt0aGlzLnN0YXRlLmV4cGFuZGVkfSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2tPbkhlYWRlcn0+XG4gICAgICAgICAgU29ydEJ5IHt0aGlzLnByb3BzLmN1cnJlbnR9IDxzcGFuIGNsYXNzTmFtZT1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5jbGFzcyBGaWx0ZXJzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgb25TdWJtaXRGaWx0ZXJGb3JtKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgZmlsdGVycyA9IHt9O1xuICAgIGZvciAobGV0IGk9MDsgaTxldmVudC50YXJnZXQuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChldmVudC50YXJnZXQuZWxlbWVudHNbaV0ubmFtZSkge1xuICAgICAgICBmaWx0ZXJzW2V2ZW50LnRhcmdldC5lbGVtZW50c1tpXS5uYW1lXSA9IGV2ZW50LnRhcmdldC5lbGVtZW50c1tpXS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVyLnRyYW5zaXRpb25UbyhcInJvYm90LWluZGV4XCIsIHt9LCB7ZmlsdGVyOiBmaWx0ZXJzfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImZvcm0taW5saW5lXCIgb25TdWJtaXQ9e3RoaXMub25TdWJtaXRGaWx0ZXJGb3JtfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbSBtYXJnaW4tcmlnaHRcIj5cbiAgICAgICAgICAgIDxsYWJlbCBmb3JOYW1lPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD4mbmJzcDtcbiAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cIm1hbnVmYWN0dXJlclwiIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy5jdXJyZW50Lm1hbnVmYWN0dXJlcn0+XG4gICAgICAgICAgICAgIDxvcHRpb24ga2V5PVwiMFwiIHZhbHVlPVwiXCI+PC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24ga2V5PVwiMVwiIHZhbHVlPVwiUnVzc2lhXCI+UnVzc2lhPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24ga2V5PVwiMlwiIHZhbHVlPVwiVVNBXCI+VVNBPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXAgbWFyZ2luLXJpZ2h0LXhzXCI+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCI+RmlsdGVyPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIG1hcmdpbi1yaWdodFwiPlxuICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1pbmRleFwiIHdpdGhRdWVyeT17e2ZpbHRlcjogZmFsc2V9fSBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1ncmF5XCI+UmVzZXQ8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuXG4gICAgKTtcbiAgfVxufVxuXG5AYnJhbmNoKHtcbiAgY3Vyc29yczoge1xuICAgIHJvYm90czogXCJyb2JvdHNcIixcbiAgfSxcblxuICBmYWNldHM6IHtcbiAgICBjdXJyZW50Um9ib3RzOiBcImN1cnJlbnRSb2JvdHNcIixcbiAgfVxufSlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90SW5kZXggZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgbG9hZERhdGEgPSByb2JvdEFjdGlvbnMuZXN0YWJsaXNoSW5kZXg7XG5cbiAgc3RhdGljIGNvbnRleHRUeXBlcyA9IHtcbiAgICByb3V0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHt0b3RhbCwgbG9hZGluZywgbG9hZEVycm9yLCBvZmZzZXQsIGxpbWl0fSA9IHRoaXMucHJvcHMucm9ib3RzO1xuICAgIGxldCBtb2RlbHMgPSB0aGlzLnByb3BzLmN1cnJlbnRSb2JvdHM7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT1cIlJvYm90c1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tYm90dG9tXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj48UGVyUGFnZSBjdXJyZW50PXtsaW1pdH0gb3B0aW9ucz17WzMsIDUsIDEwXX0vPjwvZGl2PlxuICAgICAgICAgICAgICAgIHsvKiBUT0RPOiAuc29ydHNbMF0gPT4gaGFjaywgZG9uJ3Qga25vdyBob3cgdG8gZG8gaXQgcmlnaHQgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj48U29ydEJ5IGN1cnJlbnQ9e3RoaXMucHJvcHMucm9ib3RzLnNvcnRzWzBdfSBvcHRpb25zPXtbXCIrbmFtZVwiLCBcIi1uYW1lXCJdfS8+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWFkZFwiIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLWdyZWVuXCIgdGl0bGU9XCJBZGRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtcGx1c1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPEZpbHRlcnMgY3VycmVudD17dGhpcy5wcm9wcy5yb2JvdHMuZmlsdGVyc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgPGgxPlJvYm90czwvaDE+XG4gICAgICAgICAgICAgIDxFeHRlcm5hbFBhZ2luYXRpb24gZW5kcG9pbnQ9XCJyb2JvdC1pbmRleFwiIHRvdGFsPXt0b3RhbH0gb2Zmc2V0PXtvZmZzZXR9IGxpbWl0PXtsaW1pdH0vPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICAgICAgICAgIHttb2RlbHMubWFwKG1vZGVsID0+IDxSb2JvdEl0ZW0gbW9kZWw9e21vZGVsfSBrZXk9e21vZGVsLmlkfS8+KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxJbnRlcm5hbFBhZ2luYXRpb24gb25DbGljaz17b2Zmc2V0ID0+IHJvYm90QWN0aW9ucy5zZXRPZmZzZXQob2Zmc2V0KX0gdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgICAgICB7bG9hZGluZyA/IDxMb2FkaW5nLz4gOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG4vKlxuPGRpdiBjbGFzc05hbWU9XCJidXR0b25zIGJ0bi1ncm91cFwiPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlc2V0XCI+UmVzZXQgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cInJlbW92ZVwiPlJlbW92ZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwic2h1ZmZsZVwiPlNodWZmbGUgQ29sbGVjdGlvbjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtaG9vaz1cImZldGNoXCI+UmVmZXRjaCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiYWRkXCI+QWRkIFJhbmRvbTwvYnV0dG9uPlxuPC9kaXY+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0xpbmt9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuaW1wb3J0IHJvYm90QWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvYWN0aW9uc1wiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEl0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIG1vZGVsOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXttb2RlbC5pZH0gY2xhc3NOYW1lPVwiY29sLXNtLTYgY29sLW1kLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIga2V5PXttb2RlbC5pZH0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj48TGluayB0bz1cInJvYm90LWRldGFpbFwiIHBhcmFtcz17e2lkOiBtb2RlbC5pZH19Pnttb2RlbC5uYW1lfTwvTGluaz48L2g0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keSB0ZXh0LWNlbnRlciBub3BhZGRpbmdcIj5cbiAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+XG4gICAgICAgICAgICAgIDxpbWcgc3JjPXsnaHR0cDovL3JvYm9oYXNoLm9yZy8nICsgbW9kZWwuaWQgKyAnP3NpemU9MjAweDIwMCd9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbiAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWZvb3RlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGVhcmZpeFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBidG4tZ3JvdXAtc20gcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ibHVlXCIgdGl0bGU9XCJEZXRhaWxcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1lZGl0XCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1vcmFuZ2VcIiB0aXRsZT1cIkVkaXRcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWVkaXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImJ0biBidG4tcmVkXCIgdGl0bGU9XCJSZW1vdmVcIiBvbkNsaWNrPXtyb2JvdEFjdGlvbnMucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIG1lc3NhZ2U6IHVuZGVmaW5lZCxcbiAgICBjYXRlZ29yeTogdW5kZWZpbmVkLFxuICAgIGNsb3NhYmxlOiB0cnVlLFxuICAgIGV4cGlyZTogNTAwMCxcbiAgfSwgZGF0YSk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtSb3V0ZSwgRGVmYXVsdFJvdXRlLCBOb3RGb3VuZFJvdXRlfSBmcm9tIFwicmVhY3Qtcm91dGVyXCI7XG5cbi8vIENvbXBvbmVudHNcbmltcG9ydCB7Qm9keSwgSG9tZSwgQWJvdXQsIE5vdEZvdW5kfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuaW1wb3J0IFJvYm90SW5kZXggZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaW5kZXhcIjtcbmltcG9ydCBSb2JvdEFkZCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9hZGRcIjtcbmltcG9ydCBSb2JvdERldGFpbCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9kZXRhaWxcIjtcbmltcG9ydCBSb2JvdEVkaXQgZnJvbSBcImZyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdFwiO1xuXG4vLyBST1VURVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCAoXG4gIDxSb3V0ZSBwYXRoPVwiL1wiIGhhbmRsZXI9e0JvZHl9PlxuICAgIDxEZWZhdWx0Um91dGUgaGFuZGxlcj17SG9tZX0gbmFtZT1cImhvbWVcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvYWJvdXRcIiBuYW1lPVwiYWJvdXRcIiBoYW5kbGVyPXtBYm91dH0gbG9hZGVyPVwieHh4XCIvPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy9cIiBuYW1lPVwicm9ib3QtaW5kZXhcIiBoYW5kbGVyPXtSb2JvdEluZGV4fS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzL2FkZFwiIG5hbWU9XCJyb2JvdC1hZGRcIiBoYW5kbGVyPXtSb2JvdEFkZH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy86aWRcIiBuYW1lPVwicm9ib3QtZGV0YWlsXCIgaGFuZGxlcj17Um9ib3REZXRhaWx9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvOmlkL2VkaXRcIiBuYW1lPVwicm9ib3QtZWRpdFwiIGhhbmRsZXI9e1JvYm90RWRpdH0vPlxuICAgIDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XG4gIDwvUm91dGU+XG4pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByYW5nZSBmcm9tIFwibG9kYXNoLnJhbmdlXCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcImxvZGFzaC5tZXJnZVwiO1xuaW1wb3J0IHNvcnRCeSBmcm9tIFwibG9kYXNoLnNvcnRieVwiO1xuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIFNwbGl0IGFycmF5IGludG8gY2h1bmtzIHdpdGggcHJlZGVmaW5lZCBjaHVuayBsZW5ndGguIFVzZWZ1bCBmb3IgcGFnaW5hdGlvbi5cbiAqIEV4YW1wbGU6XG4gKiAgIGNodW5rZWQoWzEsIDIsIDMsIDQsIDVdLCAyKSA9PSBbWzEsIDJdLCBbMywgNF0sIFs1XV1cbiAqIEBwdXJlXG4gKiBAcGFyYW0gYXJyYXkge0FycmF5fSAtIGFycmF5IHRvIGJlIGNodW5rZWRcbiAqIEBwYXJhbSBuIHtudW1iZXJ9IC0gbGVuZ3RoIG9mIGNodW5rXG4gKiBAcmV0dXJucyB7QXJyYXl9IC0gY2h1bmtlZCBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2h1bmtlZChhcnJheSwgbikge1xuICBsZXQgbCA9IE1hdGguY2VpbChhcnJheS5sZW5ndGggLyBuKTtcbiAgcmV0dXJuIHJhbmdlKGwpLm1hcCgoeCwgaSkgPT4gYXJyYXkuc2xpY2UoaSpuLCBpKm4gKyBuKSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgc29ydGluZyBhcnJheSBpbiBcInNob3J0XCIgZm9ybWF0IHRvIHNvcnRpbmcgYXJyYXkgaW4gXCJsb2Rhc2hcIiAobG9kYXNoLnNvcnRCeU9yZGVyKSBmb3JtYXQuXG4gKiBFeGFtcGxlOlxuICogICBsb2Rhc2hpZnlTb3J0cyhbXCIrbmFtZVwiLCBcIi1hZ2VcIl0pID09IFtbXCJuYW1lXCIsIFwiYWdlXCJdLCBbdHJ1ZSwgZmFsc2VdXVxuICogQHB1cmVcbiAqIEBwYXJhbSBzb3J0cyB7QXJyYXk8c3RyaW5nPn0gLSBhcnJheSBpbiBcInNob3J0XCIgZm9ybWF0XG4gKiBAcmV0dXJucyB7QXJyYXk8QXJyYXk8c3RyaW5nPj59IC0gYXJyYXkgaW4gXCJsb2Rhc2hcIiBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZGFzaGlmeVNvcnRzKHNvcnRzKSB7XG4gIHJldHVybiBbXG4gICAgc29ydHMubWFwKHYgPT4gdi5zbGljZSgxKSksXG4gICAgc29ydHMubWFwKHYgPT4gdlswXSA9PSBcIitcIiksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlZXAob2JqZWN0LCBvdGhlcikge1xuICByZXR1cm4gbWVyZ2Uoe30sIG9iamVjdCwgb3RoZXIsIChhLCBiKSA9PiB7XG4gICAgaWYgKGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJyYXlHcm91cChvYmplY3QsIHNvcnRlcj0odiA9PiB2KSkge1xuICByZXR1cm4gc29ydEJ5KE9iamVjdC5rZXlzKG9iamVjdCksIHNvcnRlcikucmVkdWNlKChjb21iaW5lZEFycmF5LCBrZXkpID0+IHtcbiAgICByZXR1cm4gY29tYmluZWRBcnJheS5jb25jYXQob2JqZWN0W2tleV0pO1xuICB9LCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0TGVzc2VyT2Zmc2V0KHBhZ2luYXRpb24sIG9mZnNldCkge1xuICBsZXQgb2Zmc2V0cyA9IE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLm1hcCh2ID0+IHBhcnNlSW50KHYpKS5zb3J0KCkucmV2ZXJzZSgpO1xuICBmb3IgKGxldCBvIG9mIG9mZnNldHMpIHtcbiAgICBpZiAocGFyc2VJbnQobykgPCBvZmZzZXQpIHtcbiAgICAgIHJldHVybiBvO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JqZWN0KGFycmF5KSB7XG4gIGlmIChhcnJheSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgob2JqZWN0LCBpdGVtKSA9PiB7XG4gICAgICBvYmplY3RbaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYGFycmF5IG11c3QgYmUgcGxhaW4gQXJyYXksIGdvdCAke2FycmF5fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iamVjdCkge1xuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIHNvcnRCeShcbiAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGtleSA9PiBvYmplY3Rba2V5XSksXG4gICAgICBpdGVtID0+IGl0ZW0uaWRcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRocm93IEVycm9yKGBvYmplY3QgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7b2JqZWN0fWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSkge1xuICByZXR1cm4ge1xuICAgIGZpbHRlcnM6IHF1ZXJ5LmZpbHRlcixcbiAgICBzb3J0czogcXVlcnkuc29ydCA/IHF1ZXJ5LnNvcnQuc3BsaXQoXCIsXCIpLm1hcCh2ID0+IHYucmVwbGFjZSgvXiAvLCBcIitcIikpIDogdW5kZWZpbmVkLFxuICAgIG9mZnNldDogcXVlcnkucGFnZSAmJiAocXVlcnkucGFnZS5vZmZzZXQgfHwgcXVlcnkucGFnZS5vZmZzZXQgPT0gMCkgPyBxdWVyeS5wYWdlLm9mZnNldCA6IHVuZGVmaW5lZCxcbiAgICBsaW1pdDogcXVlcnkucGFnZSAmJiAocXVlcnkucGFnZS5saW1pdCB8fCBxdWVyeS5wYWdlLm9mZnNldCA9PSAwKSA/IHF1ZXJ5LnBhZ2UubGltaXQgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRKc29uQXBpUXVlcnkobW9kaWZpZXJzKSB7XG4gIGlmICghbW9kaWZpZXJzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBtb2RpZmllcnMgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7bW9kaWZpZXJzfWApO1xuICB9XG5cbiAgbGV0IHNvcnRPYmogPSB7fTtcbiAgbGV0IGZpbHRlck9iaiA9IHt9O1xuICBsZXQgcGFnZU9iaiA9IHt9O1xuXG4gIGlmIChtb2RpZmllcnMuZmlsdGVycykge1xuICAgIGZpbHRlck9iaiA9IE9iamVjdC5rZXlzKG1vZGlmaWVycy5maWx0ZXJzKS5yZWR1Y2UoKGZpbHRlck9iaiwga2V5KSA9PiB7XG4gICAgICBmaWx0ZXJPYmpbYGZpbHRlclske2tleX1dYF0gPSBtb2RpZmllcnMuZmlsdGVyc1trZXldO1xuICAgICAgcmV0dXJuIGZpbHRlck9iajtcbiAgICB9LCBmaWx0ZXJPYmopO1xuICB9XG4gIGlmIChtb2RpZmllcnMuc29ydHMpIHtcbiAgICBzb3J0T2JqW1wic29ydFwiXSA9IG1vZGlmaWVycy5zb3J0cy5qb2luKFwiLFwiKTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLm9mZnNldCB8fCBtb2RpZmllcnMub2Zmc2V0ID09IDApIHtcbiAgICBwYWdlT2JqW1wicGFnZVtvZmZzZXRdXCJdID0gbW9kaWZpZXJzLm9mZnNldDtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmxpbWl0IHx8IG1vZGlmaWVycy5saW1pdCA9PSAwKSB7XG4gICAgcGFnZU9ialtcInBhZ2VbbGltaXRdXCJdID0gbW9kaWZpZXJzLmxpbWl0O1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHNvcnRPYmosIGZpbHRlck9iaiwgcGFnZU9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUoZGF0YSkge1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKHYgPT4gbm9ybWFsaXplKHYpKTtcbiAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRhdGEpLnJlZHVjZSgob2JqLCBrKSA9PiB7XG4gICAgICBvYmpba10gPSBub3JtYWxpemUoZGF0YVtrXSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YSA9PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKGRhdGEgPT09IFwiZmFsc2VcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKGRhdGEgPT09IFwibnVsbFwiKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGRhdGEubWF0Y2goL14tP1xcZCtcXC5cXGQrLykpIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5tYXRjaCgvXi0/XFxkKy8pKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBJbnNwZWN0IGZyb20gXCJ1dGlsLWluc3BlY3RcIjtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSG93IGl0J3MgZXZlciBtaXNzZWQ/IVxuUmVnRXhwLmVzY2FwZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xufTtcblxuLy8gVW5jb21tZW50IGlmIHVzZSBJb0pTXG4vLyBsZXQgcHJvY2VzcyA9IHByb2Nlc3MgfHwgdW5kZWZpbmVkO1xuLy9pZiAocHJvY2Vzcykge1xuICAvLyBJb0pTIGhhcyBgdW5oYW5kbGVkUmVqZWN0aW9uYCBob29rXG4gIC8vcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBmdW5jdGlvbiAocmVhc29uLCBwKSB7XG4gIC8vICB0aHJvdyBFcnJvcihgVW5oYW5kbGVkUmVqZWN0aW9uOiAke3JlYXNvbn1gKTtcbiAgLy99KTtcbi8vfSBlbHNlIHtcbiAgUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIGRvbmUocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdGhpc1xuICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhyb3cgZTsgfSwgMCk7XG4gICAgICB9KTtcbiAgfTtcbi8vfVxuXG4vLyBXb3JrYXJvdW5kIG1ldGhvZCBhcyBuYXRpdmUgYnJvd3NlciBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgSW1tdXRhYmxlIGlzIGF3ZnVsXG5sZXQgd2luZG93ID0gd2luZG93IHx8IHVuZGVmaW5lZDtcbmlmICh3aW5kb3cpIHtcbiAgd2luZG93LmNvbnNvbGUuZWNobyA9IGZ1bmN0aW9uIGVjaG8oKSB7XG4gICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAodiA9PiBJbnNwZWN0KHYpKSk7XG4gIH07XG59Il19
