// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";
import {toArray} from "shared/helpers/common";
import state from "frontend/state";
import Component from "frontend/component";
import {Error, Loading, NotFound, ExternalPagination, InternalPagination, Link} from "frontend/components";
import monsterActions from "frontend/monster/actions";
import MonsterItem from "frontend/monster/components/item";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    monsters: "monsters",
  },

  facets: {
    currentMonsters: "currentMonsters",
  }
})
export default class MonsterIndex extends Component {
  static loadData = monsterActions.loadIndex;

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  setFilters(filters) {
    if (!filters) {
      monsterActions.reset();
    }
    monsterActions.setFilters(filters);
    monsterActions.loadIndex();
  }

  setSorts(sorts) {
    monsterActions.setSorts(sorts);
    monsterActions.loadIndex();
  }

  setOffset(offset) {
    monsterActions.setOffset(offset);
    monsterActions.loadIndex();
  }

  setLimit(limit) {
    monsterActions.setLimit(limit);
    monsterActions.loadIndex();
  }

  render() {
    let {total, loading, loadError, offset, limit} = this.props.monsters;
    let models = this.props.currentMonsters;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title="Monsters">
          <div>
            <div id="page-actions">
              <div className="container">
                <div className="pull-right">
                  <Link to="monster-add" className="btn btn-sm btn-green" title="Add">
                    <span className="fa fa-plus"></span>
                  </Link>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <button type="button"
                      onClick={() => this.setLimit(3)}
                      className="btn btn-sm btn-secondary">
                      Perpage 3
                    </button>
                    <button type="button"
                      onClick={() => this.setLimit(5)}
                      className="btn btn-sm btn-secondary">
                      Perpage 5
                    </button>
                    <button type="button"
                      onClick={() => this.setLimit(10)}
                      className="btn btn-sm btn-secondary">
                      Perpage 10
                    </button>
                  </div>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <button type="button"
                      onClick={() => this.setSorts(["+name"])}
                      className="btn btn-sm btn-secondary">
                      SortBy +name
                    </button>
                    <button type="button"
                      onClick={() => this.setSorts(["-name"])}
                      className="btn btn-sm btn-secondary">
                      SortBy -name
                    </button>
                  </div>
                </div>

                <div className="pull-right">
                  <div className="btn-group">
                    <button type="button"
                      onClick={() => this.setFilters(undefined)}
                      className="btn btn-sm btn-secondary">
                      Reset filters
                    </button>
                    <button type="button"
                      onClick={() => this.setFilters({citizenship: "USA"})}
                      className="btn btn-sm btn-secondary">
                      FilterBy citizenship=USA
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <section className="container">
              <h1>Monsters</h1>
              <InternalPagination onClick={offset => this.setOffset(offset)} total={total} offset={offset} limit={limit}/>
              <div className="row">
                {models.map(model => <MonsterItem model={model} key={model.id}/>)}
              </div>
              <InternalPagination onClick={offset => this.setOffset(offset)} total={total} offset={offset} limit={limit}/>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }
}