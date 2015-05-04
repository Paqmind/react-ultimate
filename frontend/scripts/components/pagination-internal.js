// IMPORTS =========================================================================================
import range from "lodash.range";
import Class from "classnames";
import React from "react";
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
    let onClick = this.props.onClick;
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
            <li>
              <a href="#"
                onClick={() => onClick(prevOffset)}
                className={Class({disabled: currOffset == minOffset})}
                title={`To offset ${prevOffset}`}>
                <span>&laquo;</span>
              </a>
            </li>
            {range(0, maxOffset, limit).map(offset => {
              return (
                <li key={offset}>
                  <a href="#"
                    onClick={() => onClick(offset)}
                    query={{page: {offset}}}
                    className={Class({disabled: offset == currOffset})}
                    title={`To offset ${offset}`}>
                    {offset}
                  </a>
                </li>
              );
            })}
            <li>
              <a href="#"
                onClick={() => onClick(nextOffset)}
                className={Class({disabled: currOffset == maxOffset})}
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