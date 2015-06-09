// IMPORTS =========================================================================================
import {map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import {statics} from "frontend/helpers/react";
import state from "frontend/state";
import {indexRouter} from "frontend/router";
import modelActions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent} from "frontend/components/component";
import Pagination from "frontend/components/pagination";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import {Error, Loading, NotFound} from "frontend/components/page";
import RobotItem from "frontend/components/item/robot";

// COMPONENTS ======================================================================================
@statics({
  loadData: modelActions.establishIndex,
})
@branch({
  cursors: {
    robots: "robots",
  },
  facets: {
    currentRobots: "currentRobots",
  }
})
export default class RobotIndex extends DeepComponent {
  render() {
    let {loading, loadError, filters, sorts, offset, limit, total} = this.props.robots;
    let models = this.props.currentRobots;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      let pagination = <Pagination
        makeHref={_offset => this.showOffset(_offset)}
        onClick={_offset => this.setOffset(_offset)}
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
    indexRouter.transitionTo("robot-index", {offset});
  }

  showOffset(offset) {
    return indexRouter.makePath("robot-index", {offset});
  }
}

class RobotIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.robots;

    let perPage = <PerPage
      options={[5, 10, 12]} current={limit}
      makeHref={_limit => this.showLimit(_limit)}
      onClick={_limit => this.setLimit(_limit)}
    />;
    let sortBy = <SortBy
      options={["+name", "-name"]} current={sorts && sorts[0]}
      makeHref={_sorts => this.showSorts(_sorts)}
      onClick={_sorts => this.setSorts(_sorts)}
    />;
    let filterBy = <FilterBy field="manufacturer"
      options={[undefined, "China", "Russia", "USA"]} current={filters && filters.manufacturer}
      makeHref={_filters => this.showFilters(_filters)}
      onClick={_filters => this.setFilters(_filters)}
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
  }

  setSorts(sorts) {
    indexRouter.transitionTo("robot-index", {sorts});
  }

  setLimit(limit) {
    indexRouter.transitionTo("robot-index", {limit});
  }

  showFilters(filters) {
    return indexRouter.makePath("robot-index", {filters});
  }

  showSorts(sorts) {
    return indexRouter.makePath("robot-index", {sorts});
  }

  showLimit(limit) {
    return indexRouter.makePath("robot-index", {limit});
  }
}
