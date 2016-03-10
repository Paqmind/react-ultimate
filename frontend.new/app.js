/*
  IDEAS

  1. Render VDOM on every stateUI & facetsUI change,
     skip DB updates (unlike Baobab we CAN do it here!),
     and the best thing would be to bind this with router somehow...

  ...
*/

let {append} = require("ramda");
let {Observable} = require("rx");
let createElement = require("virtual-dom/create-element");
let diff = require("virtual-dom/diff");
let patch = require("virtual-dom/patch");
let {always} = require("./helpers");
let {defaults: defaultUI} = require("./state.ui");
let updateDB = require("./update.db");
let updateUI = require("./update.ui");
let facetsUI = require("./facets.ui");
let views = require("./views");

let redraw = Observable
  .combineLatest(
    facetsUI.robotIndex, facetsUI.newRobotIndex, facetsUI.monsterIndex,
    (robots, newRobots, monsters) => {
      return {robots, newRobots, monsters};
    }
  );

let vtree = null;
let rootNode = null;

redraw.subscribe((viewState) => {
  if (!vtree) {
    vtree = views.home(viewState);       // initial tree
    rootNode = createElement(vtree);     // initial root DOM node
    document.body.appendChild(rootNode); // should be in the document
  } else {
    let vtree2 = views.home(viewState);
    let vtreeDiff = diff(vtree, vtree2);
    rootNode = patch(rootNode, vtreeDiff);
    vtree = vtree2;
  }
});

// TEST-DRIVE ==========================================================================================================
let robots = [
  {id: "1", name: "sharkee", "new": false},
  {id: "2", name: "jac", "new": true},
  {id: "3", name: "jab", "new": true},
  {id: "4", name: "gizmo", "new": false},
];

setTimeout(() => {
  console.log("\n1) load robots");
  updateDB.robots.data.onNext(always(robots));
}, 1000 * 5);

setTimeout(() => {
  console.log("\n2) sort robotIndex by +name");
  updateUI.robotIndex.sort.onNext(always("+name"));
}, 2000 * 5);

setTimeout(() => {
  console.log("\n3) filter robotIndex by new=false");
  updateUI.robotIndex.filters.onNext(always({"new": false}));
}, 3000 * 5);

setTimeout(() => {
  console.log("\n4) reset robotIndex");
  updateUI.robotIndex.filters.onNext(always(defaultUI.robotIndex.filters));
  updateUI.robotIndex.sort.onNext(always(defaultUI.robotIndex.sort));
  updateUI.robotIndex.offset.onNext(always(0));
  updateUI.robotIndex.offset.onNext(always(0));
  updateUI.robotIndex.limit.onNext(always(defaultUI.robotIndex.limit));
}, 4000 * 5);

setTimeout(() => {
  console.log("\n5) limit robotIndex to 2");
  updateUI.robotIndex.limit.onNext(always(2));
}, 5000 * 5);

setTimeout(() => {
  console.log("\n6) add robot #5");
  updateDB.robots.data.onNext(append({id: "5", "new": true}));
}, 6000 * 5);

setTimeout(() => {
  console.log("\n7) add robot #0");
  updateDB.robots.data.onNext(append({id: "0", "new": true}));
}, 7000 * 5);
