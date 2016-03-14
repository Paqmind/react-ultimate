# React Ultimate

Tired of **React Starters** reexplaining another helloworld?

Dreamed of something closer to the industry?

Welcome to **React Ultimate** then.

![alt tag](/screenshot.png)

This project aims to provide basic solutions for typical web app tasks. Bundling, indexing, pagination,
filtering, sorting, CRUD, forms, authorization, tests, lints, live reloads,np isomorphic app, code sharing between server and browser...
We're going to solve all such common tasks in a simplified, yet valueable form to provide a starting point
for your next project.

Not everything of that is already here or has desired quality, but we're approaching.
We're interested in the architecture that may be ported to different frameworks and even languages.
React is not a final answer. Reactivity probably is.

## Install

```
$ wget https://github.com/Paqmind/react-ultimate/archive/master.zip; unzip master.zip -d react-ultimate; rm master.zip
$ cd react-ultimate
$ cd react-ultimate-master
$ npm install; bin/install
```

## Run

Production
```
$ npm run build
$ npm run node
```

Development
```
$ npm run dev     [terminal #1]
$ npm run nodemon [terminal #2]
```

## Lint

```
$ npm run lint -s (mute node output)
```

## Test

All tests
```
$ npm test -s
```

Specific tests (`--` is an NPM syntax to pass arguments)
```
$ npm test -- --grep "api/robots POST" -s
```

Refer to [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai)
for more details.

## Architecture FAQ

All React starters / tutorials suffer from being oversimplified.
They don't show any architecture (the most complex part), only a basic file layouts at their best.
TodoApps have similar issues: very specific, single page only, unrealistic models (one field),
no backend, no validation, no users, etc. We want to approach this differently – provide application
which is closer to production (not saying enterprise) level.

### URL-bound vs URL-unbound components

All stateful components can be divided to URL-bound and URL-unbound.
By definition, state of URL-bound components can be changed through URL.
It allows to bookmark and share page link and reproduce expectable state by
just entring page.

There is no namespacing in URL (we could add one, but URL is rather short for that sort of things,
and we want to keep JSON API format in client for simplicity) that's why the possible number of URL-bound
components is limited to one per page.

Another tradeoff is that new URL means `ReactRouter.run` is triggered
which means redraw of the Root component which hurts rendering performance ().

To sum up: make primary (content) components either URL-bound or URL-unbound depending
on your business priorities. Secondary components will always be URL-unbound.

---

## Notes

See [**Cycle-Ultimate**](https://github.com/Paqmind/cycle-ultimate) for a revamped, [CycleJS](http://cycle.js.org)-based version of this project.
