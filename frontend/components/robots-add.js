// IMPORTS =========================================================================================
let Faker = require("faker");
let React = require("react");
let Router = require("react-router");
let {Link, RouteHandler} = Router;
let DocumentTitle = require("react-document-title");
let Helpers = require("../helpers");
let robotActions = require("../actions").robotActions;

// EXPORTS =========================================================================================
module.exports = React.createClass({
  mixins: [Router.State, Router.ravigation],

  propTypes: {
    robots: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  },

  componentDidMount() {
    console.debug("RobotsAdd.componentDidMount");
  },

  componentWillUnmount() {
    console.debug("RobotsAdd.componentWillUnmount");
  },

  onAdd(event) {
    console.debug("RobotsAdd.onAdd");
    event.preventDefault();
    // TODO: what data pass???
    let robot = {
      id: Helpers.maxId(this.props.models) + 1,
      fullname: Faker.name.findName(),
    };
    console.log(robot);
    robotActions.addRobot(robot);
  },

  render() {
    console.debug("RobotsAdd.render");
    return (
      <DocumentTitle title={"Add robot"}>
        <section>
          <h2>Robot Add</h2>
          <p>This form and all behavior is defined by the form view in <code>components/robots-add.js</code>.</p>
          <p>The same form-view is used for both adding and creating new robots.</p>
          <form>
            <fieldset data-hook="field-container"></fieldset>
            <div className="buttons">
              <button className="btn" onClick={this.onAdd} type="submit">Submit</button>
            </div>
          </form>
        </section>
      </DocumentTitle>
    );
  }
});


