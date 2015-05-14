// IMPORTS =========================================================================================
import {map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import monsterValidators from "shared/validators/monster";
import monsterActions from "frontend/actions/monster";
import {ShallowComponent, DeepComponent} from "frontend/components/simple";
import {Error, Loading, NotFound} from "frontend/components/page";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@branch({
  cursors: {
    monsters: "monsters",
  },
})
export default class MonsterAdd extends Form {
  static loadData = monsterActions.loadIndex;

  constructor(props) {
    super();
    this.state = {
      model: {
        name: undefined,
        birthDate: undefined,
        citizenship: undefined,
      },
    };
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
        <DocumentTitle title={"Add Monster"}>
          <div>
            <MonsterAddActions/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">Add Monster</h1>
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
                      error: this.hasErrors("model.birthDate"),
                    })}>
                      <label htmlFor="birthDate">Birth Date</label>
                      <input type="text"
                        value={model.assemblyDate}
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
        monsterActions.addModel(this.state.model);
      } else {
        alert("Can't submit form with errors");
      }
    });
  }

  get stateSchema() {
    return monsterValidators;
  }
}

class MonsterAddActions extends ShallowComponent {
  render() {
    return (
      <div id="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="monster-index" className="btn btn-gray-light" title="Back to list">
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
<TextInput label="Citizenship" placeholder="Citizenship" id="model.citizenship" form={this}/>
*/
