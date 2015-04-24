// IMPORTS =========================================================================================
let {branch} = require("baobab-react/decorators");
let React = require("react");
let {Link} = require("react-router");
let DocumentTitle = require("react-document-title");

let {toArray} = require("frontend/common/helpers");
let Component = require("frontend/common/component");
let {Error, Loading, NotFound, Pagination} = require("frontend/common/components");
let robotActions = require("frontend/robot/actions");
let RobotItem = require("frontend/robot/components/item");
let state = require("frontend/state");

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    url: "url",
    robots: "robots",
  },

  facets: {
    models: "currentRobots",
  }
})
export default class RobotIndex extends Component {
  static loadPage = robotActions.loadPage;

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  render() {
    let page = this.props.url.page;
    let {total, loading, loadError, perpage} = this.props.robots;
    let models = this.props.models;

    if (loadError) {
      return <Error loadError={loadError}/>;
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
                <Pagination endpoint="robot-index" total={total} page={page} perpage={perpage}/>
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }
}

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/
