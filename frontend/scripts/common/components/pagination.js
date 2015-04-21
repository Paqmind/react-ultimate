// IMPORTS =========================================================================================
let Class = require("classnames");
let React = require("react");
let {Link} = require("react-router");

let Component = require("frontend/common/component");

// EXPORTS =========================================================================================
export default class Pagination extends Component {
  static propTypes = {
    endpoint: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    page: React.PropTypes.number.isRequired,
    perpage: React.PropTypes.number.isRequired,
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perpage);
  }

  render() {
    let page = this.props.page;
    let totalPages = this.totalPages();
    return (
      <nav>
        <ul className="pagination">
          <li>
            <Link to={this.props.endpoint}
              params={page == 1 ? {page: 1} : {page: page - 1}}
              className={Class({btn: true, disabled: page == 1})}
              title={`To page ${page == 1 ? 1 : page - 1}`}>
              <span>&laquo;</span>
            </Link>
          </li>
          {Array.range(1, this.totalPages() + 1).map(p => {
            return (
              <li key={p}>
                <Link to={this.props.endpoint}
                  params={{page: p}}
                  className={Class({btn: true, disabled: p == page})}
                  title={`To page ${p}`}>
                  {p}
                </Link>
              </li>
            );
          })}
          <li>
            <Link to={this.props.endpoint}
              params={page == totalPages ? {page: totalPages} : {page: page + 1}}
              className={Class({btn: true, disabled: page == totalPages})}
              title={`To page ${page == totalPages ? totalPages : page + 1}`}>
              <span>&raquo;</span>
            </Link>
          </li>
        </ul>
        {/*Total: {this.props.total}<br/>*/}
        {/*Perpage: {this.props.perpage}<br/>*/}
        {/*TotalPages: {this.totalPages()}<br/>*/}
      </nav>
    );
  }
}