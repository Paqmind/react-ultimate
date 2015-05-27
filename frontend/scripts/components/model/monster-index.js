// IMPORTS =========================================================================================
import {eqDeep, keys, map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import {statics} from "frontend/scripts/helpers/react";
import state, {MONSTER} from "frontend/scripts/state";
import modelActions from "frontend/scripts/actions/monster";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/scripts/components/simple";
import {FilterBy, SortBy, PerPage} from "frontend/scripts/components/form";
import {Error, Loading, NotFound} from "frontend/scripts/components/page";
import MonsterItem from "./monster-item";

// CURSORS =========================================================================================
let modelCursor = state.select("monsters");

// COMPONENTS ======================================================================================
@statics({
  loadData: modelActions.loadIndex,
})
@branch({
  cursors: {
    monsters: "monsters",
  },
  facets: {
    currentMonsters: "currentMonsters",
  }
})
export default class MonsterIndex extends DeepComponent {
  render() {
    let {loading, loadError, filters, sorts, offset, limit, total} = this.props.monsters;
    let models = this.props.currentMonsters;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      let pagination = <Pagination
        onClick={_offset => this.setOffset(_offset)}
        total={total} offset={offset} limit={limit}
      />;
      return (
        <DocumentTitle title="Monsters">
          <div>
            <MonsterIndexActions {...this.props}/>
            <section className="container">
              <h1>Monsters</h1>
              {pagination}
              <div className="row">
                {map(model => <MonsterItem model={model} key={model.id}/>, models)}
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
    modelCursor.set("offset", offset || MONSTER.OFFSET);
    modelActions.loadIndex();
  }
}

class MonsterIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.monsters;

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
            <Link to="monster-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  setFilters(filters) {
    if (!eqDeep(filters, modelCursor.get("filters"))) {
      modelCursor.set("filters", filters);
      if ((modelCursor.get("pagination").length < modelCursor.get("total")) || true) {
        /* TODO replace true with __newFilters_are_not_subset_of_oldFilters__ */
        // not all data loaded or new filters aren't subset of old
        modelCursor.set("pagination", []);
        modelCursor.set("total", 0);
      }
    }
    modelActions.loadIndex();
  }

  setSorts(sorts) {
    if (!eqDeep(sorts, modelCursor.get("sorts"))) {
      modelCursor.set("sorts", sorts);
      if (modelCursor.get("pagination").length < modelCursor.get("total")) {
        // not all data loaded
        modelCursor.set("pagination", []);
        modelCursor.set("total", 0);
      }
    }
    modelActions.loadIndex();
  }

  setLimit(limit) {
    modelCursor.set("limit", limit || MONSTER.LIMIT);
    modelActions.loadIndex();
  }
}
