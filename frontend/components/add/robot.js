import {clone, map} from "ramda";
import Globalize from "globalize";
import Class from "classnames";
import {branch} from "baobab-react/decorators";
import React from "react";
import {Link} from "react-router";
import DocumentTitle from "react-document-title";
import api from "shared/api/robot";
import {debounce, hasValues} from "shared/helpers/common";
import {formatQuery} from "shared/helpers/jsonapi";
import {formatTyped} from "shared/formatters";
import {Robot} from "shared/types/robot";
import {statics} from "frontend/helpers/react";
import actions from "frontend/actions/robot";
import alertActions from "frontend/actions/alert";
import {ShallowComponent, DeepComponent, ItemLink, NotFound} from "frontend/components/common";
import state from "frontend/state";

let data$ = state.select(api.plural);

let validateFormDebounced = debounce(key => {
  actions.validateAddForm(key).catch(() => {});
}, 500);

@statics({
  loadData: actions.loadIndex,
})
@branch({
  cursors: {
    form: [api.plural, "addForm"],
    errors: [api.plural, "addFormErrors"],
  }
})
export default class RobotAdd extends DeepComponent {
  handleBlur(key) {
    actions.validateAddForm(key);
  }

  handleChange(key, data) {
    actions.updateAddForm(key, data);
    validateFormDebounced(key);
  }

  handleSubmit() {
    actions
      .validateAddForm("")
      .then(actions.addItem)
      .then(item => {
        alertActions.addItem({
          message: "Robot added with id: " + item.id,
          category: "success",
        });
      })
      .catch(error => {
        alertActions.addItem({
          message: "Failed to add Robot: " + error,
          category: "error",
        });
      });
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
    let query = formatQuery({
      filters: data$.get("filters"),
      sorts: data$.get("sorts"),
      offset: data$.get("offset"),
      limit: data$.get("limit")
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
