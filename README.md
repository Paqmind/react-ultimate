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

1. Download and unzip repo
2. Go to unzipped folder
3. Install static server with `$ npm install http-server -g`
4. Install packages with `$ npm install`
5. Apply required hacks (ES6) with `$ bin/postinstall`

## Dev Run

1. Check dev.env and load it into SHELL via `$ . dev.env`.
2. Run Webpack-Server via `$ npm run webpack-server` (terminal #1)
3. Run Nodemon with `$ npm start` (terminal #2)
4. See `localhost:8080` (or with other port you've set in `dev.env`)

## Prod run

1. Create prod.env (see sample.env) and load it into SHELL via `$ . prod.env`.
2. Run Webpack via `$ npm run webpack` (terminal #1)
3. Run Node with `$ npm run node` (terminal #2)
4. See `http://yoursite.com:8080` (or with other port you've set in `prod.env`)

## Lint

1. Run `$ npm run eslint -s`

## Test

1. Run all tests with `$ . .conf-test ; npm mocha -s`
2. Run specific tests with `$ . .conf-test ; npm test -- --grep "api/robots POST" -s` (`--` is an NPM syntax to pass arguments)

## Notes

All React starters / tutorials suffer from being oversimplified.
They don't show any architecture (the most complex part), only a basic file layouts at their best.
TodoApps have similar issues: very specific, single page only, unrealistic models (one field),
no backend, no validation, no users, etc. We want to approach this differently – provide application
which is closer to production (not saying enterprise) level.

### Absolute imports

One of the most annoying NodeJS limitation is the absence of absolute imports. By "absolute" we
mean imports relative to the project root or some top-level folder.

Your imports look like `import "foo"` for libraries but turn into `import "../../../../foo";` mess for app code.
It's a well known problem because such statements are very hard to read and support.
They tend to break every time you move files between folder.

Fortunately absolute imports can be emulated with some amount of twist. The requirement here is to keep IDE navigation and autocompletion features working.
Script **bin/install** add symlinks for every project entry point like `frontend` or `backend` in **node_modules**.
Browserify requires to keep `package.json` for every such entrypoint but Webpack is free of this limitation.

This project is 100% relative-imports free.

### Flux vs Baobab

We don't use Flux. Check [this](https://github.com/acdlite/flummox/issues/63) and
[this](http://christianalfoni.github.io/javascript/2015/02/06/plant-a-baobab-tree-in-your-flux-application.html)
for a shallow answer to *why*. See [#98](https://github.com/Paqmind/react-ultimate/issues/98) for additional
insides.

### Immutable

We experimented with most popular libs: [ImmutableJS](https://github.com/facebook/immutable-js), [Mori](https://github.com/swannodette/mori)
and [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable).
We tried our best, but the resulting code was really messy and bug-prone all the time.
So we decided to switch to [Ramda](http://ramdajs.com/) which is API incompatible with all of the
above. It does not enforce immutability, but encourage it, having zero mutable operations in toolkit.

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

## Links

[Wiki](https://github.com/Paqmind/react-starter/wiki) contains more information about this project.

[Cycle-Ultimate](https://github.com/Paqmind/cycle-ultimate) is a newer version of this project built with CycleJS.
