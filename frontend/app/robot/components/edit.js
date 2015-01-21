// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let Helpers = require("../../common/helpers");
let Actions = require("../actions");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

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
    return (
      <DocumentTitle title={"Edit robot " + this.getParams().id}>
        <section>
          <h2>Robot Edit {this.getParams().id}</h2>
          <p>This form and all behavior is defined by the form view in <code>components/robots-edit.js</code>.</p>
          <p>The same form-view is used for both editing and creating new robots.</p>
          <form>
            <fieldset data-hook="field-container"></fieldset>
            <div className="buttons">
              <button className="btn" data-hook="reset" type="submit">Submit</button>
            </div>
          </form>
        </section>
      </DocumentTitle>
    );
  }
});


