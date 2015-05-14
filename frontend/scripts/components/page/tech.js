// IMPORTS =========================================================================================
import React from "react";
import DocumentTitle from "react-document-title";
import {Component} from "frontend/components/simple";

// EXPORTS =========================================================================================
export default class Tech extends Component {
  render() {
    return (
      <DocumentTitle title="React Ultimate :: Tech">
        <section className="container page home">
          <h1>Tech Stack</h1>

          <h3>Tools</h3>
          <ul>
            <li><a href="https://babeljs.io/">Babel</a> transpiler</li>
            <li><a href="http://webpack.github.io/">Webpack</a> module bundler</li>
            <li><a href="http://gulpjs.com/">Gulp</a> streaming build system</li>
          </ul>

          <h3>Frontend</h3>
          <ul>
            <li><a href="http://facebook.github.io/react/">React</a> declarative UI</li>
            <li><a href="https://github.com/Yomguithereal/baobab">Baobab</a> JS data tree with cursors</li>
            <li><a href="https://github.com/rackt/react-router">React-Router</a> declarative routes</li>
            <li><a href="https://github.com/gaearon/react-document-title">React-Document-Title</a> declarative document titles</li>
            <li><a href="http://react-bootstrap.github.io/">React-Bootstrap</a> Bootstrap components in React</li>
            <li><a href="http://bower.io/">Bower</a> frontend package manager</li>
          </ul>

          <h3>Backend</h3>
          <ul>
            <li><a href="http://expressjs.com/">Express</a> web-app backend framework</li>
            <li><a href="http://mozilla.github.io/nunjucks/">Nunjucks</a> template engine</li>
            <li><a href="https://github.com/eleith/emailjs">EmailJS</a> SMTP client</li>
          </ul>

          <h3>Common</h3>
          <ul>
            <li><a href="https://lodash.com/">Lodash</a> utility library</li>
            <li><a href="https://github.com/mzabriskie/axios">Axios</a> promise-based HTTP client</li>
            <li><a href="http://momentjs.com/">Moment</a> date and time calculations</li>
            <li><a href="https://github.com/marak/Faker.js/">Faker</a> fake data generation</li>
          </ul>
        </section>
      </DocumentTitle>
    );
  }
}