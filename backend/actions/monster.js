import indexRouter from "./index/monster";
import addRouter from "./add/monster";
import addOrEditRouter from "./add-or-edit/monster";
import removeRouter from "./remove/monster";
import randomRouter from "./random/monster";
import detailRouter from "./detail/monster";

export default [
  indexRouter,
  addRouter,
  addOrEditRouter,
  removeRouter,
  randomRouter,
  detailRouter
];
