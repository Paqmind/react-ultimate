let Tc = require("tcomb")

let Uid = Tc.subtype(Tc.String, function (x) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(x)
}, "Uid")

let AlertCategory = Tc.enums.of(["success", "error", "info", "warning"], "AlertCategory")

let Alert = Tc.struct({
  id: Uid,
  message: Tc.String,
  category: AlertCategory,
  closable: Tc.Boolean,
  expire: Tc.Number,
}, "Alert")

let RobotName = Tc.subtype(Tc.String, x => {
  return x.length >= 2 && x.length <= 100
}, "RobotName")

let RobotManufacturer = Tc.enums.of(["China", "Russia", "USA"], "RobotManufacturer")

let Robot = Tc.struct({
  id: Uid,
  name: RobotName,
  manufacturer: RobotManufacturer,
  assemblyDate: Tc.Date,
}, "Robot")

let MonsterName = Tc.subtype(Tc.String, x => {
  return x.length >= 2 && x.length <= 100
}, "MonsterName")

let MonsterCitizenship = Tc.enums.of(["China", "Russia", "USA"], "MonsterCitizenship")

let Monster = Tc.struct({
  id: Uid,
  name: MonsterName,
  citizenship: MonsterCitizenship,
  birthDate: Tc.Date,
}, "Monster")

module.exports = {
  Uid, Alert, Robot, Monster,
}
