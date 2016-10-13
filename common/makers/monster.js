let UUID = require("node-uuid")
let Faker = require("faker")
let {merge} = require("common/helpers/common")
let {Monster} = require("common/types")

module.exports = function makeMonster(data={}) {
  return Monster(merge({
    id: UUID.v4(),
    name: Faker.name.findName(),
    citizenship: Faker.random.arrayElement(["Russia", "USA", "China"]),
    birthDate: Faker.date.between("1970-01-01", "1995-01-01"),
  }, data))
}
