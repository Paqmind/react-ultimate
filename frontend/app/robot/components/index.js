// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link} = ReactRouter;
let Reflux = require("reflux");
let DocumentTitle = require("react-document-title");
let RobotActions = require("frontend/robot/actions");
let RobotStore = require("frontend/robot/stores");
let RobotItem = require("frontend/robot/components/item");

// EXPORTS =========================================================================================
let Index = React.createClass({
  mixins: [Reflux.connect(RobotStore, "models")],

  componentDidMount() {
    RobotActions.loadMany();
  },

  render() {
    return (
      <DocumentTitle title="Robots">
        <div>
          <div id="page-actions">
            <div className="container">
              <div className="pull-right">
                <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
                  <span className="fa fa-plus"></span>
                </Link>
              </div>
            </div>
          </div>
          <section className="container">
            <h1>Robots</h1>
            <div className="row">
              {this.state.models.toArray().map(model => <RobotItem model={model} key={model.get("id")}/>)}
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
});

export default Index;

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/
