(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

// IMPORTS =========================================================================================

require("babel/polyfill");

require("shared/shims");

var _React = require("react");

var _React2 = _interopRequireWildcard(_React);

var _createRouter$HistoryLocation = require("react-router");

var _normalize$parseJsonApiQuery = require("shared/common/helpers");

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

  //console.debug("router.run");

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

var _toObject = require("shared/common/helpers");

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

},{"./link":23,"classnames":"classnames","frontend/common/component":14,"lodash.range":"lodash.range","react":"react"}],27:[function(require,module,exports){
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

var _merge = require("lodash.merge");

var _merge2 = _interopRequireWildcard(_merge);

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

  _setFilters2["default"](cursor.get("filters") || undefined); // false -> undefined
  _setSorts2["default"](cursor.get("sorts") || undefined); // false -> undefined
  _setOffset2["default"](cursor.get("offset"));
  _setLimit2["default"](cursor.get("limit"));

  _loadIndex2["default"]();
}

module.exports = exports["default"];

},{"./load-index":40,"./set-filters":43,"./set-limit":45,"./set-offset":46,"./set-sorts":47,"frontend/common/router":30,"frontend/common/state":31}],36:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishModel;
// IMPORTS =========================================================================================

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

},{"./load-model":41,"frontend/common/router":30,"frontend/common/state":31}],37:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

// ACTIONS =========================================================================================
exports["default"] = establishPage;
// IMPORTS =========================================================================================

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

},{"./load-index":40,"frontend/common/router":30,"frontend/common/state":31}],38:[function(require,module,exports){
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

var _toObject = require("shared/common/helpers");

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

function isMaxOffset(pagination, offset) {
  return offset == Math.max.apply(Math, Object.keys(pagination).map(function (v) {
    return parseInt(v);
  }));
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

var _filter = require("lodash.filter");

var _filter2 = _interopRequireWildcard(_filter);

var _chunked$flattenArrayGroup$firstLesserOffset = require("shared/common/helpers");

var _state$ROBOT = require("frontend/common/state");

var _state$ROBOT2 = _interopRequireWildcard(_state$ROBOT);

var _router = require("frontend/common/router");

var _router2 = _interopRequireWildcard(_router);

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
      console.debug("Partial load, resetting pagination...");
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

var _chunked$firstLesserOffset = require("shared/common/helpers");

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
                    _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
                    { to: "robot-add", className: "btn btn-sm btn-green", title: "Add" },
                    _React2["default"].createElement("span", { className: "fa fa-plus" })
                  )
                ),
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
                  )
                ),
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
                  )
                ),
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
                        withQuery: { filter: false },
                        className: "btn btn-sm btn-secondary" },
                      "Reset filters"
                    ),
                    _React2["default"].createElement(
                      _Error$Loading$NotFound$ExternalPagination$InternalPagination$Link.Link,
                      {
                        to: "robot-index",
                        withQuery: { filter: { manufacturer: "Russia" } },
                        className: "btn btn-sm btn-secondary" },
                      "FilterBy manufacturer=Russia"
                    )
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
exports.normalize = normalize;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udGVuZC9zY3JpcHRzL2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGVjb3JhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYW9iYWItcmVhY3QvZGlzdC1tb2R1bGVzL2RlY29yYXRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy9oaWdoZXItb3JkZXIuanMiLCJub2RlX21vZHVsZXMvYmFvYmFiLXJlYWN0L2Rpc3QtbW9kdWxlcy91dGlscy9wcm9wLXR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL2Jhb2JhYi1yZWFjdC9kaXN0LW1vZHVsZXMvdXRpbHMvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1hZGQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtZmV0Y2gtbW9kZWwuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2FjdGlvbnMvYWxlcnQtbG9hZC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vYWN0aW9ucy9hbGVydC1sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9hY3Rpb25zL2FsZXJ0LXJlbW92ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2Fib3V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2FsZXJ0LWl0ZW0uanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYm9keS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9oZWFkcm9vbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ob21lLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2xpbmsuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvbG9hZGluZy5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9ub3QtZm91bmQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvcGFnaW5hdGlvbi1leHRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9wYWdpbmF0aW9uLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvY29tbW9uL21vZGVscy9hbGVydC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9jb21tb24vcm91dGVyLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL2NvbW1vbi9zdGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2VzdGFibGlzaC1wYWdlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvZmV0Y2gtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9mZXRjaC1tb2RlbC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9hY3Rpb25zL2xvYWQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9sb2FkLW1vZGVsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvcmVtb3ZlLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LWZpbHRlcnMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtaWQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtbGltaXQuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm9ib3QvYWN0aW9ucy9zZXQtb2Zmc2V0LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2FjdGlvbnMvc2V0LXNvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvYWRkLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZGV0YWlsLmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvZWRpdC5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Zyb250ZW5kL3JvYm90L2NvbXBvbmVudHMvaXRlbS5qcyIsIm5vZGVfbW9kdWxlcy9mcm9udGVuZC9yb2JvdC9tb2RlbHMuanMiLCJub2RlX21vZHVsZXMvZnJvbnRlbmQvcm91dGVzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXJlZC9jb21tb24vaGVscGVycy5qcyIsIm5vZGVfbW9kdWxlcy9zaGFyZWQvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7UUNDTyxnQkFBZ0I7O1FBQ2hCLGNBQWM7O3FCQUVILE9BQU87Ozs7NENBQzZCLGNBQWM7OzJDQUV6Qix1QkFBdUI7O3FCQUNoRCx1QkFBdUI7Ozs7c0JBQ3RCLGlCQUFpQjs7Ozs7QUFHcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyw4QkFQVCxNQUFNLENBT2dCO0FBQzVCLFFBQU0scUJBQVE7QUFDZCxVQUFRLGdDQVRzQixlQUFlLEFBU3BCO0NBQzFCLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUs7Ozs7Ozs7O0FBUXZDLE1BQUksU0FBUyxHQUFHLG1CQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxNQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMzQyxNQUFJLE1BQU0sR0FBRyw2QkFwQlAsU0FBUyxDQW9CUSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkMsTUFBSSxLQUFLLEdBQUcsNkJBckJOLFNBQVMsQ0FxQk8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqQyxXQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxXQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JELFdBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLFdBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU5QixNQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUN2QixNQUFJLEVBQUUsRUFBRTtBQUNOLGFBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3pCOztBQUVELE1BQUksV0FBVyxHQUFHLDZCQWpDRCxpQkFBaUIsQ0FpQ0UsS0FBSyxDQUFDLENBQUM7QUFDM0MsTUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3pDLGFBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUMvQztBQUNELE1BQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUN2QyxhQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDM0M7QUFDRCxNQUFJLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDeEMsYUFBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzdDO0FBQ0QsTUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3ZDLGFBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMzQzs7QUFFRCxxQkFBTSxNQUFNLEVBQUUsQ0FBQzs7O0FBR2YsTUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FDdEIsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUU7R0FBQSxDQUFDLENBQzFDLEdBQUcsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNmLFFBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNyQixjQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDckI7R0FDRixDQUFDLENBQUM7O0FBRUwsU0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUMvQix1QkFBTSxNQUFNLENBQUMsaUNBQUMsV0FBVyxPQUFFLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQy9ELENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7O0FDcEVIO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OzsrQkN0QjRCLDZCQUE2Qjs7OzsrQkFDN0IsNkJBQTZCOzs7OzhCQUU5Qiw0QkFBNEI7Ozs7OEJBQzVCLDRCQUE0Qjs7Ozt3QkFFbEMscUJBQXFCOzs7OzJCQUNs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TyxFQUFFLE1BQU0sQ0FBQyxTQUNoQixDQUFDLFVBQUEsQ0FBQyxFQUFJO0FBQ1YsY0FBVSxDQUFDLFlBQU07QUFBRSxZQUFNLENBQUMsQ0FBQztLQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDbkMsQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7OztBQUlKLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxTQUFTLENBQUM7QUFDakMsSUFBSSxNQUFNLEVBQUU7QUFDVixRQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksR0FBRztBQUNwQyxXQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7YUFBSSxxQkFBUSxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQztHQUN4RixDQUFDO0NBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFwiYmFiZWwvcG9seWZpbGxcIjtcbmltcG9ydCBcInNoYXJlZC9zaGltc1wiO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge2NyZWF0ZSBhcyBjcmVhdGVSb3V0ZXIsIEhpc3RvcnlMb2NhdGlvbn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQge25vcm1hbGl6ZSwgcGFyc2VKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVzIGZyb20gXCJmcm9udGVuZC9yb3V0ZXNcIjtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxud2luZG93Ll9yb3V0ZXIgPSBjcmVhdGVSb3V0ZXIoe1xuICByb3V0ZXM6IHJvdXRlcyxcbiAgbG9jYXRpb246IEhpc3RvcnlMb2NhdGlvblxufSk7XG5cbndpbmRvdy5fcm91dGVyLnJ1bigoQXBwbGljYXRpb24sIHVybCkgPT4ge1xuICAvLyB5b3UgbWlnaHQgd2FudCB0byBwdXNoIHRoZSBzdGF0ZSBvZiB0aGUgcm91dGVyIHRvIGFcbiAgLy8gc3RvcmUgZm9yIHdoYXRldmVyIHJlYXNvblxuICAvLyBSb3V0ZXJBY3Rpb25zLnJvdXRlQ2hhbmdlKHtyb3V0ZXJTdGF0ZTogc3RhdGV9KTtcblxuICAvL2NvbnNvbGUuZGVidWcoXCJyb3V0ZXIucnVuXCIpO1xuXG4gIC8vIFNFVCBCQU9CQUIgVVJMIERBVEEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGxldCB1cmxDdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gIGxldCBoYW5kbGVyID0gdXJsLnJvdXRlcy5zbGljZSgtMSlbMF0ubmFtZTtcbiAgbGV0IHBhcmFtcyA9IG5vcm1hbGl6ZSh1cmwucGFyYW1zKTtcbiAgbGV0IHF1ZXJ5ID0gbm9ybWFsaXplKHVybC5xdWVyeSk7XG5cbiAgdXJsQ3Vyc29yLnNldChcImhhbmRsZXJcIiwgaGFuZGxlcik7XG4gIHVybEN1cnNvci5zZXQoXCJyb3V0ZVwiLCB1cmwucm91dGVzLnNsaWNlKC0xKVswXS5uYW1lKTtcbiAgdXJsQ3Vyc29yLnNldChcInBhcmFtc1wiLCBwYXJhbXMpO1xuICB1cmxDdXJzb3Iuc2V0KFwicXVlcnlcIiwgcXVlcnkpO1xuXG4gIGxldCBpZCA9IHVybC5wYXJhbXMuaWQ7XG4gIGlmIChpZCkge1xuICAgIHVybEN1cnNvci5zZXQoXCJpZFwiLCBpZCk7XG4gIH1cblxuICBsZXQgcGFyc2VkUXVlcnkgPSBwYXJzZUpzb25BcGlRdWVyeShxdWVyeSk7XG4gIGlmIChwYXJzZWRRdWVyeS5oYXNPd25Qcm9wZXJ0eShcImZpbHRlcnNcIikpIHtcbiAgICB1cmxDdXJzb3Iuc2V0KFwiZmlsdGVyc1wiLCBwYXJzZWRRdWVyeS5maWx0ZXJzKTtcbiAgfVxuICBpZiAocGFyc2VkUXVlcnkuaGFzT3duUHJvcGVydHkoXCJzb3J0c1wiKSkge1xuICAgIHVybEN1cnNvci5zZXQoXCJzb3J0c1wiLCBwYXJzZWRRdWVyeS5zb3J0cyk7XG4gIH1cbiAgaWYgKHBhcnNlZFF1ZXJ5Lmhhc093blByb3BlcnR5KFwib2Zmc2V0XCIpKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcIm9mZnNldFwiLCBwYXJzZWRRdWVyeS5vZmZzZXQpO1xuICB9XG4gIGlmIChwYXJzZWRRdWVyeS5oYXNPd25Qcm9wZXJ0eShcImxpbWl0XCIpKSB7XG4gICAgdXJsQ3Vyc29yLnNldChcImxpbWl0XCIsIHBhcnNlZFF1ZXJ5LmxpbWl0KTtcbiAgfVxuXG4gIHN0YXRlLmNvbW1pdCgpO1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGxldCBwcm9taXNlcyA9IHVybC5yb3V0ZXNcbiAgICAubWFwKHJvdXRlID0+IHJvdXRlLmhhbmRsZXIub3JpZ2luYWwgfHwge30pXG4gICAgLm1hcChvcmlnaW5hbCA9PiB7XG4gICAgICBpZiAob3JpZ2luYWwubG9hZERhdGEpIHtcbiAgICAgICAgb3JpZ2luYWwubG9hZERhdGEoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgUmVhY3QucmVuZGVyKDxBcHBsaWNhdGlvbi8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xuICB9KTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0LW1vZHVsZXMvZGVjb3JhdG9ycy5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucm9vdCA9IHJvb3Q7XG5leHBvcnRzLmJyYW5jaCA9IGJyYW5jaDtcbi8qKlxuICogQmFvYmFiLVJlYWN0IERlY29yYXRvcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEVTNyBkZWNvcmF0b3JzIHN1Z2FyIGZvciBoaWdoZXIgb3JkZXIgY29tcG9uZW50cy5cbiAqL1xuXG52YXIgX1Jvb3QkQnJhbmNoID0gcmVxdWlyZSgnLi9oaWdoZXItb3JkZXIuanMnKTtcblxuZnVuY3Rpb24gcm9vdCh0cmVlKSB7XG4gIGlmICh0eXBlb2YgdHJlZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBfUm9vdCRCcmFuY2gucm9vdCh0cmVlKTtcbiAgfXJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5yb290KHRhcmdldCwgdHJlZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJyYW5jaChzcGVjcykge1xuICBpZiAodHlwZW9mIHNwZWNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9Sb290JEJyYW5jaC5icmFuY2goc3BlY3MpO1xuICB9cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gX1Jvb3QkQnJhbmNoLmJyYW5jaCh0YXJnZXQsIHNwZWNzKTtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfTtcblxudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTsgfSB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbnZhciBfaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBSb290IGNvbXBvbmVudFxuICovXG5leHBvcnRzLnJvb3QgPSByb290O1xuXG4vKipcbiAqIEJyYW5jaCBjb21wb25lbnRcbiAqL1xuZXhwb3J0cy5icmFuY2ggPSBicmFuY2g7XG4vKipcbiAqIEJhb2JhYi1SZWFjdCBIaWdoZXIgT3JkZXIgQ29tcG9uZW50XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBFUzYgaGlnaGVyIG9yZGVyIGNvbXBvbmVudCB0byBlbmNoYW5jZSBvbmUncyBjb21wb25lbnQuXG4gKi9cblxudmFyIF9SZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfUmVhY3QyID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX1JlYWN0KTtcblxudmFyIF90eXBlID0gcmVxdWlyZSgnLi91dGlscy90eXBlLmpzJyk7XG5cbnZhciBfdHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfdHlwZSk7XG5cbnZhciBfUHJvcFR5cGVzID0gcmVxdWlyZSgnLi91dGlscy9wcm9wLXR5cGVzLmpzJyk7XG5cbnZhciBfUHJvcFR5cGVzMiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9Qcm9wVHlwZXMpO1xuXG5mdW5jdGlvbiByb290KENvbXBvbmVudCwgdHJlZSkge1xuICBpZiAoIV90eXBlMlsnZGVmYXVsdCddLkJhb2JhYih0cmVlKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdDpoaWdoZXItb3JkZXIucm9vdDogZ2l2ZW4gdHJlZSBpcyBub3QgYSBCYW9iYWIuJyk7XG5cbiAgdmFyIENvbXBvc2VkQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgdmFyIF9jbGFzcyA9IGZ1bmN0aW9uIENvbXBvc2VkQ29tcG9uZW50KCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIF9jbGFzcyk7XG5cbiAgICAgIGlmIChfUmVhY3QkQ29tcG9uZW50ICE9IG51bGwpIHtcbiAgICAgICAgX1JlYWN0JENvbXBvbmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfaW5oZXJpdHMoX2NsYXNzLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MsIFt7XG4gICAgICBrZXk6ICdnZXRDaGlsZENvbnRleHQnLFxuXG4gICAgICAvLyBIYW5kbGluZyBjaGlsZCBjb250ZXh0XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2hpbGRDb250ZXh0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgdGhpcy5wcm9wcyk7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6ICdvcmlnaW5hbCcsXG4gICAgICB2YWx1ZTogQ29tcG9uZW50LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NoaWxkQ29udGV4dFR5cGVzJyxcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHRyZWU6IF9Qcm9wVHlwZXMyWydkZWZhdWx0J10uYmFvYmFiXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3M7XG4gIH0pKF9SZWFjdDJbJ2RlZmF1bHQnXS5Db21wb25lbnQpO1xuXG4gIHJldHVybiBDb21wb3NlZENvbXBvbmVudDtcbn1cblxuZnVuY3Rpb24gYnJhbmNoKENvbXBvbmVudCkge1xuICB2YXIgc3BlY3MgPSBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gIGlmICghX3R5cGUyWydkZWZhdWx0J10uT2JqZWN0KHNwZWNzKSkgdGhyb3cgRXJyb3IoJ2Jhb2JhYi1yZWFjdC5oaWdoZXItb3JkZXI6IGludmFsaWQgc3BlY2lmaWNhdGlvbnMgJyArICcoc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIGN1cnNvcnMgYW5kL29yIGZhY2V0cyBrZXkpLicpO1xuXG4gIHZhciBDb21wb3NlZENvbXBvbmVudCA9IChmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudDIpIHtcbiAgICB2YXIgX2NsYXNzMiA9XG5cbiAgICAvLyBCdWlsZGluZyBpbml0aWFsIHN0YXRlXG4gICAgZnVuY3Rpb24gQ29tcG9zZWRDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBfY2xhc3MyKTtcblxuICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoX2NsYXNzMi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgdmFyIGZhY2V0ID0gY29udGV4dC50cmVlLmNyZWF0ZUZhY2V0KHNwZWNzLCBbcHJvcHMsIGNvbnRleHRdKTtcblxuICAgICAgaWYgKGZhY2V0KSB0aGlzLnN0YXRlID0gZmFjZXQuZ2V0KCk7XG5cbiAgICAgIHRoaXMuZmFjZXQgPSBmYWNldDtcbiAgICB9O1xuXG4gICAgX2luaGVyaXRzKF9jbGFzczIsIF9SZWFjdCRDb21wb25lbnQyKTtcblxuICAgIF9jcmVhdGVDbGFzcyhfY2xhc3MyLCBbe1xuICAgICAga2V5OiAnZ2V0Q2hpbGRDb250ZXh0JyxcblxuICAgICAgLy8gQ2hpbGQgY29udGV4dFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldENoaWxkQ29udGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBjdXJzb3JzOiB0aGlzLmZhY2V0LmN1cnNvcnNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCBtb3VudFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmFjZXQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH12YXIgaGFuZGxlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmZhY2V0LmdldCgpKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmZhY2V0Lm9uKCd1cGRhdGUnLCBoYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdyZW5kZXInLFxuXG4gICAgICAvLyBSZW5kZXIgc2hpbVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIF9SZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHRoaXMuc3RhdGUpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb21wb25lbnRXaWxsVW5tb3VudCcsXG5cbiAgICAgIC8vIE9uIGNvbXBvbmVudCB1bm1vdW50XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBSZWxlYXNpbmcgZmFjZXRcbiAgICAgICAgdGhpcy5mYWNldC5yZWxlYXNlKCk7XG4gICAgICAgIHRoaXMuZmFjZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuXG4gICAgICAvLyBPbiBuZXcgcHJvcHNcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICAgIGlmICghdGhpcy5mYWNldCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfXRoaXMuZmFjZXQucmVmcmVzaChbcHJvcHMsIHRoaXMuY29udGV4dF0pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuZmFjZXQuZ2V0KCkpO1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiAnb3JpZ2luYWwnLFxuICAgICAgdmFsdWU6IENvbXBvbmVudCxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9LCB7XG4gICAgICBrZXk6ICdjb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgdHJlZTogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5iYW9iYWJcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSwge1xuICAgICAga2V5OiAnY2hpbGRDb250ZXh0VHlwZXMnLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgY3Vyc29yczogX1Byb3BUeXBlczJbJ2RlZmF1bHQnXS5jdXJzb3JzXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1dKTtcblxuICAgIHJldHVybiBfY2xhc3MyO1xuICB9KShfUmVhY3QyWydkZWZhdWx0J10uQ29tcG9uZW50KTtcblxuICByZXR1cm4gQ29tcG9zZWRDb21wb25lbnQ7XG59IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgQ3VzdG9tIFByb3AgVHlwZXNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBQcm9wVHlwZXMgdXNlZCB0byBwcm9wYWdhdGUgY29udGV4dCBzYWZlbHkuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHR5cGUgPSByZXF1aXJlKCcuL3R5cGUuanMnKTtcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlKHByb3BOYW1lLCB3aGF0KSB7XG4gIHJldHVybiAncHJvcCB0eXBlIGAnICsgcHJvcE5hbWUgKyAnYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlICcgKyB3aGF0ICsgJy4nO1xufVxuXG52YXIgUHJvcFR5cGVzID0ge307XG5cblByb3BUeXBlcy5iYW9iYWIgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIGlmICghdHlwZS5CYW9iYWIocHJvcHNbcHJvcE5hbWVdKSkgcmV0dXJuIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UocHJvcE5hbWUsICdhIEJhb2JhYiB0cmVlJykpO1xufTtcblxuUHJvcFR5cGVzLmN1cnNvcnMgPSBmdW5jdGlvbiAocHJvcHMsIHByb3BOYW1lKSB7XG4gIHZhciBwID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gIHZhciB2YWxpZCA9IHR5cGUuT2JqZWN0KHApICYmIE9iamVjdC5rZXlzKHApLmV2ZXJ5KGZ1bmN0aW9uIChrKSB7XG4gICAgcmV0dXJuIHR5cGUuQ3Vyc29yKHBba10pO1xuICB9KTtcblxuICBpZiAoIXZhbGlkKSByZXR1cm4gbmV3IEVycm9yKGVycm9yTWVzc2FnZShwcm9wTmFtZSwgJ0Jhb2JhYiBjdXJzb3JzJykpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9wVHlwZXM7IiwiLyoqXG4gKiBCYW9iYWItUmVhY3QgVHlwZSBDaGVja2luZ1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogU29tZSBoZWxwZXJzIHRvIHBlcmZvcm0gcnVudGltZSB2YWxpZGF0aW9ucy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZSA9IHt9O1xuXG50eXBlLk9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbn07XG5cbnR5cGUuQmFvYmFiID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgPT09ICdmdW5jdGlvbicgJiYgdmFsdWUudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgQmFvYmFiXSc7XG59O1xuXG50eXBlLkN1cnNvciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHZhbHVlLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IEN1cnNvcl0nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlOyIsImltcG9ydCBhbGVydEZldGNoTW9kZWwgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1mZXRjaC1tb2RlbFwiO1xuaW1wb3J0IGFsZXJ0RmV0Y2hJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbmltcG9ydCBhbGVydExvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtbW9kZWxcIjtcbmltcG9ydCBhbGVydExvYWRJbmRleCBmcm9tIFwiLi9hY3Rpb25zL2FsZXJ0LWxvYWQtaW5kZXhcIjtcblxuaW1wb3J0IGFsZXJ0QWRkIGZyb20gXCIuL2FjdGlvbnMvYWxlcnQtYWRkXCI7XG5pbXBvcnQgYWxlcnRSZW1vdmUgZnJvbSBcIi4vYWN0aW9ucy9hbGVydC1yZW1vdmVcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbGVydDoge1xuICAgIGZldGNoTW9kZWw6IGFsZXJ0RmV0Y2hNb2RlbCxcbiAgICBmZXRjaEluZGV4OiBhbGVydEZldGNoSW5kZXgsXG4gICAgbG9hZE1vZGVsOiBhbGVydExvYWRNb2RlbCxcbiAgICBsb2FkSW5kZXg6IGFsZXJ0TG9hZEluZGV4LFxuICAgIGFkZDogYWxlcnRBZGQsXG4gICAgcmVtb3ZlOiBhbGVydFJlbW92ZSxcbiAgfSxcbn07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCB7QWxlcnR9IGZyb20gXCJmcm9udGVuZC9jb21tb24vbW9kZWxzXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZChtb2RlbCkge1xuICBsZXQgbmV3TW9kZWwgPSBBbGVydChtb2RlbCk7XG4gIGxldCBpZCA9IG5ld01vZGVsLmlkO1xuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcblxuICAvLyBOb25wZXJzaXN0ZW50IGFkZFxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoSW5kZXgoZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoSW5kZXhcIik7XG5cbiAgbGV0IHVybCA9IGBhcGkvYWxlcnRzYDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcbiAgbGV0IHF1ZXJ5ID0gZm9ybWF0SnNvbkFwaVF1ZXJ5KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcblxuICBjdXJzb3IubWVyZ2Uoe1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgIHRvdGFsOiAwLFxuICAgIG1vZGVsczoge30sXG4gIH0pO1xuXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoMjAwKTsgLy8gSFRUUCByZXNwb25zZS5zdGF0dXNcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZldGNoTW9kZWwoaWQpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImZldGNoTW9kZWw6XCIsIGlkKTtcblxuICBsZXQgdXJsID0gYC9hcGkvYWxlcnRzLyR7aWR9YDtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcImFsZXJ0c1wiKTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCBmYWxzZSk7XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgyMDApOyAvLyBIVFRQIHJlc3BvbnNlLnN0YXR1c1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHt0b09iamVjdH0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2FsZXJ0LWZldGNoLWluZGV4XCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRJbmRleCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwiYWxlcnRzXCIpO1xuICBsZXQgZmlsdGVycyA9IGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpO1xuICBsZXQgc29ydHMgPSBjdXJzb3IuZ2V0KFwic29ydHNcIik7XG4gIGxldCBvZmZzZXQgPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpO1xuICBsZXQgbGltaXQgPSBjdXJzb3IuZ2V0KFwibGltaXRcIik7XG4gIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgbGV0IGlkcyA9IHBhZ2luYXRpb25bb2Zmc2V0XTtcbiAgaWYgKCFpZHMpIHtcbiAgICBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoTW9kZWwgZnJvbSBcIi4vYWxlcnQtZmV0Y2gtbW9kZWxcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZE1vZGVsXCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIik7XG4gIGxldCBtb2RlbHMgPSBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpO1xuICBsZXQgaWQgPSBjdXJzb3IuZ2V0KFwiaWRcIik7XG5cbiAgbGV0IG1vZGVsID0gbW9kZWxzW2lkXTtcbiAgaWYgKCFtb2RlbCkge1xuICAgIGZldGNoTW9kZWwoaWQpO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGxldCB1cmwgPSBgL2FwaS9hbGVydHMvJHtpZH1gO1xuXG4gIC8vIE5vbi1wZXJzaXN0ZW50IHJlbW92ZVxuICBzdGF0ZS5zZWxlY3QoXCJhbGVydHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZ2V0QWxsTWV0aG9kcyhvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZmlsdGVyKGtleSA9PiB0eXBlb2Ygb2JqW2tleV0gPT0gXCJmdW5jdGlvblwiKTtcbn1cblxuZnVuY3Rpb24gYXV0b0JpbmQob2JqKSB7XG4gIGdldEFsbE1ldGhvZHMob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSlcbiAgICAuZm9yRWFjaChtdGQgPT4ge1xuICAgICAgb2JqW210ZF0gPSBvYmpbbXRkXS5iaW5kKG9iaik7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGF1dG9CaW5kKHRoaXMpO1xuICB9XG59IiwiaW1wb3J0IEFib3V0IGZyb20gXCIuL2NvbXBvbmVudHMvYWJvdXRcIjtcbmltcG9ydCBCb2R5IGZyb20gXCIuL2NvbXBvbmVudHMvYm9keVwiO1xuaW1wb3J0IEhlYWRyb29tIGZyb20gXCIuL2NvbXBvbmVudHMvaGVhZHJvb21cIjtcbmltcG9ydCBIb21lIGZyb20gXCIuL2NvbXBvbmVudHMvaG9tZVwiO1xuXG5pbXBvcnQgRXJyb3IgZnJvbSBcIi4vY29tcG9uZW50cy9lcnJvclwiO1xuaW1wb3J0IE5vdEZvdW5kIGZyb20gXCIuL2NvbXBvbmVudHMvbm90LWZvdW5kXCI7XG5pbXBvcnQgTG9hZGluZyBmcm9tIFwiLi9jb21wb25lbnRzL2xvYWRpbmdcIjtcblxuaW1wb3J0IEludGVybmFsUGFnaW5hdGlvbiBmcm9tIFwiLi9jb21wb25lbnRzL3BhZ2luYXRpb24taW50ZXJuYWxcIjtcbmltcG9ydCBFeHRlcm5hbFBhZ2luYXRpb24gZnJvbSBcIi4vY29tcG9uZW50cy9wYWdpbmF0aW9uLWV4dGVybmFsXCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9jb21wb25lbnRzL2xpbmtcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBBYm91dCwgQm9keSwgSGVhZHJvb20sIEhvbWUsXG4gIEVycm9yLCBOb3RGb3VuZCwgTG9hZGluZyxcbiAgSW50ZXJuYWxQYWdpbmF0aW9uLCBFeHRlcm5hbFBhZ2luYXRpb24sXG4gIExpbmssXG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiQWJvdXRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2UgaW5mb1wiPlxuICAgICAgICAgIDxoMT5TaW1wbGUgUGFnZSBFeGFtcGxlPC9oMT5cbiAgICAgICAgICA8cD5UaGlzIHBhZ2Ugd2FzIHJlbmRlcmVkIGJ5IGEgSmF2YVNjcmlwdDwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4vL2xldCBDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSBcInJjLWNzcy10cmFuc2l0aW9uLWdyb3VwXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBMb2FkaW5nIGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50cy9sb2FkaW5nXCI7XG5pbXBvcnQgTm90Rm91bmQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL25vdC1mb3VuZFwiO1xuaW1wb3J0IEFsZXJ0SXRlbSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaXRlbVwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG1peGluczogW3N0YXRlLm1peGluXSxcblxuICBjdXJzb3JzOiB7XG4gICAgYWxlcnRzOiBbXCJhbGVydHNcIl0sXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLmFsZXJ0cztcbiAgICBtb2RlbHMgPSB0b0FycmF5KG1vZGVscyk7XG5cbiAgICBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbnMgdG9wLWxlZnRcIj5cbiAgICAgICAgICB7bW9kZWxzLm1hcChtb2RlbCA9PiA8QWxlcnRJdGVtIG1vZGVsPXttb2RlbH0ga2V5PXttb2RlbC5pZH0vPil9XG4gICAgICAgICAge2xvYWRpbmcgPyA8TG9hZGluZy8+IDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIENhbid0IHJ1biB0aGlzIGNyYXAgZm9yIG5vdyBUT0RPIHJlY2hlY2sgYWZ0ZXIgdHJhbnNpdGlvbiB0byBXZWJwYWNrXG4vLyAxKSByZWFjdC9hZGRvbnMgcHVsbHMgd2hvbGUgbmV3IHJlYWN0IGNsb25lIGluIGJyb3dzZXJpZnlcbi8vIDIpIHJjLWNzcy10cmFuc2l0aW9uLWdyb3VwIGNvbnRhaW5zIHVuY29tcGlsZWQgSlNYIHN5bnRheFxuLy8gT01HIHdoYXQgYW4gaWRpb3RzICZfJlxuXG4vLzxDU1NUcmFuc2l0aW9uR3JvdXAgdHJhbnNpdGlvbk5hbWU9XCJmYWRlXCIgY29tcG9uZW50PVwiZGl2XCI+XG4vLyAge21vZGVscy5tYXAobW9kZWwgPT4gPEFsZXJ0SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuLy88L0NTU1RyYW5zaXRpb25Hcm91cD5cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBjbGFzc05hbWVzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IHtMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEV4cGlyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgZGVsYXk6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIsXG4gICAgLy9vbkV4cGlyZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmN0aW9uLFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVsYXk6IDUwMCxcbiAgICAgIC8vb25FeHBpcmU6IHVuZGVmaW5lZCxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc3RhcnRUaW1lcigpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgLy8gUmVzZXQgdGhlIHRpbWVyIGlmIGNoaWxkcmVuIGFyZSBjaGFuZ2VkXG4gICAgaWYgKG5leHRQcm9wcy5jaGlsZHJlbiAhPT0gdGhpcy5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgfVxuICB9LFxuXG4gIHN0YXJ0VGltZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIHRpbWVyXG4gICAgaWYgKHRoaXMuX3RpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfVxuXG4gICAgLy8gSGlkZSBhZnRlciBgbW9kZWwuZGVsYXlgIG1zXG4gICAgaWYgKHRoaXMucHJvcHMuZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBpcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25FeHBpcmUoKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5fdGltZXI7XG4gICAgICB9LCB0aGlzLnByb3BzLmRlbGF5KTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiA8ZGl2Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PjtcbiAgfSxcbn0pO1xuXG5sZXQgQ2xvc2VMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljayhldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKCk7XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YSBjbGFzc05hbWU9XCJjbG9zZSBwdWxsLXJpZ2h0XCIgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT4mdGltZXM7PC9hPlxuICAgICk7XG4gIH1cbn0pO1xuXG5sZXQgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBtb2RlbCA9IHRoaXMucHJvcHMubW9kZWw7XG5cbiAgICBsZXQgY2xhc3NlcyA9IGNsYXNzTmFtZXMoe1xuICAgICAgXCJhbGVydFwiOiB0cnVlLFxuICAgICAgW1wiYWxlcnQtXCIgKyBtb2RlbC5jYXRlZ29yeV06IHRydWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0ID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzZXN9IHsuLi50aGlzLnByb3BzfT5cbiAgICAgICAge21vZGVsLmNsb3NhYmxlID8gPENsb3NlTGluayBvbkNsaWNrPXtjb21tb25BY3Rpb25zLmFsZXJ0LnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0vPiA6IFwiXCJ9XG4gICAgICAgIHttb2RlbC5tZXNzYWdlfVxuICAgICAgPC9kaXY+XG4gICAgKTtcblxuICAgIGlmIChtb2RlbC5leHBpcmUpIHtcbiAgICAgIHJlc3VsdCA9IDxFeHBpcmUgb25FeHBpcmU9e2NvbW1vbkFjdGlvbnMuYWxlcnQucmVtb3ZlLmJpbmQodGhpcywgbW9kZWwuaWQpfSBkZWxheT17bW9kZWwuZXhwaXJlfT57cmVzdWx0fTwvRXhwaXJlPjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZW07XG5cblxuLypcbk5vdGlmaWNhdGlvbi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYodGhpcy5vcHRpb25zLmZhZGVPdXQuZW5hYmxlZClcbiAgICB0aGlzLiRub3RlLmRlbGF5KHRoaXMub3B0aW9ucy5mYWRlT3V0LmRlbGF5IHx8IDMwMDApLmZhZGVPdXQoJ3Nsb3cnLCAkLnByb3h5KG9uQ2xvc2UsIHRoaXMpKTtcblxuICB0aGlzLiRlbGVtZW50LmFwcGVuZCh0aGlzLiRub3RlKTtcbiAgdGhpcy4kbm90ZS5hbGVydCgpO1xufTtcblxuTm90aWZpY2F0aW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICBpZih0aGlzLm9wdGlvbnMuZmFkZU91dC5lbmFibGVkKVxuICAgIHRoaXMuJG5vdGUuZGVsYXkodGhpcy5vcHRpb25zLmZhZGVPdXQuZGVsYXkgfHwgMzAwMCkuZmFkZU91dCgnc2xvdycsICQucHJveHkob25DbG9zZSwgdGhpcykpO1xuICBlbHNlIG9uQ2xvc2UuY2FsbCh0aGlzKTtcbn07XG5cbiQuZm4ubm90aWZ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24odGhpcywgb3B0aW9ucyk7XG59O1xuKi9cblxuLy8gVE9ETyBjaGVjayB0aGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29keWJhZy9ib290c3RyYXAtbm90aWZ5L3RyZWUvbWFzdGVyL2Nzcy9zdHlsZXNcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCB7cm9vdH0gZnJvbSBcImJhb2JhYi1yZWFjdC9kZWNvcmF0b3JzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge0xpbmssIFJvdXRlSGFuZGxlcn0gZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgSGVhZHJvb20gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzL2hlYWRyb29tXCI7XG5pbXBvcnQgQWxlcnRJbmRleCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHMvYWxlcnQtaW5kZXhcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQHJvb3Qoc3RhdGUpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2R5IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgLy9zdGF0aWMgbG9hZFBhZ2UocGFyYW1zLCBxdWVyeSkge1xuICAgIC8vIElnbm9yZSBwYXJhbXMgYW5kIHF1ZXJ5XG4gICAgLy8gZXN0YWJsaXNoUGFnZShwYXJhbXMsIHF1ZXJ5KTtcbiAgICAvL3JldHVybiBjb21tb25BY3Rpb25zLmFsZXJ0LmxvYWRQYWdlKCk7XG4gIC8vfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgaGVhZHJvb21DbGFzc05hbWVzID0ge3Zpc2libGU6IFwibmF2YmFyLWRvd25cIiwgaGlkZGVuOiBcIm5hdmJhci11cFwifTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgIDxIZWFkcm9vbSBjb21wb25lbnQ9XCJoZWFkZXJcIiBpZD1cInBhZ2UtaGVhZGVyXCIgY2xhc3NOYW1lPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCIgaGVhZHJvb21DbGFzc05hbWVzPXtoZWFkcm9vbUNsYXNzTmFtZXN9PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJuYXZiYXItdG9nZ2xlIGNvbGxhcHNlZFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCIgZGF0YS10YXJnZXQ9XCIubmF2YmFyLXBhZ2UtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWJhcnMgZmEtbGdcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8TGluayBjbGFzc05hbWU9XCJuYXZiYXItYnJhbmRcIiB0bz1cImhvbWVcIj48c3BhbiBjbGFzc05hbWU9XCJsaWdodFwiPlJlYWN0PC9zcGFuPlN0YXJ0ZXI8L0xpbms+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlIG5hdmJhci1wYWdlLWhlYWRlciBuYXZiYXItcmlnaHQgYnJhY2tldHMtZWZmZWN0XCI+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJuYXYgbmF2YmFyLW5hdlwiPlxuICAgICAgICAgICAgICAgIDxsaT48TGluayB0bz1cImhvbWVcIj5Ib21lPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0+Um9ib3RzPC9MaW5rPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpPjxMaW5rIHRvPVwiYWJvdXRcIj5BYm91dDwvTGluaz48L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9uYXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvSGVhZHJvb20+XG5cbiAgICAgICAgPG1haW4gaWQ9XCJwYWdlLW1haW5cIj5cbiAgICAgICAgICA8Um91dGVIYW5kbGVyLz5cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICAgIHsvKjxBbGVydEluZGV4Lz4qL31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3IgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGxvYWRFcnJvcjogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZihbXCJ4c1wiLCBcInNtXCIsIFwibWRcIiwgXCJsZ1wiXSksXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIHNpemU6IFwibWRcIixcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9e1wiRXJyb3IgXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5zdGF0dXMgKyBcIjogXCIgKyB0aGlzLnByb3BzLmxvYWRFcnJvci5kZXNjcmlwdGlvbn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4gICAgICAgICAgXCJhbGVydC1hcy1pY29uXCI6IHRydWUsXG4gICAgICAgICAgXCJmYS1zdGFja1wiOiB0cnVlLFxuICAgICAgICAgIFt0aGlzLnByb3BzLnNpemVdOiB0cnVlXG4gICAgICAgIH0pfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1jb2cgZmEtc3RhY2stMXhcIj48L2k+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtYmFuIGZhLXN0YWNrLTJ4XCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSBcImxvZGFzaC50aHJvdHRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRyb29tIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21wb25lbnQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBjb21wb25lbnQ6IFwiZGl2XCIsXG4gICAgaGVhZHJvb21DbGFzc05hbWVzOiB7XG4gICAgICB2aXNpYmxlOiBcIm5hdmJhci1kb3duXCIsXG4gICAgICBoaWRkZW46IFwibmF2YmFyLXVwXCJcbiAgICB9LFxuICB9XG5cbiAgc3RhdGUgPSB7XG4gICAgY2xhc3NOYW1lOiBcIlwiXG4gIH1cblxuICBoYXNTY3JvbGxlZCgpIHtcbiAgICBsZXQgdG9wUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAvLyBNYWtlIHN1cmUgdXNlcnMgc2Nyb2xsIG1vcmUgdGhhbiBkZWx0YVxuICAgIGlmIChNYXRoLmFicyh0aGlzLmxhc3RTY3JvbGxUb3AgLSB0b3BQb3NpdGlvbikgPD0gdGhpcy5kZWx0YUhlaWdodCkgcmV0dXJuO1xuXG4gICAgLy8gSWYgdGhleSBzY3JvbGxlZCBkb3duIGFuZCBhcmUgcGFzdCB0aGUgbmF2YmFyLCBhZGQgY2xhc3MgYHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGVgLlxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHNvIHlvdSBuZXZlciBzZWUgd2hhdCBpcyBcImJlaGluZFwiIHRoZSBuYXZiYXIuXG4gICAgaWYgKHRvcFBvc2l0aW9uID4gdGhpcy5sYXN0U2Nyb2xsVG9wICYmIHRvcFBvc2l0aW9uID4gdGhpcy5lbGVtZW50SGVpZ2h0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLmhpZGRlbn0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICgodG9wUG9zaXRpb24gKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2xhc3NOYW1lOiB0aGlzLnByb3BzLmhlYWRyb29tQ2xhc3NOYW1lcy52aXNpYmxlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubGFzdFNjcm9sbFRvcCA9IHRvcFBvc2l0aW9uO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gSW5pdCBvcHRpb25zXG4gICAgdGhpcy5kZWx0YUhlaWdodCA9IHRoaXMucHJvcHMuZGVsdGFIZWlnaHQgPyB0aGlzLnByb3BzLmRlbHRhSGVpZ2h0IDogNTtcbiAgICB0aGlzLmRlbGF5ID0gdGhpcy5wcm9wcy5kZWxheSA/IHRoaXMucHJvcHMuZGVsYXkgOiAyNTA7XG4gICAgdGhpcy5sYXN0U2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmVsZW1lbnRIZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnByb3BzLmlkKS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAvLyBBZGQgZXZlbnQgaGFuZGxlciBvbiBzY3JvbGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aHJvdHRsZSh0aGlzLmhhc1Njcm9sbGVkLCB0aGlzLmRlbGF5KSwgZmFsc2UpO1xuXG4gICAgLy8gVXBkYXRlIGNvbXBvbmVudFwicyBjbGFzc05hbWVcbiAgICB0aGlzLnNldFN0YXRlKHtjbGFzc05hbWU6IHRoaXMucHJvcHMuaGVhZHJvb21DbGFzc05hbWVzLnZpc2libGV9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFzU2Nyb2xsZWQsIGZhbHNlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgY29tcG9uZW50ID0gdGhpcy5wcm9wcy5jb21wb25lbnQ7XG4gICAgbGV0IHByb3BzID0ge2lkOiB0aGlzLnByb3BzLmlkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lICsgXCIgXCIgKyB0aGlzLnN0YXRlLmNsYXNzTmFtZX07XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBjb21wb25lbnQsXG4gICAgICBwcm9wcyxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJSZWFjdCBTdGFydGVyXCI+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBwYWdlIGhvbWVcIj5cbiAgICAgICAgICA8aDE+UmVhY3Qgc3RhcnRlciBhcHA8L2gxPlxuICAgICAgICAgIDxwPlByb29mIG9mIGNvbmNlcHRzLCBDUlVELCB3aGF0ZXZlci4uLjwvcD5cbiAgICAgICAgICA8cD5Qcm91ZGx5IGJ1aWxkIG9uIEVTNiB3aXRoIHRoZSBoZWxwIG9mIDxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IHRyYW5zcGlsZXIuPC9wPlxuICAgICAgICAgIDxoMz5Gcm9udGVuZDwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L1wiPlJlYWN0PC9hPiBkZWNsYXJhdGl2ZSBVSTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYlwiPkJhb2JhYjwvYT4gSlMgZGF0YSB0cmVlIHdpdGggY3Vyc29yczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9yYWNrdC9yZWFjdC1yb3V0ZXJcIj5SZWFjdC1Sb3V0ZXI8L2E+IGRlY2xhcmF0aXZlIHJvdXRlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlYWN0LWRvY3VtZW50LXRpdGxlXCI+UmVhY3QtRG9jdW1lbnQtVGl0bGU8L2E+IGRlY2xhcmF0aXZlIGRvY3VtZW50IHRpdGxlczwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9yZWFjdC1ib290c3RyYXAuZ2l0aHViLmlvL1wiPlJlYWN0LUJvb3RzdHJhcDwvYT4gQm9vdHN0cmFwIGNvbXBvbmVudHMgaW4gUmVhY3Q8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYnJvd3NlcmlmeS5vcmcvXCI+QnJvd3NlcmlmeTwvYT4gJmFtcDsgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay93YXRjaGlmeVwiPldhdGNoaWZ5PC9hPiBidW5kbGUgTlBNIG1vZHVsZXMgdG8gZnJvbnRlbmQ8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vYm93ZXIuaW8vXCI+Qm93ZXI8L2E+IGZyb250ZW5kIHBhY2thZ2UgbWFuYWdlcjwvbGk+XG4gICAgICAgICAgPC91bD5cblxuICAgICAgICAgIDxoMz5CYWNrZW5kPC9oMz5cbiAgICAgICAgICA8dWw+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9leHByZXNzanMuY29tL1wiPkV4cHJlc3M8L2E+IHdlYi1hcHAgYmFja2VuZCBmcmFtZXdvcms8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vbW96aWxsYS5naXRodWIuaW8vbnVuanVja3MvXCI+TnVuanVja3M8L2E+IHRlbXBsYXRlIGVuZ2luZTwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9lbGVpdGgvZW1haWxqc1wiPkVtYWlsSlM8L2E+IFNNVFAgY2xpZW50PC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPkNvbW1vbjwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2JhYmVsanMuaW8vXCI+QmFiZWw8L2E+IEpTIHRyYW5zcGlsZXI8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ3VscGpzLmNvbS9cIj5HdWxwPC9hPiBzdHJlYW1pbmcgYnVpbGQgc3lzdGVtPC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9sb2Rhc2guY29tL1wiPkxvZGFzaDwvYT4gdXRpbGl0eSBsaWJyYXJ5PC9saT5cbiAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3NcIj5BeGlvczwvYT4gcHJvbWlzZS1iYXNlZCBIVFRQIGNsaWVudDwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgaHJlZj1cImh0dHA6Ly9tb21lbnRqcy5jb20vXCI+TW9tZW50PC9hPiBkYXRlLXRpbWUgc3R1ZmY8L2xpPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vbWFyYWsvRmFrZXIuanMvXCI+RmFrZXI8L2E+IGZha2UgZGF0YSBnZW5lcmF0aW9uPC9saT5cbiAgICAgICAgICA8L3VsPlxuXG4gICAgICAgICAgPGgzPlZDUzwvaDM+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwOi8vZ2l0LXNjbS5jb20vXCI+R2l0PC9hPiB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RSb3V0ZXIgZnJvbSBcInJlYWN0LXJvdXRlclwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgbGV0IHBhcmFtcyA9IGN1cnNvci5nZXQoXCJwYXJhbXNcIik7XG4gICAgbGV0IHF1ZXJ5ID0gY3Vyc29yLmdldChcInF1ZXJ5XCIpO1xuXG4gICAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KFwid2l0aFBhcmFtc1wiKSkge1xuICAgICAgcHJvcHMud2l0aFBhcmFtcyA9IHByb3BzLndpdGhQYXJhbXMgPT09IHRydWUgPyB7fSA6IHByb3BzLndpdGhQYXJhbXM7XG4gICAgICBwcm9wcy5wYXJhbXMgPSBtZXJnZSh7fSwgcGFyYW1zLCBwcm9wcy53aXRoUGFyYW1zKTtcbiAgICAgIGRlbGV0ZSBwcm9wcy53aXRoUGFyYW1zO1xuICAgIH1cbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoXCJ3aXRoUXVlcnlcIikpIHtcbiAgICAgIHByb3BzLndpdGhRdWVyeSA9IHByb3BzLndpdGhRdWVyeSA9PT0gdHJ1ZSA/IHt9IDogcHJvcHMud2l0aFF1ZXJ5O1xuICAgICAgcHJvcHMucXVlcnkgPSBtZXJnZSh7fSwgcXVlcnksIHByb3BzLndpdGhRdWVyeSk7XG4gICAgICBkZWxldGUgcHJvcHMud2l0aFF1ZXJ5O1xuICAgIH1cblxuICAgIHJldHVybiA8UmVhY3RSb3V0ZXIuTGluayB7Li4ucHJvcHN9PlxuICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgPC9SZWFjdFJvdXRlci5MaW5rPjtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHNpemVDbGFzcyA9IHRoaXMucHJvcHMuc2l6ZSA/ICcgbG9hZGluZy0nICsgdGhpcy5wcm9wcy5zaXplIDogJyc7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiTG9hZGluZy4uLlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17XCJhbGVydC1hcy1pY29uXCIgKyBzaXplQ2xhc3N9PlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWNvZyBmYS1zcGluXCI+PC9pPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICApO1xuICB9XG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudFwiO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RGb3VuZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERvY3VtZW50VGl0bGUgdGl0bGU9XCJOb3QgRm91bmRcIj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIHBhZ2VcIj5cbiAgICAgICAgICA8aDE+UGFnZSBub3QgRm91bmQ8L2gxPlxuICAgICAgICAgIDxwPlNvbWV0aGluZyBpcyB3cm9uZzwvcD5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgPC9Eb2N1bWVudFRpdGxlPlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgcmFuZ2UgZnJvbSBcImxvZGFzaC5yYW5nZVwiO1xuaW1wb3J0IENsYXNzIGZyb20gXCJjbGFzc25hbWVzXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCBMaW5rIGZyb20gXCIuL2xpbmtcIjtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXh0ZXJuYWxQYWdpbmF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBlbmRwb2ludDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHRvdGFsOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgb2Zmc2V0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgbGltaXQ6IFJlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHRvdGFsUGFnZXMoKSB7XG4gICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnByb3BzLnRvdGFsIC8gdGhpcy5wcm9wcy5saW1pdCk7XG4gIH1cblxuICBtYXhPZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudG90YWxQYWdlcygpICogdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHByZXZPZmZzZXQob2Zmc2V0KSB7XG4gICAgcmV0dXJuIG9mZnNldCA8PSAwID8gMCA6IG9mZnNldCAtIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBuZXh0T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPj0gdGhpcy5tYXhPZmZzZXQoKSA/IHRoaXMubWF4T2Zmc2V0KCkgOiBvZmZzZXQgKyB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBlbmRwb2ludCA9IHRoaXMucHJvcHMuZW5kcG9pbnQ7XG4gICAgbGV0IGxpbWl0ID0gdGhpcy5wcm9wcy5saW1pdDtcbiAgICBsZXQgY3Vyck9mZnNldCA9IHRoaXMucHJvcHMub2Zmc2V0O1xuICAgIGxldCBwcmV2T2Zmc2V0ID0gdGhpcy5wcmV2T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbmV4dE9mZnNldCA9IHRoaXMubmV4dE9mZnNldCh0aGlzLnByb3BzLm9mZnNldCk7XG4gICAgbGV0IG1pbk9mZnNldCA9IDA7XG4gICAgbGV0IG1heE9mZnNldCA9IHRoaXMubWF4T2Zmc2V0KCk7XG5cbiAgICBpZiAodGhpcy50b3RhbFBhZ2VzKCkgPiAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwYWdpbmF0aW9uXCI+XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IHByZXZPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtyYW5nZSgwLCBtYXhPZmZzZXQsIGxpbWl0KS5tYXAob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXtvZmZzZXR9PlxuICAgICAgICAgICAgICAgICAgPExpbmsgdG89e2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3twYWdlOiB7b2Zmc2V0fX19XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2Rpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxMaW5rIHRvPXtlbmRwb2ludH1cbiAgICAgICAgICAgICAgICB3aXRoUGFyYW1zPXt0cnVlfVxuICAgICAgICAgICAgICAgIHdpdGhRdWVyeT17e3BhZ2U6IHtvZmZzZXQ6IG5leHRPZmZzZXR9fX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e0NsYXNzKHtkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L25hdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8bmF2Lz47XG4gICAgfVxuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQgTGluayBmcm9tIFwiLi9saW5rXCI7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVybmFsUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgb25DbGljazogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB0b3RhbDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIG9mZnNldDogUmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGxpbWl0OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIH1cblxuICB0b3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5wcm9wcy50b3RhbCAvIHRoaXMucHJvcHMubGltaXQpO1xuICB9XG5cbiAgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXMoKSAqIHRoaXMucHJvcHMubGltaXQ7XG4gIH1cblxuICBwcmV2T2Zmc2V0KG9mZnNldCkge1xuICAgIHJldHVybiBvZmZzZXQgPD0gMCA/IDAgOiBvZmZzZXQgLSB0aGlzLnByb3BzLmxpbWl0O1xuICB9XG5cbiAgbmV4dE9mZnNldChvZmZzZXQpIHtcbiAgICByZXR1cm4gb2Zmc2V0ID49IHRoaXMubWF4T2Zmc2V0KCkgPyB0aGlzLm1heE9mZnNldCgpIDogb2Zmc2V0ICsgdGhpcy5wcm9wcy5saW1pdDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgb25DbGljayA9IHRoaXMucHJvcHMub25DbGljaztcbiAgICBsZXQgbGltaXQgPSB0aGlzLnByb3BzLmxpbWl0O1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gdGhpcy5wcm9wcy5vZmZzZXQ7XG4gICAgbGV0IHByZXZPZmZzZXQgPSB0aGlzLnByZXZPZmZzZXQodGhpcy5wcm9wcy5vZmZzZXQpO1xuICAgIGxldCBuZXh0T2Zmc2V0ID0gdGhpcy5uZXh0T2Zmc2V0KHRoaXMucHJvcHMub2Zmc2V0KTtcbiAgICBsZXQgbWluT2Zmc2V0ID0gMDtcbiAgICBsZXQgbWF4T2Zmc2V0ID0gdGhpcy5tYXhPZmZzZXQoKTtcblxuICAgIGlmICh0aGlzLnRvdGFsUGFnZXMoKSA+IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxuYXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInBhZ2luYXRpb25cIj5cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKHByZXZPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtaW5PZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke3ByZXZPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JmxhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAge3JhbmdlKDAsIG1heE9mZnNldCwgbGltaXQpLm1hcChvZmZzZXQgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9e29mZnNldH0+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG9mZnNldCl9XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5PXt7XCJwYWdlW29mZnNldF1cIjogb2Zmc2V0fX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtDbGFzcyh7YnRuOiB0cnVlLCBcImJ0bi1saW5rXCI6IHRydWUsIGRpc2FibGVkOiBvZmZzZXQgPT0gY3Vyck9mZnNldH0pfVxuICAgICAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke29mZnNldH1gfT5cbiAgICAgICAgICAgICAgICAgICAge29mZnNldH1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKG5leHRPZmZzZXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Q2xhc3Moe2J0bjogdHJ1ZSwgXCJidG4tbGlua1wiOiB0cnVlLCBkaXNhYmxlZDogY3Vyck9mZnNldCA9PSBtYXhPZmZzZXR9KX1cbiAgICAgICAgICAgICAgICB0aXRsZT17YFRvIG9mZnNldCAke25leHRPZmZzZXR9YH0+XG4gICAgICAgICAgICAgICAgPHNwYW4+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmF2PlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxuYXYvPjtcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQWxlcnQgZnJvbSBcIi4vbW9kZWxzL2FsZXJ0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtBbGVydH07IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IFVVSUQgZnJvbSBcIm5vZGUtdXVpZFwiO1xuXG4vLyBNT0RFTFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChkYXRhKSB7XG4gIGlmICghZGF0YS5tZXNzYWdlKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJgZGF0YS5tZXNzYWdlYCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICBpZiAoIWRhdGEuY2F0ZWdvcnkpIHtcbiAgICB0aHJvdyBFcnJvcihcImBkYXRhLmNhdGVnb3J5YCBpcyByZXF1aXJlZFwiKTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IFVVSUQudjQoKSxcbiAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICBleHBpcmU6IGRhdGEuY2F0ZWdvcnkgPT0gXCJlcnJvclwiID8gMCA6IDUwMDAsXG4gIH0sIGRhdGEpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIFBST1hZIFJPVVRFUiBUTyBSRU1PVkUgQ0lSQ1VMQVIgREVQRU5ERU5DWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR1cm5zOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBhcHAgKHJvdXRlcilcbi8vIHRvOlxuLy8gICBhcHAgKHJvdXRlcikgPC0gcm91dGVzIDwtIGNvbXBvbmVudHMgPC0gYWN0aW9ucyA8LSBwcm94eSAocm91dGVyKVxubGV0IHByb3h5ID0ge1xuICBtYWtlUGF0aChyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCwgd2l0aFBhcmFtcz17fSwgd2l0aFF1ZXJ5PXt9KSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICByZXR1cm4gd2luZG93Ll9yb3V0ZXIubWFrZVBhdGgoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgbWFrZUhyZWYocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQsIHdpdGhQYXJhbXM9e30sIHdpdGhRdWVyeT17fSkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgcmV0dXJuIHdpbmRvdy5fcm91dGVyLm1ha2VIcmVmKFxuICAgICAgcm91dGUgfHwgY3Vyc29yLmdldChcInJvdXRlXCIpLFxuICAgICAgbWVyZ2Uoe30sIHBhcmFtcyB8fCBjdXJzb3IuZ2V0KFwicGFyYW1zXCIpLCB3aXRoUGFyYW1zKSxcbiAgICAgIG1lcmdlKHt9LCBxdWVyeSB8fCBjdXJzb3IuZ2V0KFwicXVlcnlcIiksIHdpdGhRdWVyeSlcbiAgICApO1xuICB9LFxuXG4gIHRyYW5zaXRpb25Ubyhyb3V0ZT11bmRlZmluZWQsIHBhcmFtcz11bmRlZmluZWQsIHF1ZXJ5PXVuZGVmaW5lZCwgd2l0aFBhcmFtcz17fSwgd2l0aFF1ZXJ5PXt9KSB7XG4gICAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgICB3aW5kb3cuX3JvdXRlci50cmFuc2l0aW9uVG8oXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgcmVwbGFjZVdpdGgocm91dGU9dW5kZWZpbmVkLCBwYXJhbXM9dW5kZWZpbmVkLCBxdWVyeT11bmRlZmluZWQsIHdpdGhQYXJhbXM9e30sIHdpdGhRdWVyeT17fSkge1xuICAgIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJ1cmxcIik7XG4gICAgd2luZG93Ll9yb3V0ZXIucmVwbGFjZVdpdGgoXG4gICAgICByb3V0ZSB8fCBjdXJzb3IuZ2V0KFwicm91dGVcIiksXG4gICAgICBtZXJnZSh7fSwgcGFyYW1zIHx8IGN1cnNvci5nZXQoXCJwYXJhbXNcIiksIHdpdGhQYXJhbXMpLFxuICAgICAgbWVyZ2Uoe30sIHF1ZXJ5IHx8IGN1cnNvci5nZXQoXCJxdWVyeVwiKSwgd2l0aFF1ZXJ5KVxuICAgICk7XG4gIH0sXG5cbiAgZ29CYWNrKCkge1xuICAgIHdpbmRvdy5fcm91dGVyLmdvQmFjaygpO1xuICB9LFxuXG4gIHJ1bihyZW5kZXIpIHtcbiAgICB3aW5kb3cuX3JvdXRlci5ydW4ocmVuZGVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgcHJveHk7XG5cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEJhb2JhYiBmcm9tIFwiYmFvYmFiXCI7XG5cbi8vIFNUQVRFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBjb25zdCBFWEFNUExFID0ge1xuICBGSUxURVJTOiB1bmRlZmluZWQsIC8vIHtwdWJsaXNoZWQ6IHRydWV9IHx8IHVuZGVmaW5lZFxuICBTT1JUUzogdW5kZWZpbmVkLCAgIC8vIFtcIitwdWJsaXNoZWRBdFwiLCBcIi1pZFwiXSB8fCB1bmRlZmluZWRcbiAgT0ZGU0VUOiAwLCAgICAgICAgICAvLyAwIHx8IC0xXG4gIExJTUlUOiAyMCwgICAgICAgICAgLy8gMTAgfHwgMjAgfHwgNTAgLi4uXG59O1xuXG5leHBvcnQgY29uc3QgUk9CT1QgPSB7XG4gIEZJTFRFUlM6IHt9LFxuICBTT1JUUzogW1wiK25hbWVcIl0sXG4gIE9GRlNFVDogMCxcbiAgTElNSVQ6IDUsXG59O1xuXG5leHBvcnQgY29uc3QgQUxFUlQgPSB7XG4gIEZJTFRFUlM6IHt9LFxuICBTT1JUUzogW1wiK2NyZWF0ZWRPblwiXSxcbiAgT0ZGU0VUOiAwLFxuICBMSU1JVDogNSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJhb2JhYihcbiAgeyAvLyBEQVRBXG4gICAgdXJsOiB7XG4gICAgICBoYW5kbGVyOiB1bmRlZmluZWQsXG4gICAgICBwYXJhbXM6IHVuZGVmaW5lZCxcbiAgICAgIHF1ZXJ5OiB1bmRlZmluZWQsXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgZmlsdGVyczogdW5kZWZpbmVkLFxuICAgICAgc29ydHM6IHVuZGVmaW5lZCxcbiAgICAgIG9mZnNldDogdW5kZWZpbmVkLFxuICAgICAgbGltaXQ6IHVuZGVmaW5lZCxcbiAgICB9LFxuXG4gICAgcm9ib3RzOiB7XG4gICAgICAvLyBEQVRBXG4gICAgICBtb2RlbHM6IHt9LFxuICAgICAgdG90YWw6IDAsXG4gICAgICBwYWdpbmF0aW9uOiB7fSxcblxuICAgICAgLy8gTE9BRCBBUlRFRkFDVFNcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICBsb2FkRXJyb3I6IHVuZGVmaW5lZCxcblxuICAgICAgLy8gSU5ERVhcbiAgICAgIGZpbHRlcnM6IFJPQk9ULkZJTFRFUlMsXG4gICAgICBzb3J0czogUk9CT1QuU09SVFMsXG4gICAgICBvZmZzZXQ6IFJPQk9ULk9GRlNFVCxcbiAgICAgIGxpbWl0OiBST0JPVC5MSU1JVCxcblxuICAgICAgLy8gTU9ERUxcbiAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgfSxcblxuICAgIGFsZXJ0czoge1xuICAgICAgLy8gREFUQVxuICAgICAgbW9kZWxzOiB7fSxcbiAgICAgIHRvdGFsOiAwLFxuICAgICAgcGFnaW5hdGlvbjoge30sXG5cbiAgICAgIC8vIExPQUQgQVJURUZBQ1RTXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgIC8vIElOREVYXG4gICAgICBmaWx0ZXJzOiBBTEVSVC5GSUxURVJTLFxuICAgICAgc29ydHM6IEFMRVJULlNPUlRTLFxuICAgICAgb2Zmc2V0OiBBTEVSVC5PRkZTRVQsXG4gICAgICBsaW1pdDogQUxFUlQuTElNSVQsXG5cbiAgICAgIC8vIE1PREVMXG4gICAgICBpZDogdW5kZWZpbmVkLFxuICAgIH0sXG4gIH0sXG4gIHsgLy8gT1BUSU9OU1xuICAgIGZhY2V0czoge1xuICAgICAgY3VycmVudFJvYm90OiB7XG4gICAgICAgIGN1cnNvcnM6IHtcbiAgICAgICAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIGxldCB7bW9kZWxzLCBpZH0gPSBkYXRhLnJvYm90cztcbiAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBtb2RlbHNbaWRdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3VycmVudFJvYm90czoge1xuICAgICAgICBjdXJzb3JzOiB7XG4gICAgICAgICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBsZXQge21vZGVscywgcGFnaW5hdGlvbiwgb2Zmc2V0fSA9IGRhdGEucm9ib3RzO1xuICAgICAgICAgIGxldCBpZHMgPSBwYWdpbmF0aW9uW29mZnNldF07XG4gICAgICAgICAgaWYgKGlkcykge1xuICAgICAgICAgICAgcmV0dXJuIGlkcy5tYXAoaWQgPT4gbW9kZWxzW2lkXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbik7XG5cbi8qXG5DaGFuZ2UgZmlsdGVyczpcbiAgLy9pZiBwYWdpbmF0aW9uLmxlbmd0aCA8IHRvdGFsOlxuICAvLyAgcHVyZ2UgcGFnaW5hdGlvbiFcbiAgZmV0Y2ghXG4gIHJlZGlyZWN0IHRvIG9mZnNldCA9IDAhXG5cbkNoYW5nZSBzb3J0czpcbiAgLy9pZiBwYWdpbmF0aW9uLmxlbmd0aCA8IHRvdGFsOlxuICAvLyAgcHVyZ2UgcGFnaW5hdGlvbiFcbiAgZmV0Y2ghXG4gIHJlZGlyZWN0IHRvIG9mZnNldCA9IDAhXG5cbkNoYW5nZSBvZmZzZXQ6XG4gIC8vaWYgY2FuJ3QgYmUgbG9hZGVkOlxuICAvLyAgZmV0Y2ghXG4gIC8vIHVwZGF0ZSBwYWdpbmF0aW9uXG4gIHJlZGlyZWN0IHRvIG5ldyBvZmZzZXQhXG5cbkNoYW5nZSBsaW1pdDpcbiAgcmVkaXJlY3QgdG8gb2Zmc2V0ID0gMCEgfHwgcmVidWlsZCBwYWdpbmF0aW9uIGFuZCBpZiBjYW4ndCBiZSBsb2FkZWQ6IGZldGNoXG4qLyIsImltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2FjdGlvbnMvZmV0Y2gtbW9kZWxcIjtcbmltcG9ydCBmZXRjaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZmV0Y2gtaW5kZXhcIjtcblxuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2xvYWQtbW9kZWxcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vYWN0aW9ucy9sb2FkLWluZGV4XCI7XG5cbmltcG9ydCBzZXRGaWx0ZXJzIGZyb20gXCIuL2FjdGlvbnMvc2V0LWZpbHRlcnNcIjtcbmltcG9ydCBzZXRTb3J0cyBmcm9tIFwiLi9hY3Rpb25zL3NldC1zb3J0c1wiO1xuaW1wb3J0IHNldE9mZnNldCBmcm9tIFwiLi9hY3Rpb25zL3NldC1vZmZzZXRcIjtcbmltcG9ydCBzZXRMaW1pdCBmcm9tIFwiLi9hY3Rpb25zL3NldC1saW1pdFwiO1xuaW1wb3J0IHNldElkIGZyb20gXCIuL2FjdGlvbnMvc2V0LWlkXCI7XG5cbmltcG9ydCBlc3RhYmxpc2hNb2RlbCBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1tb2RlbFwiO1xuaW1wb3J0IGVzdGFibGlzaEluZGV4IGZyb20gXCIuL2FjdGlvbnMvZXN0YWJsaXNoLWluZGV4XCI7XG5pbXBvcnQgZXN0YWJsaXNoUGFnZSBmcm9tIFwiLi9hY3Rpb25zL2VzdGFibGlzaC1wYWdlXCI7XG5cbmltcG9ydCBhZGQgZnJvbSBcIi4vYWN0aW9ucy9hZGRcIjtcbmltcG9ydCBlZGl0IGZyb20gXCIuL2FjdGlvbnMvZWRpdFwiO1xuaW1wb3J0IHJlbW92ZSBmcm9tIFwiLi9hY3Rpb25zL3JlbW92ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZldGNoTW9kZWwsIGZldGNoSW5kZXgsXG4gIGxvYWRNb2RlbCwgbG9hZEluZGV4LFxuICBzZXRGaWx0ZXJzLCBzZXRTb3J0cywgc2V0T2Zmc2V0LCBzZXRMaW1pdCxcbiAgZXN0YWJsaXNoTW9kZWwsIGVzdGFibGlzaEluZGV4LCBlc3RhYmxpc2hQYWdlLFxuICBhZGQsIGVkaXQsIHJlbW92ZVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuaW1wb3J0IFJvYm90IGZyb20gXCJmcm9udGVuZC9yb2JvdC9tb2RlbHNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkKG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgYWRkXG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcImxvYWRpbmdcIikuc2V0KHRydWUpO1xuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChuZXdNb2RlbCk7XG5cbiAgcmV0dXJuIEF4aW9zLnB1dCh1cmwsIG5ld01vZGVsKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcjogdW5kZWZpbmVkfSk7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LmFkZGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIikudW5zZXQoaWQpOyAvLyBDYW5jZWwgYWRkXG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuYWRkYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBhZGRcbiAgLi4uXG5cbiAgbGV0IHJlc3BvbnNlID0ge2RhdGE6IFtdfTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IEF4aW9zLnB1dChgL2FwaS9yb2JvdHMvJHtpZH1gLCBuZXdNb2RlbCk7XG4gIH0gY2F0Y2ggKHJlc3BvbnNlKSB7XG4gICAgLi4uXG4gIH0gLy8gZWxzZVxuICAgIC4uLlxuICAqL1xufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGNvbW1vbkFjdGlvbnMgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3QgZnJvbSBcImZyb250ZW5kL3JvYm90L21vZGVsc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlZGl0KG1vZGVsKSB7XG4gIGxldCBuZXdNb2RlbCA9IFJvYm90KG1vZGVsKTtcbiAgbGV0IGlkID0gbmV3TW9kZWwuaWQ7XG4gIGxldCBvbGRNb2RlbCA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiLCBpZCkuZ2V0KCk7XG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuXG4gIC8vIE9wdGltaXN0aWMgZWRpdFxuICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJsb2FkaW5nXCIpLnNldCh0cnVlKTtcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5zZXQobmV3TW9kZWwpO1xuXG4gIHJldHVybiBBeGlvcy5wdXQodXJsLCBuZXdNb2RlbClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIikubWVyZ2Uoe1xuICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICB9KTtcbiAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCBlZGl0XG4gICAgICAgIGNvbW1vbkFjdGlvbnMuYWxlcnQuYWRkKHttZXNzYWdlOiBcIkFjdGlvbiBgUm9ib3QuZWRpdGAgZmFpbGVkOiBcIiArIGxvYWRFcnJvci5kZXNjcmlwdGlvbiwgY2F0ZWdvcnk6IFwiZXJyb3JcIn0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzXG4gICAgICB9XG4gICAgfSlcbiAgICAuZG9uZSgpO1xuXG4gIC8qIEFzeW5jLUF3YWl0IHN0eWxlLiBXYWl0IGZvciBwcm9wZXIgSURFIHN1cHBvcnRcbiAgLy8gT3B0aW1pc3RpYyBlZGl0XG4gIC4uLlxuXG4gIGxldCByZXNwb25zZSA9IHtkYXRhOiBbXX07XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBhd2FpdCBBeGlvcy5wdXQoYC9hcGkvcm9ib3RzLyR7aWR9YCwgbmV3TW9kZWwpO1xuICB9IGNhdGNoIChyZXNwb25zZSkge1xuICAgIC4uLlxuICB9IC8vIGVsc2VcbiAgICAuLi5cbiAgKi9cbn1cbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5pbXBvcnQgbG9hZEluZGV4IGZyb20gXCIuL2xvYWQtaW5kZXhcIjtcbmltcG9ydCBzZXRGaWx0ZXJzIGZyb20gXCIuL3NldC1maWx0ZXJzXCI7XG5pbXBvcnQgc2V0U29ydHMgZnJvbSBcIi4vc2V0LXNvcnRzXCI7XG5pbXBvcnQgc2V0T2Zmc2V0IGZyb20gXCIuL3NldC1vZmZzZXRcIjtcbmltcG9ydCBzZXRMaW1pdCBmcm9tIFwiLi9zZXQtbGltaXRcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXN0YWJsaXNoSW5kZXgoKSB7XG4gIGNvbnNvbGUuZGVidWcoXCJlc3RhYmxpc2hJbmRleFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwidXJsXCIpO1xuXG4gIHNldEZpbHRlcnMoY3Vyc29yLmdldChcImZpbHRlcnNcIikgfHwgdW5kZWZpbmVkKTsgLy8gZmFsc2UgLT4gdW5kZWZpbmVkXG4gIHNldFNvcnRzKGN1cnNvci5nZXQoXCJzb3J0c1wiKSB8fCB1bmRlZmluZWQpOyAgICAgLy8gZmFsc2UgLT4gdW5kZWZpbmVkXG4gIHNldE9mZnNldChjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgc2V0TGltaXQoY3Vyc29yLmdldChcImxpbWl0XCIpKTtcblxuICBsb2FkSW5kZXgoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuaW1wb3J0IGxvYWRNb2RlbCBmcm9tIFwiLi9sb2FkLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVzdGFibGlzaE1vZGVsKCkge1xuICBjb25zb2xlLmRlYnVnKFwiZXN0YWJsaXNoTW9kZWxcIik7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgbGV0IHVybElkID0gdXJsQ3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGlmICh1cmxJZCkge1xuICAgIHJvYm90c0N1cnNvci5zZXQoXCJpZFwiLCB1cmxJZCk7XG4gIH1cbiAgc3RhdGUuY29tbWl0KCk7XG5cbiAgbG9hZE1vZGVsKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBsb2FkSW5kZXggZnJvbSBcIi4vbG9hZC1pbmRleFwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc3RhYmxpc2hQYWdlKHBhcmFtcywgcXVlcnkpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImVzdGFibGlzaFBhZ2U6XCIsIHBhcmFtcywgcXVlcnkpO1xuXG4gIC8vbGV0IHJvYm90c0N1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcblxuICAvLyBDSEFOR0UgU1RBVEVcbiAgLy8gPz8/XG4gIC8vc3RhdGUuY29tbWl0KCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0LCBmb3JtYXRKc29uQXBpUXVlcnl9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hJbmRleChmaWx0ZXJzLCBzb3J0cywgb2Zmc2V0LCBsaW1pdCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hJbmRleFwiKTtcblxuICBsZXQgdXJsID0gYC9hcGkvcm9ib3RzL2A7XG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBxdWVyeSA9IGZvcm1hdEpzb25BcGlRdWVyeSh7ZmlsdGVycywgc29ydHMsIG9mZnNldCwgbGltaXR9KTtcblxuICBjdXJzb3Iuc2V0KFwibG9hZGluZ1wiLCB0cnVlKTtcbiAgcmV0dXJuIEF4aW9zLmdldCh1cmwsIHtwYXJhbXM6IHF1ZXJ5fSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAvLyBDdXJyZW50IHN0YXRlXG4gICAgICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gY3Vyc29yLmdldChcInBhZ2luYXRpb25cIik7XG5cbiAgICAgIC8vIE5ldyBkYXRhXG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBmZXRjaGVkTW9kZWxzID0gdG9PYmplY3QoZGF0YSk7XG5cbiAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgY3Vyc29yLm1lcmdlKHtcbiAgICAgICAgdG90YWw6IG1ldGEucGFnZSAmJiBtZXRhLnBhZ2UudG90YWwgfHwgT2JqZWN0LmtleXMobW9kZWxzKS5sZW5ndGgsXG4gICAgICAgIG1vZGVsczogT2JqZWN0LmFzc2lnbihtb2RlbHMsIGZldGNoZWRNb2RlbHMpLFxuICAgICAgICBwYWdpbmF0aW9uOiBPYmplY3QuYXNzaWduKHBhZ2luYXRpb24sIHtbb2Zmc2V0XTogT2JqZWN0LmtleXMoZmV0Y2hlZE1vZGVscyl9KSxcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaFBhZ2VgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcblxuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmRvbmUoKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cbmltcG9ydCB7dG9PYmplY3R9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgY29tbW9uQWN0aW9ucyBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2FjdGlvbnNcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmV0Y2hNb2RlbChpZCkge1xuICBjb25zb2xlLmRlYnVnKFwiZmV0Y2hNb2RlbDpcIiwgaWQpO1xuXG4gIGxldCB1cmwgPSBgL2FwaS9yb2JvdHMvJHtpZH1gO1xuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuXG4gIGN1cnNvci5zZXQoXCJsb2FkaW5nXCIsIHRydWUpO1xuICByZXR1cm4gQXhpb3MuZ2V0KHVybClcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBsZXQge2RhdGEsIG1ldGF9ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGxldCBtb2RlbCA9IGRhdGE7XG5cbiAgICAgIC8vIEJVRywgTk9UIFdPUktJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgIC8vIFRSQUNLOiBodHRwczovL2dpdGh1Yi5jb20vWW9tZ3VpdGhlcmVhbC9iYW9iYWIvaXNzdWVzLzE5MFxuICAgICAgLy8gICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9Zb21ndWl0aGVyZWFsL2Jhb2JhYi9pc3N1ZXMvMTk0XG4gICAgICAvL2N1cnNvci5tZXJnZSh7XG4gICAgICAvLyAgbG9hZGluZzogZmFsc2UsXG4gICAgICAvLyAgbG9hZEVycm9yOiB1bmRlZmluZWQsXG4gICAgICAvL30pO1xuICAgICAgLy9jdXJzb3Iuc2VsZWN0KFwibW9kZWxzXCIpLnNldChtb2RlbC5pZCwgbW9kZWwpO1xuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgLy8gV09SS0FST1VORDpcbiAgICAgIGN1cnNvci5hcHBseShyb2JvdHMgPT4ge1xuICAgICAgICBsZXQgbW9kZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgcm9ib3RzLm1vZGVscyk7XG4gICAgICAgIG1vZGVsc1ttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJvYm90cywge1xuICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgIGxvYWRFcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgIG1vZGVsczogbW9kZWxzLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc3RhdGUuY29tbWl0KCk7XG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIGN1cnNvci5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5jb21taXQoKTsgLy8gR29kLCB0aGlzIGlzIHJlcXVpcmVkIGp1c3QgYWJvdXQgZXZlcnl3aGVyZSEgOihcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdDpmZXRjaE1vZGVsYCBmYWlsZWQ6IFwiICsgbG9hZEVycm9yLmRlc2NyaXB0aW9uLCBjYXRlZ29yeTogXCJlcnJvclwifSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5pbXBvcnQge3RvT2JqZWN0fSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IGZldGNoSW5kZXggZnJvbSBcIi4vZmV0Y2gtaW5kZXhcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZEluZGV4KCkge1xuICBjb25zb2xlLmRlYnVnKFwibG9hZEluZGV4XCIpO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGxldCBmaWx0ZXJzID0gY3Vyc29yLmdldChcImZpbHRlcnNcIik7XG4gIGxldCBzb3J0cyA9IGN1cnNvci5nZXQoXCJzb3J0c1wiKTtcbiAgbGV0IG9mZnNldCA9IGN1cnNvci5nZXQoXCJvZmZzZXRcIik7XG4gIGxldCBsaW1pdCA9IGN1cnNvci5nZXQoXCJsaW1pdFwiKTtcbiAgbGV0IHBhZ2luYXRpb24gPSBjdXJzb3IuZ2V0KFwicGFnaW5hdGlvblwiKTtcblxuICBsZXQgaWRzID0gcGFnaW5hdGlvbltvZmZzZXRdO1xuICBpZiAoIWlkcyB8fCBpZHMubGVuZ3RoIDwgbGltaXQpIHtcbiAgICBmZXRjaEluZGV4KGZpbHRlcnMsIHNvcnRzLCBvZmZzZXQsIGxpbWl0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc01heE9mZnNldChwYWdpbmF0aW9uLCBvZmZzZXQpIHtcbiAgcmV0dXJuIG9mZnNldCA9PSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5tYXAodiA9PiBwYXJzZUludCh2KSkpO1xufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBmZXRjaE1vZGVsIGZyb20gXCIuL2ZldGNoLW1vZGVsXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRNb2RlbCgpIHtcbiAgY29uc29sZS5kZWJ1ZyhcImxvYWRNb2RlbFwiKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBsZXQgbW9kZWxzID0gY3Vyc29yLmdldChcIm1vZGVsc1wiKTtcbiAgbGV0IGlkID0gY3Vyc29yLmdldChcImlkXCIpO1xuXG4gIGxldCBtb2RlbCA9IG1vZGVsc1tpZF07XG4gIGlmICghbW9kZWwpIHtcbiAgICBmZXRjaE1vZGVsKGlkKTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBeGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCByb3V0ZXIgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9yb3V0ZXJcIjtcbmltcG9ydCBjb21tb25BY3Rpb25zIGZyb20gXCJmcm9udGVuZC9jb21tb24vYWN0aW9uc1wiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoaWQpIHtcbiAgbGV0IG9sZE1vZGVsID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibW9kZWxzXCIsIGlkKS5nZXQoKTtcbiAgbGV0IHVybCA9IGAvYXBpL3JvYm90cy8ke2lkfWA7XG5cbiAgLy8gT3B0aW1pc3RpYyByZW1vdmVcbiAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIsIFwibG9hZGluZ1wiKS5zZXQodHJ1ZSk7XG4gIHN0YXRlLnNlbGVjdChcInJvYm90c1wiLCBcIm1vZGVsc1wiKS51bnNldChpZCk7XG5cbiAgcmV0dXJuIEF4aW9zLmRlbGV0ZSh1cmwpXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpLm1lcmdlKHtcbiAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxvYWRFcnJvcjogbG9hZEVycm9yLFxuICAgICAgfSk7XG4gICAgICByb3V0ZXIudHJhbnNpdGlvblRvKFwicm9ib3QtaW5kZXhcIik7XG4gICAgICBjb21tb25BY3Rpb25zLmFsZXJ0LmFkZCh7bWVzc2FnZTogXCJBY3Rpb24gYFJvYm90LnJlbW92ZWAgc3VjY2VlZFwiLCBjYXRlZ29yeTogXCJzdWNjZXNzXCJ9KTtcbiAgICAgIHJldHVybiByZXNwb25zZS5zdGF0dXM7XG4gICAgfSlcbiAgICAuY2F0Y2gocmVzcG9uc2UgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbG9hZEVycm9yID0ge1xuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH07XG4gICAgICAgIHN0YXRlLnNlbGVjdChcInJvYm90c1wiKS5tZXJnZSh7bG9hZGluZzogZmFsc2UsIGxvYWRFcnJvcn0pO1xuICAgICAgICBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIiwgXCJtb2RlbHNcIiwgaWQpLnNldChvbGRNb2RlbCk7IC8vIENhbmNlbCByZW1vdmVcbiAgICAgICAgY29tbW9uQWN0aW9ucy5hbGVydC5hZGQoe21lc3NhZ2U6IFwiQWN0aW9uIGBSb2JvdC5yZW1vdmVgIGZhaWxlZDogXCIgKyBsb2FkRXJyb3IuZGVzY3JpcHRpb24sIGNhdGVnb3J5OiBcImVycm9yXCJ9KTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnN0YXR1cztcbiAgICAgIH1cbiAgICB9KVxuICAgIC5kb25lKCk7XG5cbiAgLyogQXN5bmMtQXdhaXQgc3R5bGUuIFdhaXQgZm9yIHByb3BlciBJREUgc3VwcG9ydFxuICAvLyBPcHRpbWlzdGljIHJlbW92ZVxuICAuLi5cblxuICBsZXQgcmVzcG9uc2UgPSB7ZGF0YTogW119O1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgQXhpb3MucHV0KGAvYXBpL3JvYm90cy8ke2lkfWAsIG5ld01vZGVsKTtcbiAgfSBjYXRjaCAocmVzcG9uc2UpIHtcbiAgICAuLi5cbiAgfSAvLyBlbHNlXG4gICAgLi4uXG4gICovXG59XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgaXNFcXVhbCBmcm9tIFwibG9kYXNoLmlzZXF1YWxcIjtcbmltcG9ydCBmaWx0ZXIgZnJvbSBcImxvZGFzaC5maWx0ZXJcIjtcblxuaW1wb3J0IHtjaHVua2VkLCBmbGF0dGVuQXJyYXlHcm91cCwgZmlyc3RMZXNzZXJPZmZzZXR9IGZyb20gXCJzaGFyZWQvY29tbW9uL2hlbHBlcnNcIjtcbmltcG9ydCBzdGF0ZSwge1JPQk9UfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgcm91dGVyIGZyb20gXCJmcm9udGVuZC9jb21tb24vcm91dGVyXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldEZpbHRlcnMoZmlsdGVycz1ST0JPVC5GSUxURVJTKSB7XG4gIGNvbnNvbGUuZGVidWcoYHNldEZpbHRlcnMoJHtKU09OLnN0cmluZ2lmeShmaWx0ZXJzKX0pYCk7XG5cbiAgbGV0IHVybEN1cnNvciA9IHN0YXRlLnNlbGVjdChcInVybFwiKTtcbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKCFpc0VxdWFsKGZpbHRlcnMsIGN1cnNvci5nZXQoXCJmaWx0ZXJzXCIpKSkge1xuICAgIGN1cnNvci5zZXQoXCJmaWx0ZXJzXCIsIGZpbHRlcnMpO1xuICAgIGxldCBwYWdpbmF0aW9uTGVuZ3RoID0gZmxhdHRlbkFycmF5R3JvdXAoY3Vyc29yLmdldChcInBhZ2luYXRpb25cIikpLmxlbmd0aDtcbiAgICBpZiAocGFnaW5hdGlvbkxlbmd0aCAmJiBwYWdpbmF0aW9uTGVuZ3RoID49IGN1cnNvci5nZXQoXCJ0b3RhbFwiKSkge1xuICAgICAgLy8gRnVsbCBpbmRleCBsb2FkZWQg4oCTIGNhbiByZWNhbGN1bGF0ZSBwYWdpbmF0aW9uXG4gICAgICBjb25zb2xlLmRlYnVnKFwiRnVsbCBpbmRleCBsb2FkZWQsIHJlY2FsY3VsYXRpbmcgcGFnaW5hdGlvbi4uLlwiKTtcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aEZpbHRlcnMoXG4gICAgICAgIGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpLCBmaWx0ZXJzLCBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpLCBjdXJzb3IuZ2V0KFwibGltaXRcIilcbiAgICAgICk7XG4gICAgICBpZiAoIXBhZ2luYXRpb25bY3Vyc29yLmdldChcIm9mZnNldFwiKV0pIHtcbiAgICAgICAgLy8gTnVtYmVyIG9mIHBhZ2VzIHJlZHVjZWQgLSByZWRpcmVjdCB0byBjbG9zZXN0XG4gICAgICAgIGxldCBvZmZzZXQgPSBmaXJzdExlc3Nlck9mZnNldChwYWdpbmF0aW9uLCBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKTtcbiAgICAgICAgcm91dGVyLnRyYW5zaXRpb25UbyhcbiAgICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHJvdXRlXG4gICAgICAgICAgdW5kZWZpbmVkLCAgICAgICAvLyBwYXJhbXNcbiAgICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHF1ZXJ5XG4gICAgICAgICAge30sICAgICAgICAgICAgICAvLyB3aXRoUGFyYW1zXG4gICAgICAgICAge3BhZ2U6IHtvZmZzZXR9fSAvLyB3aXRoUXVlcnlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGN1cnNvci5zZXQoXCJwYWdpbmF0aW9uXCIsIHBhZ2luYXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQYXJ0IG9mIGluZGV4IGxvYWRlZCDigJMgY2FuIG9ubHkgcmVzZXRcbiAgICAgIGNvbnNvbGUuZGVidWcoXCJQYXJ0aWFsIGxvYWQsIHJlc2V0dGluZyBwYWdpbmF0aW9uLi4uXCIpO1xuICAgICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwge30pO1xuICAgIH1cbiAgICBzdGF0ZS5jb21taXQoKTtcbiAgfVxufVxuXG4vLyBIRUxQRVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKipcbiAqIFJlY2FsY3VsYXRlcyBgcGFnaW5hdGlvbmAgd2l0aCBuZXcgYGZpbHRlcnNgXG4gKiBNYXkgYmUgYXBwbGllZCBvbmx5IHdoZW4gYG1vZGVscy5sZW5ndGggPT0gdG90YWxgLCBzbyBgbW9kZWxzYFxuICogcmVwcmVzZW50IGZ1bGwgc2V0IG9mIGlkcyBhbmQgYHBhZ2luYXRpb25gIGNhbiB0aGVuIGJlIHJlY3JlYXRlZCBmcm9tIHNjcmF0aC5cbiAqIEBwdXJlXG4gKiBAcGFyYW0gcGFnaW5hdGlvbiB7T2JqZWN0PHN0cmluZywgQXJyYXk+fSAtIGlucHV0IHBhZ2luYXRpb25cbiAqIEBwYXJhbSBmaWx0ZXJzIHtudW1iZXJ9IC0gbmV3IGZpbHRlcnNcbiAqIEBwYXJhbSBtb2RlbHMge09iamVjdDxzdHJpbmcsIE9iamVjdD59IC0gb2JqIG9mIG1vZGVsc1xuICogQHBhcmFtIGxpbWl0IHtudW1iZXJ9IC0gY3VycmVudCBsaW1pdFxuICogQHJldHVybnMge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSByZWNhbGN1bGF0ZWQgcGFnaW5hdGlvblxuICovXG5mdW5jdGlvbiByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoRmlsdGVycyhwYWdpbmF0aW9uLCBmaWx0ZXJzLCBtb2RlbHMsIGxpbWl0KSB7XG4gIGlmICghcGFnaW5hdGlvbiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcGFnaW5hdGlvbiBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHtwYWdpbmF0aW9ufWApO1xuICB9XG4gIGlmICghZmlsdGVycyBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgZmlsdGVycyBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHtmaWx0ZXJzfWApO1xuICB9XG4gIGlmICghbW9kZWxzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBtb2RlbHMgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7bW9kZWxzfWApO1xuICB9XG4gIGlmICh0eXBlb2YgbGltaXQgIT0gXCJudW1iZXJcIiB8fCBsaW1pdCA8PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBsaW1pdCBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyLCBnb3QgJHtsaW1pdH1gKTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMocGFnaW5hdGlvbikubGVuZ3RoKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKGZpbHRlcnMpLmxlbmd0aCkge1xuICAgICAgbGV0IHVuZmlsdGVyZWRNb2RlbHMgPSBPYmplY3QudmFsdWVzKG1vZGVscyk7XG4gICAgICBsZXQgZmlsdGVyZWRNb2RlbHMgPSBmaWx0ZXIodW5maWx0ZXJlZE1vZGVscywgZmlsdGVycyk7XG4gICAgICByZXR1cm4gY2h1bmtlZChmaWx0ZXJlZE1vZGVscy5tYXAobSA9PiBtLmlkKSwgbGltaXQpLnJlZHVjZSgob2JqLCBpZHMsIGkpID0+IHtcbiAgICAgICAgb2JqW2kgKiBsaW1pdF0gPSBpZHM7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LCB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYWdpbmF0aW9uO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcblxuLy8gQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0T2Zmc2V0KGlkKSB7XG4gIGNvbnNvbGUuZGVidWcoYHNldElkKCR7aWR9KWApO1xuXG4gIGxldCBjdXJzb3IgPSBzdGF0ZS5zZWxlY3QoXCJyb2JvdHNcIik7XG4gIGlmIChpZCAhPSBjdXJzb3IuZ2V0KFwiaWRcIikpIHtcbiAgICBjdXJzb3Iuc2V0KFwiaWRcIiwgaWQpO1xuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGZpbHRlciBmcm9tIFwibG9kYXNoLmZpbHRlclwiO1xuaW1wb3J0IHNvcnRCeSBmcm9tIFwibG9kYXNoLnNvcnRieVwiO1xuXG5pbXBvcnQge2NodW5rZWQsIGZpcnN0TGVzc2VyT2Zmc2V0fSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuaW1wb3J0IHJvdXRlciBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3JvdXRlclwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRMaW1pdChsaW1pdD1ST0JPVC5MSU1JVCkge1xuICBjb25zb2xlLmRlYnVnKGBzZXRMaW1pdCgke2xpbWl0fSlgKTtcblxuICBsZXQgY3Vyc29yID0gc3RhdGUuc2VsZWN0KFwicm9ib3RzXCIpO1xuICBpZiAobGltaXQgIT0gY3Vyc29yLmdldChcImxpbWl0XCIpKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhcIlJlY2FsY3VsYXRpbmcgcGFnaW5hdGlvbi4uLlwiKTtcbiAgICBjdXJzb3Iuc2V0KFwibGltaXRcIiwgbGltaXQpO1xuICAgIGxldCBwYWdpbmF0aW9uID0gcmVjYWxjdWxhdGVQYWdpbmF0aW9uV2l0aExpbWl0KFxuICAgICAgY3Vyc29yLmdldChcInBhZ2luYXRpb25cIiksIGxpbWl0XG4gICAgKTtcbiAgICBpZiAoIXBhZ2luYXRpb25bY3Vyc29yLmdldChcIm9mZnNldFwiKV0pIHtcbiAgICAgIC8vIE51bWJlciBvZiBwYWdlcyByZWR1Y2VkIC0gcmVkaXJlY3QgdG8gY2xvc2VzdFxuICAgICAgbGV0IG9mZnNldCA9IGZpcnN0TGVzc2VyT2Zmc2V0KHBhZ2luYXRpb24sIGN1cnNvci5nZXQoXCJvZmZzZXRcIikpO1xuICAgICAgcm91dGVyLnRyYW5zaXRpb25UbyhcbiAgICAgICAgdW5kZWZpbmVkLCAgICAgICAvLyByb3V0ZVxuICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHBhcmFtc1xuICAgICAgICB1bmRlZmluZWQsICAgICAgIC8vIHF1ZXJ5XG4gICAgICAgIHt9LCAgICAgICAgICAgICAgLy8gd2l0aFBhcmFtc1xuICAgICAgICB7cGFnZToge29mZnNldH19IC8vIHdpdGhRdWVyeVxuICAgICAgKTtcbiAgICB9XG4gICAgY3Vyc29yLnNldChcInBhZ2luYXRpb25cIiwgcGFnaW5hdGlvbik7XG4gICAgc3RhdGUuY29tbWl0KCk7XG4gIH1cbn1cblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgYHBhZ2luYXRpb25gIHdpdGggbmV3IGxpbWl0IChwZXJwYWdlKVxuICogTWF5IGJlIGFwcGxpZWQgd2hlbiBgbW9kZWxzLmxlbmd0aCAhPSB0b3RhbGAsIHNvXG4gKiBgcGFnaW5hdGlvbmAgY2FuJ3QgYmUgcmVjcmVhdGVkIGZyb20gc2NyYXRoLlxuICogKiBTdXBwb3J0cyBpbnZhbGlkIGRhdGEgbGlrZSBvdmVybGFwcGluZyBvZmZzZXRzXG4gKiBAcHVyZVxuICogQHBhcmFtIHBhZ2luYXRpb24ge09iamVjdH0gLSBpbnB1dCBwYWdpbmF0aW9uXG4gKiBAcGFyYW0gbGltaXQge051bWJlcn0gLSBuZXcgbGltaXQgKHBlcnBhZ2UpXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAtIHJlY2FsY3VsYXRlZCBwYWdpbmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlY2FsY3VsYXRlUGFnaW5hdGlvbldpdGhMaW1pdChwYWdpbmF0aW9uLCBsaW1pdCkge1xuICBpZiAoIXBhZ2luYXRpb24gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHBhZ2luYXRpb24gbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7cGFnaW5hdGlvbn1gKTtcbiAgfVxuICBpZiAodHlwZW9mIGxpbWl0ICE9IFwibnVtYmVyXCIgfHwgbGltaXQgPD0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbGltaXQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlciwgZ290ICR7bGltaXR9YCk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCkge1xuICAgIGxldCBtYXhPZmZzZXQgPSBNYXRoLm1heC5hcHBseShNYXRoLCBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKSk7XG4gICAgbGV0IGxlbmd0aCA9IG1heE9mZnNldCArIHBhZ2luYXRpb25bbWF4T2Zmc2V0XS5sZW5ndGg7XG4gICAgbGV0IG9mZnNldHMgPSBzb3J0QnkoT2JqZWN0LmtleXMocGFnaW5hdGlvbikubWFwKHYgPT4gcGFyc2VJbnQodikpKTtcbiAgICBsZXQgaWRzID0gb2Zmc2V0c1xuICAgICAgLnJlZHVjZSgobWVtbywgb2Zmc2V0KSA9PiB7XG4gICAgICAgIHBhZ2luYXRpb25bb2Zmc2V0XS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgICAgIG1lbW9bb2Zmc2V0ICsgaV0gPSBpZDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgICAgfSwgQXJyYXkobGVuZ3RoKSk7XG4gICAgLy8gPT4gWywsLCwsMSwyLDMsNCw1LCwsLCxdXG4gICAgcmV0dXJuIGNodW5rZWQoaWRzLCBsaW1pdCkucmVkdWNlKChvYmosIG9mZnNldElkcywgaSkgPT4ge1xuICAgICAgb2Zmc2V0SWRzID0gZmlsdGVyKG9mZnNldElkcyk7XG4gICAgICBpZiAoaWRzLmxlbmd0aCkge1xuICAgICAgICBvYmpbaSAqIGxpbWl0XSA9IG9mZnNldElkcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30pOyAvLyA9PiB7NTogWzEsIDIsIDMsIDQsIDVdfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBzdGF0ZSwge1JPQk9UfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5cbi8vIEFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldE9mZnNldChvZmZzZXQ9Uk9CT1QuT0ZGU0VUKSB7XG4gIGNvbnNvbGUuZGVidWcoYHNldE9mZnNldCgke29mZnNldH0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKG9mZnNldCAhPSBjdXJzb3IuZ2V0KFwib2Zmc2V0XCIpKSB7XG4gICAgY3Vyc29yLnNldChcIm9mZnNldFwiLCBvZmZzZXQpO1xuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IGlzRXF1YWwgZnJvbSBcImxvZGFzaC5pc2VxdWFsXCI7XG5pbXBvcnQgc29ydEJ5T3JkZXIgZnJvbSBcImxvZGFzaC5zb3J0YnlvcmRlclwiO1xuaW1wb3J0IHtjaHVua2VkLCBsb2Rhc2hpZnlTb3J0cywgZmxhdHRlbkFycmF5R3JvdXAsIGZpcnN0TGVzc2VyT2Zmc2V0fSBmcm9tIFwic2hhcmVkL2NvbW1vbi9oZWxwZXJzXCI7XG5pbXBvcnQgc3RhdGUsIHtST0JPVH0gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9zdGF0ZVwiO1xuXG4vLyBBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXRTb3J0cyhzb3J0cz1ST0JPVC5TT1JUUykge1xuICBjb25zb2xlLmRlYnVnKGBzZXRTb3J0cygke0pTT04uc3RyaW5naWZ5KHNvcnRzKX0pYCk7XG5cbiAgbGV0IGN1cnNvciA9IHN0YXRlLnNlbGVjdChcInJvYm90c1wiKTtcbiAgaWYgKCFpc0VxdWFsKHNvcnRzLCBjdXJzb3IuZ2V0KFwic29ydHNcIikpKSB7XG4gICAgY3Vyc29yLnNldChcInNvcnRzXCIsIHNvcnRzKTtcbiAgICBsZXQgcGFnaW5hdGlvbkxlbmd0aCA9IGZsYXR0ZW5BcnJheUdyb3VwKGN1cnNvci5nZXQoXCJwYWdpbmF0aW9uXCIpKS5sZW5ndGg7XG4gICAgaWYgKHBhZ2luYXRpb25MZW5ndGggJiYgcGFnaW5hdGlvbkxlbmd0aCA+PSBjdXJzb3IuZ2V0KFwidG90YWxcIikpIHtcbiAgICAgIC8vIEZ1bGwgaW5kZXggbG9hZGVkIOKAkyBjYW4gcmVjYWxjdWxhdGUgcGFnaW5hdGlvblxuICAgICAgY29uc29sZS5kZWJ1ZyhcIkZ1bGwgaW5kZXggbG9hZGVkLCByZWNhbGN1bGF0aW5nIHBhZ2luYXRpb24uLi5cIik7XG4gICAgICBsZXQgcGFnaW5hdGlvbiA9IHJlY2FsY3VsYXRlUGFnaW5hdGlvbldpdGhTb3J0cyhcbiAgICAgICAgY3Vyc29yLmdldChcInBhZ2luYXRpb25cIiksIHNvcnRzLCBjdXJzb3IuZ2V0KFwibW9kZWxzXCIpLCBjdXJzb3IuZ2V0KFwibGltaXRcIilcbiAgICAgICk7XG4gICAgICBjdXJzb3Iuc2V0KFwicGFnaW5hdGlvblwiLCBwYWdpbmF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGFydCBvZiBpbmRleCBsb2FkZWQg4oCTIGNhbiBvbmx5IHJlc2V0XG4gICAgICBjdXJzb3Iuc2V0KFwicGFnaW5hdGlvblwiLCB7fSk7XG4gICAgfVxuICAgIHN0YXRlLmNvbW1pdCgpO1xuICB9XG59XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogUmVjYWxjdWxhdGVzIGBwYWdpbmF0aW9uYCB3aXRoIG5ldyBgc29ydHNgXG4gKiBNYXkgYmUgYXBwbGllZCBvbmx5IHdoZW4gYG1vZGVscy5sZW5ndGggPT0gdG90YWxgLCBzbyBgbW9kZWxzYFxuICogcmVwcmVzZW50IGZ1bGwgc2V0IG9mIGlkcyBhbmQgYHBhZ2luYXRpb25gIGNhbiB0aGVuIGJlIHJlY3JlYXRlZCBmcm9tIHNjcmF0aC5cbiAqIEBwdXJlXG4gKiBAcGFyYW0gcGFnaW5hdGlvbiB7T2JqZWN0PHN0cmluZywgQXJyYXk+fSAtIGlucHV0IHBhZ2luYXRpb25cbiAqIEBwYXJhbSBzb3J0cyB7QXJyYXk8c3RyaW5nPn0gLSBuZXcgc29ydHNcbiAqIEBwYXJhbSBtb2RlbHMge09iamVjdDxzdHJpbmcsIE9iamVjdD59IC0gb2JqIG9mIG1vZGVsc1xuICogQHBhcmFtIGxpbWl0IHtudW1iZXJ9IC0gY3VycmVudCBsaW1pdFxuICogQHJldHVybnMge09iamVjdDxzdHJpbmcsIEFycmF5Pn0gLSByZWNhbGN1bGF0ZWQgcGFnaW5hdGlvblxuICovXG5mdW5jdGlvbiByZWNhbGN1bGF0ZVBhZ2luYXRpb25XaXRoU29ydHMocGFnaW5hdGlvbiwgc29ydHMsIG1vZGVscywgbGltaXQpIHtcbiAgaWYgKCFwYWdpbmF0aW9uIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBwYWdpbmF0aW9uIG11c3QgYmUgYSBiYXNpYyBPYmplY3QsIGdvdCAke3BhZ2luYXRpb259YCk7XG4gIH1cbiAgaWYgKCFzb3J0cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBzb3J0cyBtdXN0IGJlIGEgYmFzaWMgQXJyYXksIGdvdCAke3NvcnRzfWApO1xuICB9XG4gIGlmICghbW9kZWxzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBtb2RlbHMgbXVzdCBiZSBhIGJhc2ljIE9iamVjdCwgZ290ICR7bW9kZWxzfWApO1xuICB9XG4gIGlmICh0eXBlb2YgbGltaXQgIT0gXCJudW1iZXJcIiB8fCBsaW1pdCA8PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBsaW1pdCBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyLCBnb3QgJHtsaW1pdH1gKTtcbiAgfVxuICBpZiAoT2JqZWN0LmtleXMocGFnaW5hdGlvbikubGVuZ3RoKSB7XG4gICAgaWYgKHNvcnRzLmxlbmd0aCkge1xuICAgICAgbGV0IHVuc29ydGVkTW9kZWxzID0gT2JqZWN0LnZhbHVlcyhtb2RlbHMpO1xuICAgICAgbGV0IHNvcnRlZE1vZGVscyA9IHNvcnRCeU9yZGVyKHVuc29ydGVkTW9kZWxzLCAuLi5sb2Rhc2hpZnlTb3J0cyhzb3J0cykpO1xuICAgICAgcmV0dXJuIGNodW5rZWQoc29ydGVkTW9kZWxzLm1hcChtID0+IG0uaWQpLCBsaW1pdCkucmVkdWNlKChvYmosIGlkcywgaSkgPT4ge1xuICAgICAgICBvYmpbaSAqIGxpbWl0XSA9IGlkcztcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhZ2luYXRpb247XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJlc3VsdCBmcm9tIFwibG9kYXNoLnJlc3VsdFwiO1xuaW1wb3J0IG1lcmdlIGZyb20gXCJsb2Rhc2gubWVyZ2VcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwibG9kYXNoLmRlYm91bmNlXCI7XG5pbXBvcnQgZmxhdHRlbiBmcm9tIFwibG9kYXNoLmZsYXR0ZW5cIjtcbmltcG9ydCBDbGFzcyBmcm9tIFwiY2xhc3NuYW1lc1wiO1xuLy9pbXBvcnQgSm9pIGZyb20gXCJqb2lcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBEb2N1bWVudFRpdGxlIGZyb20gXCJyZWFjdC1kb2N1bWVudC10aXRsZVwiO1xuXG4vL2ltcG9ydCBWYWxpZGF0b3JzIGZyb20gXCJzaGFyZWQvcm9ib3QvdmFsaWRhdG9yc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kLCBMaW5rfSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL2NvbXBvbmVudHNcIjtcbmltcG9ydCByb2JvdEFjdGlvbnMgZnJvbSBcImZyb250ZW5kL3JvYm90L2FjdGlvbnNcIjtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gZmxhdHRlbkFuZFJlc2V0VG8ob2JqLCB0bywgcGF0aCkge1xuICBwYXRoID0gcGF0aCB8fCBcIlwiO1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGtleSkge1xuICAgIGlmIChvYmpba2V5XSBpbnN0YW5jZW9mIEFycmF5IHx8ICFvYmpba2V5XSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgbWVtb1twYXRoICsga2V5XSA9IHRvO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKG1lbW8sIGZsYXR0ZW5BbmRSZXNldFRvKG9ialtrZXldLCB0bywgcGF0aCArIGtleSsgXCIuXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIHt9KTtcbn1cblxuLy9mdW5jdGlvbiB2YWxpZGF0ZShqb2lTY2hlbWEsIGRhdGEsIGtleSkge1xuLy8gIGpvaVNjaGVtYSA9IGpvaVNjaGVtYSB8fCB7fTtcbi8vICBkYXRhID0gZGF0YSB8fCB7fTtcbi8vICBsZXQgam9pT3B0aW9ucyA9IHtcbi8vICAgIGFib3J0RWFybHk6IGZhbHNlLFxuLy8gICAgYWxsb3dVbmtub3duOiB0cnVlLFxuLy8gIH07XG4vLyAgbGV0IGVycm9ycyA9IGZvcm1hdEVycm9ycyhKb2kudmFsaWRhdGUoZGF0YSwgam9pU2NoZW1hLCBqb2lPcHRpb25zKSk7XG4vLyAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbi8vICAgICAgZmxhdHRlbkFuZFJlc2V0VG8oam9pU2NoZW1hLCBbXSksXG4vLyAgICAgIGVycm9yc1xuLy8gICAgKTtcbi8vICB9IGVsc2Uge1xuLy8gICAgbGV0IHJlc3VsdCA9IHt9O1xuLy8gICAgcmVzdWx0W2tleV0gPSBlcnJvcnNba2V5XSB8fCBbXTtcbi8vICAgIHJldHVybiByZXN1bHQ7XG4vLyAgfVxuLy99XG5cbi8vZnVuY3Rpb24gZm9ybWF0RXJyb3JzKGpvaVJlc3VsdCkge1xuLy8gIGlmIChqb2lSZXN1bHQuZXJyb3IgIT09IG51bGwpIHtcbi8vICAgIHJldHVybiBqb2lSZXN1bHQuZXJyb3IuZGV0YWlscy5yZWR1Y2UoZnVuY3Rpb24gKG1lbW8sIGRldGFpbCkge1xuLy8gICAgICBpZiAoIW1lbW9bZGV0YWlsLnBhdGhdIGluc3RhbmNlb2YgQXJyYXkpIHtcbi8vICAgICAgICBtZW1vW2RldGFpbC5wYXRoXSA9IFtdO1xuLy8gICAgICB9XG4vLyAgICAgIG1lbW9bZGV0YWlsLnBhdGhdLnB1c2goZGV0YWlsLm1lc3NhZ2UpO1xuLy8gICAgICByZXR1cm4gbWVtbztcbi8vICAgIH0sIHt9KTtcbi8vICB9IGVsc2Uge1xuLy8gICAgcmV0dXJuIHt9O1xuLy8gIH1cbi8vfVxuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIC8vbWl4aW5zOiBbLS1SZWFjdFJvdXRlci5TdGF0ZS0tLCBzdGF0ZS5taXhpbl0sXG5cbiAgLy9jdXJzb3JzKCkge1xuICAvLyAgcmV0dXJuIHtcbiAgLy8gICAgcm9ib3RzOiBbXCJyb2JvdHNcIl0sXG4gIC8vICB9XG4gIC8vfSxcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+QWRkPC9kaXY+O1xuICAgIC8vbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnN0YXRlLmN1cnNvcnMucm9ib3RzO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfS8+XG4gICAgLy8pO1xuICB9XG59KTtcblxuLy9sZXQgRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbi8vICBnZXRJbml0aWFsU3RhdGUoKSB7XG4vLyAgICByZXR1cm4ge1xuLy8gICAgICBtb2RlbDoge1xuLy8gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbi8vICAgICAgICBhc3NlbWJseURhdGU6IHVuZGVmaW5lZCxcbi8vICAgICAgICBtYW51ZmFjdHVyZXI6IHVuZGVmaW5lZCxcbi8vICAgICAgfSxcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICAvL3ZhbGlkYXRvclR5cGVzKCkge1xuLy8gIC8vICByZXR1cm4gVmFsaWRhdG9ycy5tb2RlbDtcbi8vICAvL30sXG4vL1xuLy8gIC8vdmFsaWRhdG9yRGF0YSgpIHtcbi8vICAvLyAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgLy99LFxuLy9cbi8vICB2YWxpZGF0ZTogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgLy9sZXQgc2NoZW1hID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yVHlwZXNcIikgfHwge307XG4vLyAgICAvL2xldCBkYXRhID0gcmVzdWx0KHRoaXMsIFwidmFsaWRhdG9yRGF0YVwiKSB8fCB0aGlzLnN0YXRlO1xuLy8gICAgLy9sZXQgbmV4dEVycm9ycyA9IG1lcmdlKHt9LCB0aGlzLnN0YXRlLmVycm9ycywgdmFsaWRhdGUoc2NoZW1hLCBkYXRhLCBrZXkpLCBmdW5jdGlvbiAoYSwgYikge1xuLy8gICAgLy8gIHJldHVybiBiIGluc3RhbmNlb2YgQXJyYXkgPyBiIDogdW5kZWZpbmVkO1xuLy8gICAgLy99KTtcbi8vICAgIC8vcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHtcbi8vICAgIC8vICAgIGVycm9yczogbmV4dEVycm9yc1xuLy8gICAgLy8gIH0sICgpID0+IHJlc29sdmUodGhpcy5pc1ZhbGlkKGtleSkpKTtcbi8vICAgIC8vfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlQ2hhbmdlRm9yOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAvL3JldHVybiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbi8vICAgIC8vICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICAvLyAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vICAgIC8vICBtb2RlbFtrZXldID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcbi8vICAgIC8vICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbi8vICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4vLyAgICAvL30uYmluZCh0aGlzKTtcbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0ZURlYm91bmNlZDogZGVib3VuY2UoZnVuY3Rpb24gdmFsaWRhdGVEZWJvdW5jZWQoa2V5KSB7XG4vLyAgICAvL3JldHVybiB0aGlzLnZhbGlkYXRlKGtleSk7XG4vLyAgfSwgNTAwKSxcbi8vXG4vLyAgaGFuZGxlUmVzZXQoZXZlbnQpIHtcbi8vICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgbW9kZWw6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkubW9kZWwpLFxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4vLyAgICAgIGlmIChpc1ZhbGlkKSB7XG4vLyAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuLy8gICAgICAgIHJvYm90QWN0aW9ucy5hZGQoe1xuLy8gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgfSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4vLyAgICBpZiAoIU9iamVjdC52YWx1ZXMoZXJyb3JzKS5sZW5ndGgpIHtcbi8vICAgICAgcmV0dXJuIFtdO1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24gKGVycm9yKSB7XG4vLyAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbi8vICAgICAgICB9KSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgaXNWYWxpZDogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5nZXRWYWxpZGF0aW9uTWVzc2FnZXMoa2V5KSkubGVuZ3RoID09IDA7XG4vLyAgfSxcbi8vXG4vLyAgcmVuZGVyKCkge1xuLy8gICAgbGV0IHttb2RlbHMsIGxvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzO1xuLy8gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vXG4vLyAgICBpZiAobG9hZGluZykge1xuLy8gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbi8vICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4vLyAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICByZXR1cm4gKFxuLy8gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkFkZCBSb2JvdFwifT5cbi8vICAgICAgICAgIDxkaXY+XG4vLyAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbi8vICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cIm5vbWFyZ2luLXRvcFwiPkFkZCBSb2JvdDwvaDE+XG4vLyAgICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4vLyAgICAgICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxuLy8gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJmb3JtLWdyb3VwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5uYW1lLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLmFzc2VtYmx5RGF0ZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYXNzZW1ibHlEYXRlXCI+QXNzZW1ibHkgRGF0ZTwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG9uQmx1cj17dGhpcy52YWxpZGF0ZS5iaW5kKHRoaXMsIFwiYXNzZW1ibHlEYXRlXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJhc3NlbWJseURhdGVcIil9IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIGlkPVwiYXNzZW1ibHlEYXRlXCIgcmVmPVwiYXNzZW1ibHlEYXRlXCIgdmFsdWU9e21vZGVsLmFzc2VtYmx5RGF0ZX0vPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGVscFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogIXRoaXMuaXNWYWxpZChcImFzc2VtYmx5RGF0ZVwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldFZhbGlkYXRpb25NZXNzYWdlcyhcImFzc2VtYmx5RGF0ZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiAodGhpcy52YWxpZGF0b3JUeXBlcygpLm1hbnVmYWN0dXJlci5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHticmFuY2h9IGZyb20gXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkBicmFuY2goe1xuICBjdXJzb3JzOiB7XG4gICAgcm9ib3RzOiBcInJvYm90c1wiLFxuICB9LFxuICBmYWNldHM6IHtcbiAgICBtb2RlbDogXCJjdXJyZW50Um9ib3RcIixcbiAgfSxcbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdERldGFpbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hNb2RlbDtcblxuICBzdGF0aWMgY29udGV4dFR5cGVzID0ge1xuICAgIHJvdXRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge2xvYWRpbmcsIGxvYWRFcnJvcn0gPSB0aGlzLnByb3BzLnJvYm90cztcbiAgICBsZXQgbW9kZWwgPSB0aGlzLnByb3BzLm1vZGVsO1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiA8TG9hZGluZy8+O1xuICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4gICAgICByZXR1cm4gPEVycm9yIGxvYWRFcnJvcj17bG9hZEVycm9yfS8+O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RG9jdW1lbnRUaXRsZSB0aXRsZT17XCJEZXRhaWwgXCIgKyBtb2RlbC5uYW1lfT5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBpZD1cInBhZ2UtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtaW5kZXhcIiBwYXJhbXM9e3twYWdlOiAxfX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1ncmF5LWxpZ2h0XCIgdGl0bGU9XCJCYWNrIHRvIGxpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuLXhzIG1hcmdpbi1sZWZ0LXNtXCI+QmFjayB0byBsaXN0PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1lZGl0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lciBtYXJnaW4tdG9wLWxnXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGh1bWJuYWlsIHRodW1ibmFpbC1yb2JvdFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17XCJodHRwOi8vcm9ib2hhc2gub3JnL1wiICsgbW9kZWwuaWQgKyBcIj9zaXplPTIwMHgyMDBcIn0gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTlcIj5cbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+U2VyaWFsIE51bWJlcjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgIDxkZD57bW9kZWwuaWR9PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgPGR0PkFzc2VtYmx5IERhdGU8L2R0PlxuICAgICAgICAgICAgICAgICAgICA8ZGQ+e21vZGVsLmFzc2VtYmx5RGF0ZX08L2RkPlxuICAgICAgICAgICAgICAgICAgICA8ZHQ+TWFudWZhY3R1cmVyPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgPGRkPnttb2RlbC5tYW51ZmFjdHVyZXJ9PC9kZD5cbiAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RvY3VtZW50VGl0bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCByZXN1bHQgZnJvbSBcImxvZGFzaC5yZXN1bHRcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC5kZWJvdW5jZVwiO1xuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcImxvZGFzaC5mbGF0dGVuXCI7XG5pbXBvcnQgQ2xhc3MgZnJvbSBcImNsYXNzbmFtZXNcIjtcbi8vaW1wb3J0IEpvaSBmcm9tIFwiam9pXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRG9jdW1lbnRUaXRsZSBmcm9tIFwicmVhY3QtZG9jdW1lbnQtdGl0bGVcIjtcblxuLy9sZXQgVmFsaWRhdG9ycyBmcm9tIFwic2hhcmVkL3JvYm90L3ZhbGlkYXRvcnNcIjtcbmltcG9ydCBzdGF0ZSBmcm9tIFwiZnJvbnRlbmQvY29tbW9uL3N0YXRlXCI7XG5pbXBvcnQgQ29tcG9uZW50IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50XCI7XG5pbXBvcnQge0Vycm9yLCBMb2FkaW5nLCBOb3RGb3VuZCwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIGZsYXR0ZW5BbmRSZXNldFRvKG9iaiwgdG8sIHBhdGgpIHtcbiAgcGF0aCA9IHBhdGggfHwgXCJcIjtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBrZXkpIHtcbiAgICBpZiAob2JqW2tleV0gaW5zdGFuY2VvZiBBcnJheSB8fCAhb2JqW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIG1lbW9bcGF0aCArIGtleV0gPSB0bztcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihtZW1vLCBmbGF0dGVuQW5kUmVzZXRUbyhvYmpba2V5XSwgdG8sIHBhdGggKyBrZXkrIFwiLlwiKSk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9LCB7fSk7XG59XG5cbi8vZnVuY3Rpb24gdmFsaWRhdGUoam9pU2NoZW1hLCBkYXRhLCBrZXkpIHtcbi8vICBqb2lTY2hlbWEgPSBqb2lTY2hlbWEgfHwge307XG4vLyAgZGF0YSA9IGRhdGEgfHwge307XG4vLyAgbGV0IGpvaU9wdGlvbnMgPSB7XG4vLyAgICBhYm9ydEVhcmx5OiBmYWxzZSxcbi8vICAgIGFsbG93VW5rbm93bjogdHJ1ZSxcbi8vICB9O1xuLy8gIGxldCBlcnJvcnMgPSBmb3JtYXRFcnJvcnMoSm9pLnZhbGlkYXRlKGRhdGEsIGpvaVNjaGVtYSwgam9pT3B0aW9ucykpO1xuLy8gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuLy8gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4vLyAgICAgIGZsYXR0ZW5BbmRSZXNldFRvKGpvaVNjaGVtYSwgW10pLFxuLy8gICAgICBlcnJvcnNcbi8vICAgICk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIGxldCByZXN1bHQgPSB7fTtcbi8vICAgIHJlc3VsdFtrZXldID0gZXJyb3JzW2tleV0gfHwgW107XG4vLyAgICByZXR1cm4gcmVzdWx0O1xuLy8gIH1cbi8vfVxuXG4vL2Z1bmN0aW9uIGZvcm1hdEVycm9ycyhqb2lSZXN1bHQpIHtcbi8vICBpZiAoam9pUmVzdWx0LmVycm9yICE9PSBudWxsKSB7XG4vLyAgICByZXR1cm4gam9pUmVzdWx0LmVycm9yLmRldGFpbHMucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBkZXRhaWwpIHtcbi8vICAgICAgaWYgKCFtZW1vW2RldGFpbC5wYXRoXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4vLyAgICAgICAgbWVtb1tkZXRhaWwucGF0aF0gPSBbXTtcbi8vICAgICAgfVxuLy8gICAgICBtZW1vW2RldGFpbC5wYXRoXS5wdXNoKGRldGFpbC5tZXNzYWdlKTtcbi8vICAgICAgcmV0dXJuIG1lbW87XG4vLyAgICB9LCB7fSk7XG4vLyAgfSBlbHNlIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICB9XG4vL31cblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9jdXJzb3JzKCkge1xuLy8gIHJldHVybiB7XG4vLyAgICByb2JvdHM6IFtcInJvYm90c1wiXSxcbi8vICAgIGxvYWRNb2RlbDogW1wicm9ib3RzXCIsIFwibW9kZWxzXCIsIHRoaXMuZ2V0UGFyYW1zKCkuaWRdLFxuLy8gIH1cbi8vfSxcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90RWRpdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBsb2FkRGF0YSA9IHJvYm90QWN0aW9ucy5lc3RhYmxpc2hNb2RlbDtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXY+RWRpdDwvZGl2PjtcbiAgICAvL2xldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3J9ID0gdGhpcy5zdGF0ZS5jdXJzb3JzLnJvYm90cztcbiAgICAvL2xldCBsb2FkTW9kZWwgPSB0aGlzLnN0YXRlLmN1cnNvcnMubG9hZE1vZGVsO1xuICAgIC8vcmV0dXJuIChcbiAgICAvLyAgPEZvcm0gbW9kZWxzPXttb2RlbHN9IGxvYWRpbmc9e2xvYWRpbmd9IGxvYWRFcnJvcj17bG9hZEVycm9yfSBsb2FkTW9kZWw9e2xvYWRNb2RlbH0vPlxuICAgIC8vKTtcbiAgfVxufVxuXG4vL2xldCBGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuLy8gIGdldEluaXRpYWxTdGF0ZSgpIHtcbi8vICAgIHJldHVybiB7XG4vLyAgICAgIG1vZGVsOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmxvYWRNb2RlbCksXG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcykge1xuLy8gICAgaWYgKCFPYmplY3QudmFsdWVzKHRoaXMuc3RhdGUubW9kZWwpLmxlbmd0aCkge1xuLy8gICAgICB0aGlzLnNldFN0YXRlKHtcbi8vICAgICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgcHJvcHMubG9hZE1vZGVsKSxcbi8vICAgICAgfSlcbi8vICAgIH1cbi8vICB9LFxuLy9cbi8vICB2YWxpZGF0b3JUeXBlcygpIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICAgIC8vcmV0dXJuIFZhbGlkYXRvcnMubW9kZWw7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdG9yRGF0YSgpIHtcbi8vICAgIHJldHVybiB7fTtcbi8vICAvLyAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGU6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgIC8vbGV0IHNjaGVtYSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvclR5cGVzXCIpIHx8IHt9O1xuLy8gICAgLy9sZXQgZGF0YSA9IHJlc3VsdCh0aGlzLCBcInZhbGlkYXRvckRhdGFcIikgfHwgdGhpcy5zdGF0ZTtcbi8vICAgIC8vbGV0IG5leHRFcnJvcnMgPSBtZXJnZSh7fSwgdGhpcy5zdGF0ZS5lcnJvcnMsIHZhbGlkYXRlKHNjaGVtYSwgZGF0YSwga2V5KSwgZnVuY3Rpb24gKGEsIGIpIHtcbi8vICAgIC8vICByZXR1cm4gYiBpbnN0YW5jZW9mIEFycmF5ID8gYiA6IHVuZGVmaW5lZDtcbi8vICAgIC8vfSk7XG4vLyAgICAvL3JldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAvLyAgdGhpcy5zZXRTdGF0ZSh7XG4vLyAgICAvLyAgICBlcnJvcnM6IG5leHRFcnJvcnNcbi8vICAgIC8vICB9LCAoKSA9PiByZXNvbHZlKHRoaXMuaXNWYWxpZChrZXkpKSk7XG4vLyAgICAvL30pO1xuLy8gIH0sXG4vL1xuLy8gIGhhbmRsZUNoYW5nZUZvcjogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShldmVudCkge1xuLy8gICAgICBldmVudC5wZXJzaXN0KCk7XG4vLyAgICAgIGxldCBtb2RlbCA9IHRoaXMuc3RhdGUubW9kZWw7XG4vLyAgICAgIG1vZGVsW2tleV0gPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuLy8gICAgICB0aGlzLnNldFN0YXRlKHttb2RlbDogbW9kZWx9KTtcbi8vICAgIC8vICB0aGlzLnZhbGlkYXRlRGVib3VuY2VkKGtleSk7XG4vLyAgICB9LmJpbmQodGhpcyk7XG4vLyAgfSxcbi8vXG4vLyAgdmFsaWRhdGVEZWJvdW5jZWQ6IGRlYm91bmNlKGZ1bmN0aW9uIHZhbGlkYXRlRGVib3VuY2VkKGtleSkge1xuLy8gICAgcmV0dXJuIHRoaXMudmFsaWRhdGUoa2V5KTtcbi8vICB9LCA1MDApLFxuLy9cbi8vICBoYW5kbGVSZXNldChldmVudCkge1xuLy8gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbi8vICAgIGV2ZW50LnBlcnNpc3QoKTtcbi8vICAgIHRoaXMuc2V0U3RhdGUoe1xuLy8gICAgICBtb2RlbDogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcy5sb2FkTW9kZWwpLFxuLy8gICAgfSwgdGhpcy52YWxpZGF0ZSk7XG4vLyAgfSxcbi8vXG4vLyAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4vLyAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgZXZlbnQucGVyc2lzdCgpO1xuLy8gICAgdGhpcy52YWxpZGF0ZSgpLnRoZW4oaXNWYWxpZCA9PiB7XG4vLyAgICAgIGlmIChpc1ZhbGlkKSB7XG4vLyAgICAgICAgLy8gVE9ETyByZXBsYWNlIHdpdGggUmVhY3QuZmluZERPTU5vZGUgYXQgIzAuMTMuMFxuLy8gICAgICAgIHJvYm90QWN0aW9ucy5lZGl0KHtcbi8vICAgICAgICAgIGlkOiB0aGlzLnN0YXRlLm1vZGVsLmlkLFxuLy8gICAgICAgICAgbmFtZTogdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLFxuLy8gICAgICAgICAgYXNzZW1ibHlEYXRlOiB0aGlzLnJlZnMuYXNzZW1ibHlEYXRlLmdldERPTU5vZGUoKS52YWx1ZSxcbi8vICAgICAgICAgIG1hbnVmYWN0dXJlcjogdGhpcy5yZWZzLm1hbnVmYWN0dXJlci5nZXRET01Ob2RlKCkudmFsdWUsXG4vLyAgICAgICAgfSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgYWxlcnQoXCJDYW4ndCBzdWJtaXQgZm9ybSB3aXRoIGVycm9yc1wiKTtcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfSxcbi8vXG4vLyAgZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICBsZXQgZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnMgfHwge307XG4vLyAgICBpZiAoIU9iamVjdC52YWx1ZXMoZXJyb3JzKS5sZW5ndGgpIHtcbi8vICAgICAgcmV0dXJuIFtdO1xuLy8gICAgfSBlbHNlIHtcbi8vICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgcmV0dXJuIGZsYXR0ZW4oT2JqZWN0LmtleXMoZXJyb3JzKS5tYXAoZnVuY3Rpb24gKGVycm9yKSB7XG4vLyAgICAgICAgICByZXR1cm4gZXJyb3JzW2Vycm9yXSB8fCBbXTtcbi8vICAgICAgICB9KSk7XG4vLyAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgcmV0dXJuIGVycm9yc1trZXldIHx8IFtdO1xuLy8gICAgICB9XG4vLyAgICB9XG4vLyAgfSxcbi8vXG4vLyAgaXNWYWxpZDogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgcmV0dXJuIHRydWU7XG4vLyAgICAvL3JldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKGtleSkubGVuZ3RoID09IDApO1xuLy8gIH0sXG4vL1xuLy8gIHJlbmRlcigpIHtcbi8vICAgIGxldCB7bW9kZWxzLCBsb2FkaW5nLCBsb2FkRXJyb3IsIGxvYWRNb2RlbH0gPSB0aGlzLnByb3BzO1xuLy8gICAgbGV0IG1vZGVsID0gdGhpcy5zdGF0ZS5tb2RlbDtcbi8vXG4vLyAgICBpZiAobG9hZGluZykge1xuLy8gICAgICByZXR1cm4gPExvYWRpbmcvPjtcbi8vICAgIH0gZWxzZSBpZiAobG9hZEVycm9yKSB7XG4vLyAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4vLyAgICB9IGVsc2Uge1xuLy8gICAgICByZXR1cm4gKFxuLy8gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPXtcIkVkaXQgXCIgKyBtb2RlbC5uYW1lfT5cbi8vICAgICAgICAgIDxkaXY+XG4vLyAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtbGVmdFwiPlxuLy8gICAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWluZGV4XCIgcGFyYW1zPXt7cGFnZTogMX19IGNsYXNzTmFtZT1cImJ0biBidG4tZ3JheS1saWdodFwiIHRpdGxlPVwiQmFjayB0byBsaXN0XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtYXJyb3ctbGVmdFwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHMgbWFyZ2luLWxlZnQtc21cIj5CYWNrIHRvIGxpc3Q8L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvTGluaz5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgYnRuLWdyb3VwLXNtIHB1bGwtcmlnaHRcIj5cbi8vICAgICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuLy8gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZhIGZhLWV5ZVwiPjwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuLy8gICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJidG4gYnRuLXJlZFwiIHRpdGxlPVwiUmVtb3ZlXCIgb25DbGljaz17cm9ib3RBY3Rpb25zLnJlbW92ZS5iaW5kKHRoaXMsIG1vZGVsLmlkKX0+XG4vLyAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4vLyAgICAgICAgICAgICAgICAgIDwvYT5cbi8vICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwiY29udGFpbmVyIG1hcmdpbi10b3AtbGdcIj5cbi8vICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuLy8gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wteHMtMTIgY29sLXNtLTNcIj5cbi8vICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aHVtYm5haWwgdGh1bWJuYWlsLXJvYm90XCI+XG4vLyAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9e1wiaHR0cDovL3JvYm9oYXNoLm9yZy9cIiArIG1vZGVsLmlkICsgXCI/c2l6ZT0yMDB4MjAwXCJ9IHdpZHRoPVwiMjAwcHhcIiBoZWlnaHQ9XCIyMDBweFwiLz5cbi8vICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXhzLTEyIGNvbC1zbS05XCI+XG4vLyAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJub21hcmdpbi10b3BcIj57bW9kZWwubmFtZX08L2gxPlxuLy8gICAgICAgICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17dGhpcy5oYW5kbGVTdWJtaXR9PlxuLy8gICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgfSl9PlxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJuYW1lXCIpfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VGb3IoXCJuYW1lXCIpfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBpZD1cIm5hbWVcIiByZWY9XCJuYW1lXCIgdmFsdWU9e21vZGVsLm5hbWV9Lz5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e0NsYXNzKHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlbHBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJuYW1lXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibmFtZVwiKS5tYXAobWVzc2FnZSA9PiA8c3BhbiBrZXk9XCJcIj57bWVzc2FnZX08L3NwYW4+KX1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vXG4vLyAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Q2xhc3Moe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImZvcm0tZ3JvdXBcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJhc3NlbWJseURhdGVcIilcbi8vICAgICAgICAgICAgICAgICAgICAgIH0pfT5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJhc3NlbWJseURhdGVcIj5Bc3NlbWJseSBEYXRlPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJhc3NlbWJseURhdGVcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcImFzc2VtYmx5RGF0ZVwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJhc3NlbWJseURhdGVcIiByZWY9XCJhc3NlbWJseURhdGVcIiB2YWx1ZT17bW9kZWwuYXNzZW1ibHlEYXRlfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwiYXNzZW1ibHlEYXRlXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwiYXNzZW1ibHlEYXRlXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9ybS1ncm91cFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6ICF0aGlzLmlzVmFsaWQoXCJtYW51ZmFjdHVyZXJcIiksXG4vLyAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwibWFudWZhY3R1cmVyXCI+TWFudWZhY3R1cmVyPC9sYWJlbD5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgb25CbHVyPXt0aGlzLnZhbGlkYXRlLmJpbmQodGhpcywgXCJtYW51ZmFjdHVyZXJcIil9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZUZvcihcIm1hbnVmYWN0dXJlclwiKX0gY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJtYW51ZmFjdHVyZXJcIiByZWY9XCJtYW51ZmFjdHVyZXJcIiB2YWx1ZT17bW9kZWwubWFudWZhY3R1cmVyfS8+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtDbGFzcyh7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWxwXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiAhdGhpcy5pc1ZhbGlkKFwibWFudWZhY3R1cmVyXCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICB9KX0+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMuZ2V0VmFsaWRhdGlvbk1lc3NhZ2VzKFwibWFudWZhY3R1cmVyXCIpLm1hcChtZXNzYWdlID0+IDxzcGFuIGtleT1cIlwiPnttZXNzYWdlfTwvc3Bhbj4pfVxuLy8gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4vLyAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbi8vICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUmVzZXR9PlJlc2V0PC9idXR0b24+XG4vLyAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIGRpc2FibGVkPXshdGhpcy5pc1ZhbGlkKCl9IHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbi8vICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuLy8gICAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgICAgPC9kaXY+XG4vLyAgICAgICAgICAgIDwvc2VjdGlvbj5cbi8vICAgICAgICAgIDwvZGl2PlxuLy8gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbi8vICAgICAgKTtcbi8vICAgIH1cbi8vICB9XG4vL30pO1xuXG4vKlxuPFRleHRJbnB1dCBsYWJlbD1cIk5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWVcIiBpZD1cIm1vZGVsLm5hbWVcIiBmb3JtPXt0aGlzfS8+XG48VGV4dElucHV0IGxhYmVsPVwiQXNzZW1ibHkgRGF0ZVwiIHBsYWNlaG9sZGVyPVwiQXNzZW1ibHkgRGF0ZVwiIGlkPVwibW9kZWwuYXNzZW1ibHlEYXRlXCIgZm9ybT17dGhpc30vPlxuPFRleHRJbnB1dCBsYWJlbD1cIk1hbnVmYWN0dXJlclwiIHBsYWNlaG9sZGVyPVwiTWFudWZhY3R1cmVyXCIgaWQ9XCJtb2RlbC5tYW51ZmFjdHVyZXJcIiBmb3JtPXt0aGlzfS8+XG4qL1xuXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubWFudWZhY3R1cmVyLl9mbGFncy5wcmVzZW5jZSA9PSBcInJlcXVpcmVkXCIpXG4vLyh0aGlzLnZhbGlkYXRvclR5cGVzKCkubmFtZS5fZmxhZ3MucHJlc2VuY2UgPT0gXCJyZXF1aXJlZFwiKSxcbi8vKHRoaXMudmFsaWRhdG9yVHlwZXMoKS5hc3NlbWJseURhdGUuX2ZsYWdzLnByZXNlbmNlID09IFwicmVxdWlyZWRcIiksIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHticmFuY2h9IGZyb20gXCJiYW9iYWItcmVhY3QvZGVjb3JhdG9yc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IERvY3VtZW50VGl0bGUgZnJvbSBcInJlYWN0LWRvY3VtZW50LXRpdGxlXCI7XG5cbmltcG9ydCB7dG9BcnJheX0gZnJvbSBcInNoYXJlZC9jb21tb24vaGVscGVyc1wiO1xuaW1wb3J0IHN0YXRlIGZyb20gXCJmcm9udGVuZC9jb21tb24vc3RhdGVcIjtcbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7RXJyb3IsIExvYWRpbmcsIE5vdEZvdW5kLCBFeHRlcm5hbFBhZ2luYXRpb24sIEludGVybmFsUGFnaW5hdGlvbiwgTGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5pbXBvcnQgUm9ib3RJdGVtIGZyb20gXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2l0ZW1cIjtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQGJyYW5jaCh7XG4gIGN1cnNvcnM6IHtcbiAgICByb2JvdHM6IFwicm9ib3RzXCIsXG4gIH0sXG5cbiAgZmFjZXRzOiB7XG4gICAgY3VycmVudFJvYm90czogXCJjdXJyZW50Um9ib3RzXCIsXG4gIH1cbn0pXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2JvdEluZGV4IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGxvYWREYXRhID0gcm9ib3RBY3Rpb25zLmVzdGFibGlzaEluZGV4O1xuXG4gIHN0YXRpYyBjb250ZXh0VHlwZXMgPSB7XG4gICAgcm91dGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgc2V0TGltaXQobGltaXQpIHtcbiAgICByb2JvdEFjdGlvbnMuc2V0TGltaXQobGltaXQpO1xuICAgIHJvYm90QWN0aW9ucy5sb2FkSW5kZXgoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQge3RvdGFsLCBsb2FkaW5nLCBsb2FkRXJyb3IsIG9mZnNldCwgbGltaXR9ID0gdGhpcy5wcm9wcy5yb2JvdHM7XG4gICAgbGV0IG1vZGVscyA9IHRoaXMucHJvcHMuY3VycmVudFJvYm90cztcblxuICAgIGlmIChsb2FkRXJyb3IpIHtcbiAgICAgIHJldHVybiA8RXJyb3IgbG9hZEVycm9yPXtsb2FkRXJyb3J9Lz47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEb2N1bWVudFRpdGxlIHRpdGxlPVwiUm9ib3RzXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJwYWdlLWFjdGlvbnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPVwicm9ib3QtYWRkXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tZ3JlZW5cIiB0aXRsZT1cIkFkZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYSBmYS1wbHVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZXRMaW1pdCgzKX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSAzXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZXRMaW1pdCg1KX0+XG4gICAgICAgICAgICAgICAgICAgICAgUGVycGFnZSA1XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZXRMaW1pdCgxMCl9PlxuICAgICAgICAgICAgICAgICAgICAgIFBlcnBhZ2UgMTBcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICB0bz1cInJvYm90LWluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICB3aXRoUXVlcnk9e3tzb3J0OiBcIituYW1lXCJ9fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgIFNvcnRCeSArbmFtZVxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgdG89XCJyb2JvdC1pbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgd2l0aFF1ZXJ5PXt7c29ydDogXCItbmFtZVwifX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICBTb3J0QnkgLW5hbWVcbiAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgdG89XCJyb2JvdC1pbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgd2l0aFF1ZXJ5PXt7ZmlsdGVyOiBmYWxzZX19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgUmVzZXQgZmlsdGVyc1xuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgdG89XCJyb2JvdC1pbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgd2l0aFF1ZXJ5PXt7ZmlsdGVyOiB7bWFudWZhY3R1cmVyOiBcIlJ1c3NpYVwifX19XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgRmlsdGVyQnkgbWFudWZhY3R1cmVyPVJ1c3NpYVxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICA8aDE+Um9ib3RzPC9oMT5cbiAgICAgICAgICAgICAgPEV4dGVybmFsUGFnaW5hdGlvbiBlbmRwb2ludD1cInJvYm90LWluZGV4XCIgdG90YWw9e3RvdGFsfSBvZmZzZXQ9e29mZnNldH0gbGltaXQ9e2xpbWl0fS8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgICAgICAgICAge21vZGVscy5tYXAobW9kZWwgPT4gPFJvYm90SXRlbSBtb2RlbD17bW9kZWx9IGtleT17bW9kZWwuaWR9Lz4pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPEludGVybmFsUGFnaW5hdGlvbiBvbkNsaWNrPXtvZmZzZXQgPT4gcm9ib3RBY3Rpb25zLnNldE9mZnNldChvZmZzZXQpfSB0b3RhbD17dG90YWx9IG9mZnNldD17b2Zmc2V0fSBsaW1pdD17bGltaXR9Lz5cbiAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gPExvYWRpbmcvPiA6IFwiXCJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRG9jdW1lbnRUaXRsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbi8qXG48ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbnMgYnRuLWdyb3VwXCI+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVzZXRcIj5SZXNldCBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwicmVtb3ZlXCI+UmVtb3ZlIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJzaHVmZmxlXCI+U2h1ZmZsZSBDb2xsZWN0aW9uPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1ob29rPVwiZmV0Y2hcIj5SZWZldGNoIENvbGxlY3Rpb248L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWhvb2s9XCJhZGRcIj5BZGQgUmFuZG9tPC9idXR0b24+XG48L2Rpdj5cbiovXG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRcIjtcbmltcG9ydCB7TGlua30gZnJvbSBcImZyb250ZW5kL2NvbW1vbi9jb21wb25lbnRzXCI7XG5pbXBvcnQgcm9ib3RBY3Rpb25zIGZyb20gXCJmcm9udGVuZC9yb2JvdC9hY3Rpb25zXCI7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYm90SXRlbSBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbW9kZWw6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5wcm9wcy5tb2RlbDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e21vZGVsLmlkfSBjbGFzc05hbWU9XCJjb2wtc20tNiBjb2wtbWQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBrZXk9e21vZGVsLmlkfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJwYW5lbC10aXRsZVwiPjxMaW5rIHRvPVwicm9ib3QtZGV0YWlsXCIgcGFyYW1zPXt7aWQ6IG1vZGVsLmlkfX0+e21vZGVsLm5hbWV9PC9MaW5rPjwvaDQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1ib2R5IHRleHQtY2VudGVyIG5vcGFkZGluZ1wiPlxuICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fT5cbiAgICAgICAgICAgICAgPGltZyBzcmM9eydodHRwOi8vcm9ib2hhc2gub3JnLycgKyBtb2RlbC5pZCArICc/c2l6ZT0yMDB4MjAwJ30gd2lkdGg9XCIyMDBweFwiIGhlaWdodD1cIjIwMHB4XCIvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtZm9vdGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIGJ0bi1ncm91cC1zbSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPExpbmsgdG89XCJyb2JvdC1kZXRhaWxcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLWJsdWVcIiB0aXRsZT1cIkRldGFpbFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZXllXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICAgICAgICA8TGluayB0bz1cInJvYm90LWVkaXRcIiBwYXJhbXM9e3tpZDogbW9kZWwuaWR9fSBjbGFzc05hbWU9XCJidG4gYnRuLW9yYW5nZVwiIHRpdGxlPVwiRWRpdFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtZWRpdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1yZWRcIiB0aXRsZT1cIlJlbW92ZVwiIG9uQ2xpY2s9e3JvYm90QWN0aW9ucy5yZW1vdmUuYmluZCh0aGlzLCBtb2RlbC5pZCl9PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgVVVJRCBmcm9tIFwibm9kZS11dWlkXCI7XG5cbi8vIE1PREVMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0KGRhdGEpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgIGlkOiBVVUlELnY0KCksXG4gICAgbWVzc2FnZTogdW5kZWZpbmVkLFxuICAgIGNhdGVnb3J5OiB1bmRlZmluZWQsXG4gICAgY2xvc2FibGU6IHRydWUsXG4gICAgZXhwaXJlOiA1MDAwLFxuICB9LCBkYXRhKTtcbn0iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQge1JvdXRlLCBEZWZhdWx0Um91dGUsIE5vdEZvdW5kUm91dGV9IGZyb20gXCJyZWFjdC1yb3V0ZXJcIjtcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHtCb2R5LCBIb21lLCBBYm91dCwgTm90Rm91bmR9IGZyb20gXCJmcm9udGVuZC9jb21tb24vY29tcG9uZW50c1wiO1xuXG5pbXBvcnQgUm9ib3RJbmRleCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9pbmRleFwiO1xuaW1wb3J0IFJvYm90QWRkIGZyb20gXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2FkZFwiO1xuaW1wb3J0IFJvYm90RGV0YWlsIGZyb20gXCJmcm9udGVuZC9yb2JvdC9jb21wb25lbnRzL2RldGFpbFwiO1xuaW1wb3J0IFJvYm90RWRpdCBmcm9tIFwiZnJvbnRlbmQvcm9ib3QvY29tcG9uZW50cy9lZGl0XCI7XG5cbi8vIFJPVVRFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IChcbiAgPFJvdXRlIHBhdGg9XCIvXCIgaGFuZGxlcj17Qm9keX0+XG4gICAgPERlZmF1bHRSb3V0ZSBoYW5kbGVyPXtIb21lfSBuYW1lPVwiaG9tZVwiLz5cbiAgICA8Um91dGUgcGF0aD1cIi9hYm91dFwiIG5hbWU9XCJhYm91dFwiIGhhbmRsZXI9e0Fib3V0fSBsb2FkZXI9XCJ4eHhcIi8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzL1wiIG5hbWU9XCJyb2JvdC1pbmRleFwiIGhhbmRsZXI9e1JvYm90SW5kZXh9Lz5cbiAgICA8Um91dGUgcGF0aD1cIi9yb2JvdHMvYWRkXCIgbmFtZT1cInJvYm90LWFkZFwiIGhhbmRsZXI9e1JvYm90QWRkfS8+XG4gICAgPFJvdXRlIHBhdGg9XCIvcm9ib3RzLzppZFwiIG5hbWU9XCJyb2JvdC1kZXRhaWxcIiBoYW5kbGVyPXtSb2JvdERldGFpbH0vPlxuICAgIDxSb3V0ZSBwYXRoPVwiL3JvYm90cy86aWQvZWRpdFwiIG5hbWU9XCJyb2JvdC1lZGl0XCIgaGFuZGxlcj17Um9ib3RFZGl0fS8+XG4gICAgPE5vdEZvdW5kUm91dGUgaGFuZGxlcj17Tm90Rm91bmR9Lz5cbiAgPC9Sb3V0ZT5cbik7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IHJhbmdlIGZyb20gXCJsb2Rhc2gucmFuZ2VcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwibG9kYXNoLm1lcmdlXCI7XG5pbXBvcnQgc29ydEJ5IGZyb20gXCJsb2Rhc2guc29ydGJ5XCI7XG5cbi8vIEhFTFBFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogU3BsaXQgYXJyYXkgaW50byBjaHVua3Mgd2l0aCBwcmVkZWZpbmVkIGNodW5rIGxlbmd0aC4gVXNlZnVsIGZvciBwYWdpbmF0aW9uLlxuICogRXhhbXBsZTpcbiAqICAgY2h1bmtlZChbMSwgMiwgMywgNCwgNV0sIDIpID09IFtbMSwgMl0sIFszLCA0XSwgWzVdXVxuICogQHB1cmVcbiAqIEBwYXJhbSBhcnJheSB7QXJyYXl9IC0gYXJyYXkgdG8gYmUgY2h1bmtlZFxuICogQHBhcmFtIG4ge251bWJlcn0gLSBsZW5ndGggb2YgY2h1bmtcbiAqIEByZXR1cm5zIHtBcnJheX0gLSBjaHVua2VkIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaHVua2VkKGFycmF5LCBuKSB7XG4gIGxldCBsID0gTWF0aC5jZWlsKGFycmF5Lmxlbmd0aCAvIG4pO1xuICByZXR1cm4gcmFuZ2UobCkubWFwKCh4LCBpKSA9PiBhcnJheS5zbGljZShpKm4sIGkqbiArIG4pKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBzb3J0aW5nIGFycmF5IGluIFwic2hvcnRcIiBmb3JtYXQgdG8gc29ydGluZyBhcnJheSBpbiBcImxvZGFzaFwiIChsb2Rhc2guc29ydEJ5T3JkZXIpIGZvcm1hdC5cbiAqIEV4YW1wbGU6XG4gKiAgIGxvZGFzaGlmeVNvcnRzKFtcIituYW1lXCIsIFwiLWFnZVwiXSkgPT0gW1tcIm5hbWVcIiwgXCJhZ2VcIl0sIFt0cnVlLCBmYWxzZV1dXG4gKiBAcHVyZVxuICogQHBhcmFtIHNvcnRzIHtBcnJheTxzdHJpbmc+fSAtIGFycmF5IGluIFwic2hvcnRcIiBmb3JtYXRcbiAqIEByZXR1cm5zIHtBcnJheTxBcnJheTxzdHJpbmc+Pn0gLSBhcnJheSBpbiBcImxvZGFzaFwiIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9kYXNoaWZ5U29ydHMoc29ydHMpIHtcbiAgcmV0dXJuIFtcbiAgICBzb3J0cy5tYXAodiA9PiB2LnNsaWNlKDEpKSxcbiAgICBzb3J0cy5tYXAodiA9PiB2WzBdID09IFwiK1wiKSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVlcChvYmplY3QsIG90aGVyKSB7XG4gIHJldHVybiBtZXJnZSh7fSwgb2JqZWN0LCBvdGhlciwgKGEsIGIpID0+IHtcbiAgICBpZiAoYSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gYS5jb25jYXQoYik7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5BcnJheUdyb3VwKG9iamVjdCwgc29ydGVyPSh2ID0+IHYpKSB7XG4gIHJldHVybiBzb3J0QnkoT2JqZWN0LmtleXMob2JqZWN0KSwgc29ydGVyKS5yZWR1Y2UoKGNvbWJpbmVkQXJyYXksIGtleSkgPT4ge1xuICAgIHJldHVybiBjb21iaW5lZEFycmF5LmNvbmNhdChvYmplY3Rba2V5XSk7XG4gIH0sIFtdKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlyc3RMZXNzZXJPZmZzZXQocGFnaW5hdGlvbiwgb2Zmc2V0KSB7XG4gIGxldCBvZmZzZXRzID0gT2JqZWN0LmtleXMocGFnaW5hdGlvbikubWFwKHYgPT4gcGFyc2VJbnQodikpLnNvcnQoKS5yZXZlcnNlKCk7XG4gIGZvciAobGV0IG8gb2Ygb2Zmc2V0cykge1xuICAgIGlmIChwYXJzZUludChvKSA8IG9mZnNldCkge1xuICAgICAgcmV0dXJuIG87XG4gICAgfVxuICB9XG4gIHJldHVybiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9PYmplY3QoYXJyYXkpIHtcbiAgaWYgKGFycmF5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChvYmplY3QsIGl0ZW0pID0+IHtcbiAgICAgIG9iamVjdFtpdGVtLmlkXSA9IGl0ZW07XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBFcnJvcihgYXJyYXkgbXVzdCBiZSBwbGFpbiBBcnJheSwgZ290ICR7YXJyYXl9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gc29ydEJ5KFxuICAgICAgT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKSxcbiAgICAgIGl0ZW0gPT4gaXRlbS5pZFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYG9iamVjdCBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHtvYmplY3R9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSnNvbkFwaVF1ZXJ5KHF1ZXJ5KSB7XG4gIHJldHVybiB7XG4gICAgZmlsdGVyczogcXVlcnkuZmlsdGVyLFxuICAgIHNvcnRzOiBxdWVyeS5zb3J0ID8gcXVlcnkuc29ydC5zcGxpdChcIixcIikubWFwKHYgPT4gdi5yZXBsYWNlKC9eIC8sIFwiK1wiKSkgOiB1bmRlZmluZWQsXG4gICAgb2Zmc2V0OiBxdWVyeS5wYWdlICYmIChxdWVyeS5wYWdlLm9mZnNldCB8fCBxdWVyeS5wYWdlLm9mZnNldCA9PSAwKSA/IHF1ZXJ5LnBhZ2Uub2Zmc2V0IDogdW5kZWZpbmVkLFxuICAgIGxpbWl0OiBxdWVyeS5wYWdlICYmIChxdWVyeS5wYWdlLmxpbWl0IHx8IHF1ZXJ5LnBhZ2Uub2Zmc2V0ID09IDApID8gcXVlcnkucGFnZS5saW1pdCA6IHVuZGVmaW5lZCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEpzb25BcGlRdWVyeShtb2RpZmllcnMpIHtcbiAgaWYgKCFtb2RpZmllcnMgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG1vZGlmaWVycyBtdXN0IGJlIGEgYmFzaWMgT2JqZWN0LCBnb3QgJHttb2RpZmllcnN9YCk7XG4gIH1cblxuICBsZXQgc29ydE9iaiA9IHt9O1xuICBsZXQgZmlsdGVyT2JqID0ge307XG4gIGxldCBwYWdlT2JqID0ge307XG5cbiAgaWYgKG1vZGlmaWVycy5maWx0ZXJzKSB7XG4gICAgZmlsdGVyT2JqID0gT2JqZWN0LmtleXMobW9kaWZpZXJzLmZpbHRlcnMpLnJlZHVjZSgoZmlsdGVyT2JqLCBrZXkpID0+IHtcbiAgICAgIGZpbHRlck9ialtgZmlsdGVyWyR7a2V5fV1gXSA9IG1vZGlmaWVycy5maWx0ZXJzW2tleV07XG4gICAgICByZXR1cm4gZmlsdGVyT2JqO1xuICAgIH0sIGZpbHRlck9iaik7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5zb3J0cykge1xuICAgIHNvcnRPYmpbXCJzb3J0XCJdID0gbW9kaWZpZXJzLnNvcnRzLmpvaW4oXCIsXCIpO1xuICB9XG4gIGlmIChtb2RpZmllcnMub2Zmc2V0IHx8IG1vZGlmaWVycy5vZmZzZXQgPT0gMCkge1xuICAgIHBhZ2VPYmpbXCJwYWdlW29mZnNldF1cIl0gPSBtb2RpZmllcnMub2Zmc2V0O1xuICB9XG4gIGlmIChtb2RpZmllcnMubGltaXQgfHwgbW9kaWZpZXJzLmxpbWl0ID09IDApIHtcbiAgICBwYWdlT2JqW1wicGFnZVtsaW1pdF1cIl0gPSBtb2RpZmllcnMubGltaXQ7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc29ydE9iaiwgZmlsdGVyT2JqLCBwYWdlT2JqKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShkYXRhKSB7XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAodiA9PiBub3JtYWxpemUodikpO1xuICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGF0YSkucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgIG9ialtrXSA9IG5vcm1hbGl6ZShkYXRhW2tdKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09IFwic3RyaW5nXCIpIHtcbiAgICBpZiAoZGF0YSA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSBcInRydWVcIikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoZGF0YSA9PT0gXCJudWxsXCIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5tYXRjaCgvXi0/XFxkK1xcLlxcZCsvKSkge1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLm1hdGNoKC9eLT9cXGQrLykpIHtcbiAgICAgIHJldHVybiBwYXJzZUludChkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInV0aWwtaW5zcGVjdFwiO1xuXG4vLyBTSElNUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIb3cgaXQncyBldmVyIG1pc3NlZD8hXG5SZWdFeHAuZXNjYXBlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG59O1xuXG4vLyBVbmNvbW1lbnQgaWYgdXNlIElvSlNcbi8vIGxldCBwcm9jZXNzID0gcHJvY2VzcyB8fCB1bmRlZmluZWQ7XG4vL2lmIChwcm9jZXNzKSB7XG4gIC8vIElvSlMgaGFzIGB1bmhhbmRsZWRSZWplY3Rpb25gIGhvb2tcbiAgLy9wcm9jZXNzLm9uKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIGZ1bmN0aW9uIChyZWFzb24sIHApIHtcbiAgLy8gIHRocm93IEVycm9yKGBVbmhhbmRsZWRSZWplY3Rpb246ICR7cmVhc29ufWApO1xuICAvL30pO1xuLy99IGVsc2Uge1xuICBQcm9taXNlLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gZG9uZShyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0aGlzXG4gICAgICAudGhlbihyZXNvbHZlLCByZWplY3QpXG4gICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aHJvdyBlOyB9LCAwKTtcbiAgICAgIH0pO1xuICB9O1xuLy99XG5cbi8vIFdvcmthcm91bmQgbWV0aG9kIGFzIG5hdGl2ZSBicm93c2VyIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBJbW11dGFibGUgaXMgYXdmdWxcbmxldCB3aW5kb3cgPSB3aW5kb3cgfHwgdW5kZWZpbmVkO1xuaWYgKHdpbmRvdykge1xuICB3aW5kb3cuY29uc29sZS5lY2hvID0gZnVuY3Rpb24gZWNobygpIHtcbiAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcCh2ID0+IEluc3BlY3QodikpKTtcbiAgfTtcbn0iXX0=
