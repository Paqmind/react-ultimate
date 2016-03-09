let {curry, filter, identity, keys, map, pipe, prop, slice, sortBy, tail, values, whereEq} = require("ramda");
let {Observable, Subject} = require("rx");
let {always, scanFn} = require("./helpers");
let {ROBOT, MONSTER} = require("./constants");

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
        .shareReplay(1)
        .distinctUntilChanged(),

      sort: update.UI.robotIndex.sort
        .startWith(ROBOT.defaultSort)
        .scan(scanFn)
        .shareReplay(1)
        .distinctUntilChanged(),

      limit: update.UI.robotIndex.limit
        .startWith(ROBOT.defaultLimit)
        .scan(scanFn)
        .shareReplay(1)
        .distinctUntilChanged(),

      offset: update.UI.robotIndex.offset
        .startWith(0)
        .scan(scanFn)
        .shareReplay(1)
        .distinctUntilChanged(),
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

let stateViews = {
  DB: {
    // joins, etc.
  },

  UI: {
    robotIndex: Observable.combineLatest(
      state.DB.robots,
      state.UI.robotIndex.filters,
      state.UI.robotIndex.sort,
      state.UI.robotIndex.limit,
      state.UI.robotIndex.offset,
      (robots, filters, sort, limit, offset) => {
        let postSort = sort.startsWith("+") ? identity : reverse;
        return pipe(
          filter(whereEq(filters)),
          sortBy(prop(tail(sort))),
          postSort,
          slice(offset, offset + limit)
        )(values(robots));
      }
    ),

    monsterIndex: Observable.combineLatest(
      state.DB.monsters,
      state.UI.monsterIndex.filters,
      state.UI.monsterIndex.sort,
      state.UI.monsterIndex.limit,
      state.UI.monsterIndex.offset,
      (monsters, filters, sort, limit, offset) => {
        let postSort = sort.startsWith("+") ? identity : reverse;
        return pipe(
          filter(whereEq(filters)),
          sortBy(prop(tail(sort))),
          postSort,
          slice(offset, offset + limit)
        )(values(monsters));
      }
    ),
  }
};

// TEST-DRIVE ==========================================================================================================
stateViews.UI.robotIndex.subscribe(state => console.log("derived.UI.robotIndex:\n", state));

let robots = {
  "1": {id: "1", name: "sharkee", "new": false},
  "2": {id: "2", name: "jac", "new": true},
  "3": {id: "3", name: "jab", "new": true},
  "4": {id: "4", name: "gizmo", "new": false},
};

setTimeout(() => {
  console.log("\n1) load robots");
  update.DB.robots.onNext(always(robots));
}, 1000);

setTimeout(() => {
  console.log("\n2) sort robots");
  update.UI.robotIndex.sort.onNext(always("+name"));
}, 2000);

setTimeout(() => {
  console.log("\n3) filter robots");
  update.UI.robotIndex.filters.onNext(always({"new": true}));
}, 3000);

setTimeout(() => {
  console.log("\n5) reset robots");
  update.UI.robotIndex.filters.onNext(always(ROBOT.defaultFilters));
  update.UI.robotIndex.sort.onNext(always(ROBOT.defaultSort));
  update.UI.robotIndex.limit.onNext(always(ROBOT.defaultLimit));
  update.UI.robotIndex.offset.onNext(always(0));
  update.UI.robotIndex.offset.onNext(always(0));
}, 4000);

setTimeout(() => {
  console.log("\n6) repaginate robots");
  update.UI.robotIndex.limit.onNext(always(2));
}, 5000);
