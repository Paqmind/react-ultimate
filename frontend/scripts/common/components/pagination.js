// IMPORTS =========================================================================================
let Class = require("classnames");
let React = require("react");

// EXPORTS =========================================================================================
export default React.createClass({
  propTypes: {
    endpoint: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    perpage: React.PropTypes.number.isRequired,
  },

  totalPages() {
    return Math.ceil(this.props.total / this.props.perpage);
  },

  render() {
    return (
      <nav>
        <ul className="pagination">
          <li>
            <a href="#">
              <span>&laquo;</span>
            </a>
          </li>
          {Array.range(1, this.totalPages() + 1).map(p => {
            let offset = (p - 1) * this.props.perpage;
            let limit = this.props.perpage;
            let url = this.props.endpoint + `?page.offset=${offset}&page.limit=${limit}`;
            return <li key={p}><a href={url}>{p}</a></li>;
          })}
          <li>
            <a href="#">
              <span>&raquo;</span>
            </a>
          </li>
        </ul>
        Total: {this.props.total}<br/>
        Perpage: {this.props.perpage}<br/>
        TotalPages: {this.totalPages()}<br/>
      </nav>
    );
  }
});

//<Pagination endpoint="/api/robots" total="10" perpage="2"/>







