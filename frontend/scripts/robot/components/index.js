// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";

import {toArray} from "frontend/common/helpers";
import state from "frontend/common/state";
import Component from "frontend/common/component";
import {Error, Loading, NotFound, ExternalPagination, InternalPagination} from "frontend/common/components";
import robotActions from "frontend/robot/actions";
import RobotItem from "frontend/robot/components/item";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "robots",
  },

  facets: {
    currentRobots: "currentRobots",
  }
})
export default class RobotIndex extends Component {
  static loadData = robotActions.establishIndex;
  
  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  render() {
    let {total, loading, loadError, offset, limit} = this.props.robots;
    let models = this.props.currentRobots;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title="Robots">
          <div>
            <div id="page-actions">
              <div className="container">
                <div className="pull-right">
                  <div className="btn-group">
                    <button type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => robotActions.setLimit(3)}>
                      Perpage 3
                    </button>
                    <button type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => robotActions.setLimit(5)}>
                      Perpage 5
                    </button>
                    <button type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => robotActions.setLimit(10)}>
                      Perpage 10
                    </button>
                  </div>
                  <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
                    <span className="fa fa-plus"></span>
                  </Link>
                </div>
              </div>
            </div>
            <section className="container">
              <h1>Robots</h1>
              <ExternalPagination endpoint="robot-index" total={total} offset={offset} limit={limit}/>
              <div className="row">
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
              <InternalPagination onClick={offset => robotActions.setOffset(offset)} total={total} offset={offset} limit={limit}/>
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
