// IMPORTS =========================================================================================
import React from "react";
import monsterActions from "frontend/actions/monster";
import {ShallowComponent, Link} from "frontend/components/simple";

// COMPONENTS ======================================================================================
export default class MonsterItem extends ShallowComponent {
  static propTypes = {
    model: React.PropTypes.object,
  }

  render() {
    let model = this.props.model;

    return (
      <div key={model.id} className="col-sm-6 col-md-3">
        <div className="panel panel-default" key={model.id}>
          <div className="panel-heading">
            <h4 className="panel-title"><Link to="monster-detail" params={{id: model.id}}>{model.name}</Link></h4>
          </div>
          <div className="panel-body text-center nopadding">
            <Link to="monster-detail" params={{id: model.id}}>
              <img src={'http://robohash.org/' + model.id + '?set=set2&size=200x200'} width="200px" height="200px"/>
            </Link>
          </div>
          <div className="panel-footer">
            <div className="clearfix">
              <div className="btn-group btn-group-sm pull-right">
                <Link to="monster-detail" params={{id: model.id}} className="btn btn-blue" title="Detail">
                  <span className="fa fa-eye"></span>
                </Link>
                <Link to="monster-edit" params={{id: model.id}} className="btn btn-orange" title="Edit">
                  <span className="fa fa-edit"></span>
                </Link>
                <a className="btn btn-red" title="Remove" onClick={() => monsterActions.remove(model.id)}>
                  <span className="fa fa-times"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}