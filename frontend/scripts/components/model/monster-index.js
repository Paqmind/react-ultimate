// IMPORTS =========================================================================================
import {map} from "ramda";
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import monsterActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, Link, Pagination} from "frontend/components/simple";
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
  static loadData = monsterActions.loadIndex;

  render() {
    let {total, loading, loadError, filters, sorts, offset, limit} = this.props.monsters;
    let models = this.props.currentMonsters;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title="Monsters">
          <div>
            <MonsterIndexActions {...this.props}/>
            <section className="container">
              <h1>Monsters</h1>
              <Pagination onClick={offset => this.setOffset(offset)} total={total} offset={offset} limit={limit}/>
              <div className="row">
                {map(model => <MonsterItem model={model} key={model.id}/>, models)}
              </div>
              <Pagination onClick={offset => this.setOffset(offset)} total={total} offset={offset} limit={limit}/>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }

  setOffset(offset) {
    monsterActions.setOffset(offset);
    monsterActions.loadIndex();
  }
}

class MonsterIndexActions extends ShallowComponent {
  render() {
    let {filters, sorts, limit} = this.props.monsters;

    return (
      <div id="actions">
        <div className="container">
          <div className="pull-left">
            <PerPage onClick={limit => this.setLimit(limit)} options={[3, 5, 10]} current={limit}/>
          </div>
          <div className="pull-left">
            <SortBy onClick={sorts => this.setSorts(sorts)} options={["+name", "-name"]} current={sorts[0]}/>
          </div>
          <div className="pull-left">
            <FilterBy field="citizenship" onClick={filters => this.setFilters(filters)} options={[undefined, "Russia", "USA"]} current={filters.citizenship}/>
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
    monsterActions.setFilters(filters);
    monsterActions.loadIndex();
  }

  setSorts(sorts) {
    monsterActions.setSorts(sorts);
    monsterActions.loadIndex();
  }

  setLimit(limit) {
    monsterActions.setLimit(limit);
    monsterActions.loadIndex();
  }
}