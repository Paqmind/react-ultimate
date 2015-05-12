// IMPORTS =========================================================================================
import {clone, chain as flatMap, keys, merge} from "ramda";
import Joi from "joi";
import result from "lodash.result";
import debounce from "lodash.debounce";
import Lens from "paqmind.data-lens";
import React from "react";
import {flattenObject, unflattenObject} from "shared/helpers/common";
import {joiValidate} from "shared/helpers/validation";
import robotValidators from "shared/validators/robot";
import {ShallowComponent, DeepComponent, Link} from "frontend/components/simple";

// COMPONENTS ======================================================================================
export default class Form extends DeepComponent {
  handleReset() {
    this.setState({
      model: clone(this.props.model),
    }, this.validate.bind(this));
  }

  makeHandleChange(dataKey) {
    let dataLens = Lens(dataKey);
    return function handleChange(event) {
      event.persist();
      this.setState(dataLens.set(this.state, event.currentTarget.value));
      this.validateDebounced(dataKey);
    }.bind(this);
  }

  validateDebounced = debounce(dataKey => {
    return this.validate(dataKey);
  }, 500);

  validate(dataKey="model") {
    let errorKey = this.errorKey + "." + dataKey;

    let dataLens = Lens(dataKey);
    let errorLens = Lens(errorKey);

    // Extract data and scheme branches, specified by `dataKey` and `errorKey`
    let data = dataLens.get(this.state);
    let schema = dataLens.get(this.stateSchema);

    // Validate it
    let [value, errors] = joiValidate({[dataKey]: data}, {[dataKey]: schema}); // TODO use only last segment of `dataKey`?
    value = value[dataKey];
    errors = errors[dataKey];

    let state = dataLens.set(this.state, value);
    state = errorLens.set(state, errors);

    // Apply it
    return new Promise((resolve, reject) => {
      this.setState(state, () => resolve(!this.hasErrors(dataKey)));
    });
  }

  hasErrors(dataKey="model") {
    return this.getErrors(dataKey).length != 0;
  }

  getErrors(dataKey="model") {
    let errorKey = this.errorKey + "." + dataKey;
    let errorLens = Lens(errorKey);
    let errors = errorLens.get(this.state) || [];
    if (errors instanceof Array) {
      // Full key path like "model.name": return errors
      return errors;
    } else {
      // Group key path like "model": return flattened array of all sub-errors
      errors = flattenObject(errors);
      return flatMap(dataKey => errors[dataKey] || [], keys(errors));
    }
    return [];
  }

  get stateSchema() {
    return {};
  }

  get errorKey() {
    return "errors";
  }
}
