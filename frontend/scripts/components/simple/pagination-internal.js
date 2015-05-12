// IMPORTS =========================================================================================
import range from "lodash.range";
import Class from "classnames";
import React from "react";
import {getLastOffset} from "frontend/helpers/pagination";
import Component from "frontend/component";
import Link from "./link";

// EXPORTS =========================================================================================
export default class InternalPagination extends Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    total: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired,
  }

  lastOffset() {
    return getLastOffset(this.props.total, this.props.limit);
  }

  prevOffset(offset) {
    return offset <= 0 ? 0 : offset - this.props.limit;
  }

  nextOffset(offset) {
    return offset >= this.lastOffset() ? this.lastOffset() : offset + this.props.limit;
  }

  render() {
    let onClick = this.props.onClick;
    let limit = this.props.limit;
    let currOffset = this.props.offset;
    let prevOffset = this.prevOffset(this.props.offset);
    let nextOffset = this.nextOffset(this.props.offset);
    let firstOffset = 0;
    let lastOffset = this.lastOffset();

    if (lastOffset) {
      return (
        <nav>
          <ul className="pagination">
            <li className={Class({disabled: currOffset == firstOffset})}>
              <a href="#"
                onClick={() => onClick(prevOffset)}
                title={`To offset ${prevOffset}`}>
                <span>&laquo;</span>
              </a>
            </li>
            {range(0, lastOffset + limit, limit).map(offset => {
              return (
                <li key={offset} className={Class({active: offset == currOffset})}>
                  <a href="#"
                    onClick={() => onClick(offset)}
                    query={{page: {offset}}}
                    title={`To offset ${offset}`}>
                    {offset}
                  </a>
                </li>
              );
            })}
            <li className={Class({disabled: currOffset == lastOffset})}>
              <a href="#"
                onClick={() => onClick(nextOffset)}
                title={`To offset ${nextOffset}`}>
                <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      );
    } else {
      return <nav/>;
    }
  }
}