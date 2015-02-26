// IMPORTS =========================================================================================
let React = require("react");
let {Link} = require("react-router");
let RobotActions = require("frontend/robot/actions");

// EXPORTS =========================================================================================
let Item = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
  },

  render() {
    let model = this.props.model;
    return (
      <div key={model.get("id")} className="col-sm-6 col-md-3">
        <div className="panel panel-default" key={model.get("id")}>
          <div className="panel-heading">
            <h4 className="panel-title"><Link to="robot-detail" params={{id: model.get("id")}}>{model.get("name")}</Link></h4>
          </div>
          <div className="panel-body text-center nopadding">
            <Link to="robot-detail" params={{id: model.get("id")}}>
              <img src={'http://robohash.org/' + model.get("id") + '?size=200x200'} width="200px" height="200px"/>
            </Link>
          </div>
          <div className="panel-footer">
            <div className="clearfix">
              <div className="btn-group btn-group-sm pull-right">
                <Link to="robot-detail" params={{id: model.get("id")}} className="btn btn-blue" title="Detail">
                  <span className="fa fa-eye"></span>
                </Link>
                <Link to="robot-edit" params={{id: model.get("id")}} className="btn btn-orange" title="Edit">
                  <span className="fa fa-edit"></span>
                </Link>
                <a className="btn btn-red" title="Remove" onClick={RobotActions.remove.bind(this, model.get("id"))}>
                  <span className="fa fa-times"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Item;
