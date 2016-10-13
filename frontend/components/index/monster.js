import {equals, keys, map} from "ramda"
import React from "react"
import {Link} from "react-router"
import DocumentTitle from "react-document-title"
import {branch} from "baobab-react/decorators"
import {toArray} from "common/helpers/common"
import {MONSTER} from "common/constants"
import api from "common/api/monster"
import {statics} from "frontend/helpers/react"
import state from "frontend/state"
import * as actions from "frontend/actions/monster"
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/common"
import {FilterBy, SortBy, PerPage} from "frontend/components/form"
import MonsterItem from "frontend/components/item/monster"

let dataCursor = state.select("monsters")

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
    let {filters, sorts, offset, limit, total, items} = this.props

    let pagination = <Pagination
      onClick={_offset => this.setOffset(_offset)}
      total={total} offset={offset} limit={limit}
    />
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
    )
  }

  setOffset(offset) {
    dataCursor.set("offset", offset || 0)
    actions.loadIndex()
  }
}

class Actions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props

    let perPage = <PerPage
      options={[5, 10, 12]} current={limit}
      onClick={_limit => this.setLimit(_limit)}
    />
    let sortBy = <SortBy
      options={["+name", "-name"]} current={sorts && sorts[0]}
      onClick={_sorts => this.setSorts(_sorts)}
    />
    let filterBy = <FilterBy field="citizenship"
      options={[undefined, "China", "Russia", "USA"]} current={filters && filters.citizenship}
      onClick={_filters => this.setFilters(_filters)}
    />

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
    )
  }

  setFilters(filters) {
    if (!equals(filters, dataCursor.get("filters"))) {
      dataCursor.set("filters", filters)
      if ((dataCursor.get("pagination").length < dataCursor.get("total")) || true) {
        /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
        // not all data loaded or new filters aren't subset of old
        dataCursor.merge({
          total: 0,
          pagination: [],
        })
      }
    }
    actions.loadIndex()
  }

  setSorts(sorts) {
    if (!equals(sorts, dataCursor.get("sorts"))) {
      dataCursor.set("sorts", sorts)
      if (dataCursor.get("pagination").length < dataCursor.get("total")) {
        // not all data loaded
        dataCursor.merge({
          total: 0,
          pagination: [],
        })
      }
    }
    actions.loadIndex()
  }

  setLimit(limit) {
    dataCursor.set("limit", limit || MONSTER.index.defaultLimit)
    actions.loadIndex()
  }
}
