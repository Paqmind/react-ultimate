export function getModel(models, id) {
  //return models.reduce(
  //  (acc, robot) => robot.id == id ? robot : acc,
  //  undefined
  //);

  for (let model of models) {
    if (model.id == id) {
      return model;
    }
  }
  return undefined;
}

export function addModel(models, model) {
  return models.push(model);
}

export function updateModel(models, model) {
  for (let i=0; i < models.length; i++) {
    if (models[i].id == model.id) {
      models[i] = model;
      return models;
    }
  }
}

export function removeModel(models, id) {
  return models.filter(model => model.id != id);
}

export function maxId(models) {
  return Math.max.apply(Math, models.map(model => model.id));
}
