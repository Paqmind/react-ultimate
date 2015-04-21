// IMPORTS =========================================================================================
let React = require("react");
let DocumentTitle = require("react-document-title");

let Component = require("frontend/common/component");

// EXPORTS =========================================================================================
export default class Home extends Component {
  render() {
    return (
      <DocumentTitle title="React Starter">
        <section className="container page home">
          <h1>React starter app</h1>
          <p>Proof of concepts, CRUD, whatever...</p>
          <p>Proudly build on ES6 with the help of <a href="https://babeljs.io/">Babel</a> transpiler.</p>
          <h3>Frontend</h3>
          <ul>
            <li><a href="http://facebook.github.io/react/">React</a> declarative UI</li>
            <li><a href="https://github.com/Yomguithereal/baobab">Baobab</a> JS data tree with cursors</li>
            <li><a href="https://github.com/rackt/react-router">React-Router</a> declarative routes</li>
            <li><a href="https://github.com/gaearon/react-document-title">React-Document-Title</a> declarative document titles</li>
            <li><a href="http://react-bootstrap.github.io/">React-Bootstrap</a> Bootstrap components in React</li>
            <li><a href="http://browserify.org/">Browserify</a> &amp; <a href="https://github.com/substack/watchify">Watchify</a> bundle NPM modules to frontend</li>
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
            <li><a href="https://babeljs.io/">Babel</a> JS transpiler</li>
            <li><a href="http://gulpjs.com/">Gulp</a> streaming build system</li>
            <li><a href="https://lodash.com/">Lodash</a> utility library</li>
            <li><a href="https://github.com/mzabriskie/axios">Axios</a> promise-based HTTP client</li>
            <li><a href="https://github.com/facebook/immutable-js">Immutable</a> persistent immutable data for JS</li>
            <li><a href="http://momentjs.com/">Moment</a> date-time stuff</li>
            <li><a href="https://github.com/marak/Faker.js/">Faker</a> fake data generation</li>
          </ul>

          <h3>VCS</h3>
          <ul>
            <li><a href="http://git-scm.com/">Git</a> version control system</li>
          </ul>
        </section>
      </DocumentTitle>
    );
  }
}