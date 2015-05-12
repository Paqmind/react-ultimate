// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import Component from "frontend/component";
import {Error, Loading, NotFound, PerPage, SortBy, FilterBy, ExternalPagination, InternalPagination, Link} from "frontend/components";
import robotActions from "frontend/robot/actions";
import RobotItem from "frontend/robot/components/item";
import router from "frontend/router";

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
            <div id="actions">
              <div className="container">
                <div className="pull-left">
                  <PerPage current={limit} options={[3, 5, 10]}/>
                </div>
                <div className="pull-left">
                  <SortBy current={this.props.robots.sorts[0]} options={["+name", "-name"]}/>
                </div>
                <div className="pull-left">
                  <FilterBy current={this.props.robots.filters.manufacturer} options={[undefined, "Russia", "USA"]}/>
                </div>
                <div className="pull-right">
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
              <ExternalPagination endpoint="robot-index" total={total} offset={offset} limit={limit}/>
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
