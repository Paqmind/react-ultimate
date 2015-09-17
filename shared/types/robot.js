import {dissoc} from "ramda";
import Tc from "tcomb";
import {Uid} from "./common";

let Name = Tc.subtype(Tc.String, x => {
  return x.length >= 1;
});

let Manufacturer = Tc.enums.of(["China", "Russia", "USA"], "Manufacturer");

let RobotType = {
  id: Uid,
  name: Name,
  manufacturer: Manufacturer,
  assemblyDate: Tc.Date,
};

export default {
  Robot: Tc.struct(RobotType, "Robot"),
  AlmostRobot: Tc.struct(dissoc("id", RobotType), "AlmostRobot"),
};
