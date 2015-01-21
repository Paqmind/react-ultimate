// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let Helpers = require("../helpers");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.Navigation],

  propTypes: {
    robots: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },

  componentDidMount() {
    console.debug("RobotsDetail.componentDidMount");
  },

  componentWillUnmount() {
    console.debug("RobotsDetail.componentWillUnmount");
  },

  onRemove() {
    console.debug("RobotsDetail.onRemove");
  },

  render() {
    console.debug("RobotsDetail.render", this.getParams());
    console.log(this.props.models);
    let model = Helpers.getModel(this.props.models, this.getParams().id);
    return (
      <DocumentTitle title={"Robot " + model.fullname}>
        <section>
          <h2>{model.fullname}</h2>
          <img src="" alt="" width="80"  height="80"/>
          <div className="buttons">
            <Link className="btn" to="robots-edit" params={{id: this.getParams().id}}>Edit</Link>
            <button className="btn" onClick={this.onRemove}>Remove</button>
          </div>
        </section>
      </DocumentTitle>
    );
  },
});
