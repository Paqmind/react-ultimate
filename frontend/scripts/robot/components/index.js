// IMPORTS =========================================================================================
import {branch} from "baobab-react/decorators";
import React from "react";
import DocumentTitle from "react-document-title";

import {toArray} from "shared/common/helpers";
import state from "frontend/common/state";
import Component from "frontend/common/component";
import {Error, Loading, NotFound, ExternalPagination, InternalPagination, Link} from "frontend/common/components";
import robotActions from "frontend/robot/actions";
import RobotItem from "frontend/robot/components/item";
import router from "frontend/common/router";

// COMPONENTS ======================================================================================
class PerPage extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  setLimit(limit) {
    robotActions.setLimit(limit);
    robotActions.loadIndex();
    this.hideDropdown();
  }

  hideDropdown() {
    this.setState({expanded: false});
  }

  onClickOnHeader(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({expanded: !this.state.expanded});
  }

  documentClickHandler() {
    this.hideDropdown();
  }

  componentDidMount() {
    document.addEventListener("click", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
  }

  render() {
    let self = this;
    var items = this.props.options.map(function(item, key) {
      return <li key={key} role="presentation" className={item == self.props.current ? "disabled": ""}>
        <a role="menuitem" tabIndex="-1" href="#" onClick={() => self.setLimit(item)}>{item}</a>
      </li>;
    });
    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" aria-expanded={this.state.expanded} onClick={this.onClickOnHeader}>
          Perpage {this.props.current} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu">
          {items}
        </ul>
      </div>
    )
  }
}

class SortBy extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  resort() {
    this.hideDropdown();
  }

  hideDropdown() {
    this.setState({expanded: false});
  }

  onClickOnHeader(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({expanded: !this.state.expanded});
  }

  documentClickHandler() {
    this.hideDropdown();
  }

  componentDidMount() {
    document.addEventListener("click", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.documentClickHandler);
  }

  render() {
    let self = this;
    var items = this.props.options.map(function(item, key) {
      return <li key={key} role="presentation" className={item == self.props.current ? "disabled": ""}>
        <Link role="menuitem" tabIndex="-1" to="robot-index" withQuery={{sort: item}} onClick={self.resort}>{item}</Link>
      </li>;
    });
    return (
      <div className={"dropdown" + (this.state.expanded ? " open" : "")}>
        <button className="btn btn-default btn-sm dropdown-toggle" type="button"
          data-toggle="dropdown" aria-expanded={this.state.expanded} onClick={this.onClickOnHeader}>
          SortBy {this.props.current} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu">
          {items}
        </ul>
      </div>
    )
  }
}

class Filters extends Component {
  onSubmitFilterForm(event) {
    event.preventDefault();
    var filters = {};
    for (let i=0; i<event.target.elements.length; i++) {
      if (event.target.elements[i].name) {
        filters[event.target.elements[i].name] = event.target.elements[i].value;
      }
    }
    router.transitionTo("robot-index", {}, {filter: filters});
  }

  render() {
    return (
      <div className="container">
        <form className="form-inline" onSubmit={this.onSubmitFilterForm}>
          <div className="form-group form-group-sm margin-right">
            <label forName="manufacturer">Manufacturer</label>&nbsp;
            <select name="manufacturer" className="form-control" defaultValue={this.props.current.manufacturer}>
              <option key="0" value=""></option>
              <option key="1" value="Russia">Russia</option>
              <option key="2" value="USA">USA</option>
            </select>
          </div>
          <div className="form-group margin-right-xs">
            <button type="submit" className="btn btn-sm btn-primary">Filter</button>
          </div>
          <div className="form-group margin-right">
            <Link to="robot-index" withQuery={{filter: false}} className="btn btn-sm btn-gray">Reset</Link>
          </div>
        </form>
      </div>

    );
  }
}

@branch({
  cursors: {
    robots: "robots",
  },

  facets: {
    currentRobots: "currentRobots",
  }
})
export default class RobotIndex extends Component {
  static loadData = robotActions.establishIndex;

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  render() {
    let {total, loading, loadError, offset, limit} = this.props.robots;
    let models = this.props.currentRobots;

    if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title="Robots">
          <div>
            <div id="actions">
              <div className="container margin-bottom">
                <div className="pull-left"><PerPage current={limit} options={[3, 5, 10]}/></div>
                {/* TODO: .sorts[0] => hack, don't know how to do it right */}
                <div className="pull-left"><SortBy current={this.props.robots.sorts[0]} options={["+name", "-name"]}/></div>
                <div className="pull-right">
                  <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
                    <span className="fa fa-plus"></span>
                  </Link>
                </div>
              </div>

              <Filters current={this.props.robots.filters}/>
            </div>
            <section className="container">
              <h1>Robots</h1>
              <ExternalPagination endpoint="robot-index" total={total} offset={offset} limit={limit}/>
              <div className="row">
                {models.map(model => <RobotItem model={model} key={model.id}/>)}
              </div>
              <InternalPagination onClick={offset => robotActions.setOffset(offset)} total={total} offset={offset} limit={limit}/>
            </section>
            {loading ? <Loading/> : ""}
          </div>
        </DocumentTitle>
      );
    }
  }
}

/*
<div className="buttons btn-group">
  <button className="btn btn-default" data-hook="reset">Reset Collection</button>
  <button className="btn btn-default" data-hook="remove">Remove Collection</button>
  <button className="btn btn-default" data-hook="shuffle">Shuffle Collection</button>
  <button className="btn btn-default" data-hook="fetch">Refetch Collection</button>
  <button className="btn btn-default" data-hook="add">Add Random</button>
</div>
*/
