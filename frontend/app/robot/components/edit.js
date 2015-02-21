// IMPORTS =========================================================================================
let isObject = require("lodash.isobject");
let isString = require("lodash.isstring");
let React = require("react");
let Addons = require("react/addons").addons;
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let Reflux = require("reflux");
let DocumentTitle = require("react-document-title");
let {Alert, Input, Button} = require("react-bootstrap");
let ValidationMixin = require("react-validation-mixin");
let Validators = require("../../../../shared/robot/validators");
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
      model: Validators.model
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
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail thumbnail-robot">
                    <img src={"http://robohash.org/" + model.get("id") + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{model.get("name")}</h1>
                  <form onSubmit={this.handleSubmit}>
                    <fieldset>
                      <TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
                      <TextInput label="Serial Number" placeholder="Serial Number" id="model.id" form={this}/>
                      <TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
                      <TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
                    </fieldset>
                    <div>
                      <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
                      &nbsp;
                      <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
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
