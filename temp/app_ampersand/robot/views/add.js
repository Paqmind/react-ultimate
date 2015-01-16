var templater = require("../../templater"),
    PageView = require("../../common/views/page"),
    ModelForm = require("../forms/model"),
    ItemView = require("./item");

module.exports = PageView.extend({
  pageTitle: "Add Robot",
  seoTitle: "Robot Add SEO title",

  template: templater.lazyRender("robot/templates/form.html"),

  render: function() {
    this.renderWithTemplate(this);
    this.queryByHook("title").textContent = this.pageTitle;
    return this;
  },

  subviews: {
    form: {
      hook: "form",
      prepareView: function (el) {
        var self = this;
        return new ModelForm({
          el: el,
          collection: this.collection,
          submitCallback: function (data) {
            self.collection.create(data, {
              wait: true,
              success: function () {
                window.app.navigate("/robots");
                self.collection.fetch();
              }
            });
          }
        });
      }
    }
  }
});
