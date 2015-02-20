let {Map} = require("immutable");
let ReactLink = require("react/lib/ReactLink");
let immutableLens = require("paqmind.data-lens").immutableLens;

export function createLensedStateMixin(onChange) {
  return {
    linkState: function(key) {
      let lens = immutableLens(key);
      return new ReactLink(
        lens.get(this.state),
        (newValue) => {
          onChange();
          this.setState(lens.set(this.state, newValue));
        }
      );
    }
  };
}
