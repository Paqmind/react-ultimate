// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
//let router = require("../router");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  componentDidMount() {
    console.debug("RobotsDetail.componentDidMount");
  },

  onEdit() {
    //require('../router').transitionTo('robots-edit', {id: this.getParams().id});
    this.transitionTo('robots-edit', {id: this.getParams().id});
    //router.transitionTo('robots-edit', {id: this.getParams().id});
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
            {/*<Link className="btn" to="robots-edit" params={{id: this.getParams().id}}>Edit</Link>*/}
            <a className="btn" href="" to="robots-edit" onClick={this.onEdit}>Edit</a>
            <button className="btn" onClick={this.onRemove}>Remove</button>
          </div>
        </section>
      </DocumentTitle>
    );
  }
});
