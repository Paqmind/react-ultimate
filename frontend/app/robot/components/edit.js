// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let Helpers = require("../../common/helpers");
let Actions = require("../actions");
let Reflux = require("reflux");
let Store = require("../store");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation, Reflux.connect(Store)],

  propTypes: {
    models: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },

  componentDidMount() {
    console.debug("RobotsEdit.componentDidMount");
  },

  componentWillUnmount() {
    console.debug("RobotsEdit.componentWillUnmount");
  },

  render() {
    console.debug("RobotsEdit.render", this.getParams());
    let model = Helpers.getModel(this.state.models, this.getParams().id);
    return (
      <DocumentTitle title={"Edit robot " + model.fullname + " (#" + model.id + ")"}>
        <div>
          <div id="page-actions">
            <div className="container">
              <div className="pull-left">
                <Link to="robots-index" className="btn btn-sm btn-gray-lighter" title="Back to list">
                  <span className="fa fa-arrow-left"></span>
                  <span className="hidden-xs margin-left-sm">Back to list</span>
                </Link>
              </div>
              <div className="btn-group btn-group-sm pull-right">
                <Link to="robots-detail" params={{id: model.id}} className="btn btn-blue" title="Detail">
                  <span className="fa fa-eye"></span>
                </Link>
                <a className="btn btn-red" title="Delete" onClick={this.onRemove}><span className="fa fa-times"></span></a>
              </div>
            </div>
          </div>
          <section className="container">
            <h1>Robot Edit {model.fullname} ({"#" + model.id})</h1>
            <p>This form and all behavior is defined by the form view in <code>components/robots-edit.js</code>.</p>
            <p>The same form-view is used for both editing and creating new robots.</p>
            <form>
              <fieldset data-hook="field-container"></fieldset>
              <div className="buttons">
                <button className="btn" data-hook="reset" type="submit">Submit</button>
              </div>
            </form>
          </section>
        </div>
      </DocumentTitle>
    );
  }
});


