import React from "react"
import DocumentTitle from "react-document-title"
import {Component, TextHolder} from "frontend/components/common"

export default class Tech extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: Tech">
        <TextHolder>
          <section className="container page home">
            <h1>Tech Stack</h1>

            <h3>Tools</h3>
            <ul>
              <li><a href="https://babeljs.io/">Babel</a>: transpiler</li>
              <li><a href="http://webpack.github.io/">Webpack</a>: module bundler</li>
            </ul>

            <h3>Frontend</h3>
            <ul>
              <li><a href="http://facebook.github.io/react/">React</a>: declarative UI</li>
              <li><a href="https://github.com/Yomguithereal/baobab">Baobab</a>: data tree with cursors</li>
              <li><a href="https://github.com/rackt/react-router">React-Router</a>: declarative routes</li>
              <li><a href="https://github.com/gaearon/react-document-title">React-Document-Title</a>: declarative document titles</li>
            </ul>

            <h3>Backend</h3>
            <ul>
              <li><a href="https://nodejs.org/en/">NodeJS</a>: event-driven environment</li>
              <li><a href="http://expressjs.com/">Express</a>: backend framework, REST API</li>
              <li><a href="http://mozilla.github.io/nunjucks/">Nunjucks</a>: template engine</li>
              <li><a href="https://github.com/eleith/emailjs">EmailJS</a>: SMTP client</li>
              <li><a href="https://github.com/marak/Faker.js/">Faker</a>: fake data generation</li>
            </ul>

            <h3>Shared</h3>
            <ul>
              <li><a href="http://ramdajs.com/">Ramda</a>: functional library</li>
              <li><a href="https://github.com/gcanti/tcomb">Tcomb</a>: type checking and DDD</li>
              <li><a href="https://github.com/gcanti/tcomb-validation">Tcomb-Validation</a>: tcomb-based validation</li>
              <li><a href="http://mochajs.org/">Mocha</a>: unit tests</li>
              <li><a href="http://chaijs.com/">Chai</a>: test assertions</li>
              <li><a href="https://github.com/mzabriskie/axios">Axios</a>: promise-based HTTP client</li>
              <li><a href="http://momentjs.com/">Moment</a>: date and time calculations</li>
            </ul>
          </section>
        </TextHolder>
      </DocumentTitle>
    )
  }
}
