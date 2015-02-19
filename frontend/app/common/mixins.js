let {Map} = require("immutable");
let ReactLink = require("react/lib/ReactLink");
let immutableLens = require("paqmind.data-lens").immutableLens;

exports.LensedStateMixin = {
  linkState: function(key) {
    let lens = immutableLens(key);
    return new ReactLink(
      lens.get(this.state),
      (newValue) => {
        this.setState(lens.set(this.state, newValue));
      }
    );
  }
};
