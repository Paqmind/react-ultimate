// IMPORTS =========================================================================================
let debounce = require("lodash.debounce");
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let Reflux = require("reflux");
let DocumentTitle = require("react-document-title");
let Alert = require("react-bootstrap/Alert");
let Input = require("react-bootstrap/Input");
let Button = require("react-bootstrap/Button");
let ValidationMixin = require("react-validation-mixin");
let Joi = require("joi");
let Loading = require("../../common/components/loading");
let Actions = require("../actions");
let Store = require("../store");

// EXPORTS =========================================================================================
let Edit = React.createClass({
  mixins: [
    Router.State,
    Router.Navigation,
    React.addons.LinkedStateMixin,
    ValidationMixin,
    Reflux.connectFilter(Store, "model", function(models) {
      return models.filter(function(model) {
        return model.id === this.getParams().id;
      }.bind(this))[0];
    })
  ],

  componentDidMount() {
    Actions.entryIndex();
    //Actions.entryEdit(this.getParams().id);
  },

  validatorTypes() {
    return {
      id: Joi.string().required(), // TODO uuid
      assemblyDate: Joi.date().max("now").required(),
      manufacturer: Joi.string().required(),
    };
  },

  getInitialState() {
    return {
      id: undefined,
      assemblyDate: undefined,
      manufacturer: undefined,
    };
  },

  render() {
    if (this.state.model) {
      let model = this.state.model;
      console.log(model);
      return (
        <DocumentTitle title={"Edit " + model.name}>
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
                  <Link to="robot-detail" params={{id: model.id}} className="btn btn-blue" title="Detail">
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
                <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
              </div>
              <h1>{model.name}</h1>
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <div className={this.getClasses("id")}>
                    <label htmlFor="id">Serial Number</label>
                    <input type="id" id="id" valueLink={this.linkState("id")} onBlur={this.handleUnfocusFor("id")} className="form-control" placeholder="Serial Number"/>
                    {this.getValidationMessages("id").map(this.renderHelpText)}
                  </div>

                  <div className={this.getClasses("assemblyDate")}>
                    <label htmlFor="assemblyDate">Assembly Date</label>
                    <input type="assemblyDate" id="assemblyDate" valueLink={this.linkState("assemblyDate")} onBlur={this.handleUnfocusFor("assemblyDate")} className="form-control" placeholder="Assembly Date" />
                    {this.getValidationMessages("assemblyDate").map(this.renderHelpText)}
                  </div>

                  <div className={this.getClasses("manufacturer")}>
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <input type="manufacturer" id="manufacturer" valueLink={this.linkState("manufacturer")} onBlur={this.handleUnfocusFor("password")} className="form-control" placeholder="Manufacturer" />
                    {this.getValidationMessages("manufacturer").map(this.renderHelpText)}
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
    } else {
      console.log("!!!");
      return <Loading/>;
    }
  },

  renderHelpText: function(message) {
    return (
      <span className="help-block">{message}</span>
    );
  },

  getClasses: function(key) {
    return React.addons.classSet({
      'form-group': true,
      'has-error': !this.isValid(key)
    });
  }
});

export default Edit;
