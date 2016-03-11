let {curry, map} = require("ramda");
let h = require("virtual-dom/h");
let hh = require("hyperscript-helpers");

let {br, div, h2, hr, p, span, strong} = hh(h);

let index = curry((models) => {
  return div([
    map(model => div(JSON.stringify(model, null, "\t")), models)
  ]);
});

exports.index = index;

let home = curry(({robots, newRobots, monsters}) => {
  return div([
    h2("Robots"),
    index(robots),

    h2("New Robots"),
    index(newRobots),

    h2("Monsters"),
    index(monsters),
  ]);
});

exports.home = home;