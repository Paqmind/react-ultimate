// IMPORTS =========================================================================================
let React = require("react");
let ReactRouter = require("react-router");
let {Link} = ReactRouter;
let DocumentTitle = require("react-document-title");
let Loading = require("frontend/common/components/loading");
let NotFound = require("frontend/common/components/notfound");
let State = require("frontend/state");
let removeRobot = require("frontend/robot/actions/remove");

// COMPONENTS ======================================================================================
export default React.createClass({
  mixins: [ReactRouter.State, State.mixin],

  cursors() {
    return {
      robots: ["robots"],
      model: ["robots", "models", this.getParams().id],
    };
  },

  render() {
    let {models, loaded, loadError} = this.state.cursors.robots;
    let model = this.state.cursors.model;

    if (!loaded) {
      return <Loading/>;
    } else if (loadError) {
      return <NotFound/>;
    } else {
      return (
        <DocumentTitle title={"Detail " + model.name}>
          <div>
            <div id="page-actions">
              <div className="container">
                <div className="btn-group btn-group-sm pull-left">
                  <Link to="robot-index" className="btn btn-gray-light" title="Back to list">
                    <span className="fa fa-arrow-left"></span>
                    <span className="hidden-xs margin-left-sm">Back to list</span>
                  </Link>
                </div>
                <div className="btn-group btn-group-sm pull-right">
                  <Link to="robot-edit" params={{id: model.id}} className="btn btn-orange" title="Edit">
                    <span className="fa fa-edit"></span>
                  </Link>
                  <a className="btn btn-red" title="Remove" onClick={removeRobot.bind(this, model.id)}>
                    <span className="fa fa-times"></span>
                  </a>
                </div>
              </div>
            </div>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail thumbnail-robot">
                    <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{model.name}</h1>
                  <dl>
                    <dt>Serial Number</dt>
                    <dd>{model.id}</dd>
                    <dt>Assembly Date</dt>
                    <dd>{model.assemblyDate}</dd>
                    <dt>Manufacturer</dt>
                    <dd>{model.manufacturer}</dd>
                  </dl>
                </div>
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    }
  },
});
