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
/**
 * this.props.data -- original data (model)
 * this.state.form -- current state of the form fields (can't be auto-updated to "correct format" to keep UX smooth)
 * this.state.data -- parsed state of the form fields (can be auto-updated). Is used in submit action.
 * this.state.errors -- validation errors. Have the same structure as this.state.data
 */
export default class Form extends DeepComponent {
  handleReset() {
    this.setState({
      form: clone(this.props.data),
      data: clone(this.props.data),
    }, this.validate.bind(this));
  }

  handleChange(key, formValue, dataParser) {
    if (!key) {
      throw Exception(`key argument must be non-empty string, got ${key}`);
    }

    let dataValue;
    try {
      dataValue = dataParser(formValue);
    } catch (err) {
      dataValue = formValue;
    }

    let formKey = this.formKey + "." + key;
    let dataKey = this.dataKey + "." + key;
    let formLens = Lens(formKey);
    let dataLens = Lens(dataKey);

    let state = this.state;
    state = formLens.set(state, formValue);
    state = dataLens.set(state, dataValue);
    this.setState(state, this.validateDebounced.bind(this, key));
  }

  validateDebounced = debounce((key=undefined) => {
    return this.validate(key);
  }, 500);

  validate(key=undefined) {
    let formKey  = key ? this.formKey  + "." + key : this.formKey;
    let dataKey  = key ? this.dataKey + "." + key : this.dataKey;
    let errorKey = key ? this.errorKey + "." + key : this.errorKey;

    let dataLens = Lens(dataKey);
    let errorLens = Lens(errorKey);
    let schemaLens = Lens(key || "");

    let data = dataLens.get(this.state);
    let schema = schemaLens.get(this.schema);

    // Validate it
    console.log("val data:", {[formKey]: data});
    console.log("val schema:", {[formKey]: schema});
    let [_, _errors] = joiValidate({[formKey]: data}, {[formKey]: schema}); // TODO use only last segment of `formKey`?
    let errors = _errors[this.formKey];

    let state = this.state;
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
      // Full key path like "address.street": just return
      return errors;
    } else {
      // Group key path like "address": make flat Array from error tree
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

  get dataKey() {
    return "data";
  }

  get errorKey() {
    return "errors";
  }
}
