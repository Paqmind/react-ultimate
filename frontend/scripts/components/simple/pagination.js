// IMPORTS =========================================================================================
import {map, mapIndexed, range, reject} from "ramda";
import Class from "classnames";
import React from "react";
import {getTotalPages} from "frontend/helpers/pagination";
import {ShallowComponent} from "./component";
import Link from "./link";

// EXPORTS =========================================================================================
export default class Pagination extends ShallowComponent {
  static propTypes = {
    route: React.PropTypes.string,
    onClick: React.PropTypes.func,
    total: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired,
  }

  constructor(props) {
    if (!props.route && !props.onClick) {
      throw new Error("either route or onClick must be set");
    }
    super();
  }

  totalPages() {
    return getTotalPages(this.props.total, this.props.limit);
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
    let {route, onClick, offset, limit} = this.props;
    let currOffset = offset;
    let prevOffset = this.prevOffset(offset);
    let prevPage = Math.ceil(prevOffset / limit);
    let nextOffset = this.nextOffset(offset);
    let nextPage = Math.ceil(nextOffset / limit);
    let firstOffset = 0;
    let lastOffset = this.lastOffset();

    let offsets = reject(
      offset => offset % limit,     // reject everything but 0, 5, 10, 15... for limit = 5
      range(0, lastOffset + limit)  // from this range
    );

    if (lastOffset) {
      return (
        <nav>
          <ul className="pagination">
            <li className={Class({disabled: currOffset == firstOffset})}>
              {route ? <Link to={route}
                withParams={true}
                withQuery={{page: {offset: prevOffset}}}
                title={`To page ${prevPage}`}>
                <span>&laquo;</span>
              </Link> : <a href="#"
                onClick={() => onClick(prevOffset)}
                title={`To page ${prevPage}`}>
                <span>&laquo;</span>
              </a>}
            </li>
            {mapIndexed((offset, i) => {
                return (
                  <li key={offset} className={Class({active: offset == currOffset})}>
                    {route ? <Link to={route}
                      withParams={true}
                      withQuery={{page: {offset}}}
                      className={Class({disabled: offset == currOffset})}
                      title={`To page ${i + 1}`}>
                      {i + 1}
                    </Link> : <a href="#"
                      onClick={() => onClick(offset)}
                      query={{page: {offset}}}
                      title={`To page ${i + 1}`}>
                      {i + 1}
                    </a>}
                  </li>
                );
              }, offsets
            )}
            <li className={Class({disabled: currOffset == lastOffset})}>
              {route ? <Link to={route}
                withParams={true}
                withQuery={{page: {offset: nextOffset}}}
                title={`To page ${nextPage}`}>
                <span>&raquo;</span>
              </Link> : <a href="#"
                onClick={() => onClick(nextOffset)}
                title={`To page ${nextPage}`}>
                <span>&raquo;</span>
              </a>}
            </li>
          </ul>
        </nav>
      );
    } else {
      return <nav/>;
    }
  }
}
