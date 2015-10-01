import {eqDeep, keys, map} from "ramda";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {branch} from "baobab-react/decorators";
import {toArray} from "shared/helpers/common";
import api from "shared/api/monster";
import {statics} from "frontend/helpers/react";
import {MONSTER} from "frontend/constants";
import state from "frontend/state";
import actions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/common";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import MonsterItem from "frontend/components/item/monster";

let data$ = state.select("monsters");

@statics({
  loadData: actions.loadIndex,
})
@branch({
  cursors: {
    filters: [api.plural, "filters"],
    sorts: [api.plural, "sorts"],
    offset: [api.plural, "offset"],
    limit: [api.plural, "limit"],
    total: [api.plural, "total"],
    items: [api.plural, "currentItems"],
  }
})
export default class MonsterIndex extends DeepComponent {
  render() {
    let {filters, sorts, offset, limit, total, items} = this.props;

    let pagination = <Pagination
      onClick={_offset => this.setOffset(_offset)}
      total={total} offset={offset} limit={limit}
    />;
    return (
      <DocumentTitle title="Monsters">
        <div>
          <Actions {...this.props}/>
          <section className="container">
            <h1>Monsters</h1>
            {pagination}
            <div className="row">
              {map(item => <MonsterItem item={item} key={item.id}/>, items)}
            </div>
            {pagination}
          </section>
        </div>
      </DocumentTitle>
    );
  }

  setOffset(offset) {
    data$.set("offset", offset || MONSTER.index.offset);
    actions.loadIndex();
  }
}

class Actions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props;

    let perPage = <PerPage
      options={[5, 10, 12]} current={limit}
      onClick={_limit => this.setLimit(_limit)}
    />;
    let sortBy = <SortBy
      options={["+name", "-name"]} current={sorts && sorts[0]}
      onClick={_sorts => this.setSorts(_sorts)}
    />;
    let filterBy = <FilterBy field="citizenship"
      options={[undefined, "China", "Russia", "USA"]} current={filters && filters.citizenship}
      onClick={_filters => this.setFilters(_filters)}
    />;

    return (
      <div className="actions">
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
            <Link to="monster-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  setFilters(filters) {
    if (!eqDeep(filters, data$.get("filters"))) {
      data$.set("filters", filters);
      if ((data$.get("pagination").length < data$.get("total")) || true) {
        /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
        // not all data loaded or new filters aren't subset of old
        data$.set("pagination", []);
        data$.set("total", 0);
      }
    }
    actions.loadIndex();
  }

  setSorts(sorts) {
    if (!eqDeep(sorts, data$.get("sorts"))) {
      data$.set("sorts", sorts);
      if (data$.get("pagination").length < data$.get("total")) {
        // not all data loaded
        data$.set("pagination", []);
        data$.set("total", 0);
      }
    }
    actions.loadIndex();
  }

  setLimit(limit) {
    data$.set("limit", limit || MONSTER.index.limit);
    actions.loadIndex();
  }
}
