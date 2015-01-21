// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State],

  propTypes: {
    models: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },

  componentDidMount() {
    console.debug("RobotsIndex.componentDidMount");
  },

  componentWillUnmount() {
    console.debug("RobotsIndex.componentWillUnmount");
  },

  render() {
    console.debug("RobotsIndex.render", this.getParams());
    return (
      <DocumentTitle title="Robots">
        <section>
         {/*<h2>Collection demo</h2>

          <p>Intelligently rendering collections can be a bit tricky.</p>

          <p>
            <a href="https://github.com/ampersandjs/ampersand-view">ampersand-view's</a>
            <code>renderCollection()</code> method makes it simple.
          </p>

          <h3>Robots container</h3>
          <ul class="list-group" data-hook="robot-index"></ul>

          */}

          <p>Robots</p>
          <ul>
            {this.props.models.map(robot => {
              return <li key={robot.id}><Link to="robots-detail" params={{id: robot.id}}>{robot.fullname}</Link></li>;
            })}
          </ul>

          <p>Try it by clicking the buttons</p>

          <div className="buttons btn-group">
            {/*<button class="btn btn-default" data-hook="reset">Reset Collection</button>
             <button class="btn btn-default" data-hook="remove">Remove Collection</button>
             <button class="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
             <button class="btn btn-default" data-hook="fetch">Refetch Collection</button>
             <button class="btn btn-default" data-hook="add">Add Random</button>*/}
          </div>

          <Link to="robots-add">Add Robot</Link>

          <RouteHandler robots={this.props.models}/>

        </section>
      </DocumentTitle>
    );
  }
});
