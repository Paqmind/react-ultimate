// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link} = ReactRouter;
let DocumentTitle = require("react-document-title");
let {toArray} = require("frontend/common/helpers");
let Loading = require("frontend/common/components/loading");
let Error = require("frontend/common/components/error");
let State = require("frontend/state");
let RobotItem = require("frontend/robot/components/item");

// COMPONENTS ======================================================================================
export default React.createClass({
  mixins: [State.mixin],

  cursors: {
    robots: ["robots"],
  },

  render() {
    let {models, loading, loadError} = this.state.cursors.robots;
    models = toArray(models);

    if (loadError) {
      return <Error title="Load error" description={loadError.status}/>;
    } else {
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
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
            </section>
            {loading ? <Loading/> : ""}
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