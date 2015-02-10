// IMPORTS =========================================================================================
let Faker = require("faker");

// EXPORTS =========================================================================================
export function generateRobot(id) {
  // no support to pick name by gender for now in Faker :(
  return {
    id: id,
    name: Faker.name.firstName(),
    serialNumber: Faker.random.uuid(),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.array_element(["Russia", "USA", "China"]),
  };
}

export function maxId(models) {
  return Math.max.apply(Math, models.map(model => model.id));
}
