// IMPORTS =========================================================================================
let React = require("react");

// EXPORTS =========================================================================================
let Messages = React.createClass({
  render() {
    return (
      <div className="notifications top-left">
        {this.state.models.toArray().map(model => {

        })}
      </div>
    );
  }
});

export default Messages;
