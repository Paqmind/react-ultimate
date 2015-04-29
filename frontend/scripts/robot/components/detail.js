// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";

import state from "frontend/common/state";
import Component from "frontend/common/component";
import {Error, Loading, NotFound, Link} from "frontend/common/components";
import robotActions from "frontend/robot/actions";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "robots",
  },
  facets: {
    model: "currentRobot",
  },
})
export default class RobotDetail extends Component {
  static loadData = robotActions.establishModel;

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

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
            <div id="page-actions">
              <div className="container">
                <div className="btn-group btn-group-sm pull-left">
                  <Link to="robot-index" params={{page: 1}} className="btn btn-gray-light" title="Back to list">
                    <span className="fa fa-arrow-left"></span>
                    <span className="hidden-xs margin-left-sm">Back to list</span>
                  </Link>
                </div>
                <div className="btn-group btn-group-sm pull-right">
                  <Link to="robot-edit" params={{id: model.id}} className="btn btn-orange" title="Edit">
                    <span className="fa fa-edit"></span>
                  </Link>
                  <a className="btn btn-red" title="Remove" onClick={robotActions.remove.bind(this, model.id)}>
                    <span className="fa fa-times"></span>
                  </a>
                </div>
              </div>
            </div>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail thumbnail-robot">
                    <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
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