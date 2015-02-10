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
        <div>
          <div id="page-actions">
            <div className="container">
              <div className="pull-right">
                <Link to="robots-add" className="btn btn-sm btn-green" title="Add">
                  <span className="fa fa-plus"></span>
                </Link>
              </div>
            </div>
          </div>
          <section className="container">
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
            <div className="row">
              {this.state.models.map(robot => {
                return <div className="col-sm-6 col-md-3">
                  <div className="panel panel-default" key={robot.id}>
                    <div className="panel-heading">
                      <h4 className="panel-title"><Link to="robots-detail" params={{id: robot.id}}>{robot.name}</Link></h4>
                    </div>
                    <div className="panel-body text-center nopadding">
                      <Link to="robots-detail" params={{id: robot.id}}>
                        <img src={'http://robohash.org/' + robot.id + '?size=200x200'} width="200px" height="200px"/>
                      </Link>
                    </div>
                    <div className="panel-footer">
                      <div className="clearfix">
                        <div className="btn-group btn-group-sm pull-right">
                          <Link to="robots-edit" params={{id: robot.id}} className="btn btn-blue" title="Edit">
                            <span className="fa fa-edit"></span>
                          </Link>
                          <a className="btn btn-red" title="Delete" onClick={this.onRemove}>
                            <span className="fa fa-times"></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              })}
            </div>

          {/*<p>Try it by clicking the buttons</p>
            <div className="buttons btn-group">
              {/*<button class="btn btn-default" data-hook="reset">Reset Collection</button>
               <button class="btn btn-default" data-hook="remove">Remove Collection</button>
               <button class="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
               <button class="btn btn-default" data-hook="fetch">Refetch Collection</button>
               <button class="btn btn-default" data-hook="add">Add Random</button>}
            </div>
            */}
          </section>
        </div>
      </DocumentTitle>
    );
  }
});

export default Index;
