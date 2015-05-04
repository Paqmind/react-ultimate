// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import Component from "frontend/component";
import {Error, Loading, NotFound, ExternalPagination, InternalPagination, Link} from "frontend/components";
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
                  <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
                    <span className="fa fa-plus"></span>
                  </Link>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <Link to="robot-index"
                      withQuery={{page: {limit: 3}}}
                      className="btn btn-sm btn-secondary">
                      Perpage 3
                    </Link>
                    <Link to="robot-index"
                      withQuery={{page: {limit: 5}}}
                      className="btn btn-sm btn-secondary">
                      Perpage 5
                    </Link>
                    <Link to="robot-index"
                      withQuery={{page: {limit: 10}}}
                      className="btn btn-sm btn-secondary">
                      Perpage 10
                    </Link>
                  </div>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <Link to="robot-index"
                      withQuery={{sort: "+name"}}
                      className="btn btn-sm btn-secondary">
                      SortBy +name
                    </Link>
                    <Link to="robot-index"
                      withQuery={{sort: "-name"}}
                      className="btn btn-sm btn-secondary">
                      SortBy -name
                    </Link>
                  </div>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <Link to="robot-index"
                      withQuery={{filter: "undefined", reset: true}}
                      className="btn btn-sm btn-secondary">
                      Reset filters
                    </Link>
                    <Link to="robot-index"
                      withQuery={{filter: {manufacturer: "Russia"}}}
                      className="btn btn-sm btn-secondary">
                      FilterBy manufacturer=Russia
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <section className="container">
              <h1>Robots</h1>
              <ExternalPagination endpoint="robot-index" total={total} offset={offset} limit={limit}/>
              <div className="row">
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
              <ExternalPagination endpoint="robot-index" total={total} offset={offset} limit={limit}/>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }
}