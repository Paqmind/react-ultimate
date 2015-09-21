import {clone, chain as flatMap, filter, flatten, merge, values} from "ramda";
import Joi from "joi";
import result from "lodash.result";
import debounce from "lodash.debounce";
import Lens from "paqmind.data-lens";
import React from "react";
import {flattenObject, unflattenObject} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import {DeepComponent} from "frontend/components/common";

// COMPONENTS ======================================================================================
/**
 * this.props.data -- original data (item)
 * this.state.form -- current state of the form fields (can't be auto-updated to "correct format" to keep UX smooth)
 * this.state.data -- parsed state of the form fields (can be auto-updated). Is used in submit action.
 * this.state.errors -- validation errors. Have the same structure as this.state.data
 */
export default class Form extends DeepComponent {
  handleReset() {
    this.setState({
      form: clone(this.props.item),
      item: clone(this.props.item),
    }, this.validate.bind(this));
  }

  handleChange(key, formValue) {
    if (!key) {
      throw Error(`key argument must be non-empty string, got ${key}`);
    }

    let formKey = this.formKey + "." + key;
    let formLens = Lens(formKey);

    let state = this.state;
    state = formLens.set(state, formValue);
    this.setState(state, this.validateDebounced.bind(this, key));
  }

  validateDebounced = debounce((key=undefined) => {
    return this.validate(key);
  }, 500);

  validate(key=undefined) {
    let formKey  = key ? this.formKey  + "." + key : this.formKey;
    let itemKey  = key ? this.itemKey + "." + key : this.itemKey;
    let errorKey = key ? this.errorKey + "." + key : this.errorKey;
    let schemaKey = key ? this.schemaKey + "." + key : this.schemaKey;

    let formLens = Lens(formKey);
    let itemLens = Lens(itemKey);
    let errorLens = Lens(errorKey);
    let schemaLens = Lens(schemaKey);

    let form = formLens.get(this.state);
    let schema = schemaLens.get(this.state);

    // Validate it
    let tailKey = formKey.split(".").slice(-1);
    let [_item, _errors] = joiValidate({[tailKey]: form}, {[tailKey]: schema});
    let item = _item[tailKey];
    let errors = _errors[tailKey];

    let state = this.state;
    state = itemLens.set(state, item);
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

  get formKey() {
    return "form";
  }

  get itemKey() {
    return "item";
  }

  get errorKey() {
    return "errors";
  }

  get schemaKey() {
    return "schema";
  }
}
