import React from "react";
import {Link} from "react-router";
import actions from "frontend/actions/monster";
import alertActions from "frontend/actions/alert";
import {ShallowComponent} from "frontend/components/common";

export default class MonsterSmallItem extends ShallowComponent {
  static propTypes = {
    item: React.PropTypes.object,
  }

  render() {
    let item = this.props.item;

    if (item) {
      return (
        <div key={item.id} className="col-sm-4 col-md-2">
          <div className="panel panel-default" key={item.id}>
            <div className="panel-body text-center nopadding">
              <Link to="monster-detail" params={{id: item.id}}>
                <img src={'http://robohash.org/' + item.id + '?set=set2&size=100x100'} width="100px" height="100px"/>
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
