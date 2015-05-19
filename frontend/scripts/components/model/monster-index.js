// IMPORTS =========================================================================================
import {map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import modelActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, Pagination} from "frontend/components/simple";
import {FilterBy, SortBy, PerPage} from "frontend/components/form";
import {Error, Loading, NotFound} from "frontend/components/page";
import MonsterItem from "./monster-item";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    monsters: "monsters",
  },

  facets: {
    currentMonsters: "currentMonsters",
  }
})
export default class MonsterIndex extends DeepComponent {
  static loadData = modelActions.loadIndex;

  render() {
    let {total, loading, loadError, filters, sorts, offset, limit} = this.props.monsters;
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
    modelActions.setIndexOffset(offset);
    modelActions.loadIndex();
  }
}

class MonsterIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.monsters;

    let perPage = <PerPage
      options={[3, 5, 10]} current={limit}
      onClick={_limit => this.setLimit(_limit)}
    />;
    let sortBy = <SortBy
      options={["+name", "-name"]} current={sorts[0]}
      onClick={_sorts => this.setSorts(_sorts)}
    />;
    let filterBy = <FilterBy field="citizenship"
      options={[undefined, "China", "Russia", "USA"]} current={filters.citizenship}
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
    modelActions.setIndexFilters(filters);
    modelActions.loadIndex();
  }

  setSorts(sorts) {
    modelActions.setIndexSorts(sorts);
    modelActions.loadIndex();
  }

  setLimit(limit) {
    modelActions.setIndexLimit(limit);
    modelActions.loadIndex();
  }
}