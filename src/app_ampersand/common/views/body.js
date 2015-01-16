var ld = require("lodash"),
    dom = require("ampersand-dom"),
    View = require("ampersand-view"),
    SwitcherView = require("ampersand-view-switcher");

var templater = require("../../templater"),
    Robots = require("../../robot/collection");

//var domify = require("domify");
//var tracking = require("../helpers/metrics");
//var setFavicon = require("favicon-setter");


module.exports = View.extend({
  template: templater.lazyRender("common/templates/body.html"),

  initialize: function() {
    // create our global "me" object and an empty collection for our people models.
    //    window.me = new Me();
    this.robots = new Robots();
    this.listenTo(window.app, "page", this.handlePage);
  },

  events: {
    "click a[href]": "handleLinkClick"
  },

  handleLinkClick: function(e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;
    // Navigate internally on plain clicks (no modifier keys) to local url
    if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && !e.defaultPrevented) {
      e.preventDefault();
      window.app.navigate(aTag.pathname);
    }
  },

  handlePage: function(view) {
    this.switcherView.set(view);
    this.updateActiveNav();
  },

  updateActiveNav: function() {
    var path = window.location.pathname.slice(1);

    this.queryAll(".nav a[href]").forEach(function(aTag) {
      var aPath = aTag.pathname.slice(1);

      if ((!aPath && !path) || (aPath && path.indexOf(aPath) === 0)) {
          dom.addClass(aTag.parentNode, "active");
      } else {
          dom.removeClass(aTag.parentNode, "active");
      }
    });
  },

  render: function() {
    // main renderer
    this.renderWithTemplate(); // {me: window.me}

    // init and configure our page switcher
    this.switcherView = new SwitcherView(this.queryByHook("page-main"), {
      show: function(newView, oldView) {
        document.title = ld.result(newView, "seoTitle") || "???";
        document.scrollTop = 0;

        // add a class specifying it"s active
//        dom.addClass(newView.el, "active");

        // store an additional reference, just because
//        app.currentPage = newView;
      }
    });

    // setting a favicon for fun (note, it"s dynamic)
//    setFavicon("/images/ampersand.png");
    return this;
  },
});
