let React = require("react");
let {Alert, Input, Button} = require("react-bootstrap");
let immutableLens = require("paqmind.data-lens").immutableLens;

let TextInput = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    form: React.PropTypes.object,
  },

  render: function() {
    let id = this.props.id;
    let form = this.props.form;
    let lens = immutableLens(id);
    return (
        <Input type="text"
          key={this.props.id}
          ref={this.props.id}
          defaultValue={lens.get(form.state)}
          onChange={form.handleChangeFor(id)}
          bsStyle={form.isValid(id) ? undefined : "error"}
          help={form.getValidationMessages(id).map(message => <span key="" className="help-block">{message}</span>)}
          {...this.props}
        />
    );
  }
});

export default TextInput;
