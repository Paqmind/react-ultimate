let isFunction = require("lodash.isfunction");

function properties(obj) {
  let key, lst = [];
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      lst.push(key);
    }
  }
  return lst;
}

function createGetter(key) {
  return function getter(data) {
    return data[key];
  };
}

function createImmutableGetter(key) {
  let getter = createGetter(key);
  return function immutableGetter(data) {
    if (isFunction(data.get)) {
      return data.get(key);
    } else {
      return getter(data);
    }
  };
}

function createSetter(key) {
  return function setter(data, value) {
    let copy = properties(data).reduce((memo, val) => {
      memo[val] = data[val];
      return memo;
    }, {});
    copy[key] = value;
    return copy;
  };
}

function createImmutableSetter(key) {
  let setter = createSetter(key);
  return function immutableSetter(data, value) {
    if (isFunction(data.set)) {
      return data.set(key, value);
    } else {
      return setter(data, value);
    }
  };
}

function Lens(getter, setter) {
  return {
    get: getter,

    set: setter,

    modify(data, func) {
      let val = this.get(data);
      return this.set(data, func(val));
    },

    compose(nextLens) {
      return Lens(
        (data)        => nextLens.get(this.get(data)),
        (data, value) => this.set(data, nextLens.set(this.get(data), value))
      );
    }
  };
}

export function createLens(key) {
  let lens = key.split('.').map((k) => {
    return Lens(createGetter(k), createSetter(k))
  });
  return lens.reduce((lens, nextLens) => lens.compose(nextLens));
}

export function createImmutableLens(key) {
  let lens = key.split('.').map((k) => {
    return Lens(createImmutableGetter(k), createImmutableSetter(k))
  });
  return lens.reduce((memo, val) => memo.compose(val));
}
