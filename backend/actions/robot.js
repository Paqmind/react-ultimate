import indexRouter from "./index/robot";
import addRouter from "./add/robot";
import addOrEditRouter from "./add-or-edit/robot";
import removeRouter from "./remove/robot";
import randomRouter from "./random/robot";
import detailRouter from "./detail/robot";

export default [
  indexRouter,
  addRouter,
  addOrEditRouter,
  removeRouter,
  randomRouter,
  detailRouter
];
