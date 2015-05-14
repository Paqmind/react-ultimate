// IMPORTS =========================================================================================
import {map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import robotValidators from "shared/validators/robot";
import robotActions from "frontend/actions/robot";
import {ShallowComponent, DeepComponent} from "frontend/components/simple";
import {Error, Loading, NotFound} from "frontend/components/page";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    robots: "robots",
  },
})
export default class RobotAdd extends Form {
  static loadData = robotActions.loadIndex;

  constructor(props) {
    super();
    this.state = {
      model: {
        name: undefined,
        assemblyDate: undefined,
        manufacturer: undefined,
      },
    };
  }

  render() {
    let {loading, loadError} = this.props.robots;
    let model = this.state.model;

    if (loading) {
      return <Loading/>;
    } else if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title={"Add Robot"}>
          <div>
            <RobotAddActions {...this.props}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">Add Robot</h1>
                  <fieldset>
                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("model.name"),
                    })}>
                      <label htmlFor="name">Name</label>
                      <input type="text"
                        value={model.name}
                        onBlur={() => this.validate("model.name")}
                        onChange={this.makeHandleChange("model.name")}
                        id="name" ref="name"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("model.name"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("model.name"))}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("model.assemblyDate"),
                    })}>
                      <label htmlFor="assemblyDate">Assembly Date</label>
                      <input type="text"
                        value={model.assemblyDate}
                        onBlur={() => this.validate("model.assemblyDate")}
                        onChange={this.makeHandleChange("model.assemblyDate")}
                        id="assemblyDate" ref="assemblyDate"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("model.assemblyDate"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("model.assemblyDate"))}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("model.manufacturer"),
                    })}>
                      <label htmlFor="manufacturer">Manufacturer</label>
                      <input type="text"
                        value={model.manufacturer}
                        onBlur={() => this.validate("model.manufacturer")}
                        onChange={this.makeHandleChange("model.manufacturer")}
                        id="manufacturer" ref="manufacturer"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("model.manufacturer"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("model.manufacturer"))}
                      </div>
                    </div>
                  </fieldset>
                  <div className="btn-group">
                    <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
                    <button className="btn btn-primary" type="button" onClick={this.handleSubmit} disabled={this.hasErrors("model")}>Submit</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </DocumentTitle>
      );
    }
  }

  handleSubmit() {
    this.validate().then(isValid => {
      if (isValid) {
        robotActions.addModel(this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    });
  }

  get stateSchema() {
    return robotValidators;
  }
}

class RobotAddActions extends ShallowComponent {
  render() {
    let robots = this.props.robots;
    let query = {
      filters: robots.filters,
      sorts: robots.sorts,
      page: {
        offset: robots.offset,
        limit: robots.limit,
      }
    };

    return (
      <div id="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="robot-index" query={query} className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/

//(this.validatorTypes().name._flags.presence == "required")
//(this.validatorTypes().assemblyDate._flags.presence == "required")
//(this.validatorTypes().manufacturer._flags.presence == "required")