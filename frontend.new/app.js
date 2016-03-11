let {append, curry, merge} = require("ramda");
let {Observable} = require("rx");
let createElement = require("virtual-dom/create-element");
let diff = require("virtual-dom/diff");
let patch = require("virtual-dom/patch");
let {always} = require("./helpers");
let {defaults: defaultUI} = require("./state.ui");
let updateDB = require("./update.db");
let updateUI = require("./update.ui");
let stateUI = require("./state.ui");
let views = require("./views");

let main = curry(() => {
  return {
    DOM: Observable
      .combineLatest(
        stateUI.robotIndex, stateUI.newRobotIndex, stateUI.monsterIndex,
        (robots, newRobots, monsters) => {
          return views.home({robots, newRobots, monsters});
        }
      )
  };
});

let vtree = null;
let rootNode = null;

main().DOM.subscribe((newVtree) => {
  if (vtree) {
    rootNode = patch(rootNode, diff(vtree, newVtree)); // affects document.body
  } else {
    rootNode = createElement(newVtree);
    document.body.appendChild(rootNode);
  }
  vtree = newVtree;
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

// sinks.need.subscribe((need) => {
  // foreach need request HTTP if it's =really= required
  // pipe each response to appropriate state place
  // questions: loading indicator is global because data load is global?!
  //            diff between HAVE NOT and NOT LOADED in view
  //            last page in pagination
  //            have too few newRobots (constant requests)
// });

// let need = [];
// if (robots.length < 10) {
//   need = append(`/robots/?offset=${robots.length}&limit=${10 - robots.length}`, need);
// }
// if (newRobots.length < 10) {
//   need = append(`/robots/new/?offset=${newRobots.length}&limit=${10 - newRobots.length}`, need);
// }
// if (monsters.length < 10)  {
//   need = append(`/monsters/?offset=${monsters.length}&limit=${10 - monsters.length}`, need);
// }