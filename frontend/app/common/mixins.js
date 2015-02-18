let ReactLink = require("react/lib/ReactLink");
let ReactStateSetters = require("react/lib/ReactStateSetters");
let immutableLens = require("paqmind.data-lens").immutableLens;

exports.LensedStateMixin = {
  linkState: function(key) {
    let lens = immutableLens(key);
    return new ReactLink(
      lens.get(this.state),
      ReactStateSetters.createStateSetter(this, function(state) {
        return function(value) {
          return lens.set(value, state);
        }
      })
    );
  }
};
