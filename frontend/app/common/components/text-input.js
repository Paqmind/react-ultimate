// IMPORTS =========================================================================================
let immutableLens = require("paqmind.data-lens").immutableLens;
let debounce = require("lodash.debounce");
let React = require("react");
let {Alert, Input, Button} = require("react-bootstrap");

// EXPORTS =========================================================================================
let TextInput = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    form: React.PropTypes.object,
  },

  render: function() {
    let key = this.props.id;
    let form = this.props.form;
    let lens = immutableLens(key);
    return (
        <Input type="text"
          key={key}
          ref={key}
          defaultValue={lens.get(form.state)}
          onChange={this.handleChangeFor(key)}
          bsStyle={form.isValid(key) ? undefined : "error"}
          help={form.getValidationMessages(key).map(message => <span key="" className="help-block">{message}</span>)}
          {...this.props}
        />
    );
  },

  handleChangeFor: function(key) {
    let form = this.props.form;
    let lens = immutableLens(key);
    return function handleChange(event) {
      form.setState(lens.set(form.state, event.target.value));
      this.validateDebounced(key);
    }.bind(this);
  },

  validateDebounced: debounce(function validateDebounced(key) {
    let form = this.props.form;
    //console.echo("validateDebounced()");
    form.validate(key);
  }, 500),
});

export default TextInput;
