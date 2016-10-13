import React from "react"
import DocumentTitle from "react-document-title"
import {Component} from "./component"

export default class NotFound extends Component {
  render() {
    return (
      <DocumentTitle title="Not Found">
        <div className="row">
          <div className="col-sm-12 col-lg-6">
            <div id="http-error-descr">
              <h1 id="http-error-heading">Page not found</h1>
              <p>Keep inner peace.</p>
              <p>Perhaps it was the result of either:</p>
              <ul className="margin-bottom-lg">
                <li>a mistyped address</li>
                <li>an outdated link</li>
              </ul>
              <p>But you can always start from <a href="/">home page</a>.</p>
              <script>
                var GOOG_FIXURL_LANG = (navigator.language || '').slice(0,2)
                var GOOG_FIXURL_SITE = location.host
              </script>
              <script src="http://linkhelp.clients.google.com/tbproxy/lh/wm/fixurl.js"></script>
            </div>
          </div>
          <div className="col-sm-12 col-lg-6">
            <div id="mascotte">
              <div className="oval-thought">
                I'm gonna go build my own theme park, with blackjack and hookers. In fact, forget the park!
              </div>
              <div className="bender angry"></div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
