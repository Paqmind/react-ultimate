import {clone, map} from "ramda";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import itemValidators from "shared/validators/monster";
import {statics} from "frontend/helpers/react";
import actions from "frontend/actions/monster";
import {ShallowComponent} from "frontend/components/common";
import {Form} from "frontend/components/form";

// COMPONENTS ======================================================================================
@statics({
  loadData: actions.loadIndex,
})
@branch({
  item: ["monsters", "$emptyItem"],
})
export default class MonsterAdd extends Form {
  constructor(props) {
    super();
    this.state = {
      // Raw state for all fields
      form: clone(props.item),
      // Validated and converter state for action
      item: clone(props.item),
      // Errors
      errors: {},
      // Validation schema
      schema: itemValidators.item,
    };
  }

  render() {
    let {form} = this.state;

    return (
      <DocumentTitle title={"Add Monster"}>
        <div>
          <Actions {...this.props}/>
          <section className="container margin-top-lg">
            <div className="row">
              <div className="col-xs-12 col-sm-9">
                <h1 className="nomargin-top">Add Monster</h1>
                <fieldset>
                  <div className={Class("form-group", {
                    required: false,
                    error: this.hasErrors("name"),
                  })}>
                    <label htmlFor="name">Name</label>
                    <input type="text"
                      value={form.name}
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
                    error: this.hasErrors("citizenship"),
                  })}>
                    <label htmlFor="citizenship">Citizenship</label>
                    <input type="text"
                      value={form.citizenship}
                      onBlur={() => this.validate("citizenship")}
                      onChange={event => this.handleChange("citizenship", event.currentTarget.value)}
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

  handleSubmit() {
    this.validate().then(isValid => {
      if (isValid) {
        actions.addItem(this.state.item);
      }
    });
  }
}

class Actions extends ShallowComponent {
  render() {
    return (
      <div className="actions">
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
<TextInput label="Name" placeholder="Name" id="item.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="item.assemblyDate" form={this}/>
<TextInput label="Citizenship" placeholder="Citizenship" id="item.citizenship" form={this}/>
*/

//<div className={Class("form-group", {
//  required: false,
//  error: this.hasErrors("birthDate"),
//})}>
//  <label htmlFor="birthDate">Birth Date</label>
//  <input type="date"
//    value={form.assemblyDate}
//    onBlur={() => this.validate("birthDate")}
//    onChange={event =? this.handleChange("birthDate", event.currentTarget.value)}
//    id="birthDate" ref="birthDate"
//    className="form-control"/>
//  <div className={Class("help", {
//    error: this.hasErrors("birthDate"),
//  })}>
//    {map(message => <span key="">{message}</span>, this.getErrors("item.birthDate"))}
//  </div>
//</div>
