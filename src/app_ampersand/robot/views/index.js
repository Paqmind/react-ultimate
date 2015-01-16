var templater = require("../../templater"),
    PageView = require("../../common/views/page"),
    ItemView = require("./item");

module.exports = PageView.extend({
  seoTitle: "Robot Index SEO title",

  template: templater.lazyRender("robot/templates/index.html"),

  events: {
    "click [data-hook=reset]": "resetCollection",
    "click [data-hook=remove]": "removeCollection",
    "click [data-hook=shuffle]": "shuffleCollection",
    "click [data-hook=fetch]": "fetchCollection",
    "click [data-hook=add]": "addRandom"
  },

  render: function () {
    this.renderWithTemplate();
    this.renderCollection(this.collection, ItemView, this.queryByHook("robot-index"));
    if (!this.collection.length) {
      this.collection.fetch();
    }
  },

  resetCollection: function () {
    this.collection.reset();
  },

  removeCollection: function () {
    var self = this;
    var model;
    while (model = this.collection.first()) {
      model.destroy();
    }
  },

  shuffleCollection: function () {
    this.collection.comparator = function () {
      return !Math.round(Math.random());
    };
    this.collection.sort();
    delete this.collection.comparator;
    return false;
  },

  fetchCollection: function () {
    this.collection.fetch();
  },

  addRandom: function () {
    function getRandom(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }
    var firstNames = "Gecko Hue Joe Jacinto Harry Larry Sue Bob Rose Angela Tom Merle Joseph Josephine".split(" ");
    var lastNames = "Smith Jewel Barker Stephenson Rossum Crockford Joreteg Smith".split(" ");

    this.collection.create({
      firstName: firstNames[getRandom(0, firstNames.length - 1)],
      lastName: lastNames[getRandom(0, lastNames.length - 1)],
      coolnessFactor: getRandom(0, 15)
    });
  }
});
