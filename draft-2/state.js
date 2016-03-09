let {assoc, curry, dissoc, identity, keys, merge, omit} = require("ramda");
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

// CONSTANTS ===========================================================================================================
let ROBOT = {
  defaultFilters: {},
  defaultSort: "+name",
  defaultLimit: 10,
};

let MONSTER = {
  defaultFilters: {},
  defaultSort: "+name",
  defaultLimit: 10,
};

// UPDATE ==============================================================================================================
let update = {
  DB: {
    robots: new Subject(),
    monsters: new Subject(),
  },

  UI: {
    robotIndex: {
      filters: new Subject(),
      sort: new Subject(),
      limit: new Subject(),
      offset: new Subject(),
    },

    monsterIndex: {
      filters: new Subject(),
      sort: new Subject(),
      limit: new Subject(),
      offset: new Subject(),
    }
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

  UI: {
    robotIndex: {
      filters: update.UI.robotIndex.filters
        .startWith(ROBOT.defaultFilters)
        .scan(scanFn)
        .shareReplay(1),

      sort: update.UI.robotIndex.sort
        .startWith(ROBOT.defaultSort)
        .scan(scanFn)
        .shareReplay(1),

      limit: update.UI.robotIndex.limit
        .startWith(ROBOT.defaultLimit)
        .scan(scanFn)
        .shareReplay(1),

      offset: update.UI.robotIndex.offset
        .startWith(0)
        .scan(scanFn)
        .shareReplay(1),
    },

    monsterIndex: {
      filters: update.UI.monsterIndex.filters
        .startWith(MONSTER.defaultFilters)
        .scan(scanFn)
        .shareReplay(1),

      sort: update.UI.monsterIndex.sort
        .startWith(MONSTER.defaultSort)
        .scan(scanFn)
        .shareReplay(1),

      limit: update.UI.monsterIndex.limit
        .startWith(MONSTER.defaultLimit)
        .scan(scanFn)
        .shareReplay(1),

      offset: update.UI.monsterIndex.offset
        .startWith(0)
        .scan(scanFn)
        .shareReplay(1),
    },
  },
};

// TEST-DRIVE ==========================================================================================================
state.DB.robots.subscribe(state => console.log("DB.robots:\n", state));
state.DB.monsters.subscribe(state => console.log("DB.monsters:\n", state));

state.UI.robotIndex.filters.subscribe(state => console.log("UI.robotIndex.filters:\n", state));
state.UI.monsterIndex.filters.subscribe(state => console.log("UI.monsterIndex.filters:\n", state));

state.UI.robotIndex.sort.subscribe(state => console.log("UI.robotIndex.sort:\n", state));
state.UI.monsterIndex.sort.subscribe(state => console.log("UI.monsterIndex.sort:\n", state));

state.UI.robotIndex.limit.subscribe(state => console.log("UI.robotIndex.limit:\n", state));
state.UI.monsterIndex.limit.subscribe(state => console.log("UI.monsterIndex.limit:\n", state));

state.UI.robotIndex.offset.subscribe(state => console.log("UI.robotIndex.offset:\n", state));
state.UI.monsterIndex.offset.subscribe(state => console.log("UI.monsterIndex.offset:\n", state));

setTimeout(() => {
  // 1. set robot index filters
  update.UI.robotIndex.filters.onNext(always({name: "gizmo"}));
}, 1000);

setTimeout(() => {
  // 2. reset robot index filters
  update.UI.robotIndex.filters.onNext(always(ROBOT.defaultFilters));
}, 2000);

setTimeout(() => {
  // 3. set monster index sort
  update.UI.monsterIndex.sort.onNext(always("-id"));
}, 3000);

setTimeout(() => {
  // 4. set monster index offset
  update.UI.monsterIndex.offset.onNext(always(10));
}, 4000);