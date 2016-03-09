let {assoc, curry, dissoc, identity, merge} = require("ramda");
let {Observable, Subject} = require("rx");

// HELPERS =============================================================================================================
let always = curry((x, y) => x);

let scanFn = curry((state, updateFn) => {
  if (updateFn.length != 1) {
    throw Error("arity of updateFn function must be 1")
  } else {
    return updateFn(state);
  }
});

// UPDATE ==============================================================================================================
let update = {
  DB: {
    robots: new Subject(),
    monsters: new Subject(),
  },
};

// STATE ===============================================================================================================
let state = {
  DB: {
    robots: update.DB.robots
      .startWith({})
      .scan(scanFn)
      .shareReplay(1),

    monsters: update.DB.monsters
      .startWith({})
      .scan(scanFn)
      .shareReplay(1),
  },
};

// TEST-DRIVE ==========================================================================================================
state.DB.robots.subscribe(state => console.log("DB.robots:\n", state));
state.DB.monsters.subscribe(state => console.log("DB.monsters:\n", state));

setTimeout(() => {
  // 1. set initial robots
  update.DB.robots.onNext(always({"1": {id: "1", name: "gizmo"}}));
}, 1000);

setTimeout(() => {
  // 2. add robot #2
  update.DB.robots.onNext(assoc("2", {id: "2", name: "jab"}));
}, 2000);

setTimeout(() => {
  // 3. add robot #3
  update.DB.robots.onNext(assoc("3", {id: "3", name: "jac"}));
}, 3000);

setTimeout(() => {
  // 3. remove robot #1
  update.DB.robots.onNext(dissoc("1"));
}, 4000);

setTimeout(() => {
  // 4. add monster #1
  update.DB.monsters.onNext(assoc("1", {id: "1", name: "fluffy", fav: false}));
}, 5000);

setTimeout(() => {
  // 4. edit monster #1 (favup)
  update.DB.monsters.onNext((state) => {
    return assoc("1", merge(state["1"], {id: "1", name: "fluffy", fav: true}), state)
  });
}, 6000);