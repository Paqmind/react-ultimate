// IMPORTS =========================================================================================
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");

// EXPORTS =========================================================================================
module.exports = React.createClass({
  componentDidMount() {
    console.debug("Home.componentDidMount");
  },

  render() {
    console.debug("Home.render");
    return (
      <DocumentTitle title="Home">
        <section className="page home">
          <h2>Welcome to a Robots Demo App</h2>
          <p>If you "view source" you'll see it's 100% client rendered</p>
          <p>Click around the site using the nav bar at the top</p>
          <p>Things to note:</p>
          <ul>
            <li>The url changes, no requests are made to the server</li>
            <li>Refreshing the page will always get you back to the same page</li>
            <li>Page changes are nearly instantaneous</li>
            <li>In development mode, you don't need to restart the server to see changes, just edit and refresh</li>
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
        </section>
      </DocumentTitle>
    );
  }
});

//seoTitle: "Home SEO title",
