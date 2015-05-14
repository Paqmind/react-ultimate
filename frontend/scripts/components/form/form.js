// IMPORTS =========================================================================================
import {clone, chain as flatMap, filter, flatten, merge, values} from "ramda";
import Joi from "joi";
import result from "lodash.result";
import debounce from "lodash.debounce";
import Lens from "paqmind.data-lens";
import React from "react";
import {flattenObject, unflattenObject} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import robotValidators from "shared/validators/robot";
import {ShallowComponent, DeepComponent} from "frontend/components/simple";

// COMPONENTS ======================================================================================
export default class Form extends DeepComponent {
  handleReset() {
    this.setState({
      model: clone(this.props.model),
    }, this.validate.bind(this));
  }

  makeHandleChange(key) {
    if (!key) {
      throw Exception(`key argument must be non-empty string, got ${key}`);
    }
    let formKey = this.formKey + "." + key;
    let formLens = Lens(formKey);
    return function handleChange(event) {
      event.persist();
      this.setState(formLens.set(this.state, event.currentTarget.value));
      this.validateDebounced(key);
    }.bind(this);
  }

  validateDebounced = debounce((key=undefined) => {
    return this.validate(key);
  }, 500);

  validate(key=undefined) {
    let formKey  = key ? this.formKey  + "." + key : this.formKey;
    let modelKey = key ? this.modelKey + "." + key : this.modelKey;
    let errorKey = key ? this.errorKey + "." + key : this.errorKey;

    let schemaLens = Lens(key || "");
    let formLens  = Lens(formKey);
    let modelLens = Lens(modelKey);
    let errorLens = Lens(errorKey);

    let form = formLens.get(this.state);
    let schema = schemaLens.get(this.schema);

    // Validate it
    let [_model, _errors] = joiValidate({[formKey]: form}, {[formKey]: schema}); // TODO use only last segment of `formKey`?
    let model = _model[formKey];
    let errors = _errors[this.formKey];

    let state = this.state;
    state = modelLens.set(state, model);
    state = errorLens.set(state, errors);

    // Apply it
    return new Promise((resolve, reject) => {
      this.setState(state, () => resolve(!errors));
    });
  }

  hasErrors(key=undefined) {
    return this.getErrors(key).length != 0;
  }

  getErrors(key=undefined) {
    let errorKey = key ? this.errorKey + "." + key : this.errorKey;
    let errorLens = Lens(errorKey);
    let errors = errorLens.get(this.state) || [];
    if (errors instanceof Array) {
      // Full key path like "model.name": just return
      return errors;
    } else {
      // Group key path like "model": make flat Array from error tree
      errors = flattenObject(errors);
      return filter(v => v, flatten(values(errors)));
    }
  }

  get schema() {
    return {};
  }

  get formKey() {
    return "form";
  }

  get modelKey() {
    return "model";
  }

  get errorKey() {
    return "errors";
  }
}
