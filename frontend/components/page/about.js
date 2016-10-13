import React from "react"
import DocumentTitle from "react-document-title"
import {Component, TextHolder} from "frontend/components/common"

export default class About extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: About">
        <TextHolder>
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
              React Ultimate is no exception. We decided to highlight this lesser-known topic by
              the very app structure.
            </p>
            <p>
              Index for <a href="/robots">Robots</a> is URL-bound. State is mirrored
              in URL so it's possible to bookmark and share link to exact page state (offset, filters, sorts...).
              Namespacing of URL params is not supported, e.g. there can't be two URL-bound paginations on the same page.
            </p>
            <p>
              Index for <a href="/monsters">Monsters</a> is URL-unbound. State is implicit and hidden
              from user so bookmarking is impossible. On the flip side, such components aren't limited
              in numbers. Also notice how much more performant is ULR-unbound pagination comparing
              to the URL-bound one.
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
            <h4>Validation</h4>
            <p>
              Text fields are validated after input is stopped to provide immediate feedback
              about errors. Validations "on blur" and "on submit" are also available, of course.
              Validation rules are common between frontend and backend.
            </p>

            <h4>Index Backlinks</h4>
            <p>
              Backlinks from item pages to index pages point to the corresponding offsets in paginations.
              It was practically impossible to do this "right" in backend-driven apps. As soon
              as multiple browser tabs were opened, and cookies were overwritten, you were into trouble...
              Fortunately that days are gone.
            </p>

            <h3>Alerts</h3>
            <p>
              Powerful alert system. Beside all that animation goodness,
              alerts are "sticky to the screen" so you can change the page without alert disappear.
              This was impossible to implement in a backend-driven solution.
            </p>

            <h3>Text Holders</h3>
            <p>
              Typography goodness. The width of text container is auto-regulated to display about 80 character per row.
              Check this <a href="http://www.pearsonified.com/2012/01/characters-per-line.php">comprehensive article</a> for more information.
            </p>
          </section>
        </TextHolder>
      </DocumentTitle>
    )
  }
}
