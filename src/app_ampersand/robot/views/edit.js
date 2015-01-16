var templater = require("../../templater"),
    PageView = require("../../common/views/page"),
    ModelForm = require("../forms/model"),
    ItemView = require("./item");

module.exports = PageView.extend({
  pageTitle: "Edit Robot",
  seoTitle: "Robot Edit SEO title",

  template: templater.lazyRender("robot/templates/form.html"),

  initialize: function (spec) {
    var self = this;
    this.collection.getOrFetch(spec.id, {all: true}, function (err, model) {
      if (err) { alert(`Couldn't find a model with id: {spec.id}`); }
      self.model = model;
    });
  },

  subviews: {
    form: {
      hook: "form",
      waitFor: "model",
      prepareView: function (el) {
        var model = this.model;
        return new ModelForm({
          el: el,
          model: this.model,
          submitCallback: function (data) {
            model.save(data, {
              wait: true,
              success: function () {
                window.app.navigate("robots");
              }
            });
          }
        });
      }
    }
  },

  render: function() {
    this.renderWithTemplate(this);
    this.queryByHook("title").textContent = this.pageTitle;
    return this;
  },
});
