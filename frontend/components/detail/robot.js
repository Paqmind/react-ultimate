import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {formatQuery} from "shared/helpers/jsonapi";
import {statics} from "frontend/helpers/react";
import state from "frontend/state";
import modelActions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent} from "frontend/components/component";
import {ModelLink} from "frontend/components/link";
import {Error, Loading, NotFound} from "frontend/components/special";

// COMPONENTS ======================================================================================
@statics({
  loadData: modelActions.establishModel,
})
@branch({
  cursors: {
    robots: "robots",
  },
  facets: {
    model: "currentRobot",
  },
})
export default class RobotDetail extends DeepComponent {
  render() {
    let {loading, loadError} = this.props.robots;
    let model = this.props.model;

    if (loading) {
      return <Loading/>;
    } else if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title={"Detail " + model.name}>
          <div>
            <Actions {...this.props} model={model}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{model.name}</h1>
                  <dl>
                    <dt>Serial Number</dt>
                    <dd>{model.id}</dd>
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

class Actions extends ShallowComponent {
  render() {
    let {robots, model} = this.props;
    let query = formatQuery(robots);

    return (
      <div className="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="robot-index" query={query} className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
            <ModelLink to="robot-edit" className="btn btn-orange" title="Edit">
              <span className="fa fa-edit"></span>
            </ModelLink>
            <a className="btn btn-red" title="Remove" onClick={() => modelActions.removeModel(model.id)}>
              <span className="fa fa-times"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

//<dt>Assembly Date</dt>
//<dd>{model.assemblyDate}</dd>
