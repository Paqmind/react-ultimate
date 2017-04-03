import {clone, map} from "ramda"
import Class from "classnames"
import {branch} from "baobab-react/decorators"
import React from "react"
import {Link} from "react-router"
import DocumentTitle from "react-document-title"
import api from "common/api/monster"
import {debounce, hasValues} from "common/helpers/common"
import {Monster} from "common/types"
import {statics} from "frontend/helpers/react"
import * as actions from "frontend/actions/monster"
import * as alertActions from "frontend/actions/alert"
import {ShallowComponent, DeepComponent, ItemLink, NotFound} from "frontend/components/common"
import state from "frontend/state"

let dataCursor = state.select(api.plural)

let validateFormDebounced = debounce(key => {
  actions.validateEditForm(key).catch(err => null)
}, 500)

@statics({
  loadData: () => {
    actions
      .establishItem()
      .then(item => actions.resetEditForm(item.id))
  }
})
@branch({
  cursors: {
    havePendingRequests: [api.plural, "havePendingRequests"],
    item: [api.plural, "currentItem"],
    form: [api.plural, "editForm"],
    errors: [api.plural, "editFormErrors"],
  },
})
export default class MonsterEdit extends DeepComponent {
  handleBlur(key) {
    actions.validateEditForm(key).catch(err => null)
  }

  handleChange(key, data) {
    actions.updateEditForm(key, data)
    validateFormDebounced(key)
  }

  handleSubmit() {
    actions
      .validateEditForm("")
      .then(actions.editItem)
      .then(item => {
        alertActions.addItem({
          message: "Monster edited with id: " + item.id,
          category: "success",
        })
      })
      .catch(error => {
        alertActions.addItem({
          message: "Failed to edit Monster: " + error,
          category: "error",
        })
      })
  }

  handleReset() {
    actions.resetEditForm(this.props.item.id)
  }

  render() {
    let {havePendingRequests, item, form, errors} = this.props

    if (item) {
      return (
        <DocumentTitle title={"Edit " + form.name}>
          <div>
            <Actions {...this.props}/>
            <section className="container margin-top-lg">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="thumbnail">
                    <img src={"http://robohash.org/" + item.id + "?size=200x200"} width="200px" height="200px"/>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-9">
                  <h1 className="nomargin-top">{form.name}</h1>
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
                        id="name" className="form-control"/>
                      <div className={Class("help", {
                        error: Boolean(errors.name),
                      })}>
                        {map(message => <span key="">{message}</span>, [errors.name])}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: Boolean(errors.citizenship),
                    })}>
                      <label htmlFor="citizenship">Citizenship</label>
                      <input type="text"
                        value={form.citizenship}
                        onBlur={() => this.handleBlur("citizenship")}
                        onChange={event => this.handleChange("citizenship", event.currentTarget.value)}
                        id="citizenship" className="form-control"/>
                      <div className={Class("help", {
                        error: Boolean(errors.citizenship),
                      })}>
                        {map(message => <span key="">{message}</span>, [errors.citizenship])}
                      </div>
                    </div>

                    <div className={Class("form-group", {
                      required: false,
                      error: Boolean(errors.birthDate),
                    })}>
                      <label htmlFor="birthDate">Birth Date</label>
                      <input type="text"
                        value={form.birthDate}
                        onBlur={() => this.handleBlur("birthDate")}
                        onChange={event => this.handleChange("birthDate", event.currentTarget.value)}
                        id="birthDate" className="form-control"/>
                      <div className={Class("help", {
                        error: Boolean(errors.birthDate),
                      })}>
                        {map(message => <span key="">{message}</span>, [errors.birthDate])}
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
      )
    } else if (havePendingRequests) {
      return null
    } else {
      return <NotFound/>
    }
  }
}

class Actions extends ShallowComponent {
  render() {
    let {item} = this.props

    return (
      <div className="actions">
        <div className="container">
          <div className="btn-group btn-group-sm pull-left">
            <Link to="monster-index" className="btn btn-gray-light" title="Back to list">
              <span className="fa fa-arrow-left"></span>
              <span className="hidden-xs margin-left-sm">Back to list</span>
            </Link>
          </div>
          <div className="btn-group btn-group-sm pull-right">
            <Link to="monster-add" className="btn btn-sm btn-green" title="Add">
              <span className="fa fa-plus"></span>
            </Link>
            <ItemLink to="monster-detail" params={{id: item.id}} className="btn btn-blue" title="Detail">
              <span className="fa fa-eye"></span>
            </ItemLink>
            <a className="btn btn-red" title="Remove" onClick={() => actions.removeItem(item.id)}>
              <span className="fa fa-times"></span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
