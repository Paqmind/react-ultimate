// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
let Home = React.createClass({
  render() {
    return (
      <DocumentTitle title="React Starter">
        <section className="container page home">
          <h1>React starter app</h1>
          <p>Proof of concepts, CRUD, whatever...</p>
          <p>Proudly build on ES6 with the help of <a href="https://babeljs.io/">Babel</a> transpiler.</p>
          <h3>Frontend</h3>
          <ul>
            <li><a href="#">React</a></li>
            <li><a href="#">React-Router</a></li>
            <li><a href="#">React-Document-Title</a></li>
            <li><a href="#">Browserify</a></li>
            <li>In production mode, it will serve minfied, uniquely named files with super agressive cache headers. To test:
              <ul>
                <li>in dev_config.json set <code>isDev</code> to <code>false</code></li>
                <li>restart the server</li>
                <li>view source and you'll see minified css and js files with unique names</li>
                <li>open the "network" tab in chrome dev tools (or something similar). You'll also want to make sure you haven't disabled your cache</li>
                <li>without hitting "refresh" load the app again (selecting current URL in url bar and hitting "enter" works great)</li>
                <li>you should now see that the JS and CSS files were both served from cache without making any request to the server at all</li>
              </ul>
            </li>
          </ul>

          <h3>Backend</h3>
          <ul>
            <li><a href="#">Express</a> framework</li>
            <li><a href="#">Nunjucks</a> template engine</li>
          </ul>

          <h3>Common</h3>
          <ul>
            <li><a href="#">Gulp</a> streaming build system</li>
            <li><a href="#">Joi</a> data validation</li>
            <li><a href="#">Faker</a> fake data generation</li>
          </ul>

          <h3>VCS</h3>
          <ul>
            <li><a href="#">Git</a> version control system</li>
          </ul>
        </section>
      </DocumentTitle>
    );
  }
});

export default Home;

//seoTitle: "Home SEO title",
