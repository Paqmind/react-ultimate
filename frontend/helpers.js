exports.getModel = function(models, id) {
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
};

exports.addModel = function(models, model) {
  return models.push(model);
};

exports.updateModel = function(models, model) {
  for (let i=0; i < models.length; i++) {
    if (models[i].id == model.id) {
      models[i] = model;
      return models;
    }
  }
};

exports.removeModel = function(models, id) {
  return models.filter(model => model.id != id);
};

exports.maxId = function(models) {
  console.log(models.map(model => model.id));
  return Math.max.apply(Math, models.map(model => model.id));
};
