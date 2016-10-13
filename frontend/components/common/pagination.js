import {addIndex, map, range, reject} from "ramda"
import Class from "classnames"
import React from "react"
import {getTotalPages} from "frontend/helpers/pagination"
import IndexLink from "./indexlink"
import {ShallowComponent} from "./component"

let mapIndexed = addIndex(map)

export default class Pagination extends ShallowComponent {
  static propTypes = {
    makeHref: React.PropTypes.func,
    onClick: React.PropTypes.func.isRequired,
    total: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
    limit: React.PropTypes.number.isRequired,
  }

  totalPages() {
    return getTotalPages(this.props.total, this.props.limit)
  }

  lastOffset() {
    let totalPages = this.totalPages()
    return (totalPages <= 1) ? 0 : (totalPages - 1)  * this.props.limit
  }

  prevOffset(offset) {
    return offset <= 0 ? 0 : offset - this.props.limit
  }

  nextOffset(offset) {
    return offset >= this.lastOffset() ? this.lastOffset() : offset + this.props.limit
  }

  onClick(event, offset) {
    event.preventDefault()
    this.props.onClick(offset)
  }

  render() {
    let {makeHref, offset, limit} = this.props
    let currOffset = offset
    let prevOffset = this.prevOffset(offset)
    let prevPage = Math.ceil(prevOffset / limit)
    let nextOffset = this.nextOffset(offset)
    let nextPage = Math.ceil(nextOffset / limit)
    let firstOffset = 0
    let lastOffset = this.lastOffset()

    let offsets = reject(
      _offset => _offset % limit,    // reject everything but 0, 5, 10, 15... for limit = 5
      range(0, lastOffset + limit) // from this range
    )

    if (lastOffset) {
      return (
        <nav>
          <ul className="pagination">
            <li className={Class({disabled: currOffset == firstOffset})}>
              <a href={makeHref ? makeHref(prevOffset) : "#"}
                onClick={event => this.onClick(event, prevOffset)}
                title={`To page ${prevPage}`}>
                <span>&laquo;</span>
              </a>
            </li>
            {mapIndexed((_offset, i) => {
                return (
                  <li key={_offset} className={Class({active: _offset == currOffset})}>
                    <a href={makeHref ? makeHref(_offset) : "#"}
                      onClick={event => this.onClick(event, _offset)}
                      title={`To page ${i + 1}`}>
                      {i + 1}
                    </a>
                  </li>
                )
              }, offsets
            )}
            <li className={Class({disabled: currOffset == lastOffset})}>
              <a href={makeHref ? makeHref(nextOffset) : "#"}
                onClick={event => this.onClick(event, nextOffset)}
                title={`To page ${nextPage}`}>
                <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      )
    } else {
      return <nav/>
    }
  }
}
