// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";

import Component from "frontend/common/component";

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