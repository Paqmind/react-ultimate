// IMPORTS =========================================================================================
import {map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import * as modelActions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/simple";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import {Error, Loading, NotFound} from "frontend/components/page";
import RobotItem from "./robot-item";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "robots",
  },

  facets: {
    currentRobots: "currentRobots",
  }
})
export default class RobotIndex extends DeepComponent {
  static loadData = modelActions.establishIndex;

  render() {
    let {total, loading, loadError, filters, sorts, offset, limit} = this.props.robots;
    let models = this.props.currentRobots;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      let pagination = <Pagination
        makeHref={offset => this.showOffset(offset)}
        onClick={offset => this.setOffset(offset)}
        total={total} offset={offset} limit={limit}
      />;
      return (
        <DocumentTitle title="Robots">
          <div>
            <RobotIndexActions {...this.props}/>
            <section className="container">
              <h1>Robots</h1>
              {pagination}
              <div className="row">
                {map(model => <RobotItem model={model} key={model.id}/>, models)}
              </div>
              {pagination}
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }

  setOffset(offset) {
    indexRouter.transitionTo("robot-index", {page: {offset}});
    modelActions.loadIndex();
  }

  showOffset(offset) {
    return indexRouter.makePath("robot-index", {page: {offset}});
  }
}

class RobotIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.robots;

    let perPage = <PerPage
      options={[3, 5, 10]} current={limit}
      makeHref={filters => this.showLimit(limit)}
      onClick={limit => this.setLimit(limit)}
    />;
    let sortBy = <SortBy
      options={["+name", "-name"]} current={sorts[0]}
      makeHref={filters => this.showSorts(sorts)}
      onClick={sorts => this.setSorts(sorts)}
    />;
    let filterBy = <FilterBy field="manufacturer"
      options={[undefined, "China", "Russia", "USA"]} current={filters.manufacturer}
      makeHref={filters => this.showFilters(filters)}
      onClick={filters => this.setFilters(filters)}
    />;

    return (
      <div id="actions">
        <div className="container">
          <div className="pull-left">
            {perPage}
          </div>
          <div className="pull-left">
            {sortBy}
          </div>
          <div className="pull-left">
            {filterBy}
          </div>
          <div className="pull-right">
            <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  setFilters(filters) {
    indexRouter.transitionTo("robot-index", {filters});
    modelActions.loadIndex();
  }

  setSorts(sorts) {
    indexRouter.transitionTo("robot-index", {sorts});
    modelActions.loadIndex();
  }

  setLimit(limit) {
    indexRouter.transitionTo("robot-index", {page: {limit}});
    modelActions.loadIndex();
  }

  showFilters(filters) {
    return indexRouter.makePath("robot-index", {filters});
  }

  showSorts(sorts) {
    return indexRouter.makePath("robot-index", {sorts});
  }

  showLimit(limit) {
    return indexRouter.makePath("robot-index", {page: {limit}});
  }
}