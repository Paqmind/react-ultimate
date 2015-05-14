// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import state from "frontend/state";
import monsterActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, MoldeLink} from "frontend/components/simple";
import {Error, Loading, NotFound} from "frontend/components/page";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    monsters: "monsters",
  },
  facets: {
    model: "currentMonster",
  },
})
export default class MonsterDetail extends DeepComponent {
  static loadData = monsterActions.loadModel;

  render() {
    let {loading, loadError} = this.props.monsters;
    let model = this.props.model;

    if (loading) {
      return <Loading/>;
    } else if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title={"Detail " + model.name}>
          <div>
            <MonsterDetailActions {...this.props}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + model.id + "?set=set2&size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{model.name}</h1>
                  <dl>
                    <dt>Serial Number</dt>
                    <dd>{model.id}</dd>
                    <dt>Assembly Date</dt>
                    <dd>{model.assemblyDate}</dd>
                    <dt>Manufacturer</dt>
                    <dd>{model.manufacturer}</dd>
                  </dl>
                </div>
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    }
  }
}

class MonsterDetailActions extends DeepComponent {
  render() {
    let model = this.props.model;

    return (
      <div id="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="monster-index" className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <ModelLink to="monster-edit" className="btn btn-orange" title="Edit">
              <span className="fa fa-edit"></span>
            </ModelLink>
            <a className="btn btn-red" title="Remove" onClick={() => monsterActions.removeModel(model.id)}>
              <span className="fa fa-times"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}