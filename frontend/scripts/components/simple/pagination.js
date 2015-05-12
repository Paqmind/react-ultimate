// IMPORTS =========================================================================================
import {map, range, reject} from "ramda";
import Class from "classnames";
import React from "react";
import {getLastOffset} from "frontend/helpers/pagination";
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
    let nextOffset = this.nextOffset(offset);
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
                title={`To offset ${prevOffset}`}>
                <span>&laquo;</span>
              </Link> : <a href="#"
                onClick={() => onClick(prevOffset)}
                title={`To offset ${prevOffset}`}>
                <span>&laquo;</span>
              </a>}
            </li>
            {map(offset => {
                return (
                  <li key={offset} className={Class({active: offset == currOffset})}>
                    {route ? <Link to={route}
                      withParams={true}
                      withQuery={{page: {offset}}}
                      className={Class({disabled: offset == currOffset})}
                      title={`To offset ${offset}`}>
                      {offset}
                    </Link> : <a href="#"
                      onClick={() => onClick(offset)}
                      query={{page: {offset}}}
                      title={`To offset ${offset}`}>
                      {offset}
                    </a>}
                  </li>
                );
              }, offsets
            )}
            <li className={Class({disabled: currOffset == lastOffset})}>
              {route ? <Link to={route}
                withParams={true}
                withQuery={{page: {offset: nextOffset}}}
                title={`To offset ${nextOffset}`}>
                <span>&raquo;</span>
              </Link> : <a href="#"
                onClick={() => onClick(nextOffset)}
                title={`To offset ${nextOffset}`}>
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
