import {clone, map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {formatQuery} from "shared/helpers/jsonapi";
import {parseString, parseInteger, parseFloat, parseDate} from "shared/converters";
import {formatString, formatInteger, formatFloat, formatDate} from "shared/converters";
import modelValidators from "shared/validators/robot";
import {statics} from "frontend/helpers/react";
import modelActions from "frontend/actions/robot";
import {DeepComponent} from "frontend/components/component";
import {ModelLink} from "frontend/components/link";
import {Error, Loading, NotFound} from "frontend/components/special";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@statics({
  loadData: modelActions.establishModel,
})
@branch({
  cursors: {
    robots: "robots",
  },
  facets: {
    model: "currentRobot",
  },
})
export default class RobotEdit extends Form {
  constructor(props) {
    super();
    this.state = {
      // Raw state for all fields
      form: clone(props.model),
      // Validated and converter state for action
      model: clone(props.model),
      // Errors
      errors: {},
      // Validation schema
      schema: modelValidators.model,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      form: clone(props.model),
      model: clone(props.model),
      errors: {},
      schema: modelValidators.model
    });
  }

  render() {
    let {loading, loadError} = this.props.robots;
    let form = this.state.form;

    if (loading) {
      return <Loading/>;
    } else if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title={"Edit " + form.name}>
          <div>
            <ModelActions {...this.props} form={form}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + form.id + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{form.name}</h1>
                  <fieldset>
                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("name"),
                    })}>
                      <label htmlFor="name">Name</label>
                      <input type="text"
                        value={formatString(form.name)}
                        onBlur={() => this.validate("name")}
                        onChange={event => this.handleChange("name", event.currentTarget.value)}
                        id="name" ref="name"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("name"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("name"))}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("manufacturer"),
                    })}>
                      <label htmlFor="manufacturer">Manufacturer</label>
                      <input type="text"
                        value={formatString(form.manufacturer)}
                        onBlur={() => this.validate("manufacturer")}
                        onChange={event => this.handleChange("manufacturer", event.currentTarget.value)}
                        id="manufacturer" ref="manufacturer"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("manufacturer"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("manufacturer"))}
                      </div>
                    </div>
                  </fieldset>
                  <div className="btn-group">
                    <button className="btn btn-default" type="button" onClick={() => this.handleReset()}>Reset</button>
                    <button className="btn btn-primary" type="button" onClick={() => this.handleSubmit()} disabled={this.hasErrors()}>Submit</button>
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
        modelActions.editModel(this.state.model);
      }
    });
  }
}

class ModelActions extends DeepComponent {
  render() {
    let robots = this.props.robots;
    let form = this.props.form;
    let query = formatQuery(robots);

    return (
      <div className="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="robot-index" query={query} className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <Link to="robot-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
            <ModelLink to="robot-detail" className="btn btn-blue" title="Detail">
              <span className="fa fa-eye"></span>
            </ModelLink>
            <a className="btn btn-red" title="Remove" onClick={() => modelActions.removeModel(form.id)}>
              <span className="fa fa-times"></span>
            </a>
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

//(this.validatorTypes().manufacturer._flags.presence == "required")
//(this.validatorTypes().name._flags.presence == "required"),
//(this.validatorTypes().assemblyDate._flags.presence == "required"),

// TODO min date, max date

//<div className={Class("form-group", {
//  required: false,
//  error: this.hasErrors("assemblyDate"),
//})}>
//  <label htmlFor="assemblyDate">Assembly Date</label>
//  <input type="text"
//    value={formatDate(form.assemblyDate, "YYYY-MM-DD")}
//    onBlur={() => this.validate("assemblyDate")}
//    onChange={event => this.handleChange("assemblyDate", event.currentTarget.value)}
//    id="assemblyDate" ref="assemblyDate"
//    className="form-control"/>
//  <div className={Class("help", {
//    error: this.hasErrors("assemblyDate"),
//  })}>
//    {map(message => <span key="">{message}</span>, this.getErrors("assemblyDate"))}
//  </div>
//</div>
