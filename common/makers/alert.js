let UUID = require("node-uuid")
let Faker = require("faker")
let {merge} = require("common/helpers/common")
let {Alert} = require("common/types")

module.exports = function makeAlert(data={}) {
  return Alert(merge({
    id: UUID.v4(),
    closable: Faker.random.arrayElement([false, true]),
    expire: Faker.number.between(0, 5000),
  }, data))
}
