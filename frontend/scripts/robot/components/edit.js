// IMPORTS =========================================================================================
import result from "lodash.result";
import isArray from "lodash.isarray";
import isPlainObject from "lodash.isplainobject";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import debounce from "lodash.debounce";
import flatten from "lodash.flatten";
import Class from "classnames";
//import Joi from "joi";
import React from "react";
import DocumentTitle from "react-document-title";

//let Validators from "shared/robot/validators";
import state from "frontend/common/state";
import Component from "frontend/common/component";
import {Error, Loading, NotFound, Link} from "frontend/common/components";
import robotActions from "frontend/robot/actions";

// HELPERS =========================================================================================
function flattenAndResetTo(obj, to, path) {
  path = path || "";
  return Object.keys(obj).reduce(function (memo, key) {
    if (isPlainObject(obj[key])) {
      Object.assign(memo, flattenAndResetTo(obj[key], to, path + key+ "."));
    } else {
      memo[path + key] = to;
    }
    return memo;
  }, {});
}

//function validate(joiSchema, data, key) {
//  joiSchema = joiSchema || {};
//  data = data || {};
//  let joiOptions = {
//    abortEarly: false,
//    allowUnknown: true,
//  };
//  let errors = formatErrors(Joi.validate(data, joiSchema, joiOptions));
//  if (key === undefined) {
//    return Object.assign(
//      flattenAndResetTo(joiSchema, []),
//      errors
//    );
//  } else {
//    let result = {};
//    result[key] = errors[key] || [];
//    return result;
//  }
//}

//function formatErrors(joiResult) {
//  if (joiResult.error !== null) {
//    return joiResult.error.details.reduce(function (memo, detail) {
//      if (!Array.isArray(memo[detail.path])) {
//        memo[detail.path] = [];
//      }
//      memo[detail.path].push(detail.message);
//      return memo;
//    }, {});
//  } else {
//    return {};
//  }
//}

// COMPONENTS ======================================================================================
//cursors() {
//  return {
//    robots: ["robots"],
//    loadModel: ["robots", "models", this.getParams().id],
//  }
//},
export default class RobotEdit extends Component {
  static loadData = robotActions.establishModel;

  render() {
    return <div>Edit</div>;
    //let {models, loading, loadError} = this.state.cursors.robots;
    //let loadModel = this.state.cursors.loadModel;
    //return (
    //  <Form models={models} loading={loading} loadError={loadError} loadModel={loadModel}/>
    //);
  }
}

//let Form = React.createClass({
//  getInitialState() {
//    return {
//      model: Object.assign({}, this.props.loadModel),
//    }
//  },
//
//  componentWillReceiveProps(props) {
//    if (isEmpty(this.state.model)) {
//      this.setState({
//        model: Object.assign({}, props.loadModel),
//      })
//    }
//  },
//
//  validatorTypes() {
//    return {};
//    //return Validators.model;
//  },
//
//  validatorData() {
//    return {};
//  //  return this.state.model;
//  },
//
//  validate: function (key) {
//    //let schema = result(this, "validatorTypes") || {};
//    //let data = result(this, "validatorData") || this.state;
//    //let nextErrors = merge({}, this.state.errors, validate(schema, data, key), function (a, b) {
//    //  return isArray(b) ? b : undefined;
//    //});
//    //return new Promise((resolve, reject) => {
//    //  this.setState({
//    //    errors: nextErrors
//    //  }, () => resolve(this.isValid(key)));
//    //});
//  },
//
//  handleChangeFor: function (key) {
//    return function handleChange(event) {
//      event.persist();
//      let model = this.state.model;
//      model[key] = event.currentTarget.value;
//      this.setState({model: model});
//    //  this.validateDebounced(key);
//    }.bind(this);
//  },
//
//  validateDebounced: debounce(function validateDebounced(key) {
//    return this.validate(key);
//  }, 500),
//
//  handleReset(event) {
//    event.preventDefault();
//    event.persist();
//    this.setState({
//      model: Object.assign({}, this.props.loadModel),
//    }, this.validate);
//  },
//
//  handleSubmit(event) {
//    event.preventDefault();
//    event.persist();
//    this.validate().then(isValid => {
//      if (isValid) {
//        // TODO replace with React.findDOMNode at #0.13.0
//        robotActions.edit({
//          id: this.state.model.id,
//          name: this.refs.name.getDOMNode().value,
//          assemblyDate: this.refs.assemblyDate.getDOMNode().value,
//          manufacturer: this.refs.manufacturer.getDOMNode().value,
//        });
//      } else {
//        alert("Can't submit form with errors");
//      }
//    });
//  },
//
//  getValidationMessages: function (key) {
//    let errors = this.state.errors || {};
//    if (isEmpty(errors)) {
//      return [];
//    } else {
//      if (key === undefined) {
//        return flatten(Object.keys(errors).map(function (error) {
//          return errors[error] || [];
//        }));
//      } else {
//        return errors[key] || [];
//      }
//    }
//  },
//
//  isValid: function (key) {
//    return true;
//    //return isEmpty(this.getValidationMessages(key));
//  },
//
//  render() {
//    let {models, loading, loadError, loadModel} = this.props;
//    let model = this.state.model;
//
//    if (loading) {
//      return <Loading/>;
//    } else if (loadError) {
//      return <Error loadError={loadError}/>;
//    } else {
//      return (
//        <DocumentTitle title={"Edit " + model.name}>
//          <div>
//            <div id="page-actions">
//              <div className="container">
//                <div className="btn-group btn-group-sm pull-left">
//                  <Link to="robot-index" params={{page: 1}} className="btn btn-gray-light" title="Back to list">
//                    <span className="fa fa-arrow-left"></span>
//                    <span className="hidden-xs margin-left-sm">Back to list</span>
//                  </Link>
//                </div>
//                <div className="btn-group btn-group-sm pull-right">
//                  <Link to="robot-detail" params={{id: model.id}} className="btn btn-blue" title="Detail">
//                    <span className="fa fa-eye"></span>
//                  </Link>
//                  <a className="btn btn-red" title="Remove" onClick={robotActions.remove.bind(this, model.id)}>
//                    <span className="fa fa-times"></span>
//                  </a>
//                </div>
//              </div>
//            </div>
//            <section className="container margin-top-lg">
//              <div className="row">
//                <div className="col-xs-12 col-sm-3">
//                  <div className="thumbnail thumbnail-robot">
//                    <img src={"http://robohash.org/" + model.id + "?size=200x200"} width="200px" height="200px"/>
//                  </div>
//                </div>
//                <div className="col-xs-12 col-sm-9">
//                  <h1 className="nomargin-top">{model.name}</h1>
//                  <form onSubmit={this.handleSubmit}>
//                    <fieldset>
//                      <div className={Class({
//                        "form-group": true,
//                        "required": false,
//                        "error": !this.isValid("name"),
//                      })}>
//                        <label htmlFor="name">Name</label>
//                        <input type="text" onBlur={this.validate.bind(this, "name")} onChange={this.handleChangeFor("name")} className="form-control" id="name" ref="name" value={model.name}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("name"),
//                        })}>
//                          {this.getValidationMessages("name").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                         "required": false,
//                         "error": !this.isValid("assemblyDate")
//                      })}>
//                        <label htmlFor="assemblyDate">Assembly Date</label>
//                        <input type="text" onBlur={this.validate.bind(this, "assemblyDate")} onChange={this.handleChangeFor("assemblyDate")} className="form-control" id="assemblyDate" ref="assemblyDate" value={model.assemblyDate}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("assemblyDate"),
//                        })}>
//                          {this.getValidationMessages("assemblyDate").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//
//                      <div className={Class({
//                        "form-group": true,
//                        "required": false,
//                        "error": !this.isValid("manufacturer"),
//                      })}>
//                        <label htmlFor="manufacturer">Manufacturer</label>
//                        <input type="text" onBlur={this.validate.bind(this, "manufacturer")} onChange={this.handleChangeFor("manufacturer")} className="form-control" id="manufacturer" ref="manufacturer" value={model.manufacturer}/>
//                        <div className={Class({
//                          "help": true,
//                          "error": !this.isValid("manufacturer"),
//                        })}>
//                          {this.getValidationMessages("manufacturer").map(message => <span key="">{message}</span>)}
//                        </div>
//                      </div>
//                    </fieldset>
//                    <div className="btn-group">
//                      <button className="btn btn-default" type="button" onClick={this.handleReset}>Reset</button>
//                      <button className="btn btn-primary" disabled={!this.isValid()} type="submit">Submit</button>
//                    </div>
//                  </form>
//                </div>
//              </div>
//            </section>
//          </div>
//        </DocumentTitle>
//      );
//    }
//  }
//});

/*
<TextInput label="Name" placeholder="Name" id="model.name" form={this}/>
<TextInput label="Assembly Date" placeholder="Assembly Date" id="model.assemblyDate" form={this}/>
<TextInput label="Manufacturer" placeholder="Manufacturer" id="model.manufacturer" form={this}/>
*/

//(this.validatorTypes().manufacturer._flags.presence == "required")
//(this.validatorTypes().name._flags.presence == "required"),
//(this.validatorTypes().assemblyDate._flags.presence == "required"),