// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let router = require("../router");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  componentDidMount() {
    console.debug("RobotsEdit.componentDidMount");
  },

  onDetail() {
    console.debug("RobotsEdit.onEdit");
    this.transitionTo('/xxx', {id: this.getParams().id});
  },

  onRemove() {
    console.debug("RobotsEdit.onRemove");
  },

  render() {
    console.debug("RobotsEdit.render", this.getParams());
    return (
      <DocumentTitle title={"Edit robot " + this.getParams().id}>
        <section>
          <h2>Robot Edit {this.getParams().id}</h2>
          <p>This form and all behavior is defined by the form view in <code>client/forms/person.js</code>.</p>
          <p>The same form-view is used for both editing and creating new users.</p>
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


