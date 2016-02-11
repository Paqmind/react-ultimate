import Globalize from "globalize";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import api from "shared/api/robot";
import {statics} from "frontend/helpers/react";
import state from "frontend/state";
import actions from "frontend/actions/index";
import {ShallowComponent, DeepComponent, ItemLink, NotFound} from "frontend/components/common";
import {Robot} from "shared/types";
import {formatQuery} from "shared/helpers/jsonapi";

let DBCursor = state.select("DB", "robots");
let UICursor = state.select("UI", "robot");

@statics({
  loadData: function() {
    let urlParams = state.select("url").get("params");
    let id = urlParams.id;

    UICursor.set("id", id);
    return actions.loadItem(DBCursor, UICursor, Robot, api);
  }
})
@branch({
  cursors: {
    havePendingRequests: ["UI", "robots", "havePendingRequests"],
    item: ["UI", "robot", "currentItem"],
  }
})
export default class RobotDetail extends DeepComponent {
  render() {
    let {havePendingRequests, item} = this.props;

    if (item) {
      return (
        <DocumentTitle title={"Detail " + item.name}>
          <div>
            <Actions {...this.props}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + item.id + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{item.name}</h1>
                  <dl>
                    <dt>Serial Number</dt>
                    <dd>{item.id}</dd>
                    <dt>Manufacturer</dt>
                    <dd>{item.manufacturer}</dd>
                    <dt>Assembly Date</dt>
                    <dd>{Globalize.formatDate(item.assemblyDate)}</dd>
                  </dl>
                </div>
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    } else if (havePendingRequests) {
      return null;
    } else {
      return <NotFound/>;
    }
  }
}

class Actions extends ShallowComponent {
  render() {
    let {item} = this.props;
    let query = formatQuery({
      filters: UICursor.get("filters"),
      sorts: UICursor.get("sorts"),
      offset: UICursor.get("offset"),
      limit: UICursor.get("limit"),
    });

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
            <ItemLink to="robot-edit" params={{id: item.id}} className="btn btn-orange" title="Edit">
              <span className="fa fa-edit"></span>
            </ItemLink>
            <a className="btn btn-red" title="Remove" onClick={() => actions.removeItem(item.id)}>
              <span className="fa fa-times"></span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
