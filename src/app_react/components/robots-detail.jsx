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
    console.debug("RobotsDetail.componentDidMount");
  },

  onEdit() {
    router.transitionTo('robots-edit', {id: this.getParams().id});
  },

  onRemove() {
    console.debug("RobotsDetail.onRemove");
    console.debug("RobotsDetail.onRemove");
  },

  render() {
    console.debug("RobotsDetail.render", this.getParams());
    return (
      <DocumentTitle title={"Robot " + this.getParams().id}>
        <section>
          <h2>Robot Detail {this.getParams().id}</h2>
          <img src="" alt="" width="80"  height="80"/>
          <div className="buttons">
            <a className="btn" href="" onClick={this.onEdit}>Edit</a>
            <button className="btn" onClick={this.onRemove}>Remove</button>
          </div>
        </section>
      </DocumentTitle>
    );
  }
});
