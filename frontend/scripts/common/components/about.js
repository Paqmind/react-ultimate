// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

let Component = require("frontend/common/component");

// EXPORTS =========================================================================================
export default class About extends Component {
  render() {
    return (
      <DocumentTitle title="About">
        <section className="container page info">
          <h1>Simple Page Example</h1>
          <p>This page was rendered by a JavaScript</p>
        </section>
      </DocumentTitle>
    );
  }
}