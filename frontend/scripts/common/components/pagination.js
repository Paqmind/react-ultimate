// IMPORTS =========================================================================================
let Class = require("classnames");
let React = require("react");
let {Link} = require("react-router");
let Component = require("frontend/component");

// EXPORTS =========================================================================================
export default class Pagination extends Component {
  static propTypes = {
    endpoint: React.PropTypes.string.isRequired,
    total: React.PropTypes.number.isRequired,
    perpage: React.PropTypes.number.isRequired,
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perpage);
  }

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
            return (
              <li key={p}>
                <Link to={this.props.endpoint} params={{page: p}} title={`To page ${p}`}>
                  {p}
                </Link>
              </li>
            );
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
}