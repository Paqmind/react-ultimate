import {clone, map} from "ramda";
import Globalize from "globalize";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import {formatTyped} from "shared/formatters";
import {debounce, hasValues} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {statics} from "frontend/helpers/react";
import actions from "frontend/actions/robot";
import alertActions from "frontend/actions/alert";
import {ShallowComponent, DeepComponent, ItemLink, NotFound} from "frontend/components/common";
import {itemRouter} from "frontend/router";
import state from "frontend/state";


let validateFormDebounced = debounce(key => {
  actions.validateAddForm(key).catch(err => null);
}, 500);

@branch({
  cursors: {
    form: ["UI", "robot", "addForm"],
    errors: ["UI", "robot", "addFormErrors"],
  }
})
export default class RobotAdd extends DeepComponent {
  handleBlur(key) {
    actions.validateAddForm(key).catch(err => null);
  }

  handleChange(key, data) {
    actions.updateAddForm(key, data);
    validateFormDebounced(key);
  }

  handleSubmit() {
    actions
      .validateAddForm("")
      .then(() => {
        return actions.addItem();
      })
      .then((item) => {
        let UICursor = state.select("UI", "robot");
        UICursor.set("id", item.id);
        alertActions.addItem({
          message: "Robot added with id: " + item.id,
          category: "success",
        });
        itemRouter.transitionTo("robot-detail", item.id);
      })
      .catch(error => {
        console.error(error);
        alertActions.addItem({
          message: "Failed to add Robot: " + error,
          category: "error",
        });
      });
  }

  handleReset() {
    actions.resetAddForm();
  }

  render() {
    let {form, errors} = this.props;

    return (
      <DocumentTitle title={"Add Robot"}>
        <div>
          <Actions {...this.props}/>
          <section className="container margin-top-lg">
            <div className="row">
              <div className="col-xs-12 col-sm-9">
                <h1 className="nomargin-top">Add Robot</h1>
                <fieldset>
                  <div className={Class("form-group", {
                    required: false,
                    error: Boolean(errors.name),
                  })}>
                    <label htmlFor="name">Name</label>
                    <input type="text"
                      value={form.name}
                      onBlur={() => this.handleBlur("name")}
                      onChange={event => this.handleChange("name", event.currentTarget.value)}
                      id="name" ref="name"
                      className="form-control"/>
                    <div className={Class("help", {
                      error: Boolean(errors.name),
                    })}>
                      {map(message => <span key="">{message}</span>, [errors.name])}
                    </div>
                  </div>

                  <div className={Class("form-group", {
                    required: false,
                    error: Boolean(errors.manufacturer),
                  })}>
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <input type="text"
                      value={form.manufacturer}
                      onBlur={() => this.handleBlur("manufacturer")}
                      onChange={event => this.handleChange("manufacturer", event.currentTarget.value)}
                      id="manufacturer" ref="manufacturer"
                      className="form-control"/>
                    <div className={Class("help", {
                      error: Boolean(errors.manufacturer),
                    })}>
                      {map(message => <span key="">{message}</span>, [errors.manufacturer])}
                    </div>
                  </div>

                  <div className={Class("form-group", {
                    required: false,
                    error: Boolean(errors.assemblyDate),
                  })}>
                    <label htmlFor="assemblyDate">Assembly Date</label>
                    <input type="text"
                      value={form.assemblyDate}
                      onBlur={() => this.handleBlur("assemblyDate")}
                      onChange={event => this.handleChange("assemblyDate", event.currentTarget.value)}
                      id="assemblyDate" ref="assemblyDate"
                      className="form-control"/>
                    <div className={Class("help", {
                      error: Boolean(errors.assemblyDate),
                    })}>
                      {map(message => <span key="">{message}</span>, [errors.assemblyDate])}
                    </div>
                  </div>
                </fieldset>
                <div className="btn-group">
                  <button className="btn btn-default" type="button" onClick={() => this.handleReset()}>Reset</button>
                  <button className="btn btn-primary" type="button" onClick={() => this.handleSubmit()} disabled={hasValues(errors)}>Submit</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}

class Actions extends ShallowComponent {
  render() {
    let UICursor = state.select("UI", "robots");
    let query = formatQuery({
      filters: UICursor.get("filters"),
      sorts: UICursor.get("sorts"),
      offset: UICursor.get("offset"),
      limit: UICursor.get("limit")
    });

    return (
      <div className="actions">
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
