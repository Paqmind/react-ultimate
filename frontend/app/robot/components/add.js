// IMPORTS =========================================================================================
let LD = require("lodash");
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let Alert = require("react-bootstrap/Alert");
let Input = require("react-bootstrap/Input");
let Button = require("react-bootstrap/Button");
let ValidationMixin = require("react-validation-mixin");
let Joi = require("joi");
let Helpers = require("../../common/helpers");
let Actions = require("../actions");

// EXPORTS =========================================================================================

//let UserAction = require("../actions/UserAction");

let ExampleInput = React.createClass({
  //mixins: [LinkedStateMixin],

  //propTypes: {
    //name: React.PropTypes.string.isRequired,
    //type: React.PropTypes.oneOf(INPUT_TYPES).isRequired,
    //placeholder: React.PropTypes.string,
    //label: React.PropTypes.string,
    //required: React.PropTypes.bool,
    //oneOf: React.PropTypes.array,
    //minLength: React.PropTypes.number
  //},

  //getInitialState() {
  //  this.validateDebounced = LD.debounce(this.validate, 1000);
  //  return {
  //    value: "",
  //    error: false,
  //    validationStarted: false,
  //  };
  //},

  //prepareToValidate() {
  //
  //},
  //
  //componentWillMount() {
  //  let startValidation = function() {
  //    this.setState({
  //      validationStarted: true
  //    }).bind(this);
  //  };
  //
  //  if (!this.props.value) {
  //    startValidation();
  //  } else {
  //    this.prepareToValidate = LD.debounce(startValidation, 1000);
  //  }
  //},

  //handleChange(e) {
  //  this.validateDebounced();
    //if (!this.state.validationStarted) {
    //  this.prepareToValidate();
    //}
    //this.props.onChange && !this.props.onChange(e);
  //},
  //
  //onBlur(e) {
  //  this.validate();
  //},

  //onFocus(e) {
  //  this.setState({error: false});
  //  //e.stopPropagation();
  //},

  //validationState() {
  //  let length = this.state.value.length;
  //  if (length >= this.props.minLength)  {
  //    return "success";
  //  }
  //  else {
  //    return "error";
  //  }
  //},

  //validate() {
  //  console.log("validate invoked!");
  //  var value = this.refs.input.getValue();
  //  var error;
  //  if (this.props.required && !value)
  //      error = "required";
  //  else if (this.props.oneOf && !(value in this.props.oneOf))
  //      error = "oneOf";
  //  else if (this.props.minLength && value.length < this.props.minLength)
  //      error = "minLength";
  //  this.setState({error: error});
  //},

  //onChange() {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    //console.debug("DemoInput.onChange");
    //console.debug("value:", this.refs.input.getValue());
    //this.setState({
    //  value: this.refs.input.getValue()
    //});
    //console.log(this);
    //console.log(this.propTypes);
    //console.log(this.refs.input.getValue());
  //},

  render() {
    //let value = this.props.valueLink.value;
    //let onChange = function(evt) {
    //  this.props.valueLink.requestChange(evt.target.value);
    //};
    let form = this.props.form;
    console.log(">>>", this.props.ref);
    return (
      <Input
        type="text"
        placeholder="Enter text"
        label="Working example with validation"
        name={this.props.ref}
        test="test"
        data-test="test"
        valueLink={this.props.valueLink}
       />
    );
    // hasFeedback
    //help={form.getValidationMessages(this.props.ref).map(form.renderHelpText)}
    //  valueLink={this.linkState("value")}      onChange={this.handleChange}     bsStyle={this.state.error ? "error": "info"}
    //groupClassName="group-class"
    //wrapperClassName="wrapper-class"
    //labelClassName="label-class"
  }
});

module.exports = React.createClass({
  mixins: [Router.State, Router.navigation, ValidationMixin, React.addons.LinkedStateMixin],

  displayName: "RobotAdd",

  //propTypes: {
  //  models: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  //},

  autoLabel: true,

  validatorTypes() {
    return {
      serialNumber: Joi.number().integer().min(7).max(7).required(),
      assemblyDate: Joi.date().max("now").required(),
      manufacturer: Joi.string().required(),
    };
  },

  getInitialState() {
    return {
      errors: undefined,
      serialNumber: undefined,
      assemblyDate: undefined,
      manufacturer: undefined,
    };
  },

  //onAdd(event) {
  //  console.debug("RobotsAdd.onAdd");
  //  event.preventDefault();
    // TODO: what data pass???
    /*let robot = {
      id: Helpers.maxId(this.props.models) + 1,
      fullname: Faker.name.findName(),
    };*/
    //Actions.addRandom();
  //},

  render() {
    return (
      <DocumentTitle title={"Add robot"}>
        <div>
          <div id="page-actions">
            <div className="container">
              <div className="pull-left">
                <Link to="robots-index" className="btn btn-sm btn-gray-lighter" title="Back to list">
                  <span className="fa fa-arrow-left"></span>
                  <span className="hidden-xs margin-left-sm">Back to list</span>
                </Link>
              </div>
            </div>
          </div>
          <section className="container">
            <h1>Robot Add</h1>
            <p>This form and all behavior is defined by the form view in <code>components/robots-add.js</code>.</p>
            <p>The same form-view is used for both adding and creating new robots.</p>
              <div className="buttons">
                <form onSubmit={this.onSubmit}>
                  {/*<fieldset>*/}
                      <Input type="text" ref="serialNumber" label="Serial Number" placeholder="" valueLink={this.linkState("serialNumber")}/>
                      <Input type="text" ref="assemblyDate" label="Assembly Date" placeholder="" valueLink={this.linkState("assemblyDate")}/>
                      <Input type="text" ref="manufacturer" label="Manufacturer" placeholder="" valueLink={this.linkState("manufacturer")}/>

                  {/*<div className={this.getClasses("email")}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" valueLink={this.linkState("email")} className="form-control" placeholder="Email" />
                        {this.getValidationMessages("email").map(this.renderHelpText)}
                      </div>
                      <div className={this.getClasses("username")}>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" valueLink={this.linkState("username")} className="form-control" placeholder="Username" />
                        {this.getValidationMessages("username").map(this.renderHelpText)}
                      </div>
                      <div className={this.getClasses("password")}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" valueLink={this.linkState("password")} className="form-control" placeholder="Password" />
                        {this.getValidationMessages("password").map(this.renderHelpText)}
                      </div>
                      <div className={this.getClasses("verifyPassword")}>
                        <label htmlFor="verifyPassword">Verify Password</label>
                        <input type="password" id="verifyPassword" valueLink={this.linkState("verifyPassword")} className="form-control" placeholder="Verify Password" />
                        {this.getValidationMessages("verifyPassword").map(this.renderHelpText)}
                      </div>
                      <div className="text-center form-group">
                        <button type="submit" className="btn btn-large btn-primary">Sign up</button>
                      </div>*/}
                    {/*</fieldset>*/}
                    <Button type="submit">Submit</Button>
                  </form>
              </div>
          </section>
        </div>
      </DocumentTitle>
    );
  },

  renderHelpText: function(message) {
    return (
      <span className="help-block">{message}</span>
    );
  },

  //getClasses: function(field) {
  //  return React.addons.classSet({
  //    "form-group": true,
  //    "has-error": !this.isValid(field)
  //  });
  //},

  onSubmit(event) {
    event.preventDefault();
    this.handleSubmit(event);
  },

  handleSubmit: LD.debounce(function() {
    console.debug("RobotAdd.onSubmit");
    console.log("BEFORE VALIDATION");
    console.debug("RobotAdd.state:", this.state);
    console.debug("RobotAdd.isValid():", this.isValid());
    console.debug("RobotAdd.getValidationMessages():", this.getValidationMessages());
    console.debug("RobotAdd.getValidationMessages('serialNumber'):", this.getValidationMessages("serialNumber"));

    console.log("AFTER VALIDATION");
    this.validate();
    console.debug("RobotAdd.state:", this.state);
    console.debug("RobotAdd.isValid():", this.isValid());
    console.debug("RobotAdd.getValidationMessages():", this.getValidationMessages());
    console.debug("RobotAdd.getValidationMessages('serialNumber'):", this.getValidationMessages("serialNumber"));

    //if (this.isValid()) {
    //  UserAction.signup(this.state);
    //}
  }, 500),
});


