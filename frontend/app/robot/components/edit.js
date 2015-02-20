// IMPORTS =========================================================================================
let isObject = require("lodash.isobject");
let isString = require("lodash.isstring");
let debounce = require("lodash.debounce");
let React = require("react");
let Addons = require("react/addons").addons;
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let Reflux = require("reflux");
let DocumentTitle = require("react-document-title");
let {Alert, Input, Button} = require("react-bootstrap");
let ValidationMixin = require("react-validation-mixin");
let Validators = require("../../../../shared/robot/validators");
let LensedStateMixin = require("../../common/mixins/LensedStateMixin");
let TextInput = require("../../common/elements/TextInput");
let Loading = require("../../common/components/loading");
let NotFound = require("../../common/components/not-found");
let Actions = require("../actions");
let Store = require("../store");

// EXPORTS =========================================================================================
let Edit = React.createClass({
  mixins: [
    Router.State,
    Router.Navigation,
    ValidationMixin,
    Reflux.connectFilter(Store, "model", function(models) {
      let id = this.getParams().id;
      return models.get(id);
    })
  ],

  componentDidMount() {
    Actions.entryEdit(this.getParams().id);
  },

  validatorTypes() {
    return {
      model: Validators
    };
  },

  validatorData() {
    console.log("Edit.validatorData!", this.state);
    return {
      model: this.state.model.toJS()
    };
  },

  getInitialState() {
    return {
      model: undefined
    };
  },

  render() {
    if (isObject(this.state.model)) {
      let model = this.state.model;
      return (
        <DocumentTitle title={"Edit " + model.get("name")}>
          <div>
            <div id="page-actions">
              <div className="container">
                <div className="btn-group btn-group-sm pull-left">
                  <Link to="robot-index" className="btn btn-gray-light" title="Back to list">
                    <span className="fa fa-arrow-left"></span>
                    <span className="hidden-xs margin-left-sm">Back to list</span>
                  </Link>
                </div>
                <div className="btn-group btn-group-sm pull-right">
                  <Link to="robot-detail" params={{id: model.get("id")}} className="btn btn-blue" title="Detail">
                    <span className="fa fa-eye"></span>
                  </Link>
                  <a className="btn btn-red" title="Delete" onClick={this.onRemove}>
                    <span className="fa fa-times"></span>
                  </a>
                </div>
              </div>
            </div>
            <section className="container">
              <div className="thumbnail pull-left margin-top nopadding">
                <img src={"http://robohash.org/" + model.get("id") + "?size=200x200"} width="200px" height="200px"/>
              </div>
              <h1>{model.get("name")}</h1>
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <div className={this.getClasses("model.name")}>
                    <label htmlFor="name">Name</label>
                    <input type="text"
                      id="name"
                      valueLink={this.linkState("model.name")}
                      onBlur={this.handleUnfocusFor("model.name")}
                      className="form-control"
                      placeholder="Name"/>
                    {this.getValidationMessages("model.name").map(this.renderHelpText)}
                  </div>

                  <div className={this.getClasses("model.id")}>
                    <label htmlFor="id">Serial Number</label>
                    <input type="text"
                      id="id"
                      valueLink={this.linkState("model.id")}
                      onBlur={this.handleUnfocusFor("model.id")}
                      className="form-control"
                      placeholder="Serial Number"/>
                    {this.getValidationMessages("model.id").map(this.renderHelpText)}
                  </div>

                  <div className={this.getClasses("model.assemblyDate")}>
                    <label htmlFor="assemblyDate">Assembly Date</label>
                    <input type="text"
                      id="assemblyDate"
                      valueLink={this.linkState("model.assemblyDate")}
                      onBlur={this.handleUnfocusFor("model.assemblyDate")}
                      className="form-control"
                      placeholder="Assembly Date"/>
                    {this.getValidationMessages("model.assemblyDate").map(this.renderHelpText)}
                  </div>

                  <div className={this.getClasses("model.manufacturer")}>
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <input type="text"
                      id="manufacturer"
                      valueLink={this.linkState("model.manufacturer")}
                      onBlur={this.handleUnfocusFor("model.manufacturer")}
                      className="form-control"
                      placeholder="Manufacturer"/>
                    {this.getValidationMessages("model.manufacturer").map(this.renderHelpText)}
                  </div>
                </fieldset>

                <div className="buttons">
                  <button className="btn" type="button" onClick={this.handleReset}>Reset</button>
                  <button className="btn" type="submit">Submit</button>
                </div>
              </form>
            </section>
          </div>
        </DocumentTitle>
      );
    } else if (isString(this.state.model)) {
      return <NotFound/>;
    }
    else {
      return <Loading/>;
    }
  },

  renderHelpText: function(message) {
    return (
      <span className="help-block">{message}</span>
    );
  },

  getClasses: function(key) {
    return Addons.classSet({
      'form-group': true,
      'has-error': !this.isValid(key)
    });
  },

  // Dirty hacks with setTimeout until valid callback architecture (mixin 4.0 branch) --------------
  handleSubmit(event) {
    console.log("handleSubmit");
    event.preventDefault();
    this.validate();
    setTimeout(() => {
      console.log(this.state.errors);
      console.log(this.isValid());
      if (this.isValid()) {
        Actions.submitEdit(this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    }, 500);
  },

  //handleReset(event) {
  //  event.preventDefault();
  //  this.setState(this.getInitialState());
  //  setTimeout(function() {
  //    alert("xxx")
  //  }, 200);
  //},
  // -----------------------------------------------------------------------------------------------
});

export default Edit;
