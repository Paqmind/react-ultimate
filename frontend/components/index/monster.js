import {map} from "ramda";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {branch} from "baobab-react/decorators";
import {toArray} from "shared/helpers/common";
import api from "shared/api/monster";
import {statics} from "frontend/helpers/react";
import {recommendOffset} from "frontend/helpers/pagination";
import state from "frontend/state";
import actions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/common";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import MonsterItem from "frontend/components/item/monster";


@statics({
  loadData: function() {
    return actions.loadIndex();
  }
})
@branch({
  cursors: {
    filters: ["UI", api.plural, "filters"],
    sorts: ["UI", api.plural, "sorts"],
    offset: ["UI", api.plural, "offset"],
    limit: ["UI", api.plural, "limit"],
    ids: ["UI", api.plural, "ids"],
    items: ["UI", api.plural, "currentItems"],
  }
})
export default class MonsterIndex extends DeepComponent {
  componentWillUpdate(nextProps) {
    let {offset, limit, ids} = nextProps;
    if (ids.length) {
      let recommendedOffset = recommendOffset(ids.length, offset, limit);
      if (offset > recommendedOffset) {
        actions.updateUIPagination(recommendedOffset, limit);
        actions.loadIndex();
      }
    }
  }
  render() {
    let {filters, sorts, offset, limit, ids, items} = this.props;
    return (
      <DocumentTitle title="Monsters">
        <div>
          <div className="actions">
            <div className="container">
              <div className="pull-left">
                <MonsterPerPage limit={limit}/>
              </div>
              <div className="pull-left">
                <MonsterSorts sorts={sorts}/>
              </div>
              <div className="pull-left">
                <MonsterFilters filters={filters}/>
              </div>
              <div className="pull-right">
                <Link to="monster-add" className="btn btn-sm btn-green" title="Add">
                  <span className="fa fa-plus"></span>
                </Link>
              </div>
            </div>
          </div>
          <section className="container">
            <h1>Monsters</h1>
            <MonsterPagination offset={offset} limit={limit} total={ids.length}/>
            {items.length ?
              <div className="row">
                {map(item => <MonsterItem item={item} key={item.id}/>, items)}</div> :
                <p>No monsters</p>}
            <MonsterPagination offset={offset} limit={limit} total={ids.length}/>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

class MonsterPagination extends ShallowComponent {
  render() {
    let {offset, limit, total} = this.props;
    return <Pagination
      onClick={_offset => this.setOffset(_offset, limit)}
      total={total} offset={offset} limit={limit}
    />;
  }
  setOffset(offset, limit) {
    actions.updateUIPagination(offset, limit);
    actions.loadIndex();
  }
}

class MonsterFilters extends ShallowComponent {
  render() {
    let {filters} = this.props;
    return <FilterBy field="citizenship"
      options={[undefined, "China", "Russia", "USA"]} current={filters && filters.citizenship}
      onClick={_filters => this.setFilters(_filters)}
    />;
  }
  setFilters(filters) {
    actions.updateUIFilters(filters);
    actions.loadIndex();
  }
}

class MonsterSorts extends ShallowComponent {
  render() {
    let {sorts} = this.props;
    return <SortBy
      options={["+name", "-name"]} current={sorts && sorts[0]}
      onClick={_sorts => this.setSorts(_sorts)}
    />;
  }
  setSorts(sorts) {
    actions.updateUISorts(sorts);
    actions.loadIndex();
  }
}

class MonsterPerPage extends ShallowComponent {
  render() {
    let {limit} = this.props;
    return <PerPage
      options={[5, 10, 12]} current={limit}
      onClick={_limit => this.setLimit(_limit)}
    />;
  }
  setLimit(limit) {
    actions.updateUIPagination(undefined, limit);
    actions.loadIndex();
  }
}
