// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/components/simple";

// EXPORTS =========================================================================================
export default class About extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: About">
        <section className="container page home">
          <h1>About</h1>

          <h3>Code</h3>
          <p>
            Ultimate JavaScript.
            Newest ES2015&mdash;2016 versions everywhere: frontend, backend, tests, tasks.
          </p>

          <h3>General</h3>
          <p>
            App uses AJAX loaders heavily to avoid "white screen" UX issue.
          </p>

          <h3>Index</h3>
          <p>
            Any widget in any frontend application may be either bound or unbound to URL.
            React Ultimate is no exception. We decided to highlight this less-known topic and
            structure the app to underline this distinction.
          </p>
          <p>
            <a href="/robots">URL-bound</a> components operate through URL. Their state is mirrored
            in URL so it's possible to bookmark and share link to exact page state (offset, filters, sorts...).
            Only one set of URL params is supported (e.g. there can't be two URL-bound pagination on the same page).
          </p>
          <p>
            <a href="/monsters">URL-unbound</a> components operate through inner state. Their state is hidden
            from user so bookmarking is impossible. Such components are more performant and
            don't share mentioned number limitation.
          </p>

          <h4>Pagination</h4>
          <p>
            Ultimate Backend and Frontend solution.
            Uses cache whenever possible to avoid unnecessary API request.
            Autoredirects whenever requested page is begger than available.
          </p>

          <h4>Perpage</h4>
          <p>
            Ultimate Backend and Frontend solution.
            Performant: recalculates new pagination without API request.
            User friendly: keeps current page whenever new page limit is applied.
          </p>

          <h4>Filters</h4>
          <p>
            Ultimate Backend and Frontend solution.
            Performant: uses cache whenever possible to avoid unnecessary API request.
            User friendly: resets to first page whenever new filters are applied (old offset
            loses meaning with new filters).
          </p>

          <h4>Sorts</h4>
          <p>
            Ultimate Backend and Frontend solution.
            Performant: uses cache whenever possible to avoid unnecessary API request.
            User friendly: keeps current page whenever new sorts are applied (old offset
            keeps meaning with new sorts).
          </p>

          <h3>CRUD</h3>
          <p>
            Architecture: validation rules are shared between Backend and Frontend.
            User friendly: live validation.
          </p>

          <h3>CRUD</h3>
          <p>
            Architecture: validation rules are shared between Backend and Frontend.
            User friendly: live validation.
          </p>

        </section>
      </DocumentTitle>
    );
  }
}