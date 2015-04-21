// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

let Component = require("frontend/common/component");

// EXPORTS =========================================================================================
export default class NotFound extends Component {
  render() {
    return (
      <DocumentTitle title="Not Found">
        <section className="container page">
          <h1>Page not Found</h1>
          <p>Something is wrong</p>
        </section>
      </DocumentTitle>
    );
  }
}