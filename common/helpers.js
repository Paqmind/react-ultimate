// IMPORTS =========================================================================================
let Faker = require("faker");

// EXPORTS =========================================================================================
export function generateRobot(id) {
  // no support to pick name by gender for now in Faker :(
  return {
    id: id,
    name: Faker.name.firstName(),
  };
}

export function maxId(models) {
  return Math.max.apply(Math, models.map(model => model.id));
}
