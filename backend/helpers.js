// IMPORTS =========================================================================================
let Faker = require("faker");

// EXPORTS =========================================================================================
export function generateRobot(override) {
  // no support to pick name by gender for now in Faker :(
  return Object.assign({
    id: Faker.random.uuid(),
    name: Faker.name.firstName(),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.array_element(["Russia", "USA", "China"]),
  }, override);
}
