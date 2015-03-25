// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link} = ReactRouter;
let DocumentTitle = require("react-document-title");
let {toArray} = require("frontend/common/helpers");
let Loading = require("frontend/common/components/loading");
let NotFound = require("frontend/common/components/not-found");
let RobotActions = require("frontend/robot/actions");
let RobotItem = require("frontend/robot/components/item");
let State = require("frontend/state");

// COMPONENTS ======================================================================================
export default React.createClass({
  mixins: [State.mixin],

  cursors: {
    robots: ["robots"],
  },

  //componentDidMount() {
    //console.log("RobotIndex.componentDidMount");
    //RobotActions.loadMany();
  //},

  render() {
    let {models, loaded, loadError} = this.state.cursors.robots;
    models = toArray(models);

    if (!loaded) {
      return <Loading/>;
    } else if (loadError) {
      return <NotFound/>;
    } else {
      return (
        <DocumentTitle title="Robots">
          <div>
            <div id="page-actions">
              <div className="container">
                <div className="pull-right">
                  ... link to Robot-Add
                </div>
              </div>
            </div>
            <section className="container">
              <h1>Robots</h1>
              <div className="row">
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    }
  },
});

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/

/*
<Link to="robot-add" className="btn btn-sm btn-green" title="Add">
  <span className="fa fa-plus"></span>
</Link>*/
