// IMPORTS =========================================================================================
import {clone, map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import monsterValidators from "shared/validators/monster";
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
      model: clone(props.model),
      errors: {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      model: clone(props.model),
    });
  }

  render() {
    let {loading, loadError} = this.props.monsters;
    let model = this.state.model;

    if (loading) {
      return <Loading/>;
    } else if (loadError) {
      return <Error loadError={loadError}/>;
    } else {
      return (
        <DocumentTitle title={"Edit " + model.name}>
          <div>
            <MonsterEditActions model={model}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + model.id + "?set=set2&size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{model.name}</h1>
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
                      error: this.hasErrors("birthDate"),
                    })}>
                      <label htmlFor="birthDate">Birth Date</label>
                      <input type="text"
                        value={model.birthDate}
                        onBlur={() => this.validate("model.birthDate")}
                        onChange={this.makeHandleChange("model.birthDate")}
                        id="birthDate" ref="birthDate"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("model.birthDate"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("model.birthDate"))}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: this.hasErrors("model.citizenship"),
                    })}>
                      <label htmlFor="citizenship">Citizenship</label>
                      <input type="text"
                        value={model.citizenship}
                        onBlur={() => this.validate("model.citizenship")}
                        onChange={this.makeHandleChange("model.citizenship")}
                        id="citizenship" ref="citizenship"
                        className="form-control"/>
                      <div className={Class("help", {
                        error: this.hasErrors("model.citizenship"),
                      })}>
                        {map(message => <span key="">{message}</span>, this.getErrors("model.citizenship"))}
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
        modelActions.editModel(this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    });
  }

  get stateSchema() {
    return monsterValidators;
  }
}

class MonsterEditActions extends DeepComponent {
  render() {
    let model = this.props.model;

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
            <a className="btn btn-red" title="Remove" onClick={() => modelActions.removeModel(model.id)}>
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