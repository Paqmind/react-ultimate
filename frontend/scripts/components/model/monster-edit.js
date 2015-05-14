// IMPORTS =========================================================================================
import {clone, map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import modelValidators from "shared/validators/monster";
import modelActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent, ModelLink} from "frontend/components/simple";
import {Error, Loading, NotFound} from "frontend/components/page";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    monsters: "monsters",
  },
  facets: {
    model: "currentMonster",
  },
})
export default class MonsterEdit extends Form {
  static loadData = modelActions.establishModel;

  constructor(props) {
    super();
    this.state = {
      // Raw state for all fields
      form: clone(props.model),
      // Validated and converter state for action
      model: clone(props.model),
      // Errors
      errors: {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      form: clone(props.model),
      model: clone(props.model),
      errors: {},
    });
  }

  render() {
    let {loading, loadError} = this.props.monsters;
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
                    <img src={"http://robohash.org/" + form.id + "?set=set2&size=200x200"} width="200px" height="200px"/>
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
                        value={form.name}
                        onBlur={() => this.validate("name")}
                        onChange={this.makeHandleChange("name")}
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
                      error: this.hasErrors("birthDate"),
                    })}>
                      <label htmlFor="birthDate">Birth Date</label>
                      <input type="date"
                        value={model.birthDate}
                        onBlur={() => this.validate("birthDate")}
                        onChange={this.makeHandleChange("birthDate")}
                        id="birthDate" ref="birthDate"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("birthDate"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("birthDate"))}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("citizenship"),
                    })}>
                      <label htmlFor="citizenship">Citizenship</label>
                      <input type="text"
                        value={form.citizenship}
                        onBlur={() => this.validate("citizenship")}
                        onChange={this.makeHandleChange("citizenship")}
                        id="citizenship" ref="citizenship"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("citizenship"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("citizenship"))}
                      </div>
                    </div>
                  </fieldset>
                  <div className="btn-group">
                    <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
                    <button className="btn btn-primary" type="button" onClick={this.handleSubmit} disabled={this.hasErrors()}>Submit</button>
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
        alert("Submit will be here soon!");
        //modelActions.editModel(this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    });
  }

  get schema() {
    return modelValidators.model;
  }
}

class ModelActions extends DeepComponent {
  render() {
    let form = this.props.form;

    return (
      <div id="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="monster-index" className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <ModelLink to="monster-detail" className="btn btn-blue" title="Detail">
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
<TextInput label="Birth Date" placeholder="Birth Date" id="model.birthDate" form={this}/>
<TextInput label="citizenship" placeholder="citizenship" id="model.citizenship" form={this}/>
*/

//(this.validatorTypes().citizenship._flags.presence == "required")
//(this.validatorTypes().name._flags.presence == "required"),
//(this.validatorTypes().birthDate._flags.presence == "required"),

// TODO min date, max date