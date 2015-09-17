import {dissoc} from "ramda";
import Tc from "tcomb";
import {Uid} from "./common";

let Category = Tc.enums.of(["success", "error", "info", "warning"], "Category");

let AlertType = {
  id: Uid,
  message: Tc.String,
  category: Category,
  closable: Tc.Boolean,
  expire: Tc.Number,
};

export default {
  Alert: Tc.struct(AlertType, "Alert"),
  AlmostAlert: Tc.struct(dissoc("id", AlertType), "AlmostAlert"),
};
