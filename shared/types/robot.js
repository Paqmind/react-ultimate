import Tc from "tcomb";
import {Uid} from "./common";

let RobotName = Tc.subtype(Tc.String, x => {
  return x.length >= 2 && x.length <= 100;
});

let RobotManufacturer = Tc.enums.of(["China", "Russia", "USA"], "RobotManufacturer");

let AlmostRobot = Tc.struct({
  name: RobotName,
  manufacturer: RobotManufacturer,
  assemblyDate: Tc.Date,
}, "AlmostRobot");

let Robot = AlmostRobot.extend({
  id: Uid,
}, "Robot");

export default {
  AlmostRobot, Robot,
};
