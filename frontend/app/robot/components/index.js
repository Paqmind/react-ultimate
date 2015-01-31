// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let Reflux = require("reflux");
let DocumentTitle = require("react-document-title");
let Store = require("../store");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Reflux.connect(Store)],

  render() {
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

          <h1>Robots</h1>
          {this.state.models.map(robot => {
            return <div className="media" key={robot.id}>
              <div className="media-left">
                <Link to="robots-detail" params={{id: robot.id}}>
                  <img src={"http://robohash.org/" + robot.fullname + "?size=40x40"} width="40" height="40"/>
                </Link>
              </div>
              <div className="media-body">
                <h4 className="media-heading"><Link to="robots-detail" params={{id: robot.id}}>{robot.fullname}</Link></h4>
                ...
              </div>
            </div>
          })}
          <br/>

          <p>Try it by clicking the buttons</p>
          <div className="buttons btn-group">
            {/*<button class="btn btn-default" data-hook="reset">Reset Collection</button>
             <button class="btn btn-default" data-hook="remove">Remove Collection</button>
             <button class="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
             <button class="btn btn-default" data-hook="fetch">Refetch Collection</button>
             <button class="btn btn-default" data-hook="add">Add Random</button>*/}
          </div>
          <Link to="robots-add" className="btn btn-primary">Add Robot</Link>

          <RouteHandler models={this.state.models}/>
        </section>
      </DocumentTitle>
    );
  }
});
