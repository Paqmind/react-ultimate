// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";

import Component from "frontend/common/component";

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