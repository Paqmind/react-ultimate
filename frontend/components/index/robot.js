import {map} from "ramda";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {branch} from "baobab-react/decorators";
import {toArray} from "shared/helpers/common";
import api from "shared/api/robot";
import {statics} from "frontend/helpers/react";
import {recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import actions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/common";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import RobotItem from "frontend/components/item/robot";
import {indexRouter} from "frontend/router";


@statics({
  loadData: function() {
    let urlQueryCursor = state.select("urlQuery");
    let urlQuery = urlQueryCursor.get();
    let newFilters = urlQuery.filters;
    let newSorts = urlQuery.sorts;
    let newOffset = urlQuery.offset;
    let newLimit = urlQuery.limit;

    actions.updateUIFilters(newFilters);
    actions.updateUISorts(newSorts);
    actions.updateUIPagination(newOffset, newLimit);

    return actions.loadIndex();
  }
})
@branch({
  cursors: {
    filters: ["UI", api.plural, "filters"],
    sorts: ["UI", api.plural, "sorts"],
    offset: ["UI", api.plural, "offset"],
    limit: ["UI", api.plural, "limit"],
    total: ["UI", api.plural, "total"],
    items: ["UI", api.plural, "currentItems"],
  }
})
export default class RobotIndex extends DeepComponent {
  componentWillUpdate(nextProps) {
    let {offset, limit, total} = nextProps;
    if (total) {
      let recommendedOffset = recommendOffset(total, offset, limit);
      if (offset > recommendedOffset) {
        console.log('recommendedOffset:', recommendedOffset);
        indexRouter.transitionTo(undefined, {offset: recommendedOffset});
      }
    }
  }
  render() {
    let {filters, sorts, offset, limit, total, items} = this.props;

    return (
      <DocumentTitle title="Robots">
        <div>
          <div className="actions">
            <div className="container">
              <div className="pull-left">
                <RobotPerPage limit={limit}/>
              </div>
              <div className="pull-left">
                <RobotSorts sorts={sorts}/>
              </div>
              <div className="pull-left">
                <RobotFilters filters={filters}/>
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
            <RobotPagination offset={offset} limit={limit} total={total}/>
            {total ?
              <div className="row">
                {map(item => <RobotItem item={item} key={item.id}/>, items)}</div> :
                <p>No robots exist</p>}
            <RobotPagination offset={offset} limit={limit} total={total}/>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

class RobotPagination extends ShallowComponent {
  render() {
    let {offset, limit, total} = this.props;
    return <Pagination
      makeHref={_offset => this.showOffset(_offset)}
      onClick={_offset => this.setOffset(_offset)}
      total={total} offset={offset} limit={limit}
    />;
  }
  setOffset(offset) {
    indexRouter.transitionTo("robot-index", {offset});
  }
  showOffset(offset) {
    return indexRouter.makePath("robot-index", {offset});
  }
}

class RobotFilters extends ShallowComponent {
  render() {
    let {filters} = this.props;
    return <FilterBy field="manufacturer"
      options={[undefined, "China", "Russia", "USA"]} current={filters && filters.manufacturer}
      makeHref={_filters => this.showFilters(_filters)}
      onClick={_filters => this.setFilters(_filters)}
    />;
  }
  setFilters(filters) {
    indexRouter.transitionTo("robot-index", {filters});
  }
  showFilters(filters) {
    return indexRouter.makePath("robot-index", {filters});
  }
}

class RobotSorts extends ShallowComponent {
  render() {
    let {sorts} = this.props;
    return <SortBy
      options={["+name", "-name"]} current={sorts && sorts[0]}
      makeHref={_sorts => this.showSorts(_sorts)}
      onClick={_sorts => this.setSorts(_sorts)}
    />;
  }
  setSorts(sorts) {
    indexRouter.transitionTo("robot-index", {sorts});
  }
  showSorts(sorts) {
    return indexRouter.makePath("robot-index", {sorts});
  }
}

class RobotPerPage extends ShallowComponent {
  render() {
    let {limit} = this.props;
    return <PerPage
      options={[5, 10, 12]} current={limit}
      makeHref={_limit => this.showLimit(_limit)}
      onClick={_limit => this.setLimit(_limit)}
    />;
  }
  setLimit(limit) {
    indexRouter.transitionTo("robot-index", {limit});
  }
  showLimit(limit) {
    return indexRouter.makePath("robot-index", {limit});
  }
}
