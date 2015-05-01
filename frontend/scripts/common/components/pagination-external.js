// IMPORTS =========================================================================================
import range from "lodash.range";
import Class from "classnames";
import React from "react";

import Component from "frontend/common/component";
import Link from "./link";

// EXPORTS =========================================================================================
export default class ExternalPagination extends Component {
  static propTypes = {
    endpoint: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired,
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.limit);
  }

  maxOffset() {
    return this.totalPages() * this.props.limit;
  }

  prevOffset(offset) {
    return offset <= 0 ? 0 : offset - this.props.limit;
  }

  nextOffset(offset) {
    return offset >= this.maxOffset() ? this.maxOffset() : offset + this.props.limit;
  }

  render() {
    let endpoint = this.props.endpoint;
    let limit = this.props.limit;
    let currOffset = this.props.offset;
    let prevOffset = this.prevOffset(this.props.offset);
    let nextOffset = this.nextOffset(this.props.offset);
    let minOffset = 0;
    let maxOffset = this.maxOffset();

    if (this.totalPages() > 1) {
      return (
        <nav>
          <ul className="pagination">
            <li className={Class({disabled: currOffset == minOffset})}>
              <Link to={endpoint}
                withParams={true}
                withQuery={{page: {offset: prevOffset}}}
                title={`To offset ${prevOffset}`}>
                <span>&laquo;</span>
              </Link>
            </li>
            {range(0, maxOffset, limit).map(offset => {
              return (
                <li key={offset} className={Class({disabled: offset == currOffset})}>
                  <Link to={endpoint}
                    withParams={true}
                    withQuery={{page: {offset}}}
                    title={`To offset ${offset}`}>
                    {offset}
                  </Link>
                </li>
              );
            })}
            <li className={Class({disabled: currOffset == maxOffset})}>
              <Link to={endpoint}
                withParams={true}
                withQuery={{page: {offset: nextOffset}}}
                title={`To offset ${nextOffset}`}>
                <span>&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      );
    } else {
      return <nav/>;
    }
  }
}
