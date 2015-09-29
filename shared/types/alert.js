import Tc from "tcomb";
import {Uid} from "./common";

let AlertCategory = Tc.enums.of(["success", "error", "info", "warning"], "AlertCategory");

let AlmostAlert = Tc.struct({
  message: Tc.String,
  category: AlertCategory,
  closable: Tc.Boolean,
  expire: Tc.Number,
}, "AlmostAlert");

let Alert = AlmostAlert.extend({
  id: Uid,
}, "Alert");

export default {
  AlmostAlert, Alert,
};
