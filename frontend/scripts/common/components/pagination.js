// IMPORTS =========================================================================================
let Class = require("classnames");
let React = require("react");

// EXPORTS =========================================================================================
export default React.createClass({
  //propTypes: {
  //  loadError: React.PropTypes.object.isRequired,
  //  size: React.PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  //},
  //
  //getDefaultProps() {
  //  return {
  //    size: "md",
  //  }
  //},

  render() {
    return (
      <nav>
        <ul class="pagination">
          <li>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">4</a></li>
          <li><a href="#">5</a></li>
          <li>
            <a href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
});

