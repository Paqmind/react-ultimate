/* jshint ignore:start */
let React = require("react");

module.exports = React.createClass({
  render() {
    return (
      <section class="page view-person">
        <h2>{this.props.model.fullName}</h2>
        <img src="" alt="" data-hook="avatar" width="80"  height="80"/>
        <div class="buttons">
          <a class="btn" href="" data-hook="action-edit">Edit</a>
          <button class="btn" data-hook="action-remove">Remove</button>
        </div>
      </section>
    );
  }
});


