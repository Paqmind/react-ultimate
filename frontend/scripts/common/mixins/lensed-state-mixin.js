let {Map} = require("immutable");
let immutableLens = require("paqmind.data-lens").immutableLens;
let ReactLink = require("react/lib/ReactLink");

export function createLensedStateMixin(onChange) {
  return {
    linkState: function (key) {
      let lens = immutableLens(key);
      return new ReactLink(
        lens.get(this.state),
        newValue => {
          onChange();
          this.setState(lens.set(this.state, newValue));
        }
      );
    }
  };
}
